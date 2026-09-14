import { Parallax } from 'react-scroll-parallax'
import {
  HeroSection as StyledHeroSection,
  HeroContent,
  HeroText,
  Badge,
  BadgeIcon,
  HeroTitle,
  HeroTitleHighlight,
  HeroSubtitle,
  HeroButtons,
  HeroCtaPrimary,
  HeroCtaSecondary,
  HeroStats,
  HeroStatItem,
  HeroStatValue,
  HeroStatLabel,
  HeroVisual,
  LeaderboardCard,
  LeaderboardHeader,
  LeaderboardTitle,
  WeeklyBadge,
  LeaderboardCrown,
  LeaderboardList,
  LeaderboardRow,
  RowAvatar,
  RowInfo,
  RowName,
  RowMeta,
  RowScore,
  StreakBadge,
  StreakIcon,
  StreakValue,
  StreakLabel,
} from '../Home.styles'

const DEFAULT_BADGE = 'Platform Medis Berbasis AI'
const DEFAULT_SUBTITLE = '1.895+ Model Anatomi 3D Interaktif, AI Chat Khusus Kedokteran, simulasi OSCE dengan pasien virtual, 25.000+ quiz & flashcard, dan 400+ artikel kedokteran — semua dalam satu platform.'

const HERO_STATS = [
  { value: '1.895+', label: 'Model Anatomi 3D' },
  { value: '25.000+', label: 'Quiz & Flashcard' },
  { value: '400+', label: 'Artikel Kedokteran' },
]

const LEADERBOARD_ROWS = [
  { name: 'Dinda', meta: 'Semester 4', score: '2.569 QP', color: '#FCD9B8' },
  { name: 'Kamu', meta: 'Semester 4', score: '1.980 QP', color: '#8DC63F', highlight: true },
]

export default function HeroSection({ scrollToSection, badge, title, subtitle }) {
  const activeBadge = badge || DEFAULT_BADGE
  const activeSubtitle = subtitle || DEFAULT_SUBTITLE
  const customTitleLines = title ? title.split('\n') : null

  return (
    <StyledHeroSection>
      <Parallax speed={-5}>
        <HeroContent>
          <HeroText>
            <Badge data-aos="fade-up">
              <BadgeIcon>🩺</BadgeIcon>
              {activeBadge}
            </Badge>

            <HeroTitle data-aos="fade-up" data-aos-delay="100">
              {customTitleLines ? (
                customTitleLines.map((line, i) => (
                  <span key={i}>
                    {line}
                    {i < customTitleLines.length - 1 && <br />}
                  </span>
                ))
              ) : (
                <>
                  Belajar makin{' '}
                  <HeroTitleHighlight $color="green">seru</HeroTitleHighlight>,
                  jadi dokter makin{' '}
                  <HeroTitleHighlight $color="blue">jago</HeroTitleHighlight>.
                </>
              )}
            </HeroTitle>

            <HeroSubtitle data-aos="fade-up" data-aos-delay="200">
              {activeSubtitle}
            </HeroSubtitle>

            <HeroButtons data-aos="fade-up" data-aos-delay="300">
              <HeroCtaPrimary to="/sign-in">
                Mulai Sekarang 🚀
              </HeroCtaPrimary>
              <HeroCtaSecondary onClick={() => scrollToSection('how-it-works')}>
                Lihat Demo
              </HeroCtaSecondary>
            </HeroButtons>

            <HeroStats data-aos="fade-up" data-aos-delay="400">
              {HERO_STATS.map((stat, i) => (
                <HeroStatItem key={i}>
                  <HeroStatValue>{stat.value}</HeroStatValue>
                  <HeroStatLabel>{stat.label}</HeroStatLabel>
                </HeroStatItem>
              ))}
            </HeroStats>
          </HeroText>

          <HeroVisual data-aos="fade-left" data-aos-delay="200">
            <LeaderboardCard>
              <StreakBadge>
                <StreakIcon>🔥</StreakIcon>
                <div>
                  <StreakValue>12 hari</StreakValue>
                  <StreakLabel>Streak belajar</StreakLabel>
                </div>
              </StreakBadge>

              <LeaderboardHeader>
                <LeaderboardTitle>Papan Peringkat</LeaderboardTitle>
                <WeeklyBadge>Mingguan</WeeklyBadge>
              </LeaderboardHeader>

              <LeaderboardCrown>🏆</LeaderboardCrown>

              <LeaderboardList>
                {LEADERBOARD_ROWS.map((row, i) => (
                  <LeaderboardRow key={i} $highlight={row.highlight}>
                    <RowAvatar $color={row.color} />
                    <RowInfo>
                      <RowName>{row.name}</RowName>
                      <RowMeta>{row.meta}</RowMeta>
                    </RowInfo>
                    <RowScore>{row.score}</RowScore>
                  </LeaderboardRow>
                ))}
              </LeaderboardList>
            </LeaderboardCard>
          </HeroVisual>
        </HeroContent>
      </Parallax>
    </StyledHeroSection>
  )
}
