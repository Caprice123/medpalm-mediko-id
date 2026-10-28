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

// The public events API sits behind authentication, so the landing page reads
// this list from the `home_event_items` constant instead.
//
// There is deliberately no placeholder fallback: Figma's "Nama Event" cards are
// a design mockup, and shipping them would show visitors fake events with a
// button that leads nowhere. An empty list renders an honest empty state.
function EventSection({ eventItems }) {
  const items = eventItems
  const hasEvents = Array.isArray(items) && items.length > 0

  return (
    <SectionWrapper>
      <BackgroundArt src={eventBg} alt="" aria-hidden="true" />

      <ContentWidth>
        <SectionTop>
          <HeaderBlock>
            <GradientHeading>Free Event</GradientHeading>
            <Description>
              Sesi rutin bersama pemateri MedPal untuk membahas topik yang sedang banyak
              ditanyakan.
            </Description>
          </HeaderBlock>

          <ViewAllLink href="/webinar">
            Lihat semua event
            <ViewAllIcon src={arrowCircle} alt="" />
          </ViewAllLink>
        </SectionTop>

        <CardsArea>
          <Mascot src={eventMascot} alt="" aria-hidden="true" />

          {hasEvents ? (
            <Row className="g-4">
              {items.map((item, index) => (
                <Col key={`${item.title}-${index}`} xs={12} md={6} xl={4}>
                  <EventCard data-aos="fade-up" data-aos-delay={index * 80}>
                    <BadgeRow>
                      <FreeBadge>{item.status}</FreeBadge>
                      <DateBadge>{item.date}</DateBadge>
                    </BadgeRow>
                    <Thumbnail aria-hidden="true" />

                    <CardTitle>{item.title}</CardTitle>
                    <CardDescription>{item.description}</CardDescription>

                    <CardLink href={item.url || '/webinar'}>
                      Lihat Event
                      <CardLinkArrow src={arrowRight} alt="" />
                    </CardLink>
                  </EventCard>
                </Col>
              ))}
            </Row>
          ) : (
            <LandingEmptyState
              icon="🗓️"
              title="Belum ada event terjadwal"
              description="Sesi berikutnya sedang disiapkan tim MedPal. Cek halaman event untuk rekaman sesi sebelumnya."
              actionLabel="Lihat semua event"
              onAction={() => { window.location.href = '/webinar' }}
            />
          )}
        </CardsArea>
      </ContentWidth>
    </SectionWrapper>
  )
}

export default EventSection
