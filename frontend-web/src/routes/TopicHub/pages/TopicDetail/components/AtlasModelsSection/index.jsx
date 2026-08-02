import { useSelector } from 'react-redux'
import { PiCube } from 'react-icons/pi'
import {
  AtlasSection, AtlasSectionHeader, AtlasSectionTitle, AtlasSectionIcon, AtlasSectionSubtitle,
  AtlasModuleGroup, AtlasModuleHeader, AtlasModuleTitle,
  AtlasGrid, AtlasCard, AtlasCardIcon, AtlasCardTitle, AtlasCardArrow,
} from './AtlasModelsSection.styles'

export default function AtlasModelsSection({ onSelectModel }) {
  const atlasGroups = useSelector(s => s.featureNodes.atlasGroups)

  if (atlasGroups.length === 0) return null

  return (
    <AtlasSection>
      <AtlasSectionHeader>
        <AtlasSectionTitle>
          <AtlasSectionIcon><PiCube size={20} /></AtlasSectionIcon>
          Model 3D Anatomi
        </AtlasSectionTitle>
      </AtlasSectionHeader>
      <AtlasSectionSubtitle>
        Model 3D dibuka di halaman baru dengan navigasi kembali. Setiap model disertai kuis 3D terkait di bagian bawah.
      </AtlasSectionSubtitle>

      {atlasGroups.map(group => (
        <AtlasModuleGroup key={group.moduleId}>
          <AtlasModuleHeader>
            <AtlasModuleTitle>3D Model {group.moduleName}</AtlasModuleTitle>
          </AtlasModuleHeader>
          <AtlasGrid>
            {group.models.map(model => (
              <AtlasCard key={model.uniqueId} onClick={() => onSelectModel(model.uniqueId)}>
                <AtlasCardIcon><PiCube size={16} /></AtlasCardIcon>
                <AtlasCardTitle>{model.title}</AtlasCardTitle>
                <AtlasCardArrow>→</AtlasCardArrow>
              </AtlasCard>
            ))}
          </AtlasGrid>
        </AtlasModuleGroup>
      ))}
    </AtlasSection>
  )
}
