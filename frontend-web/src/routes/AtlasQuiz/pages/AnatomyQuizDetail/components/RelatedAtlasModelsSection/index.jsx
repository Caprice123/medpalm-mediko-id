import { PiCube } from 'react-icons/pi'
import {
  SectionCard, SectionHeader, SectionTitle, SectionSubtitle,
  ModelsGrid, ModelItemCard, ModelItemTop, ModelItemIcon, ModelItemTitle, ModelItemSubtitle,
} from './RelatedAtlasModelsSection.styles'

export default function RelatedAtlasModelsSection({ models, onModelClick }) {
  if (models.length === 0) return null

  return (
    <SectionCard>
      <SectionHeader>
        <SectionTitle><PiCube size={18} /> Atlas 3D Terkait</SectionTitle>
        <SectionSubtitle>Model 3D anatomi yang berkaitan dengan quiz ini.</SectionSubtitle>
      </SectionHeader>
      <ModelsGrid>
        {models.map(m => (
          <ModelItemCard key={m.uniqueId} onClick={() => onModelClick(m)}>
            <ModelItemTop>
              <ModelItemIcon><PiCube size={16} /></ModelItemIcon>
              <div>
                <ModelItemTitle>{m.title}</ModelItemTitle>
                {m.moduleName && <ModelItemSubtitle>{m.moduleName}</ModelItemSubtitle>}
              </div>
            </ModelItemTop>
          </ModelItemCard>
        ))}
      </ModelsGrid>
    </SectionCard>
  )
}
