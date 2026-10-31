import { useNavigate } from 'react-router-dom'
import { AuthRoute } from '@routes/Auth/routes'
import {
  CopyBlock,
  Eyebrow,
  Title,
  Description,
  CtaRow,
  PrimaryCta,
  SecondaryCta,
} from './HeroCopy.styles'

const DEFAULT_TITLE = 'Belajar kedokteran\njadi lebih terarah.'
const DEFAULT_SUBTITLE =
  'Materi, Atlas Anatomi 3D, Kuis, Kartu Kilat, dan Berbagai Fitur Belajar dalam Satu Platform untuk Membantu Mahasiswa Kedokteran Belajar Lebih Terstruktur dan Fokus'

function HeroCopy({ title, subtitle, scrollToSection }) {
  const navigate = useNavigate()

  // Figma draws the headline as two lines, the second one in brand blue. The
  // constant keeps that shape by using a newline as the split point.
  const [firstLine, ...restLines] = (title || DEFAULT_TITLE).split('\n')

  return (
    <CopyBlock>
      <Eyebrow>Platform Belajar Mahasiswa Kedokteran</Eyebrow>

      <Title>
        {firstLine}
        {restLines.map((line) => (
          <span key={line}>{line}</span>
        ))}
      </Title>

      <Description>{subtitle || DEFAULT_SUBTITLE}</Description>

      <CtaRow>
        <PrimaryCta onClick={() => navigate(AuthRoute.signInRoute)}>
          Mulai Sekarang
        </PrimaryCta>
        <SecondaryCta onClick={() => scrollToSection('features')}>
          Lihat Fitur
        </SecondaryCta>
      </CtaRow>
    </CopyBlock>
  )
}

export default HeroCopy
