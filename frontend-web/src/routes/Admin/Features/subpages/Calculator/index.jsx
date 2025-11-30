import { useState } from 'react'
import CalculatorModal from './components/CalculatorModal/index'
import CalculatorSettingsModal from './components/CalculatorSettingsModal'
import { useCalculator } from './useCalculator'
import {
  Container,
  Header,
  BackButton,
  HeaderContent,
  TitleSection,
  IconLarge,
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
  } = useCalculator()

  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false)

  return (
    <Container>
      <Header>
        <BackButton onClick={onBack}>←</BackButton>
        <HeaderContent>
          <TitleSection>
            <IconLarge>🧮</IconLarge>
            <Title>Kelola Kalkulator</Title>
          </TitleSection>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <AddTopicButton
              onClick={() => setIsSettingsModalOpen(true)}
              style={{ background: 'linear-gradient(135deg, #64748b, #475569)' }}
            >
              <span>⚙️</span>
              Pengaturan
            </AddTopicButton>
            <AddTopicButton onClick={handleOpenCreateModal}>
              <span>+</span>
              Tambah Kalkulator
            </AddTopicButton>
          </div>
        </HeaderContent>
      </Header>

      {loading.isTopicsLoading ? (
        <EmptyState>
          <div>⏳</div>
          <h3>Loading...</h3>
          <p>Memuat data kalkulator...</p>
        </EmptyState>
      ) : topics.length === 0 ? (
        <EmptyState>
          <div>🧮</div>
          <h3>Belum Ada Kalkulator</h3>
          <p>Klik "Tambah Kalkulator" untuk membuat kalkulator pertama Anda</p>
        </EmptyState>
      ) : (
        <TopicsGrid>
          {topics.map(calculator => (
            <TopicCard key={calculator.id} onClick={() => handleCalculatorClick(calculator)}>
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
                  <StatValue style={{ fontSize: '12px', color: '#8b5cf6', fontFamily: 'monospace' }}>
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
