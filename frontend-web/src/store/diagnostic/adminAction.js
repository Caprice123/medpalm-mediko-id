import { actions } from '@store/diagnostic/reducer'
import Endpoints from '@config/endpoint'
import { handleApiError } from '@utils/errorUtils'
import { getWithToken, postWithToken, putWithToken, deleteWithToken } from '@utils/requestUtils'

const {
  setLoading,
  setQuizzes,
  setPagination,
  setDetail,
} = actions

export const fetchAdminDiagnosticQuizzes = () => async (dispatch, getState) => {
  try {
    dispatch(setLoading({ key: 'isGetListDiagnosticQuizLoading', value: true }))

    const { filter, pagination } = getState().diagnostic

    const queryParams = {}
    if (filter.university) queryParams.university = filter.university
    if (filter.semester) queryParams.semester = filter.semester
    if (filter.status) queryParams.status = filter.status
    if (filter.name) queryParams.search = filter.name

    queryParams.page = pagination.page
    queryParams.perPage = pagination.perPage

    const route = Endpoints.admin.diagnostic
    const response = await getWithToken(route, queryParams)

    dispatch(setQuizzes(response.data.data || []))
    dispatch(setPagination(response.data.pagination || { page: 1, perPage: 20, isLastPage: false }))
  } finally {
    dispatch(setLoading({ key: 'isGetListDiagnosticQuizLoading', value: false }))
  }
}

export const fetchAdminDiagnosticQuiz = (quizId, onSuccess) => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isGetDetailDiagnosticQuizLoading', value: true }))

    const route = Endpoints.admin.diagnostic + `/${quizId}`
    const response = await getWithToken(route)

    const quiz = response.data.data || response.data.quiz
    dispatch(setDetail(quiz))
    if (onSuccess) onSuccess(quiz)
    return quiz
  } finally {
    dispatch(setLoading({ key: 'isGetDetailDiagnosticQuizLoading', value: false }))
  }
}

export const createDiagnosticQuiz = (quizData, onSuccess) => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isCreateDiagnosticQuizLoading', value: true }))

    const route = Endpoints.admin.diagnostic
    await postWithToken(route, quizData)

    if (onSuccess) onSuccess()
  } finally {
    dispatch(setLoading({ key: 'isCreateDiagnosticQuizLoading', value: false }))
  }
}

export const updateDiagnosticQuiz = (quizId, quizData, onSuccess) => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isUpdateDiagnosticQuizLoading', value: true }))

    const route = Endpoints.admin.diagnostic + `/${quizId}`
    await putWithToken(route, quizData)

    if (onSuccess) onSuccess()
  } finally {
    dispatch(setLoading({ key: 'isUpdateDiagnosticQuizLoading', value: false }))
  }
}

export const deleteDiagnosticQuiz = (quizId) => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isDeleteDiagnosticQuizLoading', value: true }))

    const route = Endpoints.admin.diagnostic + `/${quizId}`
    await deleteWithToken(route)
  } finally {
    dispatch(setLoading({ key: 'isDeleteDiagnosticQuizLoading', value: false }))
  }
}
