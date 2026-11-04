import { TopicHeader, TopicName, TopicDescription, TitleSkeleton } from './TopicInfo.styles'

export default function TopicInfo({ topic }) {
  return (
    <TopicHeader>
      {topic ? <TopicName>{topic.name}</TopicName> : <TitleSkeleton />}
      {topic?.description && <TopicDescription>{topic.description}</TopicDescription>}
    </TopicHeader>
  )
}
