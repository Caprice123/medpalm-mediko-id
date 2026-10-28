import { SectionContent, SectionHeader, SectionBadge, SectionTitle, SectionSubtitle } from '@routes/Home/Home.styles'
import { mascots } from '@routes/Home/utils/mascots'
import { useFaqAccordion } from './hooks/useFaqAccordion'
import {
  FAQWrapper,
  FAQLayout,
  FAQSide,
  SideBubble,
  SideMascot,
  FAQList,
  FAQItem,
  FAQQuestion,
  FAQIcon,
  FAQAnswer,
  FAQAnswerInner,
} from './FAQSection.styles'

const FAQS = [
  {
    question: 'Apa itu kredit dan bagaimana cara menggunakannya?',
    answer:
      'Kredit adalah biaya untuk setiap penggunaan fitur yang berhubungan dengan AI, setiap paket langganan kami berikan credits, namun jika untuk pengguna yang menggunakan AI secara intensif dapat melakukan top up. Biaya credits untuk AI research sekitar 0,1 dan untuk OSCE AI sekitar 5 credits.',
  },
  {
    question: 'Apakah ada masa percobaan gratis?',
    answer:
      'Ada, namun biasanya dalam bentuk event khusus dengan waktu terbatas, users bisa mendapatkan free credits untuk AI ataupun free trial untuk mengakses fitur premium tertentu.',
  },
  {
    question: 'Bisakah saya mengakses MedPal dari smartphone?',
    answer:
      'Ya bisa, anda bisa mengaksesnya lewat website, namun untuk versi Play Store ataupun App Store akan tersedia sekitar Agustus 2026.',
  },
  {
    question: 'Bagaimana cara membeli kredit?',
    answer:
      'Bisa dilakukan dengan mengklik "top up" di pojok sebelah kanan dashboard pengguna.',
  },
  {
    question: 'Apakah bahan belajar terus diperbarui?',
    answer:
      'Benar, akan terus kami perbarui sesuai dengan kurikulum pendidikan kedokteran Indonesia.',
  },
]

export default function FAQSection({ faqItems }) {
  const items = faqItems || FAQS
  const { isOpen, toggle } = useFaqAccordion()

  return (
    <FAQWrapper id="faq">
      <SectionContent>
        <SectionHeader data-aos="fade-up">
          <SectionBadge>FAQ</SectionBadge>
          <SectionTitle>Pertanyaan yang Sering Diajukan</SectionTitle>
          <SectionSubtitle>Temukan jawaban atas pertanyaan umum seputar MedPal</SectionSubtitle>
        </SectionHeader>

        <FAQLayout>
          <FAQSide data-aos="fade-right">
            <SideBubble>Masih bingung?<br />Cek di sini dulu!</SideBubble>
            <SideMascot src={mascots.thinkingChin} alt="Maskot kapibara MedPal sedang berpikir" />
          </FAQSide>

          <FAQList>
            {items.map((faq, index) => {
              const open = isOpen(index)
              return (
                <div key={faq.question} data-aos="fade-up" data-aos-delay={index * 50}>
                  <FAQItem $open={open}>
                    <FAQQuestion onClick={() => toggle(index)} aria-expanded={open}>
                      {faq.question}
                      <FAQIcon $open={open}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="12" y1="5" x2="12" y2="19" />
                          <line x1="5" y1="12" x2="19" y2="12" />
                        </svg>
                      </FAQIcon>
                    </FAQQuestion>
                    <FAQAnswer $open={open}>
                      <FAQAnswerInner>{faq.answer}</FAQAnswerInner>
                    </FAQAnswer>
                  </FAQItem>
                </div>
              )
            })}
          </FAQList>
        </FAQLayout>
      </SectionContent>
    </FAQWrapper>
  )
}
