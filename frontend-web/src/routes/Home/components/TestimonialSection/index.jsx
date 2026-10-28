import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import testimonialMascot from '@/assets/landing/testimonial-capybara-laptop.png'
import quoteMark from '@/assets/landing/quote-mark.svg'
import quoteMarkAlt from '@/assets/landing/quote-mark-alt.svg'
import { ContentWidth, SectionHeading, LandingEmptyState } from '../../Home.styles'
import {
  SectionWrapper,
  HeaderBlock,
  Description,
  Mascot,
  TestimonialCard,
  QuoteRow,
  QuoteMark,
  QuoteText,
  Divider,
  Author,
  Avatar,
  AuthorName,
  AuthorDetail,
} from './TestimonialSection.styles'

// No placeholder fallback: invented testimonials are fabricated social proof.
// Admins fill these in through Pengaturan Global > Testimoni.
function TestimonialSection({ testimonialItems }) {
  const items = testimonialItems
  const hasTestimonials = Array.isArray(items) && items.length > 0

  return (
    <SectionWrapper>
      <Mascot src={testimonialMascot} alt="" aria-hidden="true" />

      <ContentWidth>
        <HeaderBlock>
          <SectionHeading>Cerita dari mahasiswa yang belajar bersama MedPal</SectionHeading>
          <Description>
            Pengalaman belajar setiap orang berbeda. Berikut beberapa hal yang mereka
            rasakan ketika menggunakan MedPal.
          </Description>
        </HeaderBlock>

        {hasTestimonials ? (
          <Row className="g-4 mt-1">
          {items.map((item, index) => (
            <Col key={`${item.name}-${index}`} xs={12} md={6} lg={4}>
              <TestimonialCard data-aos="fade-up" data-aos-delay={index * 80}>
                <QuoteRow>
                  {/* Figma uses a slightly different glyph on the first card. */}
                  <QuoteMark src={index === 0 ? quoteMark : quoteMarkAlt} alt="" />
                  <QuoteText>{item.quote}</QuoteText>
                </QuoteRow>

                <Divider />

                <Author>
                  <Avatar aria-hidden="true" />
                  <div>
                    <AuthorName>{item.name}</AuthorName>
                    <AuthorDetail>{item.detail}</AuthorDetail>
                  </div>
                </Author>
              </TestimonialCard>
            </Col>
          ))}
          </Row>
        ) : (
          <LandingEmptyState
            icon="💬"
            title="Testimoni segera hadir"
            description="Cerita dari mahasiswa yang belajar bersama MedPal akan ditampilkan di sini."
          />
        )}
      </ContentWidth>
    </SectionWrapper>
  )
}

export default TestimonialSection
