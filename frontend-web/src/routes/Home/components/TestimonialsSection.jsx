import { Parallax } from 'react-scroll-parallax'
import { Card, CardBody } from '@components/common/Card'
import {
  TestimonialSection,
  SectionContent,
  SectionHeader,
  SectionBadge,
  SectionTitle,
  SectionSubtitle,
  TestimonialGrid,
  TestimonialText,
  TestimonialAuthor,
  AuthorAvatar,
  AuthorInfo,
  AuthorName,
  AuthorRole,
} from '../Home.styles'

export default function TestimonialsSection() {
  return (
    <Parallax speed={1}>
      <TestimonialSection>
        <SectionContent>
          <SectionHeader data-aos="fade-up">
            <SectionBadge>💬 Testimoni</SectionBadge>
            <SectionTitle>Apa Kata Mahasiswa Kami</SectionTitle>
            <SectionSubtitle>
              Dengar pengalaman dari mahasiswa kedokteran yang telah menggunakan MedPal
            </SectionSubtitle>
          </SectionHeader>

          <Parallax speed={-1}>
            <TestimonialGrid>
              <Card hoverable rounded="lg" data-aos="fade-up" data-aos-delay="0">
                <CardBody>
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
                </CardBody>
              </Card>

              <Card hoverable rounded="lg" data-aos="fade-up" data-aos-delay="100">
                <CardBody>
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
                </CardBody>
              </Card>

              <Card hoverable rounded="lg" data-aos="fade-up" data-aos-delay="200">
                <CardBody>
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
                </CardBody>
              </Card>
            </TestimonialGrid>
          </Parallax>
        </SectionContent>
      </TestimonialSection>
    </Parallax>
  )
}
