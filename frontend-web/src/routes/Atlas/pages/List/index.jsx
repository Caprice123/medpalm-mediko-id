import { useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { generatePath, useNavigate } from 'react-router-dom'
import { fetchAtlasModels } from '@store/atlas/userAction'
import { actions } from '@store/atlas/reducer'
import { actions as tagActions } from '@store/tags/reducer'
import { fetchTags } from '@store/tags/userAction'
import { Card, CardHeader, CardBody } from '@components/common/Card'
import Button from '@components/common/Button'
import EmptyState from '@components/common/EmptyState'
import { SummaryNoteSkeletonGrid } from '@components/common/SkeletonCard'
import Pagination from '@components/Pagination'
import FilterComponent from '@components/common/Filter'
import TextInput from '@components/common/TextInput'
import Dropdown from '@components/common/Dropdown'
import { AtlasRoute } from '../../routes'
import {
  Container,
  Content,
  ModelsGrid,
  QuizDescription,
  TagList,
  Tag,
  UpdatedText
} from './Atlas.styles'
import { formatLocalDateLong } from '@utils/dateUtils'

function AtlasListPage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { models, loading, filter, pagination } = useSelector(state => state.atlas)
  const { tags } = useSelector(state => state.tags)

  useEffect(() => {
    dispatch(tagActions.updateFilter({ key: 'tagGroupNames', value: ['atlas_topic', 'atlas_subtopic'] }))
    dispatch(fetchTags())
    dispatch(fetchAtlasModels())
  }, [dispatch])

  const topicTags = useMemo(
    () => tags?.find(t => t.name === 'atlas_topic')?.tags?.map(t => ({ label: t.name, value: t.id })) || [],
    [tags]
  )
  const subtopicTags = useMemo(
    () => tags?.find(t => t.name === 'atlas_subtopic')?.tags?.map(t => ({ label: t.name, value: t.id })) || [],
    [tags]
  )

  const onSearch = () => dispatch(fetchAtlasModels())

  const handlePageChange = (page) => {
    dispatch(actions.setPagination({ ...pagination, page }))
    dispatch(fetchAtlasModels())
  }

  return (
    <Container>
      <Content>
        {/* Filter */}
        <div style={{ background: 'white', padding: '1.5rem', borderRadius: '12px', marginBottom: '2rem', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
          <form onSubmit={e => { e.preventDefault(); onSearch() }}>
            <FilterComponent>
              <FilterComponent.Group>
                <FilterComponent.Label>Nama model</FilterComponent.Label>
                <TextInput
                  placeholder="Cari atlas berdasarkan nama..."
                  value={filter.search || ''}
                  onChange={e => dispatch(actions.updateFilter({ key: 'search', value: e.target.value }))}
                  onKeyPress={e => { if (e.key === 'Enter') { e.preventDefault(); onSearch() } }}
                />
              </FilterComponent.Group>
              <FilterComponent.Group>
                <FilterComponent.Label>Topik</FilterComponent.Label>
                <Dropdown
                  options={topicTags}
                  value={filter.topic ? topicTags.find(t => t.value === filter.topic) : null}
                  onChange={option => dispatch(actions.updateFilter({ key: 'topic', value: option?.value || '' }))}
                  placeholder="Filter topik..."
                />
              </FilterComponent.Group>
              <FilterComponent.Group>
                <FilterComponent.Label>Subtopik</FilterComponent.Label>
                <Dropdown
                  options={subtopicTags}
                  value={filter.subtopic ? subtopicTags.find(t => t.value === filter.subtopic) : null}
                  onChange={option => dispatch(actions.updateFilter({ key: 'subtopic', value: option?.value || '' }))}
                  placeholder="Filter subtopik..."
                />
              </FilterComponent.Group>
            </FilterComponent>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
              <Button variant="primary" type="submit">Cari</Button>
            </div>
          </form>
        </div>

        {loading?.isGetListAtlasLoading ? (
          <SummaryNoteSkeletonGrid count={6} />
        ) : models.length === 0 ? (
          <EmptyState icon="🧬" title="Tidak ada atlas model tersedia" />
        ) : (
          <ModelsGrid>
            {models.map(model => (
              <Card key={model.uniqueId} shadow hoverable>
                <CardHeader title={model.title} divider={false} />
                <CardBody padding="0 1.25rem 1.25rem 1.25rem">
                  <QuizDescription>
                    {model.description || 'Tidak ada deskripsi'}
                  </QuizDescription>

                  {model.topicTags?.length > 0 && (
                    <TagList>
                      {model.topicTags.map(tag => (
                        <Tag key={tag.id} topic>🏷️ {tag.name}</Tag>
                      ))}
                    </TagList>
                  )}

                  {model.subtopicTags?.length > 0 && (
                    <TagList>
                      {model.subtopicTags.map(tag => (
                        <Tag key={tag.id} subtopic>📌 {tag.name}</Tag>
                      ))}
                    </TagList>
                  )}

                  <div style={{ flex: 1 }} />

                  {model.updatedAt && (
                    <UpdatedText>
                      Terakhir diperbarui: {formatLocalDateLong(model.updatedAt)}
                    </UpdatedText>
                  )}

                  <Button
                    variant="primary"
                    fullWidth
                    onClick={() => navigate(generatePath(AtlasRoute.detailRoute, { uniqueId: model.uniqueId }))}
                  >
                    Buka Atlas
                  </Button>
                </CardBody>
              </Card>
            ))}
          </ModelsGrid>
        )}


        {!loading.isGetListAtlasLoading && models.length > 0 && (pagination.page > 1 || !pagination.isLastPage) && (
          <Pagination
            currentPage={pagination.page}
            isLastPage={pagination.isLastPage}
            onPageChange={handlePageChange}
            isLoading={loading.isGetListAtlasLoading}
            language="id"
          />
        )}
      </Content>
    </Container>
  )
}

export default AtlasListPage
