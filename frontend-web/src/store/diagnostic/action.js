import { actions } from '@store/diagnostic/reducer'
import Endpoints from '@config/endpoint'
import { getWithToken, postWithToken } from '@utils/requestUtils'

const {
  setLoading,
  setQuizzes,
  setPagination,
  setDetail,
} = actions

// Fetch all diagnostic quizzes (user)
export const fetchDiagnosticQuizzes = () => async (dispatch, getState) => {
  try {
    dispatch(setLoading({ key: 'isGetListDiagnosticQuizLoading', value: true }))

    const { filter, pagination } = getState().diagnostic

    const queryParams = {}
    if (filter.university) queryParams.university = filter.university
    if (filter.semester) queryParams.semester = filter.semester
    if (filter.search) queryParams.search = filter.search

    queryParams.page = filter.page || pagination.page
    queryParams.perPage = filter.perPage || pagination.perPage

    const route = Endpoints.api.diagnostic
    const response = await getWithToken(route, queryParams)

    dispatch(setQuizzes(response.data.data || []))
    dispatch(setPagination(response.data.pagination || { page: 1, perPage: 20, isLastPage: false }))
  } finally {
    dispatch(setLoading({ key: 'isGetListDiagnosticQuizLoading', value: false }))
  }
}

// Fetch single diagnostic quiz (user)
export const fetchDetailDiagnosticQuiz = (quizId) => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isGetDetailDiagnosticQuizLoading', value: true }))

    const route = Endpoints.api.diagnostic + `/${quizId}`
    const response = await getWithToken(route)

    const quiz = response.data.data || response.data.quiz
    dispatch(setDetail(quiz))
  } finally {
    dispatch(setLoading({ key: 'isGetDetailDiagnosticQuizLoading', value: false }))
  }
}

// Submit diagnostic quiz answers
export const submitDiagnosticQuizAnswers = (quizId, answers, onSuccess) => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isSubmitDiagnosticQuizLoading', value: true }))

    const route = Endpoints.api.diagnostic + `/${quizId}/submit`
    const response = await postWithToken(route, { answers })

    const result = response.data.data
    onSuccess(result)
  } finally {
    dispatch(setLoading({ key: 'isSubmitDiagnosticQuizLoading', value: false }))
  }
}
