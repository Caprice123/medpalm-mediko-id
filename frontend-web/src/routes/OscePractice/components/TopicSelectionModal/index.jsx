import { useState, useMemo } from 'react'
import Modal from '@components/common/Modal'
import {
  ModalContent,
  SearchBox,
  TopicsGrid,
  TopicCard,
  TopicHeader,
  TopicTitle,
  SelectionIndicator,
  TopicDescription,
  TopicMeta,
  MetaItem,
  ModelBadge,
  ModalActions,
  Button,
  EmptyState,
} from './TopicSelectionModal.styles'

function TopicSelectionModal({ topics, onClose, onSelectTopic, isLoading }) {
  const [selectedTopicId, setSelectedTopicId] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')

  // Filter topics based on search query
  const filteredTopics = useMemo(() => {
    if (!searchQuery.trim()) return topics

    const query = searchQuery.toLowerCase()
    return topics.filter(topic =>
      topic.title?.toLowerCase().includes(query) ||
      topic.description?.toLowerCase().includes(query) ||
      topic.scenario?.toLowerCase().includes(query)
    )
  }, [topics, searchQuery])

  const handleSelectTopic = () => {
    const selectedTopic = topics.find(t => t.id === selectedTopicId)
    if (selectedTopic && onSelectTopic) {
      onSelectTopic(selectedTopic)
    }
  }

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title="Pilih Topic OSCE Practice"
      size="large"
    >
      <ModalContent>
        <SearchBox
          type="text"
          placeholder="Cari topic berdasarkan judul, deskripsi, atau skenario..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        {filteredTopics.length === 0 ? (
          <EmptyState>
            <div style={{ fontSize: '3rem' }}>🔍</div>
            <p>
              {searchQuery ? 'Tidak ada topic yang sesuai dengan pencarian' : 'Belum ada topic tersedia'}
            </p>
          </EmptyState>
        ) : (
          <TopicsGrid>
            {filteredTopics.map((topic) => (
              <TopicCard
                key={topic.id}
                selected={selectedTopicId === topic.id}
                onClick={() => setSelectedTopicId(topic.id)}
                type="button"
              >
                <TopicHeader>
                  <TopicTitle>{topic.title}</TopicTitle>
                  <SelectionIndicator selected={selectedTopicId === topic.id} />
                </TopicHeader>

                {topic.description && (
                  <TopicDescription>{topic.description}</TopicDescription>
                )}

                <TopicMeta>
                  <MetaItem>
                    ⏱️ {topic.durationMinutes || 15} menit
                  </MetaItem>
                  <MetaItem>
                    <ModelBadge>{topic.aiModel || 'AI'}</ModelBadge>
                  </MetaItem>
                </TopicMeta>
              </TopicCard>
            ))}
          </TopicsGrid>
        )}
      </ModalContent>

      <ModalActions>
        <Button variant="secondary" onClick={onClose}>
          Batal
        </Button>
        <Button
          variant="primary"
          onClick={handleSelectTopic}
          disabled={!selectedTopicId || isLoading}
        >
          {isLoading ? 'Memulai...' : 'Mulai Practice'}
        </Button>
      </ModalActions>
    </Modal>
  )
}

export default TopicSelectionModal
