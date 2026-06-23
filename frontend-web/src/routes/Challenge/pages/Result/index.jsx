import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchChallengeLeaderboard } from '@store/challenge/userAction'
import { ChallengeRoute } from '../../routes'
import {
  PageWrapper, Container, BackBtn,
  HeroCard, HeroTitle, HeroSub, StatsRow, Stat, StatValue, StatLabel,
  EmailNotice,
  Panel, PanelHeader, PanelTitle, RefreshCountdown,
  LeaderRow, RankNum, MedalIcon, LeaderName, LeaderScore, EmptyLeader,
  DetailBtn,
} from './Result.styles'

const MEDALS = { 1: '🥇', 2: '🥈', 3: '🥉' }

export default function ChallengeResultPage() {
  const { uniqueId } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { challengeLeaderboard, challengeMyRank, loading } = useSelector(s => s.challenge)
  const [countdown, setCountdown] = useState(15)
  const [fetched, setFetched] = useState(false)

  useEffect(() => {
    dispatch(fetchChallengeLeaderboard(uniqueId)).then(() => setFetched(true))
  }, [dispatch, uniqueId])

  useEffect(() => {
    if (!fetched) return
    if (countdown === 0) {
      dispatch(fetchChallengeLeaderboard(uniqueId, { silent: true }))
      setCountdown(15)
      return
    }
    const t = setTimeout(() => setCountdown(p => p - 1), 1000)
    return () => clearTimeout(t)
  }, [countdown, dispatch, uniqueId, fetched])

  if (!fetched || loading.isGetChallengeLeaderboardLoading) {
    return (
      <PageWrapper>
        <Container>
          <EmptyLeader>Memuat hasil...</EmptyLeader>
        </Container>
      </PageWrapper>
    )
  }

  if (challengeMyRank === null) {
    navigate(ChallengeRoute.detailRoute(uniqueId))
    return null
  }

  const myEntry = challengeLeaderboard.find(e => e.isMe)
  const score = myEntry?.score ?? 0
  const totalTimeSeconds = myEntry?.totalTimeSeconds ?? 0
  const totalParticipants = challengeLeaderboard.length

  return (
    <PageWrapper>
      <Container>
        <BackBtn onClick={() => navigate(ChallengeRoute.listRoute)}>← Kembali ke daftar</BackBtn>

        <HeroCard>
          <HeroTitle>🏆 Challenge Selesai!</HeroTitle>
          <HeroSub>Peringkat #{challengeMyRank} dari {totalParticipants} peserta</HeroSub>
          <StatsRow>
            <Stat>
              <StatValue>{score?.toFixed(0) ?? 0}</StatValue>
              <StatLabel>Skor</StatLabel>
            </Stat>
            <Stat>
              <StatValue>#{challengeMyRank}</StatValue>
              <StatLabel>Peringkat</StatLabel>
            </Stat>
            <Stat>
              <StatValue>{Math.round(totalTimeSeconds)}s</StatValue>
              <StatLabel>Waktu</StatLabel>
            </Stat>
          </StatsRow>
        </HeroCard>

        <EmailNotice>
          <span style={{ fontSize: '1.25rem' }}>📧</span>
          <span>Pembahasan jawaban lengkap akan dikirimkan ke email kamu.</span>
        </EmailNotice>

        <Panel>
          <PanelHeader>
            <PanelTitle>Leaderboard · {totalParticipants} peserta</PanelTitle>
            <RefreshCountdown>Refresh dalam {countdown}s</RefreshCountdown>
          </PanelHeader>

          {challengeLeaderboard.length === 0 ? (
            <EmptyLeader>Belum ada peserta yang menyelesaikan challenge ini.</EmptyLeader>
          ) : (
            challengeLeaderboard.map(entry => (
              <LeaderRow key={entry.rank} $isMe={entry.isMe} $rank={entry.rank}>
                {MEDALS[entry.rank]
                  ? <MedalIcon>{MEDALS[entry.rank]}</MedalIcon>
                  : <RankNum>#{entry.rank}</RankNum>}
                <LeaderName $isMe={entry.isMe}>
                  {entry.userName}{entry.isMe && ' (Kamu)'}
                </LeaderName>
                <LeaderScore>
                  {entry.score?.toFixed(0)} pts
                </LeaderScore>
              </LeaderRow>
            ))
          )}
        </Panel>

        <DetailBtn onClick={() => navigate(ChallengeRoute.detailRoute(uniqueId))}>
          Lihat Detail Challenge
        </DetailBtn>
      </Container>
    </PageWrapper>
  )
}
