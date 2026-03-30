import { useState } from 'react'
import { Parallax } from 'react-scroll-parallax'
import {
  FAQSection as StyledFAQSection,
  SectionContent,
  SectionHeader,
  SectionBadge,
  SectionTitle,
  SectionSubtitle,
  FAQList,
  FAQItem,
  FAQQuestion,
  FAQIcon,
  FAQAnswer,
  FAQAnswerInner,
} from '../Home.styles'

const FAQS = [
  {
    question: 'Apa itu kredit dan bagaimana cara menggunakannya?',
    answer:
      'Kredit adalah biaya untuk setiap penggunaan fitur yang berhubungan dengan AI, setiap paket langganan kami berikan credits, namun jika untuk pengguna yang menggunakan AI secara intensif dapat melakukan top up. Biaya credits untuk AI research sekitar 0,1 dan untuk OSCE AI sekitar 5 credits.',
  },
  {
    question: 'Apakah ada masa percobaan gratis? ',
    answer:
      'Ada, namun biasanya dalam bentuk event khusus dengan waktu terbatas, users bisa mendapatkan free credits untuk AI ataupun free trial untuk mengakse fitur premium tertentu.',
  },
  {
    question: 'Bisakah saya mengakses Medpal dari smartphone?',
    answer:
      'Ya bisa, anda bisa mengaksesnya lewat website, namun untuk versi Play Store ataupun App Store akan tersedia sekitar Agustus 2026.',
  },
  {
    question: 'Bagaimana cara membeli kredit?',
    answer:
      'Bisa dilakukan dengan mengklik “top up” di pojok sebelah kanan dashboard pengguna.',
  },
  {
    question: 'Apakah bahan belajar terus diperbarui?',
    answer:
      'Benar, akan terus kami perbarui sesuai dengan kurikulum pendidikan kedokteran Indonesia.',
  },
]

export default function FAQSection({ faqItems }) {
  const [openSet, setOpenSet] = useState(new Set())
  const items = faqItems || FAQS

  const toggle = (index) => {
    setOpenSet(prev => {
      const next = new Set(prev)
      next.has(index) ? next.delete(index) : next.add(index)
      return next
    })
  }

  return (
    <StyledFAQSection id="faq">
      <Parallax speed={2}>
        <SectionContent>
          <SectionHeader data-aos="fade-up">
            <SectionBadge>❓ FAQ</SectionBadge>
            <SectionTitle>Pertanyaan yang Sering Diajukan</SectionTitle>
            <SectionSubtitle>
              Temukan jawaban atas pertanyaan umum seputar MedPal
            </SectionSubtitle>
          </SectionHeader>

          <FAQList>
            {items.map((faq, index) => {
              const isOpen = openSet.has(index)
              return (
                <div key={index} data-aos="fade-up" data-aos-delay={index * 50}>
                  <FAQItem $open={isOpen}>
                    <FAQQuestion onClick={() => toggle(index)} aria-expanded={isOpen}>
                      {faq.question}
                      <FAQIcon $open={isOpen}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="6 9 12 15 18 9" />
                        </svg>
                      </FAQIcon>
                    </FAQQuestion>
                    <FAQAnswer $open={isOpen}>
                      <FAQAnswerInner>{faq.answer}</FAQAnswerInner>
                    </FAQAnswer>
                  </FAQItem>
                </div>
              )
            })}
          </FAQList>
        </SectionContent>
      </Parallax>
    </StyledFAQSection>
  )
}
