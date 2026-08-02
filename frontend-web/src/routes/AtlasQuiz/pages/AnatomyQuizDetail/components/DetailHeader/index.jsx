import Breadcrumb from '@components/common/Breadcrumb'
import { TopBar, Brand, BrandIcon, BrandTitle, BrandSubtitle, BackButton } from './DetailHeader.styles'

export default function DetailHeader({ breadcrumbItems, onBack }) {
  return (
    <>
      <TopBar>
        <Brand>
          <BrandIcon>🧬</BrandIcon>
          <div>
            <BrandTitle>Atlas 3D &amp; Quiz Anatomi</BrandTitle>
            <BrandSubtitle>Eksplorasi atlas 3D dan latihan quiz anatomi interaktif.</BrandSubtitle>
          </div>
        </Brand>
        <BackButton onClick={onBack}>
          ← Kembali
        </BackButton>
      </TopBar>

      <Breadcrumb style={{ marginBottom: '1.25rem' }} items={breadcrumbItems} />
    </>
  )
}
