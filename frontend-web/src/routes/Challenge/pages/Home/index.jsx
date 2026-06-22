import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getWithToken } from '@utils/requestUtils'
import Endpoints from '@config/endpoint'
import Loading from '@components/common/Loading'
import EmptyState from '@components/common/EmptyState'
import { formatJakartaDateLong } from '@utils/dateUtils'
import { ChallengeRoute } from '../../routes'
import {
  PageWrapper, Container, TopSection,
  HeroCard, HeroTopRow, LiveBadge, LiveDot, HeroChip,
  HeroTitle, HeroDesc, HeroActions, JoinBtn,
  SlideDots, SlideDot,
  LeaderPanel, LeaderPanelHeader, LeaderPanelTitle, LeaderPanelLink,
  MiniLeaderRow, MiniRank, MiniLeaderName, MiniScore, MyRankBadge,
  EmptyLeaderMsg,
  StatsRow, StatCard, StatCardLabel, StatCardValue,
  SectionHeader, SectionTitle, SectionSub, SeeAllBtn,
  ChallengeGrid, ChallengeCard, CardTopRow, CategoryChip, TimeLeftTag, CardTitle, CardFooter,
  PlayedCount, PointsLabel, PlayBtn,
  BadgesSection,
  LatestBadgeCard, LatestBadgeImg, LatestBadgePlaceholder, LatestBadgeInfo,
  LatestBadgeLabel, LatestBadgeName, LatestBadgeMeta, LatestBadgeRank,
  NoBadgeCta, NoBadgeIcon, NoBadgeText, NoBadgeTitle, NoBadgeSub,
  HowToPlayGrid, HowToPlayCard, HowToPlayIcon, HowToPlayStep, HowToPlayTitle, HowToPlayDesc,
  EmptyHero, EmptyHeroIcon, EmptyHeroTitle, EmptyHeroSub,
  UpcomingBanner, UpcomingInfo, UpcomingLabel, UpcomingTitle, UpcomingDesc, UpcomingMeta, UpcomingBtn, UpcomingTrophy,
} from './Home.styles'

const SCORING_LABEL = { classic: 'CLASSIC', blitz: 'BLITZ' }
const SLIDE_INTERVAL = 5000
const FADE_DURATION = 300

function getTimeLeft(endAt) {
  if (!endAt) return null
  const diff = new Date(endAt) - new Date()
  if (diff <= 0) return null
  const hours = Math.ceil(diff / (1000 * 60 * 60))
  if (hours >= 48) return { short: `${Math.ceil(hours / 24)}h`, urgent: false }
  if (hours >= 1)  return { short: `${hours}j`, urgent: hours <= 6 }
  return { short: '<1j', urgent: true }
}

export default function ChallengeHomePage() {
  const navigate = useNavigate()
  const [ongoing, setOngoing] = useState([])
  const [upcoming, setUpcoming] = useState(null)
  const [myBadges, setMyBadges] = useState([])
  const [leaderboardMap, setLeaderboardMap] = useState({})
  const [loaded, setLoaded] = useState(false)
  const [lbLoading, setLbLoading] = useState(false)
  const [currentIdx, setCurrentIdx] = useState(0)
  const [transitioning, setTransitioning] = useState(false)
  const intervalRef = useRef(null)

  useEffect(() => {
    const load = async () => {
      try {
        const [ongoingRes, upcomingRes, badgesRes] = await Promise.all([
          getWithToken(Endpoints.api.challenges, { tab: 'ongoing', page: 1, perPage: 3 }),
          getWithToken(Endpoints.api.challenges, { tab: 'upcoming', page: 1, perPage: 1 }),
          getWithToken(Endpoints.api.challengeMyBadges).catch(() => ({ data: { data: [] } })),
        ])
        const ongoingList = ongoingRes.data.data || []
        const upcomingList = upcomingRes.data.data || []
        setOngoing(ongoingList)
        setUpcoming(upcomingList[0] || null)
        setMyBadges(badgesRes.data.data || [])

        if (ongoingList.length > 0) {
          setLbLoading(true)
          try {
            const lbResults = await Promise.all(
              ongoingList.map(c =>
                getWithToken(`${Endpoints.api.challenges}/${c.uniqueId}/leaderboard`)
                  .then(res => ({ uniqueId: c.uniqueId, data: res.data.data }))
                  .catch(() => ({ uniqueId: c.uniqueId, data: null }))
              )
            )
            const map = {}
            lbResults.forEach(({ uniqueId, data }) => { map[uniqueId] = data })
            setLeaderboardMap(map)
          } finally {
            setLbLoading(false)
          }
        }
      } finally {
        setLoaded(true)
      }
    }
    load()
  }, [])

  // Auto-advance slideshow
  useEffect(() => {
    if (ongoing.length <= 1) return
    intervalRef.current = setInterval(() => {
      setTransitioning(true)
      setTimeout(() => {
        setCurrentIdx(prev => (prev + 1) % ongoing.length)
        setTransitioning(false)
      }, FADE_DURATION)
    }, SLIDE_INTERVAL)
    return () => clearInterval(intervalRef.current)
  }, [ongoing.length])

  const handleDotClick = (idx) => {
    if (idx === currentIdx || transitioning) return
    clearInterval(intervalRef.current)
    setTransitioning(true)
    setTimeout(() => {
      setCurrentIdx(idx)
      setTransitioning(false)
      // Restart auto-advance after manual navigation
      if (ongoing.length > 1) {
        intervalRef.current = setInterval(() => {
          setTransitioning(true)
          setTimeout(() => {
            setCurrentIdx(prev => (prev + 1) % ongoing.length)
            setTransitioning(false)
          }, FADE_DURATION)
        }, SLIDE_INTERVAL)
      }
    }, FADE_DURATION)
  }

  const handlePlay = (c) => {
    if (c.myStatus === 'completed') navigate(ChallengeRoute.resultRoute(c.uniqueId))
    else navigate(ChallengeRoute.detailRoute(c.uniqueId))
  }

  const getHeroLabel = (myStatus) => {
    if (myStatus === 'completed')   return 'Lihat Hasil'
    if (myStatus === 'in_progress') return 'Lanjutkan →'
    return 'Ikuti Sekarang'
  }

  const getCardLabel = (myStatus) => {
    if (myStatus === 'completed')   return 'Selesai ✓'
    if (myStatus === 'in_progress') return 'Lanjut →'
    return 'PLAY →'
  }

  if (!loaded) return <Loading text="Memuat Challenge Arena..." minHeight="calc(100vh - 90px)" />

  const featured = ongoing[currentIdx] || null
  const timeLeft = featured ? getTimeLeft(featured.endAt) : null
  const currentLb = featured ? (leaderboardMap[featured.uniqueId] || {}) : {}
  const leaderboard = currentLb.leaderboard || []
  const myRank = currentLb.myRank || null

  return (
    <PageWrapper>
      <Container>

        {/* ── Hero slideshow + leaderboard ── */}
        <TopSection>
          {featured ? (
            <HeroCard $transitioning={transitioning}>
              <HeroTopRow>
                <LiveBadge><LiveDot />LIVE</LiveBadge>
                <HeroChip $type={featured.scoringType}>
                  {SCORING_LABEL[featured.scoringType] || featured.scoringType?.toUpperCase()}
                </HeroChip>
              </HeroTopRow>
              <HeroTitle>{featured.title}</HeroTitle>
              {featured.description && <HeroDesc>{featured.description}</HeroDesc>}
              <HeroActions>
                <JoinBtn $status={featured.myStatus} onClick={() => handlePlay(featured)}>
                  {getHeroLabel(featured.myStatus)}
                </JoinBtn>
              </HeroActions>
              {ongoing.length > 1 && (
                <SlideDots>
                  {ongoing.map((_, i) => (
                    <SlideDot key={i} $active={i === currentIdx} onClick={() => handleDotClick(i)} />
                  ))}
                </SlideDots>
              )}
            </HeroCard>
          ) : (
            <EmptyHero>
              <EmptyHeroIcon>🏆</EmptyHeroIcon>
              <EmptyHeroTitle>Tidak ada challenge aktif</EmptyHeroTitle>
              <EmptyHeroSub>Challenge baru akan segera hadir</EmptyHeroSub>
            </EmptyHero>
          )}

          <LeaderPanel>
            <LeaderPanelHeader>
              <LeaderPanelTitle>Leaderboard</LeaderPanelTitle>
              {featured && (
                <LeaderPanelLink onClick={() => navigate(ChallengeRoute.detailRoute(featured.uniqueId))}>
                  LIHAT SEMUA →
                </LeaderPanelLink>
              )}
            </LeaderPanelHeader>

            {lbLoading ? (
              <EmptyLeaderMsg>Memuat...</EmptyLeaderMsg>
            ) : leaderboard.length === 0 ? (
              <EmptyLeaderMsg>Belum ada peserta</EmptyLeaderMsg>
            ) : (
              <div key={featured?.uniqueId}>
                {leaderboard.slice(0, 10).map((row, i) => (
                  <MiniLeaderRow key={row.rank} $index={i}>
                    <MiniRank>{row.rank}</MiniRank>
                    <MiniLeaderName>{row.userName}</MiniLeaderName>
                    <MiniScore>{row.score?.toFixed(0)}</MiniScore>
                  </MiniLeaderRow>
                ))}
                {myRank && !leaderboard.slice(0, 10).find(r => r.isMe) && (
                  <MiniLeaderRow $self $index={10}>
                    <MiniRank>{myRank}</MiniRank>
                    <MiniLeaderName>Kamu</MiniLeaderName>
                    <MyRankBadge>#{myRank}</MyRankBadge>
                  </MiniLeaderRow>
                )}
              </div>
            )}
          </LeaderPanel>
        </TopSection>

        {/* ── Stats row ── */}
        {featured && (
          <StatsRow key={featured.uniqueId}>
            <StatCard $index={0}>
              <StatCardLabel>Peringkat Saya</StatCardLabel>
              <StatCardValue $color="#0d9488">#{myRank || '–'}</StatCardValue>
            </StatCard>
            <StatCard $index={1}>
              <StatCardLabel>Total Soal</StatCardLabel>
              <StatCardValue>{featured.totalQuestions || '–'}</StatCardValue>
            </StatCard>
            <StatCard $index={2}>
              <StatCardLabel>Poin / Benar</StatCardLabel>
              <StatCardValue $color="#d97706">+{featured.basePointsPerCorrect}</StatCardValue>
            </StatCard>
            {timeLeft && (
              <StatCard $index={3}>
                <StatCardLabel>Berakhir Dalam</StatCardLabel>
                <StatCardValue $color="#DC2626">{timeLeft.short}</StatCardValue>
              </StatCard>
            )}
          </StatsRow>
        )}

        {/* ── Active challenges ── */}
        <SectionHeader>
          <div>
            <SectionTitle>Challenge Aktif</SectionTitle>
            <SectionSub>Tantangan yang sedang berlangsung saat ini</SectionSub>
          </div>
          <SeeAllBtn onClick={() => navigate(ChallengeRoute.listRoute)}>
            LIHAT SEMUA →
          </SeeAllBtn>
        </SectionHeader>

        {ongoing.length === 0 ? (
          <EmptyState icon="🏆" title="Tidak ada challenge aktif saat ini" />
        ) : (
          <ChallengeGrid>
            {ongoing.map(c => {
              const tl = getTimeLeft(c.endAt)
              return (
                <ChallengeCard key={c.uniqueId} onClick={() => navigate(ChallengeRoute.detailRoute(c.uniqueId))}>
                  <CardTopRow>
                    <CategoryChip $type={c.scoringType}>
                      {SCORING_LABEL[c.scoringType] || c.scoringType?.toUpperCase()}
                    </CategoryChip>
                    {tl && <TimeLeftTag $urgent={tl.urgent}>{tl.short} tersisa</TimeLeftTag>}
                  </CardTopRow>
                  <CardTitle>{c.title}</CardTitle>
                  <CardFooter>
                    <PlayedCount>{c.playedCount?.toLocaleString('id-ID')} peserta</PlayedCount>
                    <PointsLabel>+{c.basePointsPerCorrect} poin</PointsLabel>
                    <PlayBtn $status={c.myStatus}>{getCardLabel(c.myStatus)}</PlayBtn>
                  </CardFooter>
                </ChallengeCard>
              )
            })}
          </ChallengeGrid>
        )}

        {/* BADGE TERBARU HIDDEN
        <BadgesSection>
          <SectionHeader>
            <div>
              <SectionTitle>Badge Terbaru</SectionTitle>
              <SectionSub>Pencapaian terakhir yang kamu raih</SectionSub>
            </div>
            {myBadges.length > 0 && (
              <SeeAllBtn onClick={() => navigate(ChallengeRoute.listRoute)}>
                LIHAT SEMUA →
              </SeeAllBtn>
            )}
          </SectionHeader>

          {myBadges.length === 0 ? (
            <NoBadgeCta>
              <NoBadgeIcon>🏅</NoBadgeIcon>
              <NoBadgeText>
                <NoBadgeTitle>Belum ada badge yang diraih</NoBadgeTitle>
                <NoBadgeSub>Selesaikan challenge dan masuk peringkat teratas untuk mendapatkan badge eksklusif</NoBadgeSub>
              </NoBadgeText>
            </NoBadgeCta>
          ) : (() => {
            const latest = myBadges[0]
            return (
              <LatestBadgeCard>
                {latest.image?.url
                  ? <LatestBadgeImg src={latest.image.url} alt={latest.name} />
                  : <LatestBadgePlaceholder>🏅</LatestBadgePlaceholder>}
                <LatestBadgeInfo>
                  <LatestBadgeLabel>Badge Terbaru</LatestBadgeLabel>
                  <LatestBadgeName>{latest.name}</LatestBadgeName>
                  {latest.challengeTitle && (
                    <LatestBadgeMeta>{latest.challengeTitle}</LatestBadgeMeta>
                  )}
                </LatestBadgeInfo>
                {latest.finalRank && (
                  <LatestBadgeRank>Peringkat #{latest.finalRank}</LatestBadgeRank>
                )}
              </LatestBadgeCard>
            )
          })()}
        </BadgesSection>
        */}

        {/* ── How to play ── */}
        <SectionHeader>
          <div>
            <SectionTitle>Cara Bermain</SectionTitle>
            <SectionSub>Ikuti langkah berikut untuk mulai bersaing</SectionSub>
          </div>
        </SectionHeader>
        <HowToPlayGrid>
          <HowToPlayCard>
            <HowToPlayIcon>🎯</HowToPlayIcon>
            <HowToPlayStep>Langkah 1</HowToPlayStep>
            <HowToPlayTitle>Pilih Challenge</HowToPlayTitle>
            <HowToPlayDesc>Pilih challenge yang sedang aktif dan klik "Ikuti Sekarang" untuk memulai</HowToPlayDesc>
          </HowToPlayCard>
          <HowToPlayCard>
            <HowToPlayIcon>⚡</HowToPlayIcon>
            <HowToPlayStep>Langkah 2</HowToPlayStep>
            <HowToPlayTitle>Jawab Soal</HowToPlayTitle>
            <HowToPlayDesc>Jawab setiap soal dengan cepat dan tepat — makin cepat makin besar bonus poinmu</HowToPlayDesc>
          </HowToPlayCard>
          <HowToPlayCard>
            <HowToPlayIcon>🏆</HowToPlayIcon>
            <HowToPlayStep>Langkah 3</HowToPlayStep>
            <HowToPlayTitle>Raih Badge</HowToPlayTitle>
            <HowToPlayDesc>Masuk peringkat teratas dan dapatkan badge eksklusif yang bisa kamu bagikan</HowToPlayDesc>
          </HowToPlayCard>
        </HowToPlayGrid>

        {/* ── Upcoming section ── */}
        {upcoming && (
          <>
            <SectionHeader>
              <div>
                <SectionTitle>Akan Datang</SectionTitle>
                <SectionSub>Challenge yang akan segera dibuka</SectionSub>
              </div>
            </SectionHeader>
            <UpcomingBanner onClick={() => navigate(ChallengeRoute.detailRoute(upcoming.uniqueId))}>
              <UpcomingInfo>
                <UpcomingLabel>Segera Hadir</UpcomingLabel>
                <UpcomingTitle>{upcoming.title}</UpcomingTitle>
                {upcoming.description ? (
                  <UpcomingDesc>{upcoming.description}</UpcomingDesc>
                ) : (
                  <UpcomingDesc>
                    {upcoming.totalQuestions} soal · {SCORING_LABEL[upcoming.scoringType] || upcoming.scoringType?.toUpperCase()}
                  </UpcomingDesc>
                )}
                {upcoming.startAt && (
                  <UpcomingMeta>
                    Mulai {formatJakartaDateLong(upcoming.startAt)} · +{upcoming.basePointsPerCorrect} poin/benar
                  </UpcomingMeta>
                )}
                <UpcomingBtn>Lihat Detail →</UpcomingBtn>
              </UpcomingInfo>
              <UpcomingTrophy>🏆</UpcomingTrophy>
            </UpcomingBanner>
          </>
        )}

      </Container>
    </PageWrapper>
  )
}
