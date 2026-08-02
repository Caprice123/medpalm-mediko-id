import { PageHeader, SubtopicName, ProgressLabel, SkeletonTitle, SkeletonSubtitle } from './SubtopicHeader.styles'

export default function SubtopicHeader({ subtopic, subtopicSlug, currentIndex, siblingsCount, isLoading }) {
  return (
    <PageHeader>
      {isLoading ? (
        <>
          <SkeletonTitle />
          <SkeletonSubtitle />
        </>
      ) : (
        <>
          <SubtopicName>{subtopic?.name ?? subtopicSlug}</SubtopicName>
          {siblingsCount > 0 && currentIndex >= 0 && (
            <ProgressLabel>Subtopik {currentIndex + 1} dari {siblingsCount}</ProgressLabel>
          )}
        </>
      )}
    </PageHeader>
  )
}
