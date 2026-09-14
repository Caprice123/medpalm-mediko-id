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
  ConnectCopyright,
} from '../Home.styles'

const DEFAULT_CONNECT_CARDS = [
  {
    platform: 'Instagram',
    handle: '@medpal.id',
    url: 'https://instagram.com/medpal.id',
    type: 'instagram',
  },
  {
    platform: 'WhatsApp',
    handle: '+6281234567890',
    url: 'https://wa.me/6281234567890',
    type: 'whatsapp',
  },
]

const ICON_COLORS = {
  instagram: { bg: '#FCE4EC' },
  whatsapp: { bg: '#E3F7E0' },
  youtube: { bg: '#FDE2E2' },
  tiktok: { bg: '#E4E7FB' },
  facebook: { bg: '#DCEEFB' },
  twitter: { bg: '#DCEEFB' },
  linkedin: { bg: '#DCEEFB' },
}

const ICONS = {
  instagram: '📷',
  whatsapp: '💬',
  youtube: '▶️',
  tiktok: '🎵',
  facebook: '👍',
  twitter: '🐦',
  linkedin: '💼',
}

export default function FooterSection({ socialItems }) {
  const cards = socialItems || DEFAULT_CONNECT_CARDS

  return (
    <ConnectSection id="contact">
      <Parallax speed={2}>
        <SectionContent>
          <SectionHeader data-aos="fade-up">
            <SectionBadge>Sosial Media</SectionBadge>
            <SectionTitle>Tetap Terhubung dengan Kami</SectionTitle>
            <SectionSubtitle>
              Ikuti perkembangan terbaru dan dapatkan tips medis eksklusif
            </SectionSubtitle>
          </SectionHeader>

          <ConnectGrid>
            {cards.map((card, i) => {
              const iconStyle = ICON_COLORS[card.type] || ICON_COLORS.instagram
              return (
                <div key={i} data-aos="fade-up" data-aos-delay={i * 100}>
                  <ConnectCard href={card.url} target="_blank" rel="noopener noreferrer">
                    <ConnectCardIcon $bg={iconStyle.bg}>
                      {ICONS[card.type] || ICONS.instagram}
                    </ConnectCardIcon>
                    <ConnectCardPlatform>{card.platform}</ConnectCardPlatform>
                    <ConnectCardHandle>{card.handle}</ConnectCardHandle>
                  </ConnectCard>
                </div>
              )
            })}
          </ConnectGrid>

          <ConnectCopyright>
            © {new Date().getFullYear()} MedPal Indonesia. Belajar lebih ceria, jadi dokter lebih siap.
          </ConnectCopyright>
        </SectionContent>
      </Parallax>
    </ConnectSection>
  )
}
