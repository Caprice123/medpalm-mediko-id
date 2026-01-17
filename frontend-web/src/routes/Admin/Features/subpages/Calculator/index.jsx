import { useState, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchAdminCalculatorTopics } from '@store/calculator/action'
import { actions } from '@store/calculator/reducer'
import CalculatorModal from './components/CalculatorModal/index'
import CalculatorSettingsModal from './components/CalculatorSettingsModal'
import { Filter } from './components/Filter'
import { useCalculatorSection } from './hooks/useCalculatorSection'
import Button from '@components/common/Button'
import Pagination from '@components/Pagination'
import {
  Container,
  Header,
  BackButton,
  HeaderContent,
  TitleSection,
  Title,
  AddTopicButton,
  TopicsGrid,
  TopicCard,
  TopicHeader,
  TopicTitle,
  StatusBadge,
  TopicDescription,
  TopicStats,
  StatItem,
  StatLabel,
  StatValue,
  CardActions,
  ActionButton,
  EmptyState,
  TagList,
  Tag
} from './Calculator.styles'

function Calculator({ onBack }) {
  const dispatch = useDispatch()
  const { pagination } = useSelector(state => state.calculator)

  const {
    topics,
    loading,
    isModalOpen,
    calculatorToEdit,
    handleOpenCreateModal,
    handleCalculatorClick,
    handleCloseModal,
    handleModalSuccess,
    handleDelete
  } = useCalculatorSection()

  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false)

  const handlePageChange = (page) => {
    dispatch(actions.setPage(page))
    dispatch(fetchAdminCalculatorTopics())
  }

  return (
    <Container>
      <Header>
        <BackButton onClick={onBack}>Back</BackButton>
        <HeaderContent>
          <TitleSection>
            <Title>Kelola Kalkulator</Title>
          </TitleSection>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <AddTopicButton
              secondary
              onClick={() => setIsSettingsModalOpen(true)}
            >
              Pengaturan
            </AddTopicButton>
            <AddTopicButton onClick={handleOpenCreateModal}>
              Tambah Kalkulator
            </AddTopicButton>
          </div>
        </HeaderContent>
      </Header>

      <Filter />

      {loading.isGetListCalculatorsLoading ? (
        <EmptyState>
          <h3>Loading...</h3>
          <p>Memuat data kalkulator...</p>
        </EmptyState>
      ) : topics.length === 0 ? (
        <EmptyState>
          <h3>Belum Ada Kalkulator</h3>
          <p>Klik "Tambah Kalkulator" untuk membuat kalkulator pertama Anda</p>
        </EmptyState>
      ) : (
        <>
          <TopicsGrid>
            {topics.map(calculator => {
              // Filter tags by tag_group
              const kategoriTags = calculator.tags?.filter(tag => tag.tagGroup?.name === 'kategori') || []

              return (
                <TopicCard key={calculator.id}>
                  <TopicHeader>
                    <TopicTitle>{calculator.title}</TopicTitle>
                    <StatusBadge published={calculator.status === 'published'}>
                      {calculator.status === 'published' ? 'Published' : 'Draft'}
                    </StatusBadge>
                  </TopicHeader>

                  <TopicDescription>
                    {calculator.description || 'Tidak ada deskripsi'}
                  </TopicDescription>

                  <div style={{flex: "1"}}></div>

                  {/* Category Tags */}
                  {kategoriTags.length > 0 && (
                    <TagList>
                      {kategoriTags.map((tag) => (
                        <Tag key={tag.id} kategori>
                          📊 {tag.name}
                        </Tag>
                      ))}
                    </TagList>
                  )}

                  <TopicStats>
                    <StatItem>
                      <StatLabel>Fields</StatLabel>
                      <StatValue>{calculator.fields_count || 0}</StatValue>
                    </StatItem>
                    <StatItem>
                      <StatLabel>Created</StatLabel>
                      <StatValue>
                        {calculator.createdAt
                          ? new Date(calculator.createdAt).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            })
                          : '-'}
                      </StatValue>
                    </StatItem>
                  </TopicStats>

                  <CardActions>
                    <ActionButton onClick={() => handleCalculatorClick(calculator)}>
                      Edit
                    </ActionButton>
                    <ActionButton
                      danger
                      onClick={(e) => handleDelete(e, calculator.id)}
                    >
                      Delete
                    </ActionButton>
                  </CardActions>
                </TopicCard>
              )
            })}
          </TopicsGrid>

          <Pagination
            currentPage={pagination.page}
            isLastPage={pagination.isLastPage}
            onPageChange={handlePageChange}
            isLoading={loading.isGetListCalculatorsLoading}
            variant="admin"
            language="id"
          />
        </>
      )}

      <CalculatorModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        calculator={calculatorToEdit}
        onSuccess={handleModalSuccess}
      />

      <CalculatorSettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
      />
    </Container>
  )
}

export default Calculator
