import { ContentWidth } from '../../Home.styles'
import {
  FooterWrapper,
  FooterGrid,
  Brand,
  Tagline,
  SocialGrid,
  SocialCard,
  SocialIcon,
  SocialPlatform,
  SocialHandle,
  Copyright,
} from './FooterSection.styles'

// Keyed by the `type` field of each `home_social_items` entry, matching the
// options the admin Global Settings page offers.
const ICON_STYLES = {
  instagram: { background: '#fde7f0', icon: '📷' },
  whatsapp: { background: '#e3f6e7', icon: '💬' },
  youtube: { background: '#fde8e8', icon: '▶️' },
  tiktok: { background: '#eceef2', icon: '🎵' },
  facebook: { background: '#e6effd', icon: '👥' },
  twitter: { background: '#e8f4fd', icon: '🐦' },
  linkedin: { background: '#e4eefb', icon: '💼' },
}

const DEFAULT_SOCIAL_ITEMS = [
  {
    platform: 'Instagram',
    type: 'instagram',
    handle: '@medpal.id',
    url: 'https://instagram.com/medpal.id',
  },
  {
    platform: 'WhatsApp',
    type: 'whatsapp',
    handle: 'Hubungi kami',
    url: 'https://wa.me/',
  },
]

function FooterSection({ socialItems }) {
  const items = socialItems || DEFAULT_SOCIAL_ITEMS

  return (
    <FooterWrapper id="contact">
      <ContentWidth>
        <FooterGrid>
          <div>
            <Brand>
              <span>Med</span>
              <span>Pal</span>
            </Brand>
            <Tagline>
              Platform belajar kedokteran untuk mahasiswa Indonesia — materi, anatomi 3D,
              quiz, dan flashcard dalam satu tempat.
            </Tagline>
          </div>

          <SocialGrid>
            {items.map((item) => {
              const style = ICON_STYLES[item.type] || ICON_STYLES.instagram
              return (
                <SocialCard
                  key={item.platform}
                  href={item.url}
                  target="_blank"
                  rel="noreferrer"
                >
                  <SocialIcon $background={style.background} aria-hidden="true">
                    {style.icon}
                  </SocialIcon>
                  <div>
                    <SocialPlatform>{item.platform}</SocialPlatform>
                    <SocialHandle>{item.desc || item.handle}</SocialHandle>
                  </div>
                </SocialCard>
              )
            })}
          </SocialGrid>
        </FooterGrid>

        <Copyright>
          © {new Date().getFullYear()} MedPal.id — Seluruh hak cipta dilindungi.
        </Copyright>
      </ContentWidth>
    </FooterWrapper>
  )
}

export default FooterSection
