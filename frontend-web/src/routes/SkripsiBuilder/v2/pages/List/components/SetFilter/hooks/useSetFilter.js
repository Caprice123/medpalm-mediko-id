import { useDispatch, useSelector } from 'react-redux'
import { actions } from '@store/skripsi/v2/reducer'
import { reloadSets } from '@store/skripsi/v2'

export const useSetFilter = () => {
  const dispatch = useDispatch()
  const search = useSelector(state => state.skripsiV2.filters.search)
  const isFetching = useSelector(state => state.skripsiV2.loading.isFetchingSets)

  return {
    search,
    isFetching,
    setSearch: (value) => dispatch(actions.updateFilter({ key: 'search', value })),
    // Filtering is server-side and runs when the user asks, not per keystroke.
    applySearch: () => dispatch(reloadSets()),
  }
}
