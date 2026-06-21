import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { ChallengeRoute } from '../../routes'
import {
  PageWrapper, Container, HeroCard, HeroTitle, StatsRow, Stat, StatValue, StatLabel,
  BadgeBox, BadgeImg, BadgeName, BadgeDesc, EmailNotice, BackBtn
} from './Result.styles'

export default function ChallengeResultPage() {
  const { uniqueId } = useParams()
  const navigate = useNavigate()
  const { state } = useLocation()
  const result = state?.result

  if (!result) {
    navigate(ChallengeRoute.detailRoute(uniqueId))
    return null
  }

  const { score, correctCount, totalQuestions, answeredCount, totalTimeSeconds, rank, totalParticipants, scoringType, earnedBadge } = result

  return (
    <PageWrapper>
      <Container>
        <HeroCard>
          <HeroTitle>Challenge Selesai!</HeroTitle>
          <StatsRow>
            <Stat>
              <StatValue>{score?.toFixed(0) ?? 0}</StatValue>
              <StatLabel>Skor</StatLabel>
            </Stat>
            <Stat>
              <StatValue>{correctCount}/{scoringType === 'blitz' ? (answeredCount ?? totalQuestions) : totalQuestions}</StatValue>
              <StatLabel>Jawaban Benar</StatLabel>
            </Stat>
            <Stat>
              <StatValue>#{rank}</StatValue>
              <StatLabel>Peringkat dari {totalParticipants}</StatLabel>
            </Stat>
            <Stat>
              <StatValue>{Math.round(totalTimeSeconds)}s</StatValue>
              <StatLabel>Total Waktu</StatLabel>
            </Stat>
          </StatsRow>
        </HeroCard>

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

        <EmailNotice>
          <span style={{ fontSize: '1.25rem' }}>📧</span>
          <span>Pembahasan jawaban lengkap akan dikirimkan ke email kamu.</span>
        </EmailNotice>

        <BackBtn onClick={() => navigate(ChallengeRoute.detailRoute(uniqueId))}>
          Lihat Leaderboard
        </BackBtn>
      </Container>
    </PageWrapper>
  )
}
