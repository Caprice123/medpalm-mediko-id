import { useDispatch, useSelector } from 'react-redux'
import { actions } from '@store/chatbot/v2/adminReducer'
import { reloadAdminConversations } from '@store/chatbot/v2/adminAction'

export const useConversationFilter = () => {
  const dispatch = useDispatch()
  const filters = useSelector(state => state.chatbotAdminV2.filters)
  const isFetching = useSelector(state => state.chatbotAdminV2.loading.isFetchingConversations)

  const setFilter = (key) => (value) => dispatch(actions.updateFilter({ key, value }))

  return {
    search: filters.search,
    userId: filters.userId,
    setSearch: setFilter('search'),
    setUserId: setFilter('userId'),
    isFetching,
    applyFilters: () => dispatch(reloadAdminConversations()),
  }
}
