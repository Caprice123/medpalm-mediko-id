import { useSelector } from 'react-redux'
import { hasTabPermission } from '@utils/permissionUtils'
import Button from '@components/common/Button'
import { PageTitle, NoAccessMessage } from './GlobalSettings.styles'
import { useGlobalSettings } from './hooks/useGlobalSettings'

import HeroSection from './components/HeroSection'
import WhyMedPalSection from './components/WhyMedPalSection'
import FeatureSection from './components/FeatureSection'
import TestimonialSection from './components/TestimonialSection'
import FaqSection from './components/FaqSection'
import FooterSection from './components/FooterSection'
import LoginSection from './components/LoginSection'

// The cards follow the order the sections appear on the landing page, so an
// admin can work down this page while scrolling down medpal.id.
//
// What is missing is missing on purpose. The navbar's links must point at ids
// that exist on the page. The hero's content counters are computed from how
// much content exists. Events and challenges are read live from the webinar and
// challenge listings. Pricing has its own admin tab, and the feature tabs
// themselves come from Kelola Fitur — which is why the feature card here only
// carries the heading and the bullet points.
function GlobalSettings() {
  const { text, listProps, changeText, featurePoints, changeFeaturePoints, save } =
    useGlobalSettings()
  const isSaving = useSelector((state) => state.constant.loading.isUpdateConstantLoading)

  if (!hasTabPermission('globalSettings')) {
    return (
      <NoAccessMessage>
        Anda tidak memiliki akses ke halaman ini. Hubungi administrator untuk
        mendapatkan izin akses.
      </NoAccessMessage>
    )
  }

  return (
    <div>
      <PageTitle>Pengaturan Global</PageTitle>

      <HeroSection
        title={text.home_hero_title}
        subtitle={text.home_hero_subtitle}
        onTextChange={changeText}
      />

      <WhyMedPalSection
        heading={text.home_why_heading}
        subtitle={text.home_why_subtitle}
        onTextChange={changeText}
        {...listProps('whyCards')}
      />

      <FeatureSection
        heading={text.home_feature_heading}
        headingAccent={text.home_feature_heading_accent}
        subtitle={text.home_feature_subtitle}
        onTextChange={changeText}
        points={featurePoints}
        onPointsChange={changeFeaturePoints}
      />

      <TestimonialSection {...listProps('testimonials')} />

      <FaqSection {...listProps('faqs')} />

      <FooterSection {...listProps('socials')} />

      <LoginSection
        tagline={text.home_hero_badge}
        signinTitle={text.login_signin_title}
        signinSubtitle={text.login_signin_subtitle}
        onTextChange={changeText}
        {...listProps('loginSlides')}
      />

      <Button variant="primary" onClick={save} disabled={isSaving}>
        {isSaving ? 'Menyimpan...' : 'Simpan Pengaturan'}
      </Button>
    </div>
  )
}

export default GlobalSettings
