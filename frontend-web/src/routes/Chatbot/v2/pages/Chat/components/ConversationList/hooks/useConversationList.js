import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { actions } from '@store/chatbot/v2/reducer'
import {
  reloadConversations,
  loadMoreConversations,
  createConversation,
} from '@store/chatbot/v2'

const SEARCH_DEBOUNCE_MS = 400

export const useConversationList = () => {
  const dispatch = useDispatch()
  const search = useSelector(state => state.chatbotV2.filters.search)

  // One effect covers both the first load and every later search: the search
  // box writes straight to Redux, and this refetches from page 1 once the user
  // has stopped typing. Firing per keystroke would spend a request per letter.
  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(reloadConversations())
    }, SEARCH_DEBOUNCE_MS)

    return () => clearTimeout(timer)
  }, [dispatch, search])

  const handleSearchChange = (event) => {
    dispatch(actions.updateFilter({ key: 'search', value: event.target.value }))
  }

  const handleSelect = (uniqueId) => {
    dispatch(actions.setActiveConversationId(uniqueId))
  }

  const handleLoadMore = () => {
    dispatch(loadMoreConversations())
  }

  // A new thread opens immediately under a placeholder name; the title is
  // editable in the panel header, so there is nothing to fill in first.
  const handleNewConversation = async () => {
    const conversation = await dispatch(createConversation('Percakapan Baru', 'normal'))
    if (conversation?.uniqueId) {
      dispatch(actions.setActiveConversationId(conversation.uniqueId))
    }
  }

  return {
    search,
    handleSearchChange,
    handleSelect,
    handleLoadMore,
    handleNewConversation,
  }
}
