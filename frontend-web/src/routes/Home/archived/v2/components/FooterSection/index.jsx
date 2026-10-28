import { SectionContent, SectionHeader, SectionBadge, SectionTitle, SectionSubtitle } from '@routes/Home/Home.styles'
import { mascots } from '@routes/Home/utils/mascots'
import {
  SocialWrapper,
  SocialMascot,
  SocialGrid,
  SocialCard,
  SocialIcon,
  SocialPlatform,
  SocialHandle,
  Copyright,
} from './FooterSection.styles'

const DEFAULT_SOCIAL_CARDS = [
  { platform: 'Instagram', handle: '@medpal.id', url: 'https://instagram.com/medpal.id', type: 'instagram' },
  { platform: 'WhatsApp', handle: '+6285746469645', url: 'https://wa.me/6285746469645', type: 'whatsapp' },
]

const ICON_STYLES = {
  instagram: { bg: '#fde6ec', icon: '📷' },
  whatsapp: { bg: '#e4f6de', icon: '💬' },
  youtube: { bg: '#fde2e2', icon: '▶️' },
  tiktok: { bg: '#e4e7fb', icon: '🎵' },
  facebook: { bg: '#dceefb', icon: '👍' },
  twitter: { bg: '#dceefb', icon: '🐦' },
  linkedin: { bg: '#dceefb', icon: '💼' },
}

export default function FooterSection({ socialItems }) {
  const cards = socialItems || DEFAULT_SOCIAL_CARDS

  return (
    <SocialWrapper id="contact">
      <SectionContent>
        <SocialMascot
          data-aos="fade-up"
          src={mascots.waving}
          alt="Maskot kapibara MedPal melambaikan tangan"
        />

        <SectionHeader data-aos="fade-up">
          <SectionBadge>Sosial Media</SectionBadge>
          <SectionTitle>Tetap Terhubung dengan Kami</SectionTitle>
          <SectionSubtitle>Ikuti perkembangan terbaru dan dapatkan tips medis eksklusif</SectionSubtitle>
        </SectionHeader>

        <SocialGrid>
          {cards.map((card, i) => {
            const style = ICON_STYLES[card.type] || ICON_STYLES.instagram
            return (
              <SocialCard
                key={card.platform + i}
                href={card.url}
                target="_blank"
                rel="noopener noreferrer"
                data-aos="fade-up"
                data-aos-delay={i * 100}
              >
                <SocialIcon $bg={style.bg}>{style.icon}</SocialIcon>
                <SocialPlatform>{card.platform}</SocialPlatform>
                <SocialHandle>{card.handle}</SocialHandle>
              </SocialCard>
            )
          })}
        </SocialGrid>

        <Copyright>
          © {new Date().getFullYear()} MedPal Indonesia. Belajar lebih ceria, jadi dokter lebih siap.
        </Copyright>
      </SectionContent>
    </SocialWrapper>
  )
}
