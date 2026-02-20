import { useMemo } from 'react'
import { useSelector } from 'react-redux'
import { TagList, Tag } from '../../Detail.styles'

const TopicTags = ({ tags: topicTags }) => {
  const { tags: tagGroups } = useSelector(state => state.tags)

  const departmentGroupId = useMemo(() => tagGroups?.find(t => t.name === 'department')?.id, [tagGroups])
  const topicGroupId = useMemo(() => tagGroups?.find(t => t.name === 'topic')?.id, [tagGroups])
  const universityGroupId = useMemo(() => tagGroups?.find(t => t.name === 'university')?.id, [tagGroups])
  const semesterGroupId = useMemo(() => tagGroups?.find(t => t.name === 'semester')?.id, [tagGroups])

  const departmentTags = useMemo(() => topicTags?.filter(t => t.tagGroupId === departmentGroupId) || [], [topicTags, departmentGroupId])
  const topicTagsFiltered = useMemo(() => topicTags?.filter(t => t.tagGroupId === topicGroupId) || [], [topicTags, topicGroupId])
  const universityTags = useMemo(() => topicTags?.filter(t => t.tagGroupId === universityGroupId) || [], [topicTags, universityGroupId])
  const semesterTags = useMemo(() => topicTags?.filter(t => t.tagGroupId === semesterGroupId) || [], [topicTags, semesterGroupId])

  return (
    <>
      {universityTags.length > 0 && (
        <TagList>
          {universityTags.map(tag => <Tag key={tag.id} university>🏛️ {tag.name}</Tag>)}
        </TagList>
      )}
      {semesterTags.length > 0 && (
        <TagList>
          {semesterTags.map(tag => <Tag key={tag.id} semester>📚 {tag.name}</Tag>)}
        </TagList>
      )}
      {topicTagsFiltered.length > 0 && (
        <TagList>
          {topicTagsFiltered.map(tag => <Tag key={tag.id} topic>📖 {tag.name}</Tag>)}
        </TagList>
      )}
      {departmentTags.length > 0 && (
        <TagList>
          {departmentTags.map(tag => <Tag key={tag.id} department>🏥 {tag.name}</Tag>)}
        </TagList>
      )}
    </>
  )
}

export default TopicTags
