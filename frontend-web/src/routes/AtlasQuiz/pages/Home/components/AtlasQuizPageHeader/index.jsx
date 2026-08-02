import { PiCube } from 'react-icons/pi'
import { PageHeader, PageHeaderIcon, PageHeaderTitle, PageHeaderSubtitle } from './AtlasQuizPageHeader.styles'

export default function AtlasQuizPageHeader() {
  return (
    <PageHeader>
      <PageHeaderIcon><PiCube size={22} /></PageHeaderIcon>
      <div>
        <PageHeaderTitle>Atlas 3D &amp; Quiz Anatomi</PageHeaderTitle>
        <PageHeaderSubtitle>Eksplorasi atlas 3D dan latihan quiz anatomi interaktif.</PageHeaderSubtitle>
      </div>
    </PageHeader>
  )
}
