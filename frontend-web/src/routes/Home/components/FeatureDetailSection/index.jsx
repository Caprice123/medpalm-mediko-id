import frameLeft from '@/assets/landing/feature-frame-left.png'
import blobUnion from '@/assets/landing/feature-blob-union.svg'
import decorMascot from '@/assets/landing/feature-capybara-laptop.png'
import checkFirst from '@/assets/landing/feature-check-first.svg'
import check from '@/assets/landing/feature-check.svg'
import { useSelector } from 'react-redux'
import { ContentWidth } from '../../Home.styles'
import { useFeatureTabs } from './hooks/useFeatureTabs'
import {
  SectionWrapper,
  FrameLeft,
  Heading,
  Description,
  TabRow,
  Tab,
  PanelGrid,
  Illustration,
  VideoFrame,
  PanelBody,
  PanelTitle,
  PanelDescription,
  PointList,
  PointItem,
  PointIcon,
  Decoration,
  BlobUnion,
  DecorMascot,
} from './FeatureDetailSection.styles'

// Pengaturan Global owns the heading, but the defaults stay here so the section
// still reads correctly against a database the landing seed has not run on.
const DEFAULT_HEADING = 'Semua yang kamu butuhkan'
const DEFAULT_HEADING_ACCENT = 'untuk belajar kedokteran.'
const DEFAULT_SUBTITLE =
  'Mulai dari memahami materi hingga menguji pemahaman, MedPal menyediakan berbagai ' +
  'fitur yang bisa digunakan sesuai kebutuhan belajarmu.'

function FeatureDetailSection() {
  const { tabs, activeTab, setActiveKey } = useFeatureTabs()

  // Read here rather than taking props: this copy is rendered as-is, so it
  // never needs to travel through the page component.
  const constants = useSelector((state) => state.constant.constants)

  return (
    <SectionWrapper>
      <FrameLeft src={frameLeft} alt="" aria-hidden="true" />

      <ContentWidth>
        <Heading data-aos="fade-up">
          {constants.home_feature_heading || DEFAULT_HEADING}
          <span>{constants.home_feature_heading_accent || DEFAULT_HEADING_ACCENT}</span>
        </Heading>
        <Description data-aos="fade-up" data-aos-delay="80">
          {constants.home_feature_subtitle || DEFAULT_SUBTITLE}
        </Description>

        {/* Nothing to show until the features request resolves. */}
        {activeTab && (
          <>
            <TabRow role="tablist" data-aos="fade-up" data-aos-delay="140">
              {tabs.map((tab) => (
                <Tab
                  key={tab.key}
                  role="tab"
                  aria-selected={tab.key === activeTab.key}
                  $active={tab.key === activeTab.key}
                  onClick={() => setActiveKey(tab.key)}
                >
                  {tab.name}
                </Tab>
              ))}
            </TabRow>

            <PanelGrid>
              <Illustration key={`video-${activeTab.key}`}>
                {activeTab.videoId && (
                  <VideoFrame
                    src={`https://www.youtube-nocookie.com/embed/${activeTab.videoId}`}
                    title={`Video ${activeTab.name}`}
                    loading="lazy"
                    allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                )}
              </Illustration>

              <PanelBody key={`copy-${activeTab.key}`}>
                <PanelTitle>{activeTab.name}</PanelTitle>
                <PanelDescription>{activeTab.description}</PanelDescription>

                {/* A feature with no local copy keeps its title, description
                    and video rather than leaving an empty list behind. */}
                {activeTab.points.length > 0 && (
                  <PointList>
                    {activeTab.points.map((point, index) => (
                      <PointItem key={point}>
                        {/* Figma uses a distinct glyph on the first row. */}
                        <PointIcon src={index === 0 ? checkFirst : check} alt="" />
                        {point}
                      </PointItem>
                    ))}
                  </PointList>
                )}
              </PanelBody>
            </PanelGrid>
          </>
        )}
      </ContentWidth>

      <Decoration aria-hidden="true">
        <BlobUnion src={blobUnion} alt="" />
        <DecorMascot src={decorMascot} alt="" />
      </Decoration>
    </SectionWrapper>
  )
}

export default FeatureDetailSection
