import { SectionContent, PillCtaPrimary } from '@routes/Home/Home.styles'
import { mascots } from '@routes/Home/utils/mascots'
import { CTAWrapper, CTAPanel, CTABlob, CTAContent, CTATitle, CTASubtitle, CTAMascot } from './CTASection.styles'

export default function CTASection() {
  return (
    <CTAWrapper>
      <SectionContent>
        <CTAPanel data-aos="zoom-in">
          <CTABlob />
          <CTAContent>
            <CTATitle>Siap menjadi #topmedstud?</CTATitle>
            <CTASubtitle>
              Bergabung dengan ribuan mahasiswa kedokteran lainnya. Ayo belajar lebih efektif bersama MedPal!
            </CTASubtitle>
            <PillCtaPrimary to="/sign-in">Mulai Belajar Sekarang</PillCtaPrimary>
          </CTAContent>
          <CTAMascot src={mascots.walkingBag} alt="Maskot kapibara MedPal berjalan membawa tas dokter" />
        </CTAPanel>
      </SectionContent>
    </CTAWrapper>
  )
}
