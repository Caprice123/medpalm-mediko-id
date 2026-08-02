import { actions } from '@store/atlasQuiz/reducer'
import Endpoints from '@config/endpoint'
import { getWithToken } from '@utils/requestUtils'

const {
  appendSistemBlokTopics,
  appendIlmuLintasSistemTopics,
  setTopicDetail,
  setAtlasModelDetail, setAtlasModelRelatedQuizzes, setAtlasModelPrevNext,
  setAnatomyQuizDetail, setAnatomyQuizRelatedModels, setAnatomyQuizPrevNext,
  setModuleOptions,
  setTopicModules, appendTopicModules, setModulesFilter,
  setTopicAnatomyQuizzes, appendTopicAnatomyQuizzes, setQuizzesFilter,
  setLoading,
} = actions

export const fetchSistemBlokTopics = (page = 1) => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isFetchingSistemBlok', value: true }))
    const response = await getWithToken(Endpoints.api.atlasQuizTopics, { classification: 'sistem_blok', page })
    dispatch(appendSistemBlokTopics(response.data))
  } finally {
    dispatch(setLoading({ key: 'isFetchingSistemBlok', value: false }))
  }
}

export const fetchIlmuLintasSistemTopics = (page = 1) => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isFetchingIlmuLintasSistem', value: true }))
    const response = await getWithToken(Endpoints.api.atlasQuizTopics, { classification: 'ilmu_lintas_sistem', page })
    dispatch(appendIlmuLintasSistemTopics(response.data))
  } finally {
    dispatch(setLoading({ key: 'isFetchingIlmuLintasSistem', value: false }))
  }
}

export const loadMoreSistemBlokTopics = () => (dispatch, getState) => {
  const { sistemBlokPagination } = getState().atlasQuiz
  if (sistemBlokPagination.isLastPage) return
  dispatch(fetchSistemBlokTopics(sistemBlokPagination.page + 1))
}

export const loadMoreIlmuLintasSistemTopics = () => (dispatch, getState) => {
  const { ilmuLintasSistemPagination } = getState().atlasQuiz
  if (ilmuLintasSistemPagination.isLastPage) return
  dispatch(fetchIlmuLintasSistemTopics(ilmuLintasSistemPagination.page + 1))
}

export const fetchAtlasQuizTopicDetail = (slug) => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isFetchingTopicDetail', value: true }))
    const response = await getWithToken(Endpoints.api.atlasQuizTopic(slug))
    dispatch(setTopicDetail(response.data.data))
  } finally {
    dispatch(setLoading({ key: 'isFetchingTopicDetail', value: false }))
  }
}

export const fetchAtlasQuizAtlasModelDetail = (slug, uniqueId) => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isFetchingAtlasModelDetail', value: true }))
    const response = await getWithToken(Endpoints.api.atlasQuizAtlasModelDetail(slug, uniqueId))
    dispatch(setAtlasModelDetail(response.data.data))
  } finally {
    dispatch(setLoading({ key: 'isFetchingAtlasModelDetail', value: false }))
  }
}

export const fetchAtlasModelRelatedQuizzes = (sourceUniqueId) => async (dispatch) => {
  const res = await getWithToken(Endpoints.api.userContentRelations, {
    sourceType: 'atlas_model', sourceUniqueId, targetType: 'anatomy_quiz', relationType: 'feature_relation',
  })
  dispatch(setAtlasModelRelatedQuizzes(res.data.data || []))
}

export const fetchAtlasModelAdjacent = (sourceUniqueId) => async (dispatch) => {
  const res = await getWithToken(Endpoints.api.userContentRelations, {
    sourceType: 'atlas_model', sourceUniqueId, targetType: 'atlas_model',
  })
  const links = res.data.data || []
  dispatch(setAtlasModelPrevNext({
    prev: links.find(l => l.relationType === 'prev') ?? null,
    next: links.find(l => l.relationType === 'next') ?? null,
  }))
}

export const fetchAtlasQuizAnatomyQuizDetail = (slug, uniqueId) => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isFetchingAnatomyQuizDetail', value: true }))
    const response = await getWithToken(Endpoints.api.atlasQuizAnatomyQuizDetail(slug, uniqueId))
    dispatch(setAnatomyQuizDetail(response.data.data))
  } finally {
    dispatch(setLoading({ key: 'isFetchingAnatomyQuizDetail', value: false }))
  }
}

export const fetchAnatomyQuizRelatedModels = (sourceUniqueId) => async (dispatch) => {
  const res = await getWithToken(Endpoints.api.userContentRelations, {
    sourceType: 'anatomy_quiz', sourceUniqueId, targetType: 'atlas_model', relationType: 'feature_relation',
  })
  dispatch(setAnatomyQuizRelatedModels(res.data.data || []))
}

export const fetchAnatomyQuizAdjacent = (sourceUniqueId) => async (dispatch) => {
  const res = await getWithToken(Endpoints.api.userContentRelations, {
    sourceType: 'anatomy_quiz', sourceUniqueId, targetType: 'anatomy_quiz',
  })
  const links = res.data.data || []
  dispatch(setAnatomyQuizPrevNext({
    prev: links.find(l => l.relationType === 'prev') ?? null,
    next: links.find(l => l.relationType === 'next') ?? null,
  }))
}


export const fetchAtlasQuizModuleOptions = (slug) => async (dispatch) => {
  const response = await getWithToken(Endpoints.api.atlasQuizTopicModuleOptions(slug))
  dispatch(setModuleOptions(response.data.data))
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
