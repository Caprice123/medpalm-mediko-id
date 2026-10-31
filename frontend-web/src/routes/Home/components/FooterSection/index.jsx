import {
  FaInstagram,
  FaWhatsapp,
  FaYoutube,
  FaTiktok,
  FaFacebookF,
  FaXTwitter,
  FaLinkedinIn,
} from 'react-icons/fa6'

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
// options the admin Global Settings page offers. Each entry carries the real
// brand mark plus its own tint so the footer reads as the actual platforms.
const ICON_STYLES = {
  instagram: { Icon: FaInstagram, background: '#fde7f0', color: '#c13584' },
  whatsapp: { Icon: FaWhatsapp, background: '#e3f6e7', color: '#25d366' },
  youtube: { Icon: FaYoutube, background: '#fde8e8', color: '#ff0000' },
  tiktok: { Icon: FaTiktok, background: '#eceef2', color: '#010101' },
  facebook: { Icon: FaFacebookF, background: '#e6effd', color: '#1877f2' },
  twitter: { Icon: FaXTwitter, background: '#e8f4fd', color: '#000000' },
  linkedin: { Icon: FaLinkedinIn, background: '#e4eefb', color: '#0a66c2' },
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
              <img src="/icon.png" alt="MedPal" />
            </Brand>
            <Tagline>
              Platform belajar kedokteran untuk mahasiswa Indonesia — materi, anatomi 3D,
              quiz, dan flashcard dalam satu tempat.
            </Tagline>
          </div>

          <SocialGrid>
            {items.map((item) => {
              const style = ICON_STYLES[item.type] || ICON_STYLES.instagram
              const { Icon } = style
              return (
                <SocialCard
                  key={item.platform}
                  href={item.url}
                  target="_blank"
                  rel="noreferrer"
                >
                  <SocialIcon
                    $background={style.background}
                    $color={style.color}
                    aria-hidden="true"
                  >
                    <Icon />
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
