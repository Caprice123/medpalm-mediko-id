import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import {
  fetchAdminSkripsiTemplates,
  loadMoreAdminSkripsiTemplates,
  deleteAdminSkripsiTemplate,
} from '@store/skripsi/v2'
import { actions } from '@store/skripsi/v2/reducer'

// The subtab's own state: the one list read, which template is open in the
// form, and which one is pending deletion.
export const useTemplatesPage = () => {
  const dispatch = useDispatch()
  const [pendingDeletion, setPendingDeletion] = useState(null)

  // Item counts shift on every write, so the list always reloads from page 1
  // rather than refetching whichever page it had accumulated to.
  useEffect(() => {
    dispatch(actions.setAdminTemplatesPagination({ page: 1 }))
    dispatch(fetchAdminSkripsiTemplates())
  }, [dispatch])

  const confirmDeletion = async () => {
    if (!pendingDeletion) return

    await dispatch(deleteAdminSkripsiTemplate(pendingDeletion.id))
    setPendingDeletion(null)
  }

  return {
    handleLoadMore: () => dispatch(loadMoreAdminSkripsiTemplates()),
    pendingDeletion,
    requestDeletion: setPendingDeletion,
    cancelDeletion: () => setPendingDeletion(null),
    confirmDeletion,
  }
}
