import { actions } from './reducer'
import Endpoints from '@config/endpoint'
import { getWithToken, putWithToken, deleteWithToken } from '@utils/requestUtils'

const { setQuestions, setPagination, setLoading } = actions

export const fetchUnlinkedQuestions = (overrides = {}) => async (dispatch, getState) => {
  try {
    dispatch(setLoading({ isFetchingQuestions: true }))
    const { pagination } = getState().unlinkedQuestions
    const page = overrides.page ?? pagination.page
    const search = overrides.search ?? ''
    const res = await getWithToken(Endpoints.admin.mcqQuestionsUnlinked, { page, perPage: pagination.perPage, search })
    dispatch(setQuestions(res.data.data || []))
    if (res.data.pagination) dispatch(setPagination(res.data.pagination))
  } finally {
    dispatch(setLoading({ isFetchingQuestions: false }))
  }
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
