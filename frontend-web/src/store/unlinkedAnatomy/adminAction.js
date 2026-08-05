import { actions } from './reducer'
import Endpoints from '@config/endpoint'
import { getWithToken, putWithToken, deleteWithToken } from '@utils/requestUtils'

const { setQuizzes, appendQuizzes, setPagination, setLoading } = actions

export const fetchUnlinkedAnatomy = ({ search = '', append = false } = {}) => async (dispatch, getState) => {
  try {
    dispatch(setLoading({ isFetchingQuizzes: true }))
    const { pagination } = getState().unlinkedAnatomy
    const res = await getWithToken(Endpoints.admin.anatomyQuizzesUnlinked, { page: pagination.page, perPage: pagination.perPage, search })
    dispatch(append ? appendQuizzes(res.data.data || []) : setQuizzes(res.data.data || []))
    if (res.data.pagination) dispatch(setPagination(res.data.pagination))
  } finally {
    dispatch(setLoading({ isFetchingQuizzes: false }))
  }
}

export const loadMoreUnlinkedAnatomy = (search = '') => (dispatch, getState) => {
  const { pagination } = getState().unlinkedAnatomy
  if (pagination.isLastPage) return
  dispatch(setPagination({ page: pagination.page + 1 }))
  dispatch(fetchUnlinkedAnatomy({ search, append: true }))
}

export const deleteUnlinkedAnatomy = (uniqueId, onSuccess) => async (dispatch) => {
  try {
    dispatch(setLoading({ isDeletingQuiz: true }))
    await deleteWithToken(`${Endpoints.admin.anatomyQuizzesUnlinked}/${uniqueId}`)
    onSuccess?.()
  } finally {
    dispatch(setLoading({ isDeletingQuiz: false }))
  }
}

export const assignAnatomyToNode = (uniqueId, nodeId, onSuccess) => async (dispatch) => {
  try {
    dispatch(setLoading({ isAssigningQuiz: true }))
    await putWithToken(`${Endpoints.admin.anatomyQuizzesUnlinked}/${uniqueId}/assign`, { nodeId })
    onSuccess?.()
  } finally {
    dispatch(setLoading({ isAssigningQuiz: false }))
  }
}
