import { Parallax } from 'react-scroll-parallax'
import {
  ConnectSection,
  SectionContent,
  SectionHeader,
  SectionBadge,
  SectionTitle,
  SectionSubtitle,
  ConnectGrid,
  ConnectCard,
  ConnectCardIcon,
  ConnectCardPlatform,
  ConnectCardHandle,
  ConnectCardDesc,
  ConnectCardBtn,
} from '../Home.styles'

const CONNECT_CARDS = [
  {
    platform: 'Instagram',
    handle: '@medpal.id',
    desc: 'Tips & Edukasi Medis',
    href: 'https://instagram.com/medpal.id',
    btnLabel: 'Ikuti',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    platform: 'Instagram',
    handle: '@medpal.community',
    desc: 'Komunitas Medis',
    href: 'https://instagram.com/medpal.community',
    btnLabel: 'Ikuti',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    platform: 'WhatsApp',
    handle: '+6281234567890',
    desc: 'Dukungan Langsung',
    href: 'https://wa.me/6281234567890',
    btnLabel: 'Hubungi',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
        <path d="M12 0C5.373 0 0 5.373 0 12c0 2.124.558 4.17 1.535 5.943L0 24l6.274-1.641A11.94 11.94 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.8 9.8 0 0 1-5.022-1.381l-.36-.214-3.733.977.998-3.64-.235-.374A9.77 9.77 0 0 1 2.182 12C2.182 6.57 6.57 2.182 12 2.182S21.818 6.57 21.818 12 17.43 21.818 12 21.818z" />
      </svg>
    ),
  },
]

export default function FooterSection() {
  return (
    <ConnectSection id="contact">
      <Parallax speed={2}>
        <SectionContent>
          <SectionHeader data-aos="fade-up">
            <SectionBadge>📲 Sosial Media</SectionBadge>
            <SectionTitle>Tetap Terhubung dengan Kami</SectionTitle>
            <SectionSubtitle>
              Ikuti perkembangan terbaru dan dapatkan tips medis eksklusif
            </SectionSubtitle>
          </SectionHeader>

          <ConnectGrid>
            {CONNECT_CARDS.map((card, i) => (
              <div key={card.handle} data-aos="fade-up" data-aos-delay={i * 100}>
                <ConnectCard href={card.href} target="_blank" rel="noopener noreferrer">
                  <ConnectCardIcon>{card.icon}</ConnectCardIcon>
                  <ConnectCardPlatform>{card.platform}</ConnectCardPlatform>
                  <ConnectCardHandle>{card.handle}</ConnectCardHandle>
                  <ConnectCardDesc>{card.desc}</ConnectCardDesc>
                  <ConnectCardBtn>{card.btnLabel} →</ConnectCardBtn>
                </ConnectCard>
              </div>
            ))}
          </ConnectGrid>
        </SectionContent>
      </Parallax>
    </ConnectSection>
  )
}
