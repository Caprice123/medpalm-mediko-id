import { actions } from '@store/anatomy/reducer'
import Endpoints from '@config/endpoint'
import { handleApiError } from '@utils/errorUtils'
import { getWithToken, postWithToken, putWithToken, deleteWithToken } from '@utils/requestUtils'

const {
  setLoading,
  setQuizzes,
  setPagination,
  setDetail,
} = actions

export const fetchAdminAnatomyQuizzes = () => async (dispatch, getState) => {
  try {
    dispatch(setLoading({ key: 'isGetListAnatomyQuizLoading', value: true }))

    const { filter, pagination } = getState().anatomy

    const queryParams = {}
    if (filter.university) queryParams.university = filter.university
    if (filter.semester) queryParams.semester = filter.semester
    if (filter.status) queryParams.status = filter.status
    if (filter.name) queryParams.search = filter.name

    // Add pagination parameters
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

    // Refresh the list and close modal
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

    // Refresh the list to show updated quiz
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
