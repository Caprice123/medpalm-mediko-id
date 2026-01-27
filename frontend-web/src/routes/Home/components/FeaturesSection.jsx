import { Parallax } from 'react-scroll-parallax'
import { Card, CardBody } from '@components/common/Card'
import {
  FeaturesSection as StyledFeaturesSection,
  SectionContent,
  SectionHeader,
  SectionBadge,
  SectionTitle,
  SectionSubtitle,
  FeaturesGrid,
  FeatureIcon,
  FeatureTitle,
  FeatureDescription,
} from '../Home.styles'
import { useSelector } from 'react-redux'

export default function FeaturesSection() {
  const features = useSelector((state) => state.feature.features)

  // Filter only active features
  const activeFeatures = features.filter(feature => feature.isActive === true || feature.isActive === "true")

  return (
    <Parallax speed={3}>
      <StyledFeaturesSection id="features">
        <SectionContent>
          <SectionHeader data-aos="fade-up">
            <SectionBadge>🚀 Fitur Unggulan</SectionBadge>
            <SectionTitle>Semua yang Anda Butuhkan untuk Belajar</SectionTitle>
            <SectionSubtitle>
              Fitur pembelajaran yang dirancang khusus untuk mahasiswa kedokteran
            </SectionSubtitle>
          </SectionHeader>

          <Parallax speed={-2}>
            <FeaturesGrid>
              {activeFeatures.length > 0 ? (
                activeFeatures.map((feature, index) => (
                  <Card
                    key={index}
                    hoverable
                    rounded="lg"
                    data-aos="fade-up"
                    data-aos-delay={index * 100}
                  >
                    <CardBody>
                      <FeatureIcon>{feature.icon}</FeatureIcon>
                      <FeatureTitle>{feature.name}</FeatureTitle>
                      <FeatureDescription>
                        {feature.description}
                      </FeatureDescription>
                    </CardBody>
                  </Card>
                ))
              ) : (
                <>
                  <Card hoverable rounded="lg" data-aos="fade-up" data-aos-delay="0">
                    <CardBody>
                      <FeatureIcon>🎓</FeatureIcon>
                      <FeatureTitle>Bank Soal</FeatureTitle>
                      <FeatureDescription>
                        20.000+ soal latihan untuk persiapan UKMPPD dan ujian blok dengan pembahasan lengkap.
                      </FeatureDescription>
                    </CardBody>
                  </Card>

                  <Card hoverable rounded="lg" data-aos="fade-up" data-aos-delay="100">
                    <CardBody>
                      <FeatureIcon>🎴</FeatureIcon>
                      <FeatureTitle>Flashcards</FeatureTitle>
                      <FeatureDescription>
                        18.000+ flashcard interaktif untuk membantu mengingat materi kedokteran dengan efektif.
                      </FeatureDescription>
                    </CardBody>
                  </Card>

                  <Card hoverable rounded="lg" data-aos="fade-up" data-aos-delay="200">
                    <CardBody>
                      <FeatureIcon>📝</FeatureIcon>
                      <FeatureTitle>Summary Notes</FeatureTitle>
                      <FeatureDescription>
                        Ringkasan materi yang terstruktur untuk review cepat sebelum ujian.
                      </FeatureDescription>
                    </CardBody>
                  </Card>
                </>
              )}
            </FeaturesGrid>
          </Parallax>
        </SectionContent>
      </StyledFeaturesSection>
    </Parallax>
  )
}
