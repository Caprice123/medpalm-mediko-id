import { useState } from 'react'
import {
  Container,
  Header,
  Title,
  Subtitle,
  TopicSelectionContainer,
  TopicGrid,
  TopicCard,
  TopicHeader,
  TopicTitle,
  TagContainer,
  Tag,
  TopicFooter,
  QuestionCount,
  FilterSection,
  FilterGroup,
  FilterLabel,
  Select,
  EmptyState,
  TopicDescription
} from './TopicList.styles'
import Button from '@components/common/Button'
import { useSelector } from 'react-redux'

const TopicList = ({ topics, onSelectTopic }) => {
    const { tags } = useSelector(state => state.tags)
  const [filters, setFilters] = useState({
    university: '',
    semester: ''
  })

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }))
  }

  // Get unique universities and semesters for filters
  const universities = tags.find((tag) => tag.name == "university")?.tags || []
  const universityGroupId = tags.find((tag) => tag.name == "university")?.id

  const semesterGroupId = tags.find((tag) => tag.name == "semester")?.id
  const semesters = tags.find((tag) => tag.name == "semester")?.tags || []

  // Filter topics based on selected filters
  const filteredTopics = topics.filter(topic => {
    const universityMatch = !filters.university ||
      topic.tags?.some(tag => tag.tagGroupId === universityGroupId && tag.name === filters.university)

    const semesterMatch = !filters.semester ||
      topic.tags?.some(tag => tag.tagGroupId === semesterGroupId && tag.name === filters.semester)

    return universityMatch && semesterMatch
  })

  return (
    <Container>
      <Header>
        <div>
          <Title>Pilih Topik Latihan Soal</Title>
          <Subtitle>
            Pilih topik latihan soal untuk melatih pemahaman Anda
          </Subtitle>
        </div>
      </Header>

      <TopicSelectionContainer>
        <FilterSection>
          <FilterGroup>
            <FilterLabel>Universitas</FilterLabel>
            <Select
              value={filters.university}
              onChange={(e) => handleFilterChange('university', e.target.value)}
            >
              <option value="">Semua Universitas</option>
              {universities.map(tag => (
                <option key={tag.name} value={tag.name}>{tag.name}</option>
              ))}
            </Select>
          </FilterGroup>

          <FilterGroup>
            <FilterLabel>Semester</FilterLabel>
            <Select
              value={filters.semester}
              onChange={(e) => handleFilterChange('semester', e.target.value)}
            >
              <option value="">Semua Semester</option>
              {semesters.map(tag => (
                <option key={tag.name} value={tag.name}>{tag.name}</option>
              ))}
            </Select>
          </FilterGroup>
        </FilterSection>

        {filteredTopics.length === 0 ? (
          <EmptyState>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📝</div>
            <h3>Belum Ada Topik</h3>
            <p>Belum ada topik latihan soal yang tersedia saat ini</p>
          </EmptyState>
        ) : (
          <TopicGrid>
            {filteredTopics.map((topic) => (
              <TopicCard key={topic.id}>
                <TopicHeader>
                  <TopicTitle>{topic.title}</TopicTitle>
                  <TopicDescription>{topic.description || 'Tidak ada deskripsi'}</TopicDescription>
                </TopicHeader>

                <TagContainer>
                  {topic.tags && topic.tags.map((tag, index) => (
                    <Tag key={index} type={tag.type}>
                      {tag.name}
                    </Tag>
                  ))}
                </TagContainer>

                <TopicFooter>
                  <QuestionCount>
                    {topic.questionCount || topic.questions?.length || 0} Soal
                  </QuestionCount>
                  <Button variant="primary"
                    fullWidth
                    onClick={() => onSelectTopic(topic)}
                  >
                    Mulai Latihan
                  </Button>
                </TopicFooter>
              </TopicCard>
            ))}
          </TopicGrid>
        )}
      </TopicSelectionContainer>
    </Container>
  )
}

export default TopicList
