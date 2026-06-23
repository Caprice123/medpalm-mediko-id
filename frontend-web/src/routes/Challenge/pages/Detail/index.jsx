import { useEffect, useState } from 'react'
import ShareModal from './ShareModal'
import { useDispatch, useSelector } from 'react-redux'
import { useParams, useNavigate } from 'react-router-dom'
import { fetchChallengeDetail, fetchChallengeBadges, fetchChallengeLeaderboard, startChallenge } from '@store/challenge/userAction'
import Loading from '@components/common/Loading'
import { formatJakartaDateLong } from '@utils/dateUtils'
import { ChallengeRoute } from '../../routes'
import {
  PageWrapper, Container, BackBtn,
  CompletedTopRow,
  HeroCard, HeroTopRow, HeroLabel, LiveBadge, LiveDot,
  HeroTitle, HeroDesc, HeroTagsRow, HeroTag,
  HeroMetaRow, HeroMetaChip,
  DateCardsRow, DateCard, DateCardIcon, DateCardInfo, DateCardLabel, DateCardValue,
  PointsGuideCard, PointsGuideHeader, PointsGuideTitleIcon, PointsGuideTitle, PointsItem, PointsItemIcon,
  StartSection, StartBtn, ContinueBtn, StartHint, CompletedNote,
  MyResultBox, MyResultHeader, MyResultTitle, MyResultBadge, MyResultStats, Stat, StatValue, StatLabel, ShareBtn,
  TabsRow, TabBtn, TabPanel,
  Panel, PanelTitle, LeaderboardHeader, RefreshCountdown,
  LeaderRow, RankNum, MedalIcon, LeaderName, LeaderScore, EmptyLeader,
  BadgeCardGrid, BadgeCard, BadgeCardImg, BadgeCardPlaceholder,
  BadgeCardName, BadgeCardRankLabel, BadgeEarnedTag,
  BadgeInfoBanner, BadgeInfoIcon,
} from './Detail.styles'

const MEDALS = { 1: '🥇', 2: '🥈', 3: '🥉' }

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

function formatDuration(seconds) {
  if (seconds < 60) return `${seconds} detik`
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  if (m < 60) return s ? `${m}m ${s}s` : `${m} menit`
  const h = Math.floor(m / 60)
  const rem = m % 60
  return rem ? `${h}j ${rem}m` : `${h} jam`
}

export default function ChallengeDetailPage() {
  const { uniqueId } = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { detail, /* challengeBadges, */ challengeLeaderboard, challengeMyRank, /* challengeMyBadge, */ loading } = useSelector(state => state.challenge)
  const [countdown, setCountdown] = useState(15)
  const [shareOpen, setShareOpen] = useState(false)

  useEffect(() => {
    dispatch(fetchChallengeDetail(uniqueId))
    // dispatch(fetchChallengeBadges(uniqueId))
  }, [dispatch, uniqueId])

  const myStatus = detail?.myStatus
  useEffect(() => {
    if (myStatus !== 'completed') return
    dispatch(fetchChallengeLeaderboard(uniqueId, { limit: 25 }))
  }, [dispatch, uniqueId, myStatus])

  useEffect(() => {
    if (myStatus !== 'completed') return
    if (detail?.challenge?.badgesDisbursed) return
    if (countdown === 0) {
      dispatch(fetchChallengeLeaderboard(uniqueId, { silent: true, limit: 25 }))
      setCountdown(15)
      return
    }
    const t = setTimeout(() => setCountdown(prev => prev - 1), 1000)
    return () => clearTimeout(t)
  }, [countdown, detail?.challenge?.badgesDisbursed, dispatch, uniqueId, myStatus])

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

        {/* ── Non-completed: stacked layout ── */}
        {!completed && (
          <>
            <HeroCard>
              <HeroTopRow>
                <HeroLabel>🏆 Quiz Challenge</HeroLabel>
                {daysLeft !== null && daysLeft > 0 && (
                  <LiveBadge>
                    <LiveDot />
                    LIVE · {daysLeft} hari lagi
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
              <HeroMetaRow>
                <HeroMetaChip><span>📝</span> {challenge.totalQuestions} soal</HeroMetaChip>
                <HeroMetaChip><span>⏱</span> {formatDuration(challenge.durationSeconds)}</HeroMetaChip>
                <HeroMetaChip><span>⚡</span> {challenge.scoringType === 'blitz' ? 'Blitz' : 'Classic'}</HeroMetaChip>
                {challenge.maxSpecialPerSession > 0 && (
                  <HeroMetaChip><span>⭐</span> {challenge.maxSpecialPerSession} soal spesial</HeroMetaChip>
                )}
              </HeroMetaRow>
            </HeroCard>

            {(challenge.startAt || challenge.endAt) && (
              <DateCardsRow>
                {challenge.startAt && (
                  <DateCard>
                    <DateCardIcon $color="#f0fdf4">📅</DateCardIcon>
                    <DateCardInfo>
                      <DateCardLabel>Mulai</DateCardLabel>
                      <DateCardValue>{formatJakartaDateLong(challenge.startAt)}</DateCardValue>
                    </DateCardInfo>
                  </DateCard>
                )}
                {challenge.endAt && (
                  <DateCard>
                    <DateCardIcon $color="#fff7ed">⏰</DateCardIcon>
                    <DateCardInfo>
                      <DateCardLabel>Berakhir</DateCardLabel>
                      <DateCardValue>{formatJakartaDateLong(challenge.endAt)}</DateCardValue>
                    </DateCardInfo>
                  </DateCard>
                )}
              </DateCardsRow>
            )}

            <PointsGuideCard>
              <PointsGuideHeader>
                <PointsGuideTitleIcon>🏆</PointsGuideTitleIcon>
                <PointsGuideTitle>Cara Mendapat Poin</PointsGuideTitle>
              </PointsGuideHeader>
              <PointsItem>
                <PointsItemIcon $bg="#d1fae5">⚡</PointsItemIcon>
                <span>
                  {challenge.scoringType === 'classic'
                    ? <>Maks <strong>{challenge.basePointsPerCorrect * 2} poin</strong> per soal (tergantung kecepatan &amp; streak)</>
                    : <><strong>{challenge.basePointsPerCorrect} poin</strong> untuk setiap jawaban benar</>
                  }
                </span>
              </PointsItem>
              {challenge.maxSpecialPerSession > 0 && (
                <PointsItem>
                  <PointsItemIcon $bg="#ede9fe">⭐</PointsItemIcon>
                  <span>
                    Hingga <strong>{challenge.maxSpecialPerSession} soal spesial</strong> —{' '}
                    {challenge.scoringType === 'classic'
                      ? <>bernilai <strong>{challenge.basePointsPerCorrect * 2} poin</strong> (2× lebih besar dari soal biasa)</>
                      : <>bernilai <strong>2 poin</strong> (soal biasa hanya 1 poin)</>
                    }
                    {challenge.specialDurationSeconds > 0 && (
                      <> · waktu pengerjaan hanya <strong>{formatDuration(challenge.specialDurationSeconds)}</strong></>
                    )}
                  </span>
                </PointsItem>
              )}
              {/* BADGES HIDDEN
              {challengeBadges.length > 0 && (
                <PointsItem>
                  <PointsItemIcon $bg="#fef3c7">🏅</PointsItemIcon>
                  <span>
                    Top <strong>{challengeBadges[0].minRank}–{challengeBadges[challengeBadges.length - 1].maxRank}</strong> mendapat{' '}
                    badge eksklusif yang bisa di-download &amp; dibagikan
                  </span>
                </PointsItem>
              )}
              */}
              <PointsItem>
                <PointsItemIcon $bg="#fee2e2">⚠️</PointsItemIcon>
                <span>Challenge hanya bisa diikuti <strong>1 kali</strong> — tidak bisa diulang</span>
              </PointsItem>
            </PointsGuideCard>

            <StartSection>
              {canStart && (
                <>
                  <StartBtn onClick={handleStart} disabled={loading.isStartLoading}>
                    {loading.isStartLoading ? 'Memuat...' : '🚀 Mulai Challenge'}
                  </StartBtn>
                  <StartHint>Pastikan kamu siap — challenge tidak bisa diulang setelah dimulai</StartHint>
                </>
              )}
              {inProgress && (
                <>
                  <ContinueBtn onClick={() => navigate(ChallengeRoute.sessionRoute(uniqueId))}>
                    ▶ Lanjutkan Challenge
                  </ContinueBtn>
                  <StartHint>Kamu masih dalam sesi aktif</StartHint>
                </>
              )}
            </StartSection>
          </>
        )}

        {/* ── Completed: side-by-side layout ── */}
        {completed && (
          <>
            <CompletedTopRow>
              <HeroCard>
                <HeroTopRow>
                  <HeroLabel>🏆 Quiz Challenge</HeroLabel>
                  {daysLeft !== null && daysLeft > 0 && (
                    <LiveBadge>
                      <LiveDot />
                      LIVE · {daysLeft} hari lagi
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
                <HeroMetaRow>
                  <HeroMetaChip><span>📝</span> {challenge.totalQuestions} soal</HeroMetaChip>
                  <HeroMetaChip><span>⏱</span> {formatDuration(challenge.durationSeconds)}</HeroMetaChip>
                  <HeroMetaChip><span>⚡</span> {challenge.scoringType === 'blitz' ? 'Blitz' : 'Classic'}</HeroMetaChip>
                </HeroMetaRow>
              </HeroCard>

              <MyResultBox>
                <MyResultHeader>
                  <MyResultTitle>🎯 Hasil Kamu</MyResultTitle>
                  {/* {challengeMyBadge && <MyResultBadge>🏅 {challengeMyBadge.name}</MyResultBadge>} */}
                </MyResultHeader>
                <MyResultStats>
                  <Stat>
                    <StatValue>{myScore?.toFixed(0) ?? 0}</StatValue>
                    <StatLabel>Skor</StatLabel>
                  </Stat>
                  <Stat>
                    <StatValue>{challengeMyRank ? `#${challengeMyRank}` : '—'}</StatValue>
                    <StatLabel>Peringkat</StatLabel>
                  </Stat>
                  <Stat>
                    <StatValue>{myTotalTimeSeconds != null ? `${Math.round(myTotalTimeSeconds)}s` : '—'}</StatValue>
                    <StatLabel>Waktu</StatLabel>
                  </Stat>
                </MyResultStats>
                <ShareBtn onClick={() => setShareOpen(true)}>
                  ↗ Bagikan Hasil
                </ShareBtn>
              </MyResultBox>
            </CompletedTopRow>

            {(challenge.startAt || challenge.endAt) && (
              <DateCardsRow>
                {challenge.startAt && (
                  <DateCard>
                    <DateCardIcon $color="#f0fdf4">📅</DateCardIcon>
                    <DateCardInfo>
                      <DateCardLabel>Mulai</DateCardLabel>
                      <DateCardValue>{formatJakartaDateLong(challenge.startAt)}</DateCardValue>
                    </DateCardInfo>
                  </DateCard>
                )}
                {challenge.endAt && (
                  <DateCard>
                    <DateCardIcon $color="#fff7ed">⏰</DateCardIcon>
                    <DateCardInfo>
                      <DateCardLabel>Berakhir</DateCardLabel>
                      <DateCardValue>{formatJakartaDateLong(challenge.endAt)}</DateCardValue>
                    </DateCardInfo>
                  </DateCard>
                )}
              </DateCardsRow>
            )}

            <CompletedNote>✓ Kamu sudah menyelesaikan challenge ini</CompletedNote>

            {/* TABS HIDDEN
            <TabsRow>
              <TabBtn $active={activeTab === 'leaderboard'} onClick={() => setActiveTab('leaderboard')}>
                Leaderboard {challengeLeaderboard.length > 0 ? `(${challengeLeaderboard.length})` : ''}
              </TabBtn>
              <TabBtn $active={activeTab === 'badge'} onClick={() => setActiveTab('badge')}>
                Badge ...
              </TabBtn>
            </TabsRow>
            */}

            <Panel>
              <LeaderboardHeader>
                <PanelTitle style={{ margin: 0, border: 'none', paddingBottom: 0 }}>
                  Leaderboard · {challengeLeaderboard.length} peserta
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
                  <LeaderRow key={entry.rank} $isMe={entry.isMe} $rank={entry.rank}>
                    {MEDALS[entry.rank]
                      ? <MedalIcon>{MEDALS[entry.rank]}</MedalIcon>
                      : <RankNum $rank={entry.rank}>#{entry.rank}</RankNum>}
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

            {/* BADGE PANEL HIDDEN
            {activeTab === 'badge' && ( ... )}
            */}
          </>
        )}
      </Container>

      {completed && (
        <ShareModal
          isOpen={shareOpen}
          onClose={() => setShareOpen(false)}
          challengeTitle={challenge?.title}
          score={myScore?.toFixed(0) ?? 0}
        />
      )}
    </PageWrapper>
  )
}
