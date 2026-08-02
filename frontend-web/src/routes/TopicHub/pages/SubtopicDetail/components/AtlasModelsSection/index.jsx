import { PiCube } from 'react-icons/pi'
import { SectionLabel } from '../../SubtopicDetail.styles'
import {
  AtlasSection, AtlasSectionSubtitle, AtlasGrid, AtlasCard, AtlasCardIcon, AtlasCardTitle, AtlasCardArrow,
} from './AtlasModelsSection.styles'

export default function AtlasModelsSection({ atlasModels, isLoading, onSelectModel }) {
  if (isLoading || atlasModels.length === 0) return null

  return (
    <AtlasSection>
      <SectionLabel>Model 3D Anatomi</SectionLabel>
      <AtlasSectionSubtitle>Model 3D dibuka di halaman baru dengan navigasi kembali. Setiap model disertai kuis 3D terkait di bagian bawah.</AtlasSectionSubtitle>
      <AtlasGrid>
        {atlasModels.map(model => (
          <AtlasCard key={model.uniqueId} onClick={() => onSelectModel(model.uniqueId)}>
            <AtlasCardIcon><PiCube size={16} /></AtlasCardIcon>
            <AtlasCardTitle>{model.title}</AtlasCardTitle>
            <AtlasCardArrow>→</AtlasCardArrow>
          </AtlasCard>
        ))}
      </AtlasGrid>
    </AtlasSection>
  )
}
