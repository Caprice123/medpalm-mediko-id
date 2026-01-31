import { actions } from '@store/anatomy/reducer'
import Endpoints from '@config/endpoint'
import { handleApiError } from '@utils/errorUtils'
import { getWithToken, postWithToken } from '@utils/requestUtils'

const {
  setLoading,
  setQuizzes,
  setPagination,
  setDetail,
} = actions

// Fetch all anatomy quizzes (user)
export const fetchAnatomyQuizzes = () => async (dispatch, getState) => {
  try {
    dispatch(setLoading({ key: 'isGetListAnatomyQuizLoading', value: true }))

    const { filter, pagination } = getState().anatomy

    const queryParams = {}
    if (filter.university) queryParams.university = filter.university
    if (filter.semester) queryParams.semester = filter.semester
    if (filter.search) queryParams.search = filter.search

    // Add pagination parameters
    queryParams.page = filter.page || pagination.page
    queryParams.perPage = filter.perPage || pagination.perPage

    const route = Endpoints.api.anatomy
    const response = await getWithToken(route, queryParams)

    dispatch(setQuizzes(response.data.data || []))
    dispatch(setPagination(response.data.pagination || { page: 1, perPage: 20, isLastPage: false }))
  } finally {
    dispatch(setLoading({ key: 'isGetListAnatomyQuizLoading', value: false }))
  }
}

// Fetch single anatomy quiz (user)
export const fetchDetailAnatomyQuiz = (quizId) => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isGetDetailAnatomyQuizLoading', value: true }))

    const route = Endpoints.api.anatomy + `/${quizId}`
    const response = await getWithToken(route)

    const quiz = response.data.data || response.data.quiz
    dispatch(setDetail(quiz))
  } finally {
    dispatch(setLoading({ key: 'isGetDetailAnatomyQuizLoading', value: false }))
  }
}

// Submit anatomy quiz answers
export const submitAnatomyQuizAnswers = (quizId, answers) => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isSubmitAnatomyQuizLoading', value: true }))

    const route = Endpoints.api.anatomy + `/${quizId}/submit`
    const response = await postWithToken(route, { answers })

    const result = response.data.data
    return result
  } finally {
    dispatch(setLoading({ key: 'isSubmitAnatomyQuizLoading', value: false }))
  }
}
