import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { actions } from '@store/chatbot/v2/adminReducer'
import {
  reloadAdminDomains,
  loadMoreAdminDomains,
  createAdminDomain,
  updateAdminDomain,
  deleteAdminDomain,
} from '@store/chatbot/v2/adminAction'

const SEARCH_DEBOUNCE_MS = 350

export const useDomainsPage = () => {
  const dispatch = useDispatch()
  const search = useSelector(state => state.chatbotAdminV2.domainFilters.search)

  const [newDomain, setNewDomain] = useState('')
  const [newJournal, setNewJournal] = useState('')
  const [pendingDeletion, setPendingDeletion] = useState(null)

  // Covers the first load and every later search; the list is refetched from
  // page 1 once typing stops rather than on each keystroke.
  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(reloadAdminDomains())
    }, SEARCH_DEBOUNCE_MS)

    return () => clearTimeout(timer)
  }, [dispatch, search])

  // Both halves are required: the domain filters the web search, the journal
  // name is what the research retriever actually matches on.
  const canAdd = Boolean(newDomain.trim()) && Boolean(newJournal.trim())

  const handleAdd = async () => {
    if (!canAdd) return

    await dispatch(createAdminDomain(newDomain.trim(), newJournal.trim()))
    setNewDomain('')
    setNewJournal('')
  }

  const confirmDeletion = async () => {
    if (!pendingDeletion) return

    await dispatch(deleteAdminDomain(pendingDeletion.id))
    setPendingDeletion(null)
  }

  return {
    search,
    setSearch: (value) => dispatch(actions.updateDomainFilter({ key: 'search', value })),
    newDomain,
    setNewDomain,
    newJournal,
    setNewJournal,
    canAdd,
    handleAdd,
    handleLoadMore: () => dispatch(loadMoreAdminDomains()),
    updateJournalName: (id, journalName) => dispatch(updateAdminDomain(id, { journal_name: journalName })),
    pendingDeletion,
    requestDeletion: setPendingDeletion,
    cancelDeletion: () => setPendingDeletion(null),
    confirmDeletion,
  }
}
