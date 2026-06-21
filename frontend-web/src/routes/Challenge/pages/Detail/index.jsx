import { useEffect, useState } from 'react'
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
  MyResultBox, MyResultHeader, MyResultTitle, MyResultBadge, MyResultStats, Stat, StatValue, StatLabel,
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

function formatDuration(minutes) {
  if (minutes < 60) return `${minutes} menit`
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return m ? `${h}j ${m}m` : `${h} jam`
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

  const myStatus = detail?.myStatus
  useEffect(() => {
    if (myStatus !== 'completed') return
    dispatch(fetchChallengeLeaderboard(uniqueId))
  }, [dispatch, uniqueId, myStatus])

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
                <HeroMetaChip><span>⏱</span> {formatDuration(challenge.durationMinutes)}</HeroMetaChip>
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
                  <strong>{challenge.basePointsPerCorrect} poin</strong> untuk setiap jawaban benar
                  {challenge.timeBonusPool > 0 && (
                    <> · bonus kecepatan hingga <strong>+{challenge.timeBonusPool} poin</strong></>
                  )}
                </span>
              </PointsItem>
              {challenge.maxSpecialPerSession > 0 && (
                <PointsItem>
                  <PointsItemIcon $bg="#ede9fe">⭐</PointsItemIcon>
                  <span>
                    Hingga <strong>{challenge.maxSpecialPerSession} soal spesial</strong> bernilai poin ×2
                    {challenge.specialDurationMinutes > 0 && (
                      <> — waktu pengerjaan hanya <strong>{challenge.specialDurationMinutes} menit</strong></>
                    )}
                  </span>
                </PointsItem>
              )}
              {challengeBadges.length > 0 && (
                <PointsItem>
                  <PointsItemIcon $bg="#fef3c7">🏅</PointsItemIcon>
                  <span>
                    Top <strong>{challengeBadges[0].minRank}–{challengeBadges[challengeBadges.length - 1].maxRank}</strong> mendapat{' '}
                    badge eksklusif yang bisa di-download &amp; dibagikan
                  </span>
                </PointsItem>
              )}
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
                  <HeroMetaChip><span>⏱</span> {formatDuration(challenge.durationMinutes)}</HeroMetaChip>
                  <HeroMetaChip><span>⚡</span> {challenge.scoringType === 'blitz' ? 'Blitz' : 'Classic'}</HeroMetaChip>
                </HeroMetaRow>
              </HeroCard>

              <MyResultBox>
                <MyResultHeader>
                  <MyResultTitle>🎯 Hasil Kamu</MyResultTitle>
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
                  <Stat>
                    <StatValue>{challengeMyRank ? `#${challengeMyRank}` : '—'}</StatValue>
                    <StatLabel>Peringkat</StatLabel>
                  </Stat>
                  <Stat>
                    <StatValue>{myTotalTimeSeconds != null ? `${Math.round(myTotalTimeSeconds)}s` : '—'}</StatValue>
                    <StatLabel>Waktu</StatLabel>
                  </Stat>
                </MyResultStats>
              </MyResultBox>
            </CompletedTopRow>

            <CompletedNote>✓ Kamu sudah menyelesaikan challenge ini</CompletedNote>

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
                          {entry.score?.toFixed(0)} · {entry.correctCount}/{challenge.totalQuestions}
                        </LeaderScore>
                      </LeaderRow>
                    ))
                  )}
                </Panel>
              </TabPanel>
            )}

            {activeTab === 'badge' && (
              <TabPanel>
                {!challenge.badgesDisbursed && (
                  <BadgeInfoBanner>
                    <BadgeInfoIcon>⏳</BadgeInfoIcon>
                    <span>
                      Badge akan dihitung berdasarkan peringkat akhir dan <strong>dibagikan setelah challenge berakhir</strong>.
                      Selesaikan challenge dengan skor terbaik untuk mendapatkan badge eksklusif!
                    </span>
                  </BadgeInfoBanner>
                )}
                {challengeBadges.length === 0 ? (
                  <Panel><EmptyLeader>Belum ada badge untuk challenge ini.</EmptyLeader></Panel>
                ) : (
                  <BadgeCardGrid>
                    {challengeBadges.map(b => {
                      const earned = challenge.badgesDisbursed && challengeMyBadge?.uniqueId === b.uniqueId
                      return (
                        <BadgeCard key={b.uniqueId} $earned={earned}>
                          {b.image?.url
                            ? <BadgeCardImg src={b.image.url} alt={b.name} $earned={earned} />
                            : <BadgeCardPlaceholder>🏅</BadgeCardPlaceholder>}
                          <BadgeCardName>{b.name}</BadgeCardName>
                          <BadgeCardRankLabel>
                            Rank {b.minRank === b.maxRank ? b.minRank : `${b.minRank}–${b.maxRank}`}
                          </BadgeCardRankLabel>
                          {b.description && (
                            <div style={{ fontSize: '0.75rem', color: '#9CA3AF', lineHeight: 1.4 }}>
                              {b.description}
                            </div>
                          )}
                          {earned && <BadgeEarnedTag>✓ Kamu peroleh!</BadgeEarnedTag>}
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
