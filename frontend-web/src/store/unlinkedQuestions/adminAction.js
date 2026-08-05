import { actions } from './reducer'
import Endpoints from '@config/endpoint'
import { getWithToken, putWithToken, deleteWithToken } from '@utils/requestUtils'

const { setQuestions, appendQuestions, setPagination, setLoading } = actions

export const fetchUnlinkedQuestions = ({ search = '', append = false } = {}) => async (dispatch, getState) => {
  try {
    dispatch(setLoading({ isFetchingQuestions: true }))
    const { pagination } = getState().unlinkedQuestions
    const res = await getWithToken(Endpoints.admin.mcqQuestionsUnlinked, { page: pagination.page, perPage: pagination.perPage, search })
    dispatch(append ? appendQuestions(res.data.data || []) : setQuestions(res.data.data || []))
    if (res.data.pagination) dispatch(setPagination(res.data.pagination))
  } finally {
    dispatch(setLoading({ isFetchingQuestions: false }))
  }
}

export const loadMoreUnlinkedQuestions = (search = '') => (dispatch, getState) => {
  const { pagination } = getState().unlinkedQuestions
  if (pagination.isLastPage) return
  dispatch(setPagination({ page: pagination.page + 1 }))
  dispatch(fetchUnlinkedQuestions({ search, append: true }))
}

export const updateUnlinkedQuestion = (questionId, payload, onSuccess) => async (dispatch) => {
  try {
    dispatch(setLoading({ isUpdatingQuestion: true }))
    await putWithToken(`${Endpoints.admin.mcqQuestionsUnlinked}/${questionId}`, payload)
    onSuccess?.()
  } finally {
    dispatch(setLoading({ isUpdatingQuestion: false }))
  }
}

export const deleteUnlinkedQuestion = (questionId, onSuccess) => async (dispatch) => {
  try {
    dispatch(setLoading({ isDeletingQuestion: true }))
    await deleteWithToken(`${Endpoints.admin.mcqQuestionsUnlinked}/${questionId}`)
    onSuccess?.()
  } finally {
    dispatch(setLoading({ isDeletingQuestion: false }))
  }
}

export const assignQuestionToNode = (questionId, nodeId, onSuccess) => async (dispatch) => {
  try {
    dispatch(setLoading({ isAssigningQuestion: true }))
    await putWithToken(`${Endpoints.admin.mcqQuestionsUnlinked}/${questionId}/assign`, { nodeId })
    onSuccess?.()
  } finally {
    dispatch(setLoading({ isAssigningQuestion: false }))
  }
}
