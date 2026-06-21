import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { startChallenge } from '@store/challenge/userAction'
import Loading from '@components/common/Loading'
import ClassicSession from '../ClassicSession'
import BlitzSession from '../BlitzSession'

export default function ChallengeSessionPage() {
  const { uniqueId } = useParams()
  const dispatch = useDispatch()
  const { loading } = useSelector(state => state.challenge)
  const [session, setSession] = useState(null)

  useEffect(() => {
    dispatch(startChallenge(uniqueId)).then(data => {
      if (data) setSession(data)
    })
  }, [dispatch, uniqueId])

  if (loading.isStartLoading || !session) {
    return <Loading minHeight="100vh" text="Memuat sesi..." />
  }

  if (session.scoringType === 'blitz') {
    return <BlitzSession session={session} uniqueId={uniqueId} />
  }
  return <ClassicSession session={session} uniqueId={uniqueId} />
}
