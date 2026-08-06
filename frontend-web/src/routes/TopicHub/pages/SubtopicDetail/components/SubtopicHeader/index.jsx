import { PageHeader, SubtopicName, SkeletonTitle, SkeletonSubtitle } from './SubtopicHeader.styles'

export default function SubtopicHeader({ subtopic, subtopicSlug, isLoading }) {
  return (
    <PageHeader>
      {isLoading ? (
        <>
          <SkeletonTitle />
          <SkeletonSubtitle />
        </>
      ) : (
        <SubtopicName>{subtopic?.name ?? subtopicSlug}</SubtopicName>
      )}
    </PageHeader>
  )
}
