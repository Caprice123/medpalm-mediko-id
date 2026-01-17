import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { actions } from '@store/oscePractice/reducer'
import { fetchAdminOsceTopics, fetchOsceTopic } from '@store/oscePractice/adminAction'
import Pagination from '@components/Pagination'
import Filter from './components/Filter'
import Button from '@components/common/Button'
import TopicsList from './components/TopicsList'
import CreateTopicModal from './components/CreateTopicModal'
import UpdateTopicModal from './components/UpdateTopicModal'
import { TabContent, AddTopicButton } from './TopicsTab.styles'

function TopicsTab() {
  const dispatch = useDispatch()
  const { pagination, loading } = useSelector(state => state.oscePractice)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false)

  useEffect(() => {
    dispatch(fetchAdminOsceTopics())
  }, [dispatch])

  const handlePageChange = (page) => {
    dispatch(actions.setPage(page))
    dispatch(fetchAdminOsceTopics())
  }

  const handleEditTopic = async (topic) => {
    await dispatch(fetchOsceTopic(topic.id, () => {
      setIsUpdateModalOpen(true)
    }))
  }

  return (
    <TabContent>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
        <Button variant="primary" onClick={() => setIsCreateModalOpen(true)}>
          Tambah Topic Baru
        </Button>
      </div>

      <Filter />

      <TopicsList
        onEdit={handleEditTopic}
        onCreateFirst={() => setIsCreateModalOpen(true)}
      />

      <Pagination
        currentPage={pagination.page}
        isLastPage={pagination.isLastPage}
        onPageChange={handlePageChange}
        isLoading={loading.isGetListTopicsLoading}
        variant="admin"
        language="id"
      />

      {isCreateModalOpen && (
        <CreateTopicModal onClose={() => setIsCreateModalOpen(false)} />
      )}

      {isUpdateModalOpen && (
        <UpdateTopicModal onClose={() => setIsUpdateModalOpen(false)} />
      )}
    </TabContent>
  )
}

export default TopicsTab
