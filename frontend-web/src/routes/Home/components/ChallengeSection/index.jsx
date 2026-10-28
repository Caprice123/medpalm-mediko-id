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

// Same reasoning as the event list: the challenges API requires a login, so the
// landing page reads `home_challenge_items`. No placeholder fallback either —
// an empty list shows an empty state rather than invented challenges.
function ChallengeSection({ challengeItems }) {
  const items = challengeItems
  const hasChallenges = Array.isArray(items) && items.length > 0

  return (
    <SectionWrapper>
      <BackgroundArt src={challengeBg} alt="" aria-hidden="true" />

      <ContentWidth>
        <SectionTop>
          <HeaderBlock>
            <SectionHeading>Challenge</SectionHeading>
            <Description>
              Sesi rutin bersama pemateri MedPal untuk membahas topik yang sedang banyak
              ditanyakan.
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
                <Col key={`${item.title}-${index}`} xs={12} lg={6}>
                  <ChallengeCard data-aos="fade-up" data-aos-delay={index * 80}>
                    <StatusBadge>{item.status}</StatusBadge>
                    <CardTitle>{item.title}</CardTitle>
                    <CardDescription>{item.description}</CardDescription>

                    <StatRow>
                      <div>
                        <StatValue>{item.duration}</StatValue>
                        <StatLabel>Durasi</StatLabel>
                      </div>
                      <div>
                        <StatValue>{item.participants}</StatValue>
                        <StatLabel>Peserta</StatLabel>
                      </div>
                      <div>
                        <StatValue>{item.cost}</StatValue>
                        <StatLabel>Biaya</StatLabel>
                      </div>
                    </StatRow>
                  </ChallengeCard>
                </Col>
              ))}
            </Row>
          ) : (
            <LandingEmptyState
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
