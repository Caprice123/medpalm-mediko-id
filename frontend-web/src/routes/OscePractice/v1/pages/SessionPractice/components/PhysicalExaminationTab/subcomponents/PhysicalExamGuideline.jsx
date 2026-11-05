import { useState } from 'react'
import { GuideSection, GuideTitle, GuideText } from '../../../SessionPractice.styles'

const defaultGuideline = `🩺 Pemeriksaan Fisik

Di tab ini, Anda dapat melakukan pemeriksaan fisik pada pasien simulasi. Sistem akan memberikan temuan objektif berdasarkan kondisi pasien.

Contoh pemeriksaan yang dapat dilakukan:
• 💓 Tanda Vital: "periksa tanda vital" atau "ukur tekanan darah"
• 👂 Kepala & Leher: "inspeksi kepala dan leher" atau "palpasi kelenjar limfe"
• 🫁 Thorax: "auskultasi paru" atau "perkusi thorax"
• 🫃 Abdomen: "palpasi abdomen" atau "auskultasi bising usus"
• 🦵 Ekstremitas: "inspeksi ekstremitas" atau "tes kekuatan otot"
• 🧠 Neurologis: "tes refleks patella" atau "pemeriksaan nervus kranialis"

💡 Tip: Sistem hanya memberikan temuan objektif. Untuk bertanya atau diskusi diagnosis, gunakan tab "Percakapan".`

function PhysicalExamGuideline({ guideline }) {
  const [isVisible, setIsVisible] = useState(true)

  const guidelineText = guideline || defaultGuideline

  return (
    <GuideSection>
      <GuideTitle onClick={() => setIsVisible(!isVisible)}>
        <span>{isVisible ? '▼' : '▶'}</span>
        Panduan Pemeriksaan Fisik
      </GuideTitle>
      {isVisible && (
        <GuideText>
          {guidelineText}
        </GuideText>
      )}
    </GuideSection>
  )
}

export default PhysicalExamGuideline
