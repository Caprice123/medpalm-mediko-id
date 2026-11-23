import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { actions } from '@store/skripsi/v2/reducer'
import { loadMoreSkripsiTemplates, reloadSkripsiTemplates } from '@store/skripsi/v2'

// The catalogue, searched and paged.
//
// Server-side, like every other list in this project: an admin can publish any
// number of templates and each row carries its section list for the card, so
// filtering in the browser would mean downloading the whole catalogue to throw
// most of it away. The search runs when asked rather than per keystroke.
export const useTemplatePicker = () => {
  const dispatch = useDispatch()

  const templates = useSelector(state => state.skripsiV2.templates)
  const search = useSelector(state => state.skripsiV2.templateFilters.search)
  const pagination = useSelector(state => state.skripsiV2.templatePagination)
  const isFetching = useSelector(state => state.skripsiV2.loading.isFetchingTemplates)
  const isLoadingMore = useSelector(state => state.skripsiV2.loading.isLoadingMoreTemplates)

  // The term lives in Redux so the page's own fetch picks it up, which means
  // it outlives this page. Clearing it on mount keeps "Buat laporan baru" from
  // opening onto the filtered catalogue of a previous report.
  useEffect(() => {
    dispatch(actions.updateTemplateFilter({ key: 'search', value: '' }))
  }, [dispatch])

  return {
    templates,
    search,
    pagination,
    isFetching,
    isLoadingMore,
    setSearch: (event) => dispatch(
      actions.updateTemplateFilter({ key: 'search', value: event.target.value })
    ),
    applySearch: () => dispatch(reloadSkripsiTemplates()),
    loadMore: () => dispatch(loadMoreSkripsiTemplates()),
  }
}
