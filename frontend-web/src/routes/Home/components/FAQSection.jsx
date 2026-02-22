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
    question: 'Apa itu MedPal?',
    answer:
      'MedPal adalah platform pembelajaran digital yang dirancang khusus untuk mahasiswa kedokteran Indonesia. Kami menyediakan berbagai fitur seperti Bank Soal, Flashcard, Summary Notes, Chat Assistant bertenaga AI, OSCE Practice, dan banyak lagi — semuanya dalam satu platform terintegrasi.',
  },
  {
    question: 'Bagaimana sistem kredit bekerja?',
    answer:
      'Kredit adalah mata uang digital di MedPal yang digunakan untuk mengakses fitur-fitur tertentu. Setiap paket berisi sejumlah kredit yang dapat digunakan secara fleksibel sesuai kebutuhan belajar Anda. Kredit tidak memiliki masa kadaluarsa selama akun Anda aktif.',
  },
  {
    question: 'Apakah ada masa percobaan gratis?',
    answer:
      'Beberapa fitur dasar tersedia secara gratis tanpa perlu membeli kredit. Untuk fitur premium seperti Chat Assistant AI, OSCE Practice, dan generasi soal otomatis, Anda membutuhkan kredit. Anda bisa mulai dengan paket kredit terkecil untuk mencoba seluruh fitur premium.',
  },
  {
    question: 'Materi apa saja yang tersedia?',
    answer:
      'MedPal mencakup seluruh spektrum materi kedokteran meliputi ilmu dasar (Anatomi, Fisiologi, Biokimia, dll.), ilmu klinik (Penyakit Dalam, Bedah, Obstetri-Ginekologi, Anak, Psikiatri, dll.), hingga materi persiapan UKMPPD. Konten terus diperbarui sesuai kurikulum terbaru.',
  },
  {
    question: 'Bisakah saya mengakses MedPal dari smartphone?',
    answer:
      'Ya! MedPal dirancang responsif dan dapat diakses dari perangkat apa pun — laptop, tablet, maupun smartphone. Tidak perlu menginstal aplikasi; cukup buka browser favorit Anda dan mulai belajar kapan saja, di mana saja.',
  },
  {
    question: 'Bagaimana cara membeli kredit?',
    answer:
      'Pilih paket kredit yang sesuai di halaman Harga, lalu lanjutkan ke pembayaran. Kami mendukung berbagai metode pembayaran termasuk transfer bank, dompet digital (GoPay, OVO, Dana), dan kartu kredit/debit. Kredit akan langsung masuk ke akun Anda setelah pembayaran dikonfirmasi.',
  },
  {
    question: 'Apakah soal-soal di Bank Soal terus diperbarui?',
    answer:
      'Ya, tim kami secara rutin menambah dan memperbarui soal-soal di Bank Soal agar relevan dengan pola soal UKMPPD terkini. Setiap soal disertai pembahasan lengkap yang ditulis oleh dokter dan tenaga pengajar berpengalaman.',
  },
]

export default function FAQSection() {
  const [openSet, setOpenSet] = useState(new Set())

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
            {FAQS.map((faq, index) => {
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
