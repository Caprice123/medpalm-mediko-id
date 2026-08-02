import {
  TopicHeader, TopicHeaderLeft, TopicIconBox, TopicMeta,
  ClassificationBadge, TopicName, TopicDescription, BackButton,
} from './TopicInfo.styles'

const CLASSIFICATION_LABELS = {
  sistem_blok: 'Sistem Blok',
  ilmu_lintas_sistem: 'Ilmu Lintas Sistem',
}

export default function TopicInfo({ topic, topicSlug, onBack }) {
  return (
    <TopicHeader>
      <TopicHeaderLeft>
        <TopicIconBox>{topic?.icon || '📚'}</TopicIconBox>
        <TopicMeta>
          {topic?.classification && (
            <ClassificationBadge>
              {CLASSIFICATION_LABELS[topic.classification] ?? topic.classification}
            </ClassificationBadge>
          )}
          <TopicName>{topic?.name ?? topicSlug}</TopicName>
          {topic?.description && <TopicDescription>{topic.description}</TopicDescription>}
        </TopicMeta>
      </TopicHeaderLeft>
      <BackButton onClick={onBack}>
        ← Kembali
      </BackButton>
    </TopicHeader>
  )
}
