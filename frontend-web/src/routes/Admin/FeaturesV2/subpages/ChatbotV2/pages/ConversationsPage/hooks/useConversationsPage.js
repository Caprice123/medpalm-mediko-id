import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  reloadAdminConversations,
  loadMoreAdminConversations,
  deleteAdminConversation,
} from '@store/chatbot/v2/adminAction'

export const useConversationsPage = () => {
  const dispatch = useDispatch()
  const pagination = useSelector(state => state.chatbotAdminV2.pagination)

  const [openedConversation, setOpenedConversation] = useState(null)
  const [pendingDeletion, setPendingDeletion] = useState(null)

  useEffect(() => {
    dispatch(reloadAdminConversations())
  }, [dispatch])

  const handleLoadMore = () => dispatch(loadMoreAdminConversations())

  const confirmDeletion = async () => {
    if (!pendingDeletion) return

    await dispatch(deleteAdminConversation(pendingDeletion.uniqueId))
    setPendingDeletion(null)

    // Deleting shifts every later row up a place, so an accumulated list cannot
    // just drop the row and keep its page counter — reload from page 1.
    dispatch(reloadAdminConversations())
  }

  return {
    pagination,
    openedConversation,
    openConversation: setOpenedConversation,
    closeConversation: () => setOpenedConversation(null),
    pendingDeletion,
    requestDeletion: setPendingDeletion,
    cancelDeletion: () => setPendingDeletion(null),
    confirmDeletion,
    handleLoadMore,
  }
}
