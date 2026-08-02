import { useSelector } from 'react-redux'
import { PiCube } from 'react-icons/pi'
import { PageHeader, PageHeaderIcon, PageHeaderTitle, PageHeaderSubtitle } from './AtlasQuizPageHeader.styles'

const FALLBACK_TITLE = 'Atlas 3D & Quiz Anatomi'

export default function AtlasQuizPageHeader() {
  const features = useSelector(s => s.feature.features)
  const anatomyFeature = features.find(f => f.sessionType === 'anatomy')
  const atlasFeature = features.find(f => f.sessionType === 'atlas')

  const title = anatomyFeature?.name && atlasFeature?.name
    ? `${atlasFeature.name} & ${anatomyFeature.name}`
    : FALLBACK_TITLE

  return (
    <PageHeader>
      <PageHeaderIcon><PiCube size={22} /></PageHeaderIcon>
      <div>
        <PageHeaderTitle>{title}</PageHeaderTitle>
        <PageHeaderSubtitle>Eksplorasi atlas 3D dan latihan quiz anatomi interaktif.</PageHeaderSubtitle>
      </div>
    </PageHeader>
  )
}
