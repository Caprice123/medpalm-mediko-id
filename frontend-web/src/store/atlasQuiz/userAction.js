import { actions } from '@store/atlasQuiz/reducer'
import Endpoints from '@config/endpoint'
import { handleApiError } from '@utils/errorUtils'
import { getWithToken } from '@utils/requestUtils'

const {
  setSistemBlokTopics, appendSistemBlokTopics,
  setIlmuLintasSistemTopics, appendIlmuLintasSistemTopics,
  setTopicDetail, setAtlasModelDetail, setAnatomyQuizDetail, setModuleOptions,
  setTopicModules, appendTopicModules, setModulesFilter,
  setTopicAnatomyQuizzes, appendTopicAnatomyQuizzes, setQuizzesFilter,
  setLoading,
} = actions

export const fetchSistemBlokTopics = (page = 1) => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isFetchingSistemBlok', value: true }))
    const response = await getWithToken(Endpoints.api.atlasQuizTopics, { classification: 'sistem_blok', page })
    dispatch(page > 1 ? appendSistemBlokTopics(response.data) : setSistemBlokTopics(response.data))
  } catch (err) {
    handleApiError(err, dispatch)
  } finally {
    dispatch(setLoading({ key: 'isFetchingSistemBlok', value: false }))
  }
}

export const fetchIlmuLintasSistemTopics = (page = 1) => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isFetchingIlmuLintasSistem', value: true }))
    const response = await getWithToken(Endpoints.api.atlasQuizTopics, { classification: 'ilmu_lintas_sistem', page })
    dispatch(page > 1 ? appendIlmuLintasSistemTopics(response.data) : setIlmuLintasSistemTopics(response.data))
  } catch (err) {
    handleApiError(err, dispatch)
  } finally {
    dispatch(setLoading({ key: 'isFetchingIlmuLintasSistem', value: false }))
  }
}

export const fetchAtlasQuizTopicDetail = (slug) => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isFetchingTopicDetail', value: true }))
    const response = await getWithToken(Endpoints.api.atlasQuizTopic(slug))
    dispatch(setTopicDetail(response.data.data))
  } catch (err) {
    handleApiError(err, dispatch)
  } finally {
    dispatch(setLoading({ key: 'isFetchingTopicDetail', value: false }))
  }
}

export const fetchUserContentRelations = (params) => async () => {
  const res = await getWithToken(Endpoints.api.userContentRelations, params)
  return res.data.data || []
}

export const fetchAtlasQuizAtlasModelDetail = (slug, uniqueId) => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isFetchingAtlasModelDetail', value: true }))
    const response = await getWithToken(Endpoints.api.atlasQuizAtlasModelDetail(slug, uniqueId))
    dispatch(setAtlasModelDetail(response.data.data))
  } catch (err) {
    handleApiError(err, dispatch)
  } finally {
    dispatch(setLoading({ key: 'isFetchingAtlasModelDetail', value: false }))
  }
}

export const fetchAtlasQuizAnatomyQuizDetail = (slug, uniqueId) => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isFetchingAnatomyQuizDetail', value: true }))
    const response = await getWithToken(Endpoints.api.atlasQuizAnatomyQuizDetail(slug, uniqueId))
    dispatch(setAnatomyQuizDetail(response.data.data))
  } catch (err) {
    handleApiError(err, dispatch)
  } finally {
    dispatch(setLoading({ key: 'isFetchingAnatomyQuizDetail', value: false }))
  }
}


export const fetchAtlasQuizModuleOptions = (slug) => async (dispatch) => {
  try {
    const response = await getWithToken(Endpoints.api.atlasQuizTopicModuleOptions(slug))
    dispatch(setModuleOptions(response.data.data))
  } catch (err) {
    handleApiError(err, dispatch)
  }
}

export const fetchAtlasQuizModules = (slug) => async (dispatch, getState) => {
  try {
    dispatch(setLoading({ key: 'isFetchingModules', value: true }))
    const { modulesFilter } = getState().atlasQuiz
    const params = { page: modulesFilter.page }
    if (modulesFilter.module) params.module = modulesFilter.module
    const response = await getWithToken(Endpoints.api.atlasQuizTopicAtlasModels(slug), params)
    const isAppend = modulesFilter.page > 1
    dispatch(isAppend ? appendTopicModules(response.data) : setTopicModules(response.data))
  } catch (err) {
    handleApiError(err, dispatch)
  } finally {
    dispatch(setLoading({ key: 'isFetchingModules', value: false }))
  }
}

export const updateModulesFilter = (slug, patch) => (dispatch) => {
  dispatch(setModulesFilter(patch))
  dispatch(fetchAtlasQuizModules(slug))
}

export const loadMoreModules = (slug) => (dispatch, getState) => {
  const { modulesPagination } = getState().atlasQuiz
  if (modulesPagination.isLastPage) return
  dispatch(setModulesFilter({ page: modulesPagination.page + 1 }))
  dispatch(fetchAtlasQuizModules(slug))
}

export const fetchAtlasQuizAnatomyQuizzes = (slug) => async (dispatch, getState) => {
  try {
    dispatch(setLoading({ key: 'isFetchingAnatomyQuizzes', value: true }))
    const { quizzesFilter } = getState().atlasQuiz
    const params = { page: quizzesFilter.page }
    if (quizzesFilter.module) params.module = quizzesFilter.module
    const response = await getWithToken(Endpoints.api.atlasQuizTopicAnatomyQuizzes(slug), params)
    const isAppend = quizzesFilter.page > 1
    dispatch(isAppend ? appendTopicAnatomyQuizzes(response.data) : setTopicAnatomyQuizzes(response.data))
  } catch (err) {
    handleApiError(err, dispatch)
  } finally {
    dispatch(setLoading({ key: 'isFetchingAnatomyQuizzes', value: false }))
  }
}

export const updateQuizzesFilter = (slug, patch) => (dispatch) => {
  dispatch(setQuizzesFilter(patch))
  dispatch(fetchAtlasQuizAnatomyQuizzes(slug))
}

export const loadMoreQuizzes = (slug) => (dispatch, getState) => {
  const { quizzesPagination } = getState().atlasQuiz
  if (quizzesPagination.isLastPage) return
  dispatch(setQuizzesFilter({ page: quizzesPagination.page + 1 }))
  dispatch(fetchAtlasQuizAnatomyQuizzes(slug))
}
