import { useState, useEffect, useMemo, useCallback } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import {
  fetchSessionDetail,
  fetchSessionMessages,
  fetchPhysicalExamMessages,
  endOsceSession,
} from '@store/oscePractice/userAction'
import { OscePracticeRoute } from '@routes/OscePractice/routes'

// Everything the station board owns: the session's three reads, the answers the worksheet
// collects, the speech-to-text provider, and ending the station.
//
// The answers live here rather than inside the worksheet because two places need them — the
// worksheet edits them, and ending the session submits them — and because the rail's progress
// marks are derived from the same values the worksheet is editing, not from a second source.
export const useStation = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { sessionId } = useParams()
  const { sessionDetail, loading } = useSelector((state) => state.oscePractice)

  const [hasLoaded, setHasLoaded] = useState(false)

  // Psychiatry stations take a list of primary diagnoses rather than one, which changes the
  // shape of `diagnosisUtama` — so it is resolved before the answer state is seeded.
  const isPsikiatri = useMemo(() => (
    sessionDetail?.tags?.some((tag) => (
      tag.tagGroup?.name?.toLowerCase() === 'topic' && tag.name?.toLowerCase() === 'psikiatri'
    )) || false
  ), [sessionDetail])

  const [diagnosisUtama, setDiagnosisUtama] = useState(isPsikiatri ? [] : '')
  const [diagnosisPembanding, setDiagnosisPembanding] = useState([])
  const [therapies, setTherapies] = useState('')
  const [observations, setObservations] = useState([])
  const [interpretations, setInterpretations] = useState({})

  const [endDialog, setEndDialog] = useState({ isOpen: false, auto: false })

  useEffect(() => {
    if (!sessionId) return

    setHasLoaded(false)
    Promise.all([
      dispatch(fetchSessionDetail(sessionId)),
      dispatch(fetchSessionMessages(sessionId)),
      dispatch(fetchPhysicalExamMessages(sessionId)),
    ]).finally(() => setHasLoaded(true))
  }, [sessionId, dispatch])

  // Seed the worksheet from whatever the student already saved, so reopening a station mid-way
  // shows their own answers rather than empty fields.
  useEffect(() => {
    if (!sessionDetail || sessionDetail.uniqueId !== sessionId) return

    const diagnosis = sessionDetail.userAnswer?.diagnosis
    if (diagnosis) {
      setDiagnosisUtama(Array.isArray(diagnosis.utama)
        ? diagnosis.utama
        : diagnosis.utama || (isPsikiatri ? [] : ''))
      setDiagnosisPembanding(diagnosis.pembanding || [])
    }

    if (sessionDetail.userAnswer?.therapy !== undefined) {
      setTherapies(sessionDetail.userAnswer.therapy || '')
    }

    // Observations are only readable back once the student has locked their selection; before
    // that the saved list is empty by definition.
    if (sessionDetail.observationsLocked && sessionDetail.userAnswer?.observations) {
      const saved = sessionDetail.userAnswer.observations || []
      setObservations(saved)
      setInterpretations(saved.reduce((acc, observation) => (
        observation.notes ? { ...acc, [observation.snapshotId]: observation.notes } : acc
      ), {}))
    }
  }, [sessionDetail, sessionId, isPsikiatri])

  // A station that is not actually in progress belongs on another screen. The guard waits for
  // the first load so it cannot fire on a stale session from a previous route.
  useEffect(() => {
    if (loading.isLoadingSessionDetail || !hasLoaded) return
    if (!sessionDetail || sessionDetail.uniqueId !== sessionId) return

    if (sessionDetail.status === 'created') {
      navigate(OscePracticeRoute.moduleRoute, { replace: true })
    } else if (sessionDetail.status === 'completed') {
      navigate(OscePracticeRoute.resultRoute(sessionId), { replace: true })
    }
  }, [sessionDetail, sessionId, navigate, loading.isLoadingSessionDetail, hasLoaded])

  const requestEnd = useCallback((auto = false) => {
    setEndDialog({ isOpen: true, auto })
  }, [])

  const closeEnd = useCallback(() => setEndDialog({ isOpen: false, auto: false }), [])

  const confirmEnd = useCallback(async () => {
    await dispatch(endOsceSession(
      sessionId,
      {
        diagnoses: { utama: diagnosisUtama, pembanding: diagnosisPembanding },
        therapies,
        observations: observations.map((observation) => ({
          snapshotId: observation.snapshotId,
          name: observation.name,
          interpretation: interpretations[observation.snapshotId] || '',
        })),
      },
      () => navigate(OscePracticeRoute.resultRoute(sessionId)),
    ))
  }, [dispatch, navigate, sessionId, diagnosisUtama, diagnosisPembanding, therapies, observations, interpretations])

  // What the rubric still has nothing for. This is the board's thesis in one value: it is
  // derived from the live answer state, so a section stops warning the moment it is filled.
  const worksheetStatus = useMemo(() => {
    const hasPrimaryDiagnosis = Array.isArray(diagnosisUtama)
      ? diagnosisUtama.length > 0
      : !!diagnosisUtama.trim()

    const sections = [
      {
        key: 'supporting',
        label: 'Data penunjang',
        filled: observations.length > 0,
        detail: observations.length > 0 ? `${observations.length} dipilih` : 'belum dipilih',
      },
      {
        key: 'diagnosis',
        label: 'Diagnosis',
        filled: hasPrimaryDiagnosis,
        detail: hasPrimaryDiagnosis ? 'terisi' : 'masih kosong',
      },
      {
        key: 'therapy',
        label: 'Terapi',
        filled: !!therapies.trim(),
        detail: therapies.trim() ? 'terisi' : 'masih kosong',
      },
    ]

    return { sections, emptyCount: sections.filter((section) => !section.filled).length }
  }, [observations, diagnosisUtama, therapies])

  return {
    sessionId,
    sessionDetail,
    loading,
    isReady: hasLoaded,
    isPsikiatri,
    answers: {
      diagnosisUtama, setDiagnosisUtama,
      diagnosisPembanding, setDiagnosisPembanding,
      therapies, setTherapies,
      observations, setObservations,
      interpretations, setInterpretations,
    },
    worksheetStatus,
    endDialog,
    requestEnd,
    closeEnd,
    confirmEnd,
  }
}
