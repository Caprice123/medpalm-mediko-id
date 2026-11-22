import { useDispatch, useSelector } from 'react-redux'
import { actions } from '@store/skripsi/v2/reducer'
import { reloadAdminSkripsiTemplates } from '@store/skripsi/v2'

// The search box above the template list. What is typed lives in the store, so
// a reload triggered by a save or a delete keeps filtering by the same thing.
export const useTemplateFilter = () => {
  const dispatch = useDispatch()

  const search = useSelector(state => state.skripsiV2.adminTemplatesFilter.search)
  const isFetching = useSelector(state => state.skripsiV2.loading.isFetchingAdminTemplates)

  return {
    search,
    setSearch: (value) => dispatch(actions.updateAdminTemplatesFilter({ key: 'search', value })),
    isFetching,
    applyFilters: () => dispatch(reloadAdminSkripsiTemplates()),
  }
}
