import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchSistemBlokTopics, fetchIlmuLintasSistemTopics } from '@store/atlasQuiz/userAction'

const FETCHERS = {
  sistemBlok: fetchSistemBlokTopics,
  ilmuLintasSistem: fetchIlmuLintasSistemTopics,
}

export function useAtlasTopicSection(group) {
  const dispatch = useDispatch()
  const {
    sistemBlokTopics, sistemBlokPagination,
    ilmuLintasSistemTopics, ilmuLintasSistemPagination,
    loading,
  } = useSelector(s => s.atlasQuiz)

  const fetchTopics = FETCHERS[group]
  const topics = group === 'sistemBlok' ? sistemBlokTopics : ilmuLintasSistemTopics
  const pagination = group === 'sistemBlok' ? sistemBlokPagination : ilmuLintasSistemPagination
  const isLoading = group === 'sistemBlok' ? loading.isFetchingSistemBlok : loading.isFetchingIlmuLintasSistem

  useEffect(() => {
    dispatch(fetchTopics(1))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, group])

  const handleLoadMore = () => {
    if (pagination.page < pagination.totalPages) dispatch(fetchTopics(pagination.page + 1))
  }

  return { topics, pagination, isLoading, handleLoadMore }
}
