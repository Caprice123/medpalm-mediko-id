import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  fetchSistemBlokTopics, fetchIlmuLintasSistemTopics,
  loadMoreSistemBlokTopics, loadMoreIlmuLintasSistemTopics,
} from '@store/atlasQuiz/userAction'

const FETCHERS = {
  sistemBlok: fetchSistemBlokTopics,
  ilmuLintasSistem: fetchIlmuLintasSistemTopics,
}

const LOAD_MORE_FETCHERS = {
  sistemBlok: loadMoreSistemBlokTopics,
  ilmuLintasSistem: loadMoreIlmuLintasSistemTopics,
}

export function useAtlasTopicSection(group) {
  const dispatch = useDispatch()
  const {
    sistemBlokTopics, sistemBlokPagination,
    ilmuLintasSistemTopics, ilmuLintasSistemPagination,
    loading,
  } = useSelector(s => s.atlasQuiz)

  const topics = group === 'sistemBlok' ? sistemBlokTopics : ilmuLintasSistemTopics
  const pagination = group === 'sistemBlok' ? sistemBlokPagination : ilmuLintasSistemPagination
  const isLoading = group === 'sistemBlok' ? loading.isFetchingSistemBlok : loading.isFetchingIlmuLintasSistem

  useEffect(() => {
    dispatch(FETCHERS[group](1))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, group])

  const handleLoadMore = () => dispatch(LOAD_MORE_FETCHERS[group]())

  return { topics, hasMore: !pagination.isLastPage, isLoading, handleLoadMore }
}
