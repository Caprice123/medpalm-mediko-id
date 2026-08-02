import { CLASSIFICATION_LABELS } from '../../utils/labels'
import { ModelCard, ModelMeta, MetaTag, ModelTitle, ModelDescription } from './ModelInfoCard.styles'

export default function ModelInfoCard({ mod, model }) {
  return (
    <ModelCard>
      {mod && (
        <ModelMeta>
          <MetaTag $type="module">{mod.name}</MetaTag>
          {mod.classification && (
            <MetaTag $type={mod.classification}>
              {CLASSIFICATION_LABELS[mod.classification] ?? mod.classification}
            </MetaTag>
          )}
        </ModelMeta>
      )}
      <ModelTitle>{model.title}</ModelTitle>
      {model.description && <ModelDescription>{model.description}</ModelDescription>}
    </ModelCard>
  )
}
