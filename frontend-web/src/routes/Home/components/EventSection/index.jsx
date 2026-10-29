import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import eventBg from '@/assets/landing/event-bg-calendar.png'
import eventMascot from '@/assets/landing/event-capybara-megaphone.png'
import arrowCircle from '@/assets/landing/arrow-circle.svg'
import arrowRight from '@/assets/landing/arrow-right.svg'
import { ContentWidth, LandingEmptyState } from '../../Home.styles'
import {
  SectionWrapper,
  BackgroundArt,
  SectionTop,
  HeaderBlock,
  GradientHeading,
  Description,
  ViewAllLink,
  ViewAllIcon,
  CardsArea,
  Mascot,
  EventCard,
  BadgeRow,
  FreeBadge,
  DateBadge,
  Thumbnail,
  CardTitle,
  CardDescription,
  CardLink,
  CardLinkArrow,
} from './EventSection.styles'
import { useHomeEvents } from './hooks/useHomeEvents'

// Real events, read live from the event listing — the ones this section
// advertises are the same ones /events shows, so there is nothing for an admin
// to retype in Pengaturan Global.
//
// There is deliberately no placeholder fallback: Figma's "Nama Event" cards are
// a design mockup, and shipping them would show visitors fake events with a
// button that leads nowhere. No open events renders an honest empty state.
function EventSection() {
  const { items, isLoaded } = useHomeEvents()
  const hasEvents = items.length > 0

  return (
    <SectionWrapper>
      <BackgroundArt src={eventBg} alt="" aria-hidden="true" />

      <ContentWidth>
        <SectionTop>
          <HeaderBlock>
            <GradientHeading>Free Event</GradientHeading>
            <Description>
              Periode mencoba fitur MedPal tanpa biaya. Daftar selama pendaftarannya
              masih dibuka.
            </Description>
          </HeaderBlock>

          <ViewAllLink href="/events">
            Lihat semua event
            <ViewAllIcon src={arrowCircle} alt="" />
          </ViewAllLink>
        </SectionTop>

        <CardsArea>
          <Mascot src={eventMascot} alt="" aria-hidden="true" />

          {hasEvents ? (
            <Row className="g-4">
              {items.map((item, index) => (
                <Col key={item.code} xs={12} md={6} xl={4}>
                  <EventCard data-aos="fade-up" data-aos-delay={index * 80}>
                    <BadgeRow>
                      <FreeBadge>{item.status}</FreeBadge>
                      <DateBadge>{item.date}</DateBadge>
                    </BadgeRow>
                    <Thumbnail aria-hidden="true" />

                    <CardTitle>{item.title}</CardTitle>
                    <CardDescription>{item.description}</CardDescription>

                    <CardLink href="/events">
                      Lihat Event
                      <CardLinkArrow src={arrowRight} alt="" />
                    </CardLink>
                  </EventCard>
                </Col>
              ))}
            </Row>
          ) : (
            isLoaded && <LandingEmptyState
              icon="🗓️"
              title="Belum ada event yang dibuka"
              description="Periode berikutnya sedang disiapkan tim MedPal. Cek halaman event untuk yang sudah lewat."
              actionLabel="Lihat semua event"
              onAction={() => { window.location.href = '/events' }}
            />
          )}
        </CardsArea>
      </ContentWidth>
    </SectionWrapper>
  )
}

export default EventSection
