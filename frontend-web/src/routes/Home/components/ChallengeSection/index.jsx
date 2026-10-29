import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import challengeBg from '@/assets/landing/challenge-bg.png'
import challengeMascot from '@/assets/landing/challenge-capybara-trophy.png'
import arrowCircle from '@/assets/landing/arrow-circle-challenge.svg'
import { ContentWidth, SectionHeading, LandingEmptyState } from '../../Home.styles'
import {
  SectionWrapper,
  BackgroundArt,
  SectionTop,
  HeaderBlock,
  Description,
  ViewAllLink,
  ViewAllIcon,
  CardsArea,
  Mascot,
  ChallengeCard,
  StatusBadge,
  CardTitle,
  CardDescription,
  StatRow,
  StatValue,
  StatLabel,
} from './ChallengeSection.styles'
import { useHomeChallenges } from './hooks/useHomeChallenges'

// Same reasoning as the event list: read live from the challenge listing rather
// than retyped into a constant. No placeholder fallback either — nothing
// running shows an empty state rather than invented challenges.
function ChallengeSection() {
  const { items, isLoaded } = useHomeChallenges()
  const hasChallenges = items.length > 0

  return (
    <SectionWrapper>
      <BackgroundArt src={challengeBg} alt="" aria-hidden="true" />

      <ContentWidth>
        <SectionTop>
          <HeaderBlock>
            <SectionHeading>Challenge</SectionHeading>
            <Description>
              Kuis singkat berbatas waktu. Kerjakan, kumpulkan skor, dan bersaing di
              papan peringkat.
            </Description>
          </HeaderBlock>

          <ViewAllLink href="/challenge">
            Lihat semua challenge
            <ViewAllIcon src={arrowCircle} alt="" />
          </ViewAllLink>
        </SectionTop>

        <CardsArea>
          <Mascot src={challengeMascot} alt="" aria-hidden="true" />

          {hasChallenges ? (
            <Row className="g-4">
              {items.map((item, index) => (
                <Col key={item.uniqueId} xs={12} lg={6}>
                  <ChallengeCard data-aos="fade-up" data-aos-delay={index * 80}>
                    <StatusBadge>{item.status}</StatusBadge>
                    <CardTitle>{item.title}</CardTitle>
                    <CardDescription>{item.description}</CardDescription>

                    {/* Which figures appear depends on whether the challenge
                        is running yet — see useHomeChallenges. */}
                    <StatRow>
                      {item.stats.map((stat) => (
                        <div key={stat.label}>
                          <StatValue>{stat.value}</StatValue>
                          <StatLabel>{stat.label}</StatLabel>
                        </div>
                      ))}
                    </StatRow>
                  </ChallengeCard>
                </Col>
              ))}
            </Row>
          ) : (
            isLoaded && <LandingEmptyState
              icon="🏆"
              title="Belum ada challenge berjalan"
              description="Challenge berikutnya sedang disiapkan tim MedPal. Cek halaman challenge untuk yang sudah lewat."
              actionLabel="Lihat semua challenge"
              onAction={() => { window.location.href = '/challenge' }}
            />
          )}
        </CardsArea>
      </ContentWidth>
    </SectionWrapper>
  )
}

export default ChallengeSection
