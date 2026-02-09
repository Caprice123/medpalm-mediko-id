import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { actions } from '@store/oscePractice/reducer'
import {
  fetchAdminOsceRubrics,
  fetchOsceRubric
} from '@store/oscePractice/adminAction'
import Pagination from '@components/Pagination'
import Button from '@components/common/Button'
import Filter from './components/Filter'
import RubricsList from './components/RubricsList'
import CreateRubricModal from './components/CreateRubricModal'
import UpdateRubricModal from './components/UpdateRubricModal'
import { TabContent } from './Rubric.styles'

function RubricsTab() {
  const dispatch = useDispatch()
  const { rubricPagination, loading } = useSelector(state => state.oscePractice)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false)

  useEffect(() => {
    dispatch(fetchAdminOsceRubrics())
  }, [dispatch])

  const handlePageChange = (page) => {
    dispatch(actions.setRubricPage(page))
    dispatch(fetchAdminOsceRubrics())
  }

  const handleEditRubric = async (rubric) => {
    await dispatch(fetchOsceRubric(rubric.id, () => {
      setIsUpdateModalOpen(true)
    }))
  }

  return (
    <TabContent>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 600 }}>Rubrik OSCE</h2>
          <p style={{ margin: '0.25rem 0 0 0', color: '#6b7280', fontSize: '0.875rem' }}>
            Kelola rubrik evaluasi untuk penilaian OSCE
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Button variant="primary" onClick={() => setIsCreateModalOpen(true)}>
            + Buat Rubrik Baru
          </Button>
        </div>
      </div>

      <Filter />

      <RubricsList
        onEdit={handleEditRubric}
        onCreateFirst={() => setIsCreateModalOpen(true)}
      />

      {rubricPagination && (rubricPagination.page > 1 || (rubricPagination.page === 1 && !rubricPagination.isLastPage)) && (
        <Pagination
          currentPage={rubricPagination.page}
          isLastPage={rubricPagination.isLastPage}
          onPageChange={handlePageChange}
          isLoading={loading.isGetListRubricsLoading}
          variant="admin"
          language="id"
        />
      )}

      {isCreateModalOpen && (
        <CreateRubricModal
          onClose={() => {
            setIsCreateModalOpen(false)
            dispatch(fetchAdminOsceRubrics())
          }}
        />
      )}

      {isUpdateModalOpen && (
        <UpdateRubricModal
          onClose={() => {
            setIsUpdateModalOpen(false)
            dispatch(fetchAdminOsceRubrics())
          }}
        />
      )}
    </TabContent>
  )
}

export default RubricsTab

