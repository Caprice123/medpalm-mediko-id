import { useEffect, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchChallengeLeaderboard } from '@store/challenge/userAction'
import { ChallengeRoute } from '../../routes'
import {
  PageWrapper, Container, BackBtn,
  HeroCard, HeroTitle, HeroSub, StatsRow, Stat, StatValue, StatLabel,
  // BadgeBox, BadgeImg, BadgeName, BadgeDesc,
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
  const { state } = useLocation()
  const result = state?.result
  const { challengeLeaderboard, loading } = useSelector(s => s.challenge)
  const [countdown, setCountdown] = useState(15)

  useEffect(() => {
    dispatch(fetchChallengeLeaderboard(uniqueId))
  }, [dispatch, uniqueId])

  useEffect(() => {
    if (countdown === 0) {
      dispatch(fetchChallengeLeaderboard(uniqueId, { silent: true }))
      setCountdown(15)
      return
    }
    const t = setTimeout(() => setCountdown(p => p - 1), 1000)
    return () => clearTimeout(t)
  }, [countdown, dispatch, uniqueId])

  if (!result) {
    navigate(ChallengeRoute.detailRoute(uniqueId))
    return null
  }

  const { score, correctCount, totalQuestions, answeredCount, totalTimeSeconds, rank, totalParticipants, scoringType, earnedBadge } = result

  return (
    <PageWrapper>
      <Container>
        <BackBtn onClick={() => navigate(ChallengeRoute.listRoute)}>← Kembali ke daftar</BackBtn>

        <HeroCard>
          <HeroTitle>🏆 Challenge Selesai!</HeroTitle>
          <HeroSub>Peringkat #{rank} dari {totalParticipants} peserta</HeroSub>
          <StatsRow>
            <Stat>
              <StatValue>{score?.toFixed(0) ?? 0}</StatValue>
              <StatLabel>Skor</StatLabel>
            </Stat>
            <Stat>
              <StatValue>#{rank}</StatValue>
              <StatLabel>Peringkat</StatLabel>
            </Stat>
            <Stat>
              <StatValue>{Math.round(totalTimeSeconds)}s</StatValue>
              <StatLabel>Waktu</StatLabel>
            </Stat>
          </StatsRow>
        </HeroCard>

        {/* BADGE HIDDEN
        {earnedBadge && (
          <BadgeBox>
            {earnedBadge.image?.url
              ? <BadgeImg src={earnedBadge.image.url} alt={earnedBadge.name} />
              : <span style={{ fontSize: '2.5rem' }}>🏅</span>
            }
            <div>
              <BadgeName>{earnedBadge.name}</BadgeName>
              {earnedBadge.description && <BadgeDesc>{earnedBadge.description}</BadgeDesc>}
            </div>
          </BadgeBox>
        )}
        */}

        <EmailNotice>
          <span style={{ fontSize: '1.25rem' }}>📧</span>
          <span>Pembahasan jawaban lengkap akan dikirimkan ke email kamu.</span>
        </EmailNotice>

        <Panel>
          <PanelHeader>
            <PanelTitle>Leaderboard · {challengeLeaderboard.length} peserta</PanelTitle>
            <RefreshCountdown>Refresh dalam {countdown}s</RefreshCountdown>
          </PanelHeader>

          {loading.isGetChallengeLeaderboardLoading ? (
            <EmptyLeader>Memuat leaderboard...</EmptyLeader>
          ) : challengeLeaderboard.length === 0 ? (
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
