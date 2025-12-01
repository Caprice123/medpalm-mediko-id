import { useState } from 'react'
import CalculatorModal from './components/CalculatorModal/index'
import CalculatorSettingsModal from './components/CalculatorSettingsModal'
import { useCalculatorSection } from './hooks/useCalculatorSection'
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
  EmptyState
} from './Calculator.styles'

function Calculator({ onBack }) {
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

      {loading.isTopicsLoading ? (
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
        <TopicsGrid>
          {topics.map(calculator => (
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

              <TopicStats>
                <StatItem>
                  <StatLabel>Formula</StatLabel>
                  <StatValue style={{ fontSize: '12px', color: '#6b7280', fontFamily: 'monospace' }}>
                    {calculator.formula?.substring(0, 30)}...
                  </StatValue>
                </StatItem>
                <StatItem>
                  <StatLabel>Fields</StatLabel>
                  <StatValue>{calculator.fields_count || 0}</StatValue>
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
          ))}
        </TopicsGrid>
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
