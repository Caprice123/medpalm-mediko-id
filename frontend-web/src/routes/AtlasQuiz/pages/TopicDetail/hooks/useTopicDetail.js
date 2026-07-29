import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  fetchAtlasQuizTopicDetail,
  fetchAtlasQuizModules,
  fetchAtlasQuizAnatomyQuizzes,
  fetchAtlasQuizModuleOptions,
  loadMoreModules,
  loadMoreQuizzes,
} from '@store/atlasQuiz/userAction'
import { actions } from '@store/atlasQuiz/reducer'

const { resetTopicDetail, setModulesFilter, setQuizzesFilter } = actions

export function useTopicDetail(slug) {
  const dispatch = useDispatch()
  const {
    topicDetail, topicModules, modulesPagination,
    topicAnatomyQuizzes, quizzesPagination,
    moduleOptions, loading,
  } = useSelector(s => s.atlasQuiz)

  useEffect(() => {
    if (!slug) return
    dispatch(resetTopicDetail())
    dispatch(fetchAtlasQuizTopicDetail(slug))
    dispatch(fetchAtlasQuizModuleOptions(slug))
    dispatch(fetchAtlasQuizModules(slug))
    dispatch(fetchAtlasQuizAnatomyQuizzes(slug))
  }, [dispatch, slug])

  const handleModuleFilterChange = (opt) => {
    dispatch(setModulesFilter({ module: opt?.value ?? null, page: 1 }))
    dispatch(fetchAtlasQuizModules(slug))
  }

  const handleLoadMoreModules = () => {
    dispatch(loadMoreModules(slug))
  }

  const handleQuizModuleFilterChange = (opt) => {
    dispatch(setQuizzesFilter({ module: opt?.value ?? null, page: 1 }))
    dispatch(fetchAtlasQuizAnatomyQuizzes(slug))
  }

  const handleLoadMoreQuizzes = () => {
    dispatch(loadMoreQuizzes(slug))
  }

  return {
    topic: topicDetail,
    modules: topicModules,
    modulesPagination,
    quizzes: topicAnatomyQuizzes,
    quizzesPagination,
    isLoadingTopic: loading.isFetchingTopicDetail,
    isLoadingModules: loading.isFetchingModules,
    isLoadingQuizzes: loading.isFetchingAnatomyQuizzes,
    moduleOptions,
    handleModuleFilterChange,
    handleLoadMoreModules,
    handleQuizModuleFilterChange,
    handleLoadMoreQuizzes,
  }
}
