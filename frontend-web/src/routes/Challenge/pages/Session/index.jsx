import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams, useNavigate } from 'react-router-dom'
import { startChallenge, submitChallenge } from '@store/challenge/userAction'
import Loading from '@components/common/Loading'
import ClassicSession from '../ClassicSession'
import BlitzSession from '../BlitzSession'
import { ChallengeRoute } from '../../routes'

export default function ChallengeSessionPage() {
  const { uniqueId } = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { loading } = useSelector(state => state.challenge)
  const [session, setSession] = useState(null)

  useEffect(() => {
    dispatch(startChallenge(uniqueId)).then(data => {
      if (data?.completed) {
        navigate(ChallengeRoute.resultRoute(uniqueId), { replace: true })
        return
      }
      if (data) setSession(data)
    })
  }, [dispatch, uniqueId])

  if (loading.isStartLoading || !session) {
    return <Loading minHeight="100vh" text="Memuat sesi..." />
  }

  if (session.scoringType === 'blitz') {
    return <BlitzSession session={session} uniqueId={uniqueId} endAt={session.endAt} />
  }
  return <ClassicSession session={session} uniqueId={uniqueId} endAt={session.endAt} />
}
