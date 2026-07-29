import { actions } from '@store/anatomy/reducer'
import Endpoints from '@config/endpoint'
import { handleApiError } from '@utils/errorUtils'
import { getWithToken, postWithToken, putWithToken, deleteWithToken } from '@utils/requestUtils'

const {
  setLoading,
  setQuizzes,
  setPagination,
  setDetail,
  setQuizRelations,
  setSearchedAnatomyQuizzes,
} = actions

export const fetchAdminAnatomyQuizzes = () => async (dispatch, getState) => {
  try {
    dispatch(setLoading({ key: 'isGetListAnatomyQuizLoading', value: true }))

    const { filter, pagination } = getState().anatomy

    const queryParams = {}
    if (filter.topic) queryParams.topic = filter.topic
    
    if (filter.status) queryParams.status = filter.status
    if (filter.name) queryParams.search = filter.name

    queryParams.page = pagination.page
    queryParams.perPage = pagination.perPage

    const route = Endpoints.admin.anatomy
    const response = await getWithToken(route, queryParams)

    dispatch(setQuizzes(response.data.data || []))
    dispatch(setPagination(response.data.pagination || { page: 1, perPage: 20, isLastPage: false }))
  } finally {
    dispatch(setLoading({ key: 'isGetListAnatomyQuizLoading', value: false }))
  }
}

export const fetchAdminAnatomyQuiz = (quizId, onSuccess) => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isGetDetailAnatomyQuizLoading', value: true }))

    const route = Endpoints.admin.anatomy + `/${quizId}`
    const response = await getWithToken(route)

    const quiz = response.data.data || response.data.quiz
    dispatch(setDetail(quiz))
    if (onSuccess) onSuccess(quiz)
    return quiz
  } finally {
    dispatch(setLoading({ key: 'isGetDetailAnatomyQuizLoading', value: false }))
  }
}

export const createAnatomyQuiz = (quizData, onSuccess) => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isCreateAnatomyQuizLoading', value: true }))

    const route = Endpoints.admin.anatomy
    await postWithToken(route, quizData)

    if (onSuccess) onSuccess()
  } finally {
    dispatch(setLoading({ key: 'isCreateAnatomyQuizLoading', value: false }))
  }
}

export const updateAnatomyQuiz = (quizId, quizData, onSuccess) => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isUpdateAnatomyQuizLoading', value: true }))

    const route = Endpoints.admin.anatomy + `/${quizId}`
    await putWithToken(route, quizData)

    if (onSuccess) onSuccess()
  } finally {
    dispatch(setLoading({ key: 'isUpdateAnatomyQuizLoading', value: false }))
  }
}

export const deleteAnatomyQuiz = (quizId) => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isDeleteAnatomyQuizLoading', value: true }))

    const route = Endpoints.admin.anatomy + `/${quizId}`
    await deleteWithToken(route)
  } finally {
    dispatch(setLoading({ key: 'isDeleteAnatomyQuizLoading', value: false }))
  }
}

export const createAnatomyQuizV2 = (quizData, onSuccess) => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isCreateAnatomyQuizLoading', value: true }))
    await postWithToken(Endpoints.admin.anatomyV2, quizData)
    if (onSuccess) onSuccess()
  } finally {
    dispatch(setLoading({ key: 'isCreateAnatomyQuizLoading', value: false }))
  }
}

export const fetchAnatomyQuizRelations = (uniqueId) => async (dispatch) => {
  dispatch(setLoading({ key: 'isFetchingQuizRelations', value: true }))
  try {
    const res = await getWithToken(Endpoints.admin.anatomyQuizRelations(uniqueId))
    dispatch(setQuizRelations(res.data.data || []))
  } finally {
    dispatch(setLoading({ key: 'isFetchingQuizRelations', value: false }))
  }
}

export const addAnatomyQuizRelation = (sourceUniqueId, targetUniqueId, onSuccess) => async (dispatch) => {
  dispatch(setLoading({ key: 'isAddingQuizRelation', value: true }))
  try {
    await postWithToken(Endpoints.admin.anatomyQuizRelations(sourceUniqueId), { targetUniqueId })
    if (onSuccess) onSuccess()
  } finally {
    dispatch(setLoading({ key: 'isAddingQuizRelation', value: false }))
  }
}

export const removeAnatomyQuizRelation = (sourceUniqueId, relationId, onSuccess) => async (dispatch) => {
  dispatch(setLoading({ key: 'isDeletingQuizRelation', value: true }))
  try {
    await deleteWithToken(Endpoints.admin.anatomyQuizRelations(sourceUniqueId) + `/${relationId}`)
    if (onSuccess) onSuccess()
  } finally {
    dispatch(setLoading({ key: 'isDeletingQuizRelation', value: false }))
  }
}

export const searchAnatomyQuizzesForRelation = (search) => async (dispatch) => {
  dispatch(setLoading({ key: 'isSearchingAnatomyQuizzes', value: true }))
  try {
    const res = await getWithToken(Endpoints.admin.anatomy, { search, perPage: 10, page: 1 })
    dispatch(setSearchedAnatomyQuizzes(res.data.data || []))
  } finally {
    dispatch(setLoading({ key: 'isSearchingAnatomyQuizzes', value: false }))
  }
}
