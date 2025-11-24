import { useState, useEffect } from 'react'
import {
  LandingContainer,
  Navbar,
  NavContent,
  Logo,
  LogoIcon,
  NavLinks,
  NavLink,
  CTAButton,
  HeroSection,
  HeroContent,
  HeroText,
  Badge,
  HeroTitle,
  HeroSubtitle,
  HeroButtons,
  PrimaryButton,
  SecondaryButton,
  HeroVisual,
  FeaturePreviewCard,
  PreviewIcon,
  PreviewText,
  PreviewTitle,
  PreviewDescription,
  FeaturesSection,
  SectionContent,
  SectionHeader,
  SectionBadge,
  SectionTitle,
  SectionSubtitle,
  FeaturesGrid,
  FeatureCard,
  FeatureIcon,
  FeatureTitle,
  FeatureDescription,
  HowItWorksSection,
  StatsSection,
  StatsGrid,
  StatCard,
  StatValue,
  StatLabel,
  TestimonialSection,
  TestimonialGrid,
  TestimonialCard,
  TestimonialText,
  TestimonialAuthor,
  AuthorAvatar,
  AuthorInfo,
  AuthorName,
  AuthorRole,
  CTASection,
  CTAContent,
  CTATitle,
  CTASubtitle,
  CTAButtonLarge,
  TrustBadge,
  Footer,
  FooterContent,
  FooterColumn,
  FooterLogo,
  FooterDescription,
  FooterTitle,
  FooterLinks,
  FooterLink,
  FooterBottom,
  PricingSection,
  PricingGrid,
  PricingCard,
  PopularBadge,
  PricingName,
  PricingCredits,
  PricingPrice,
  PricingDescription,
  PricingButton,
  DiscountBadge,
} from './Home.styles'

import { ParallaxProvider, Parallax } from 'react-scroll-parallax'
import { useInView } from 'react-intersection-observer'
import CountUp from 'react-countup'
import { useAppDispatch, useAppSelector } from '@store/store'
import { fetchFeatures } from '@store/feature/action'
import { fetchStatistics } from '@store/statistic/action'
import { fetchActiveCreditPlans } from '@store/credit/action'

function Home() {
  const dispatch = useAppDispatch()

  // Get data from Redux store
  const features = useAppSelector((state) => state.feature.features)
  const statistics = useAppSelector((state) => state.statistic.statistics)
  const creditPlans = useAppSelector((state) => state.credit.plans)

  // Intersection observer for stats section
  const { ref: statsRef, inView: statsInView } = useInView({
    threshold: 0.3,
    triggerOnce: true
  })

  useEffect(() => {
    // Dispatch Redux actions to fetch data
    dispatch(fetchFeatures())
    dispatch(fetchStatistics())
    dispatch(fetchActiveCreditPlans())

    // Refresh statistics every 30 seconds
    const statsInterval = setInterval(() => {
      dispatch(fetchStatistics())
    }, 30000)

    return () => clearInterval(statsInterval)
  }, [dispatch])

  const scrollToSection = (id) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <ParallaxProvider>
      <LandingContainer>
        {/* Navigation */}
        <Navbar>
        <NavContent>
          <Logo>
            <LogoIcon>🏥</LogoIcon>
            MedPalm
          </Logo>
          <NavLinks>
            <NavLink onClick={() => scrollToSection('features')}>Fitur</NavLink>
            <NavLink onClick={() => scrollToSection('how-it-works')}>Cara Kerja</NavLink>
            <NavLink onClick={() => scrollToSection('stats')}>Statistik</NavLink>
            <CTAButton to="/sign-in">Masuk</CTAButton>
          </NavLinks>
        </NavContent>
      </Navbar>

        {/* Hero Section */}
        <HeroSection>
          <Parallax speed={-5}>
            <HeroContent>
              <HeroText>
                <Badge>
                  🎓 Platform #1 untuk Mahasiswa Kedokteran Indonesia
                </Badge>
                <HeroTitle>
                  Cara mahasiswa kedokteran terbaik sukses — kini di genggaman Anda, didukung AI.
                </HeroTitle>
                <HeroSubtitle>
                  18.000+ flashcards, 20.000+ bank soal, simulasi OSCE berbasis AI, AI yang menjawab dengan referensi textbook dan jurnal ilmiah, medical calculators, serta AI assistant untuk menyusun laporan studi kasus dan skripsi.
                </HeroSubtitle>
                <HeroButtons>
                  <PrimaryButton to="/sign-in">
                    Mulai Gratis Sekarang
                  </PrimaryButton>
                  <SecondaryButton onClick={() => scrollToSection('features')}>
                    Lihat Fitur
                  </SecondaryButton>
                </HeroButtons>
              </HeroText>

              <HeroVisual>
                <FeaturePreviewCard>
                  <PreviewIcon>📚</PreviewIcon>
                  <PreviewText>
                    <PreviewTitle>18.000+ Flashcards</PreviewTitle>
                    <PreviewDescription>Materi lengkap semua blok</PreviewDescription>
                  </PreviewText>
                </FeaturePreviewCard>
                <FeaturePreviewCard>
                  <PreviewIcon>📝</PreviewIcon>
                  <PreviewText>
                    <PreviewTitle>20.000+ Bank Soal</PreviewTitle>
                    <PreviewDescription>Latihan UKMPPD & ujian blok</PreviewDescription>
                  </PreviewText>
                </FeaturePreviewCard>
                <FeaturePreviewCard>
                  <PreviewIcon>🤖</PreviewIcon>
                  <PreviewText>
                    <PreviewTitle>AI Assistant</PreviewTitle>
                    <PreviewDescription>Referensi textbook & jurnal</PreviewDescription>
                  </PreviewText>
                </FeaturePreviewCard>
              </HeroVisual>
            </HeroContent>
          </Parallax>
        </HeroSection>

      {/* Features Section */}
      <Parallax speed={3}>
        <FeaturesSection id="features">
        <SectionContent>
          <SectionHeader>
            <SectionBadge>🚀 Fitur Unggulan</SectionBadge>
            <SectionTitle>Semua yang Anda Butuhkan untuk Belajar</SectionTitle>
            <SectionSubtitle>
              Fitur pembelajaran yang dirancang khusus untuk mahasiswa kedokteran
            </SectionSubtitle>
          </SectionHeader>

          <Parallax speed={-2}>
            <FeaturesGrid>
              {features.length > 0 ? (
                features.map((feature, index) => (
                  <FeatureCard key={index}>
                    <FeatureIcon>{feature.icon}</FeatureIcon>
                    <FeatureTitle>{feature.name}</FeatureTitle>
                    <FeatureDescription>
                      {feature.description}
                      {feature.cost > 0 && (
                        <span style={{ display: 'block', marginTop: '0.5rem', fontWeight: '600', color: '#8DC63F' }}>
                          {feature.cost} kredit per sesi
                        </span>
                      )}
                    </FeatureDescription>
                  </FeatureCard>
                ))
              ) : (
                <>
                  <FeatureCard>
                    <FeatureIcon>🎓</FeatureIcon>
                    <FeatureTitle>Bank Soal</FeatureTitle>
                    <FeatureDescription>
                      20.000+ soal latihan untuk persiapan UKMPPD dan ujian blok dengan pembahasan lengkap.
                    </FeatureDescription>
                  </FeatureCard>

                  <FeatureCard>
                    <FeatureIcon>🎴</FeatureIcon>
                    <FeatureTitle>Flashcards</FeatureTitle>
                    <FeatureDescription>
                      18.000+ flashcard interaktif untuk membantu mengingat materi kedokteran dengan efektif.
                    </FeatureDescription>
                  </FeatureCard>

                  <FeatureCard>
                    <FeatureIcon>📝</FeatureIcon>
                    <FeatureTitle>Summary Notes</FeatureTitle>
                    <FeatureDescription>
                      Ringkasan materi yang terstruktur untuk review cepat sebelum ujian.
                    </FeatureDescription>
                  </FeatureCard>
                </>
              )}
            </FeaturesGrid>
          </Parallax>
        </SectionContent>
      </FeaturesSection>
    </Parallax>

    {/* How It Works Section */}
    <Parallax speed={2}>
      <HowItWorksSection id="how-it-works">
        <SectionContent>
          <SectionHeader>
            <SectionBadge>🎬 Lihat Demo</SectionBadge>
            <SectionTitle>Cara Kerja MedPalm</SectionTitle>
            <SectionSubtitle>
              Tonton video demo untuk melihat bagaimana MedPalm dapat membantu pembelajaran Anda
            </SectionSubtitle>
          </SectionHeader>

          <Parallax speed={-1}>
            <div style={{
              position: 'relative',
              width: '100%',
              maxWidth: '800px',
              margin: '0 auto',
              borderRadius: '16px',
              overflow: 'hidden',
              boxShadow: '0 20px 50px rgba(107, 185, 232, 0.2)'
            }}>
              <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0 }}>
                <iframe
                  src="https://www.youtube.com/embed/YOUR_VIDEO_ID"
                  title="MedPalm Demo"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    borderRadius: '16px'
                  }}
                />
              </div>
            </div>
          </Parallax>
        </SectionContent>
      </HowItWorksSection>
    </Parallax>

    {/* Stats Section */}
    <Parallax speed={-3}>
      <StatsSection id="stats" ref={statsRef}>
        <SectionContent>
          <SectionHeader>
            <SectionTitle>
              Dipercaya oleh Mahasiswa Kedokteran
            </SectionTitle>
          </SectionHeader>

          <StatsGrid>
            <StatCard>
              <StatValue>
                {statsInView && (
                  <CountUp
                    end={statistics.totalUsers}
                    duration={2.5}
                    separator=","
                    suffix="+"
                    useEasing={true}
                    preserveValue={true}
                  />
                )}
                {!statsInView && '0+'}
              </StatValue>
              <StatLabel>Mahasiswa Aktif</StatLabel>
            </StatCard>

            <StatCard>
              <StatValue>
                {statsInView && (
                  <CountUp
                    end={statistics.totalFlashcards}
                    duration={2.5}
                    separator=","
                    suffix="+"
                    useEasing={true}
                    preserveValue={true}
                  />
                )}
                {!statsInView && '0+'}
              </StatValue>
              <StatLabel>Flashcards</StatLabel>
            </StatCard>

            <StatCard>
              <StatValue>
                {statsInView && (
                  <CountUp
                    end={statistics.totalSessions}
                    duration={2.5}
                    separator=","
                    suffix="+"
                    useEasing={true}
                    preserveValue={true}
                  />
                )}
                {!statsInView && '0+'}
              </StatValue>
              <StatLabel>Sesi Belajar</StatLabel>
            </StatCard>

            <StatCard>
              <StatValue>
                {statsInView && (
                  <CountUp
                    end={statistics.satisfactionRate}
                    duration={2.5}
                    suffix="%"
                    useEasing={true}
                    preserveValue={true}
                  />
                )}
                {!statsInView && '0%'}
              </StatValue>
              <StatLabel>Tingkat Kepuasan</StatLabel>
            </StatCard>
          </StatsGrid>
        </SectionContent>
      </StatsSection>
    </Parallax>

    {/* Pricing Section */}
    <Parallax speed={2}>
      <PricingSection id="pricing">
        <SectionContent>
          <SectionHeader>
            <SectionBadge>💰 Paket Kredit</SectionBadge>
            <SectionTitle>Pilih Paket yang Sesuai</SectionTitle>
            <SectionSubtitle>
              Dapatkan kredit untuk mengakses semua fitur pembelajaran premium
            </SectionSubtitle>
          </SectionHeader>

          <Parallax speed={-1}>
            <PricingGrid>
              {creditPlans.length > 0 ? (
                creditPlans.map((plan) => (
                  <PricingCard key={plan.id} $isPopular={plan.isPopular}>
                    {plan.isPopular && <PopularBadge>Paling Populer</PopularBadge>}
                    <PricingName>{plan.name}</PricingName>
                    <PricingCredits>{plan.credits.toLocaleString()} Kredit</PricingCredits>
                    <PricingPrice>
                      Rp {Number(plan.price).toLocaleString('id-ID')}
                      {plan.discount > 0 && (
                        <DiscountBadge>Hemat {plan.discount}%</DiscountBadge>
                      )}
                    </PricingPrice>
                    <PricingDescription>
                      {plan.description || 'Akses semua fitur pembelajaran premium'}
                    </PricingDescription>
                    <PricingButton to="/sign-in">
                      Pilih Paket
                    </PricingButton>
                  </PricingCard>
                ))
              ) : (
                <>
                  <PricingCard>
                    <PricingName>Starter</PricingName>
                    <PricingCredits>50 Kredit</PricingCredits>
                    <PricingPrice>Rp 25.000</PricingPrice>
                    <PricingDescription>
                      Cocok untuk mencoba fitur-fitur dasar platform
                    </PricingDescription>
                    <PricingButton to="/sign-in">Pilih Paket</PricingButton>
                  </PricingCard>

                  <PricingCard $isPopular>
                    <PopularBadge>Paling Populer</PopularBadge>
                    <PricingName>Standard</PricingName>
                    <PricingCredits>200 Kredit</PricingCredits>
                    <PricingPrice>
                      Rp 75.000
                      <DiscountBadge>Hemat 25%</DiscountBadge>
                    </PricingPrice>
                    <PricingDescription>
                      Pilihan terbaik untuk belajar rutin setiap minggu
                    </PricingDescription>
                    <PricingButton to="/sign-in">Pilih Paket</PricingButton>
                  </PricingCard>

                  <PricingCard>
                    <PricingName>Premium</PricingName>
                    <PricingCredits>500 Kredit</PricingCredits>
                    <PricingPrice>
                      Rp 150.000
                      <DiscountBadge>Hemat 40%</DiscountBadge>
                    </PricingPrice>
                    <PricingDescription>
                      Untuk persiapan intensif UKMPPD dan ujian blok
                    </PricingDescription>
                    <PricingButton to="/sign-in">Pilih Paket</PricingButton>
                  </PricingCard>
                </>
              )}
            </PricingGrid>
          </Parallax>
        </SectionContent>
      </PricingSection>
    </Parallax>

    {/* Testimonial Section */}
    <Parallax speed={1}>
      <TestimonialSection>
        <SectionContent>
          <SectionHeader>
            <SectionBadge>💬 Testimoni</SectionBadge>
            <SectionTitle>Apa Kata Mahasiswa Kami</SectionTitle>
            <SectionSubtitle>
              Dengar pengalaman dari mahasiswa kedokteran yang telah menggunakan MedPalm
            </SectionSubtitle>
          </SectionHeader>

          <Parallax speed={-1}>
            <TestimonialGrid>
            <TestimonialCard>
              <TestimonialText>
                Platform ini sangat membantu saya dalam memahami materi kedokteran yang kompleks.
                Fitur-fiturnya interaktif dan sistem kredit membuat belajar lebih fleksibel!
              </TestimonialText>
              <TestimonialAuthor>
                <AuthorAvatar>AR</AuthorAvatar>
                <AuthorInfo>
                  <AuthorName>Ahmad Rizki</AuthorName>
                  <AuthorRole>Mahasiswa FK UI</AuthorRole>
                </AuthorInfo>
              </TestimonialAuthor>
            </TestimonialCard>

            <TestimonialCard>
              <TestimonialText>
                Sangat terstruktur dan mudah digunakan. Dashboard pribadi membantu saya
                melacak progress pembelajaran. Highly recommended untuk teman-teman koas!
              </TestimonialText>
              <TestimonialAuthor>
                <AuthorAvatar>SP</AuthorAvatar>
                <AuthorInfo>
                  <AuthorName>Siti Permata</AuthorName>
                  <AuthorRole>Mahasiswa FK UGM</AuthorRole>
                </AuthorInfo>
              </TestimonialAuthor>
            </TestimonialCard>

            <TestimonialCard>
              <TestimonialText>
                Interface yang responsif dan modern. Bisa diakses dari HP saat di rumah sakit.
                7 fitur pembelajaran benar-benar lengkap untuk kebutuhan kuliah!
              </TestimonialText>
              <TestimonialAuthor>
                <AuthorAvatar>BW</AuthorAvatar>
                <AuthorInfo>
                  <AuthorName>Budi Wijaya</AuthorName>
                  <AuthorRole>Mahasiswa FK UNAIR</AuthorRole>
                </AuthorInfo>
              </TestimonialAuthor>
            </TestimonialCard>
            </TestimonialGrid>
          </Parallax>
        </SectionContent>
      </TestimonialSection>
    </Parallax>

    {/* CTA Section */}
    <Parallax speed={2}>
      <CTASection>
        <CTAContent>
          <CTATitle>
            Siap Meningkatkan Pembelajaran Anda?
          </CTATitle>
          <CTASubtitle>
            Bergabunglah dengan ribuan mahasiswa kedokteran yang telah meningkatkan
            pembelajaran mereka dengan MedPalm. Mulai gratis hari ini!
          </CTASubtitle>
          <CTAButtonLarge to="/sign-in">
            Mulai Belajar Sekarang
          </CTAButtonLarge>
        </CTAContent>
      </CTASection>
    </Parallax>

    {/* Footer */}
    <Footer>
        <FooterContent>
          <FooterColumn>
            <FooterLogo>
              <LogoIcon>🏥</LogoIcon>
              MedPalm
            </FooterLogo>
            <FooterDescription>
              Platform pembelajaran medis berbasis AI yang membantu mahasiswa
              kedokteran belajar lebih efektif dan efisien.
            </FooterDescription>
          </FooterColumn>

          <FooterColumn>
            <FooterTitle>Produk</FooterTitle>
            <FooterLinks>
              <FooterLink onClick={() => scrollToSection('features')}>Fitur</FooterLink>
              <FooterLink onClick={() => scrollToSection('how-it-works')}>Cara Kerja</FooterLink>
              <FooterLink onClick={() => scrollToSection('stats')}>Statistik</FooterLink>
            </FooterLinks>
          </FooterColumn>

          <FooterColumn>
            <FooterTitle>Perusahaan</FooterTitle>
            <FooterLinks>
              <FooterLink>Tentang Kami</FooterLink>
              <FooterLink>Kontak</FooterLink>
              <FooterLink>Blog</FooterLink>
            </FooterLinks>
          </FooterColumn>

          <FooterColumn>
            <FooterTitle>Legal</FooterTitle>
            <FooterLinks>
              <FooterLink>Kebijakan Privasi</FooterLink>
              <FooterLink>Syarat & Ketentuan</FooterLink>
            </FooterLinks>
          </FooterColumn>
        </FooterContent>

        <FooterBottom>
          © 2025 MedPalm. All rights reserved.
        </FooterBottom>
      </Footer>
    </LandingContainer>
  </ParallaxProvider>
  )
}

export default Home
