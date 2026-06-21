import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams, useNavigate } from 'react-router-dom'
import { fetchChallengeDetail, fetchChallengeBadges, fetchChallengeLeaderboard, startChallenge } from '@store/challenge/userAction'
import Loading from '@components/common/Loading'
import { formatJakartaDateLong } from '@utils/dateUtils'
import { ChallengeRoute } from '../../routes'
import {
  PageWrapper, Container, BackBtn,
  HeroCard, HeroTopRow, HeroLabel, LiveBadge, LiveDot,
  HeroTitle, HeroDesc, HeroTagsRow, HeroTag,
  DateCardsRow, DateCard, DateCardLabel, DateCardValue,
  PointsGuideCard, PointsGuideHeader, PointsGuideTitle, PointsItem, PointsItemIcon,
  StartBtn,
  MyResultBox, MyResultHeader, MyResultTitle, MyResultBadge, MyResultStats, Stat, StatValue, StatLabel,
  TabsRow, TabBtn, TabPanel,
  Panel, PanelTitle, LeaderboardHeader, RefreshCountdown,
  LeaderRow, RankNum, LeaderName, LeaderScore, EmptyLeader,
  BadgeCardGrid, BadgeCard, BadgeCardImg, BadgeCardPlaceholder,
  BadgeCardName, BadgeCardRankLabel, BadgeEarnedTag,
} from './Detail.styles'

function getDaysLeft(endAt) {
  if (!endAt) return null
  const diff = new Date(endAt) - new Date()
  if (diff <= 0) return 0
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
}

function getTagIcon(groupName) {
  if (groupName === 'university') return '🏛️'
  if (groupName === 'semester') return '📚'
  return '📋'
}

export default function ChallengeDetailPage() {
  const { uniqueId } = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { detail, challengeBadges, challengeLeaderboard, challengeMyRank, challengeMyBadge, loading } = useSelector(state => state.challenge)
  const [activeTab, setActiveTab] = useState('leaderboard')
  const [countdown, setCountdown] = useState(15)

  useEffect(() => {
    dispatch(fetchChallengeDetail(uniqueId))
    dispatch(fetchChallengeBadges(uniqueId))
  }, [dispatch, uniqueId])

  // Load leaderboard once we know the user has completed
  const myStatus = detail?.myStatus
  useEffect(() => {
    if (myStatus !== 'completed') return
    dispatch(fetchChallengeLeaderboard(uniqueId))
  }, [dispatch, uniqueId, myStatus])

  // Auto-refresh leaderboard every 15s while badges not yet disbursed
  useEffect(() => {
    if (activeTab !== 'leaderboard') return
    if (myStatus !== 'completed') return
    if (detail?.challenge?.badgesDisbursed) return
    if (countdown === 0) {
      dispatch(fetchChallengeLeaderboard(uniqueId, { silent: true }))
      setCountdown(15)
      return
    }
    const t = setTimeout(() => setCountdown(prev => prev - 1), 1000)
    return () => clearTimeout(t)
  }, [activeTab, countdown, detail?.challenge?.badgesDisbursed, dispatch, uniqueId, myStatus])

  useEffect(() => { setCountdown(15) }, [activeTab])

  const handleStart = async () => {
    await dispatch(startChallenge(uniqueId))
    navigate(ChallengeRoute.sessionRoute(uniqueId))
  }

  if (loading.isGetDetailLoading || !detail) {
    return <PageWrapper><Container><Loading /></Container></PageWrapper>
  }

  const { challenge, myScore, myCorrectCount, myTotalTimeSeconds, activeSession } = detail
  const canStart = myStatus === 'not_started'
  const inProgress = myStatus === 'in_progress' || !!activeSession
  const completed = myStatus === 'completed'
  const daysLeft = getDaysLeft(challenge.endAt)
  const tags = challenge.tags || []

  return (
    <PageWrapper>
      <Container>
        <BackBtn onClick={() => navigate(ChallengeRoute.listRoute)}>← Kembali ke daftar</BackBtn>

        <HeroCard>
          <HeroTopRow>
            <HeroLabel>📋 Quiz Challenge</HeroLabel>
            {daysLeft !== null && daysLeft > 0 && (
              <LiveBadge>
                <LiveDot />
                LIVE • {daysLeft} hari tersisa
              </LiveBadge>
            )}
            {daysLeft === 0 && (
              <LiveBadge style={{ background: 'rgba(0,0,0,0.2)', borderColor: 'rgba(255,255,255,0.15)' }}>
                ⏹ Selesai
              </LiveBadge>
            )}
          </HeroTopRow>
          <HeroTitle>{challenge.title}</HeroTitle>
          {challenge.description && <HeroDesc>{challenge.description}</HeroDesc>}
          {tags.length > 0 && (
            <HeroTagsRow>
              {tags.map(t => (
                <HeroTag key={t.id}>{getTagIcon(t.tagGroupName)} {t.name}</HeroTag>
              ))}
            </HeroTagsRow>
          )}
        </HeroCard>

        {(challenge.startAt || challenge.endAt) && (
          <DateCardsRow>
            {challenge.startAt && (
              <DateCard>
                <DateCardLabel>📅 Mulai</DateCardLabel>
                <DateCardValue>{formatJakartaDateLong(challenge.startAt)}</DateCardValue>
              </DateCard>
            )}
            {challenge.endAt && (
              <DateCard>
                <DateCardLabel>⏰ Berakhir</DateCardLabel>
                <DateCardValue>{formatJakartaDateLong(challenge.endAt)}</DateCardValue>
              </DateCard>
            )}
          </DateCardsRow>
        )}

        <PointsGuideCard>
          <PointsGuideHeader>
            <span style={{ fontSize: '1.25rem' }}>🏆</span>
            <PointsGuideTitle>Cara Mendapat Poin</PointsGuideTitle>
          </PointsGuideHeader>
          <PointsItem>
            <PointsItemIcon>⚡</PointsItemIcon>
            <span>
              <strong>{challenge.basePointsPerCorrect} poin</strong> jawaban benar
              {challenge.timeBonusPool > 0 && <> + bonus kecepatan hingga <strong>+{challenge.timeBonusPool}</strong></>}
            </span>
          </PointsItem>
          {challenge.maxSpecialPerSession > 0 && (
            <PointsItem>
              <PointsItemIcon>⭐</PointsItemIcon>
              <span>Hingga <strong>{challenge.maxSpecialPerSession} soal spesial</strong> mendapat poin ×2</span>
            </PointsItem>
          )}
          {challengeBadges.length > 0 && (
            <PointsItem>
              <PointsItemIcon>🏅</PointsItemIcon>
              <span>
                Top {challengeBadges[0].minRank}–{challengeBadges[challengeBadges.length - 1].maxRank} dapat{' '}
                <strong>badge eksklusif</strong> yang bisa di-download & dibagikan
              </span>
            </PointsItem>
          )}
          <PointsItem>
            <PointsItemIcon>⚠️</PointsItemIcon>
            <span>Challenge hanya bisa diikuti <strong>1 kali</strong></span>
          </PointsItem>
        </PointsGuideCard>

        {canStart && (
          <StartBtn onClick={handleStart} disabled={loading.isStartLoading}>
            {loading.isStartLoading ? 'Memuat...' : 'Mulai Challenge →'}
          </StartBtn>
        )}
        {inProgress && (
          <StartBtn onClick={() => navigate(ChallengeRoute.sessionRoute(uniqueId))}>
            Lanjutkan Challenge →
          </StartBtn>
        )}
        {completed && (
          <div style={{ textAlign: 'center', color: '#6b7280', fontSize: '0.875rem', marginBottom: '1.75rem' }}>
            ✓ Kamu sudah menyelesaikan challenge ini
          </div>
        )}

        {completed && (
          <>
            <MyResultBox>
              <MyResultHeader>
                <MyResultTitle>Hasil Kamu</MyResultTitle>
                {challengeMyBadge && <MyResultBadge>🏅 {challengeMyBadge.name}</MyResultBadge>}
              </MyResultHeader>
              <MyResultStats>
                <Stat>
                  <StatValue>{myScore?.toFixed(0) ?? 0}</StatValue>
                  <StatLabel>Skor</StatLabel>
                </Stat>
                <Stat>
                  <StatValue>{myCorrectCount ?? 0}/{challenge.totalQuestions}</StatValue>
                  <StatLabel>Benar</StatLabel>
                </Stat>
                {challengeMyRank && (
                  <Stat>
                    <StatValue>#{challengeMyRank}</StatValue>
                    <StatLabel>Peringkat</StatLabel>
                  </Stat>
                )}
                {myTotalTimeSeconds != null && (
                  <Stat>
                    <StatValue>{Math.round(myTotalTimeSeconds)}s</StatValue>
                    <StatLabel>Waktu</StatLabel>
                  </Stat>
                )}
              </MyResultStats>
            </MyResultBox>

            <TabsRow>
              <TabBtn $active={activeTab === 'leaderboard'} onClick={() => setActiveTab('leaderboard')}>
                Leaderboard {challengeLeaderboard.length > 0 ? `(${challengeLeaderboard.length})` : ''}
              </TabBtn>
              <TabBtn $active={activeTab === 'badge'} onClick={() => setActiveTab('badge')}>
                Badge {challengeBadges.length > 0 ? `(${challengeBadges.length})` : ''}
              </TabBtn>
            </TabsRow>

            {activeTab === 'leaderboard' && (
              <TabPanel>
                <Panel>
                  <LeaderboardHeader>
                    <PanelTitle style={{ margin: 0, border: 'none', paddingBottom: 0 }}>
                      Leaderboard ({challengeLeaderboard.length} peserta)
                    </PanelTitle>
                    {!challenge.badgesDisbursed && (
                      <RefreshCountdown>Refresh dalam {countdown}s</RefreshCountdown>
                    )}
                  </LeaderboardHeader>
                  {loading.isGetChallengeLeaderboardLoading ? (
                    <EmptyLeader>Memuat leaderboard...</EmptyLeader>
                  ) : challengeLeaderboard.length === 0 ? (
                    <EmptyLeader>Belum ada peserta yang menyelesaikan challenge ini.</EmptyLeader>
                  ) : (
                    challengeLeaderboard.map(entry => (
                      <LeaderRow key={entry.rank} $isMe={entry.isMe}>
                        <RankNum $rank={entry.rank}>#{entry.rank}</RankNum>
                        <LeaderName $isMe={entry.isMe}>
                          {entry.isMe ? `${entry.userName} (Kamu)` : entry.userName}
                        </LeaderName>
                        <LeaderScore>
                          {entry.score?.toFixed(0)} poin · {entry.correctCount}/{challenge.totalQuestions}
                        </LeaderScore>
                      </LeaderRow>
                    ))
                  )}
                </Panel>
              </TabPanel>
            )}

            {activeTab === 'badge' && (
              <TabPanel>
                {challengeBadges.length === 0 ? (
                  <Panel><EmptyLeader>Belum ada badge untuk challenge ini.</EmptyLeader></Panel>
                ) : (
                  <BadgeCardGrid>
                    {challengeBadges.map(b => {
                      const earned = challengeMyBadge?.uniqueId === b.uniqueId
                      return (
                        <BadgeCard key={b.uniqueId} $earned={earned}>
                          {b.image?.url
                            ? <BadgeCardImg src={b.image.url} alt={b.name} $earned={earned} />
                            : <BadgeCardPlaceholder>🏅</BadgeCardPlaceholder>}
                          <BadgeCardName>{b.name}</BadgeCardName>
                          <BadgeCardRankLabel>Rank {b.minRank}–{b.maxRank}</BadgeCardRankLabel>
                          {b.description && (
                            <div style={{ fontSize: '0.75rem', color: '#9CA3AF', lineHeight: 1.4 }}>
                              {b.description}
                            </div>
                          )}
                          {earned && <BadgeEarnedTag>✓ Kamu peroleh</BadgeEarnedTag>}
                        </BadgeCard>
                      )
                    })}
                  </BadgeCardGrid>
                )}
              </TabPanel>
            )}
          </>
        )}
      </Container>
    </PageWrapper>
  )
}
