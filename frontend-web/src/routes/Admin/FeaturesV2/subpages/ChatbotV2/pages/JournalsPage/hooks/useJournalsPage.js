import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { actions } from '@store/chatbot/v2/adminReducer'
import {
  reloadAdminJournals,
  loadMoreAdminJournals,
  createAdminJournal,
  deleteAdminJournal,
} from '@store/chatbot/v2/adminAction'

const SEARCH_DEBOUNCE_MS = 350

export const useJournalsPage = () => {
  const dispatch = useDispatch()
  const search = useSelector(state => state.chatbotAdminV2.journalFilters.search)

  const [newJournal, setNewJournal] = useState('')
  const [pendingDeletion, setPendingDeletion] = useState(null)

  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(reloadAdminJournals())
    }, SEARCH_DEBOUNCE_MS)

    return () => clearTimeout(timer)
  }, [dispatch, search])

  const canAdd = Boolean(newJournal.trim())

  const handleAdd = async () => {
    if (!canAdd) return

    await dispatch(createAdminJournal(newJournal.trim()))
    setNewJournal('')
  }

  const confirmDeletion = async () => {
    if (!pendingDeletion) return

    await dispatch(deleteAdminJournal(pendingDeletion.id))
    setPendingDeletion(null)
  }

  return {
    search,
    setSearch: (value) => dispatch(actions.updateJournalFilter({ key: 'search', value })),
    newJournal,
    setNewJournal,
    canAdd,
    handleAdd,
    handleLoadMore: () => dispatch(loadMoreAdminJournals()),
    pendingDeletion,
    requestDeletion: setPendingDeletion,
    cancelDeletion: () => setPendingDeletion(null),
    confirmDeletion,
  }
}
