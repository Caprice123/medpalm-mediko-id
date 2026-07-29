import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchSistemBlokTopics, fetchIlmuLintasSistemTopics } from '@store/atlasQuiz/userAction'

export function useAtlasQuizHome() {
  const dispatch = useDispatch()
  const {
    sistemBlokTopics, sistemBlokPagination,
    ilmuLintasSistemTopics, ilmuLintasSistemPagination,
    loading,
  } = useSelector(state => state.atlasQuiz)

  useEffect(() => {
    dispatch(fetchSistemBlokTopics(1))
    dispatch(fetchIlmuLintasSistemTopics(1))
  }, [dispatch])

  const handleLoadMoreSistemBlok = () => {
    if (sistemBlokPagination.page < sistemBlokPagination.totalPages) {
      dispatch(fetchSistemBlokTopics(sistemBlokPagination.page + 1))
    }
  }

  const handleLoadMoreIlmuLintasSistem = () => {
    if (ilmuLintasSistemPagination.page < ilmuLintasSistemPagination.totalPages) {
      dispatch(fetchIlmuLintasSistemTopics(ilmuLintasSistemPagination.page + 1))
    }
  }

  return {
    sistemBlokTopics,
    sistemBlokPagination,
    ilmuLintasSistemTopics,
    ilmuLintasSistemPagination,
    isLoadingSistemBlok: loading.isFetchingSistemBlok,
    isLoadingIlmuLintasSistem: loading.isFetchingIlmuLintasSistem,
    handleLoadMoreSistemBlok,
    handleLoadMoreIlmuLintasSistem,
  }
}
