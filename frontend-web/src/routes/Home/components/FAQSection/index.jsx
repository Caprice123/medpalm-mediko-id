import faqMascot from '@/assets/landing/faq-capybara-thinking.png'
import toggleHorizontal from '@/assets/landing/faq-toggle-horizontal.svg'
import toggleVertical from '@/assets/landing/faq-toggle-vertical.svg'
import { ContentWidth } from '../../Home.styles'
import { useFaqAccordion } from './hooks/useFaqAccordion'
import {
  SectionWrapper,
  Layout,
  Badge,
  Heading,
  Description,
  ContactLink,
  AccordionList,
  AccordionItem,
  AccordionTrigger,
  ToggleChip,
  ToggleBar,
  ToggleBarVertical,
  AccordionAnswer,
  Mascot,
} from './FAQSection.styles'

// The questions Figma shows. Answers are not in the design, so these are the
// defaults an admin can replace through the `home_faq_items` constant.
const DEFAULT_FAQS = [
  {
    question: 'Apa saja yang bisa dipelajari di MedPal?',
    answer:
      'Materi kedokteran yang tersusun per sistem dan blok, atlas anatomi 3D interaktif, quiz, flashcard, serta berbagai fitur pendukung belajar lainnya.',
  },
  {
    question: 'Apakah MedPal bisa digunakan lewat smartphone?',
    answer:
      'Bisa. MedPal dapat diakses lewat browser di ponsel, tablet, maupun komputer tanpa perlu instalasi tambahan.',
  },
  {
    question: 'Apakah progres belajar tersimpan?',
    answer:
      'Ya. Progres belajar, riwayat quiz, dan status flashcard tersimpan otomatis di akunmu dan bisa dilanjutkan kapan saja.',
  },
  {
    question: 'Bagaimana cara memilih paket MedPal?',
    answer:
      'Pilih paket sesuai kebutuhan belajarmu. Kamu bisa mulai dari paket gratis, lalu meningkatkan kapan pun dibutuhkan.',
  },
  {
    question: 'Apakah materi MedPal terus diperbarui?',
    answer:
      'Materi dan soal diperbarui secara berkala oleh tim kurikulum MedPal agar tetap relevan dengan kebutuhan perkuliahan.',
  },
]

function FAQSection({ faqItems }) {
  const { isOpen, toggle } = useFaqAccordion()
  const items = faqItems || DEFAULT_FAQS

  return (
    <SectionWrapper id="faq">
      <Mascot src={faqMascot} alt="" aria-hidden="true" />

      <ContentWidth>
        <Layout>
          <div>
            <Badge>FAQ</Badge>
            <Heading>
              Pertanyaan yang
              <br />
              sering muncul.
            </Heading>
            <Description>
              Masih ada yang ingin ditanyakan? Temukan jawaban singkat tentang
              penggunaan MedPal di sini.
            </Description>
            <ContactLink href="mailto:medpal.id@gmail.com">Hubungi MedPal →</ContactLink>
          </div>

          <AccordionList>
            {items.map((item, index) => (
              <AccordionItem key={item.question}>
                <AccordionTrigger
                  onClick={() => toggle(index)}
                  aria-expanded={isOpen(index)}
                >
                  {item.question}
                  <ToggleChip aria-hidden="true">
                    <ToggleBar src={toggleHorizontal} alt="" />
                    <ToggleBarVertical src={toggleVertical} alt="" $open={isOpen(index)} />
                  </ToggleChip>
                </AccordionTrigger>
                {isOpen(index) && <AccordionAnswer>{item.answer}</AccordionAnswer>}
              </AccordionItem>
            ))}
          </AccordionList>
        </Layout>
      </ContentWidth>
    </SectionWrapper>
  )
}

export default FAQSection
