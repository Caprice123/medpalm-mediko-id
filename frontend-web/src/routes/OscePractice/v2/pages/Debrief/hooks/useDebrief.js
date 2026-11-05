import { useEffect, useMemo, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import {
  fetchSessionDetail,
  fetchSessionMessages,
  fetchPhysicalExamMessages,
} from '@store/oscePractice/userAction'
import { OscePracticeRoute } from '@routes/OscePractice/routes'

// The mark a station is expected to clear. The same threshold the station list and the
// performance rows read a score against.
const PASS_PERCENTAGE = 60

// The debrief's data: the session, its transcripts, and the rubric parsed out of the
// evaluation. Everything numeric is computed once here so the rubric panel, the header score
// and the footnote cannot disagree.
export const useDebrief = () => {
  const { sessionId } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { sessionDetail, loading } = useSelector((state) => state.oscePractice)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!sessionId) return

    Promise.all([
      dispatch(fetchSessionDetail(sessionId)),
      dispatch(fetchSessionMessages(sessionId)),
      dispatch(fetchPhysicalExamMessages(sessionId)),
    ]).catch((caught) => setError(caught.message || 'Gagal memuat detail sesi'))
  }, [sessionId, dispatch])

  // A station that has not been marked yet has no debrief to show.
  useEffect(() => {
    if (!sessionDetail || sessionDetail.uniqueId !== sessionId) return

    if (sessionDetail.status === 'created') {
      navigate(OscePracticeRoute.moduleRoute, { replace: true })
    } else if (sessionDetail.status === 'started') {
      navigate(OscePracticeRoute.practiceRoute(sessionId), { replace: true })
    }
  }, [sessionDetail, sessionId, navigate])

  const rubric = useMemo(() => {
    const result = sessionDetail?.result
    if (!result) return null

    // `aiFeedback` arrives as a JSON string from some evaluations and as an object from
    // others; both shapes carry the criteria either at the root or under `criteria`.
    let criteria = []
    if (result.aiFeedback) {
      try {
        const parsed = typeof result.aiFeedback === 'string'
          ? JSON.parse(result.aiFeedback)
          : result.aiFeedback
        criteria = parsed?.criteria || (Array.isArray(parsed) ? parsed : [])
      } catch {
        criteria = []
      }
    }

    const totalScore = result.totalScore || 0
    const maxScore = result.maxScore || 0
    // The authoritative percentage is the server's raw rubric points, not the weighted table
    // below: that table is the arithmetic of how the mark was reached, shown so the student can
    // follow it, and it is labelled as such rather than quoted as a second score.
    const percentage = maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 0

    const rows = criteria.map((criterion, index) => {
      const earned = criterion.score || 0
      const available = criterion.maxScore || 0
      const weight = criterion.weight || 1

      return {
        key: `${criterion.type || criterion.name || criterion.category || 'kriteria'}-${index}`,
        label: criterion.type || criterion.name || criterion.category || `Kriteria ${index + 1}`,
        earned,
        available,
        weight,
        percentage: available > 0 ? Math.round((earned / available) * 100) : 0,
        weighted: available > 0 ? (earned / available) * weight : 0,
        comment: criterion.comment || null,
        reason: criterion.scoreReason || null,
      }
    })

    return {
      rows,
      totalScore,
      maxScore,
      percentage,
      isPassing: percentage >= PASS_PERCENTAGE,
      passThreshold: PASS_PERCENTAGE,
      weightedEarned: rows.reduce((sum, row) => sum + row.weighted, 0),
      weightTotal: rows.reduce((sum, row) => sum + row.weight, 0),
    }
  }, [sessionDetail])

  return { sessionId, sessionDetail, loading, error, rubric }
}
