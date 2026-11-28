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
  ViewAllGroup,
  ViewAllLink,
  ViewAllIcon,
  CardsArea,
  Mascot,
  EventCard,
  BadgeRow,
  KindBadge,
  FreeBadge,
  DateBadge,
  Thumbnail,
  CardTitle,
  CardDescription,
  CardLink,
  CardLinkArrow,
} from './EventSection.styles'
import { useHomeEvents } from './hooks/useHomeEvents'
import { EventRoute } from '../../../Event/routes'
import { WebinarRoute } from '../../../Webinar/routes'

// Real events and webinars, read live from GET /api/v2/home/landing-events —
// the ones this section advertises are the same ones /events and /webinar show,
// so there is nothing for an admin to retype in Pengaturan Global. Both kinds
// share one row sorted by when registration opens; the first badge says which
// kind each card is and its button links to that kind's own page.
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
            <GradientHeading>Free Event &amp; Webinar</GradientHeading>
            <Description>
              Periode mencoba fitur MedPal tanpa biaya dan webinar bersama praktisi.
              Daftar selama pendaftarannya masih dibuka.
            </Description>
          </HeaderBlock>

          <ViewAllGroup>
            Lihat semua
            <ViewAllLink href={EventRoute.moduleRoute}>Event</ViewAllLink>
            <span aria-hidden="true">·</span>
            <ViewAllLink href={WebinarRoute.moduleRoute}>Webinar</ViewAllLink>
            <ViewAllIcon src={arrowCircle} alt="" />
          </ViewAllGroup>
        </SectionTop>

        <CardsArea>
          <Mascot src={eventMascot} alt="" aria-hidden="true" />

          {hasEvents ? (
            <Row className="g-4">
              {items.map((item, index) => (
                <Col key={item.code} xs={12} md={6} xl={4}>
                  <EventCard data-aos="fade-up" data-aos-delay={index * 80}>
                    <BadgeRow>
                      <KindBadge $kind={item.kind}>{item.kindLabel}</KindBadge>
                      <FreeBadge>{item.status}</FreeBadge>
                      <DateBadge>{item.date}</DateBadge>
                    </BadgeRow>
                    <Thumbnail aria-hidden="true" />

                    <CardTitle>{item.title}</CardTitle>
                    <CardDescription>{item.description}</CardDescription>

                    <CardLink href={item.href}>
                      {item.kind === 'webinar' ? 'Lihat Webinar' : 'Lihat Event'}
                      <CardLinkArrow src={arrowRight} alt="" />
                    </CardLink>
                  </EventCard>
                </Col>
              ))}
            </Row>
          ) : (
            isLoaded && <LandingEmptyState
              icon="🗓️"
              title="Belum ada event atau webinar yang dibuka"
              description="Periode berikutnya sedang disiapkan tim MedPal. Cek halaman event untuk yang sudah lewat."
              actionLabel="Lihat semua event"
              onAction={() => { window.location.href = EventRoute.moduleRoute }}
            />
          )}
        </CardsArea>
      </ContentWidth>
    </SectionWrapper>
  )
}

export default EventSection
