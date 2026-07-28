import { actions } from './reducer'
import Endpoints from '@config/endpoint'
import { getWithToken, putWithToken, deleteWithToken } from '@utils/requestUtils'

const { setQuizzes, setPagination, setLoading } = actions

export const fetchUnlinkedAnatomy = (overrides = {}) => async (dispatch, getState) => {
  try {
    dispatch(setLoading({ isFetchingQuizzes: true }))
    const { pagination } = getState().unlinkedAnatomy
    const page = overrides.page ?? pagination.page
    const search = overrides.search ?? ''
    const res = await getWithToken(Endpoints.admin.anatomyQuizzesUnlinked, { page, perPage: pagination.perPage, search })
    dispatch(setQuizzes(res.data.data || []))
    if (res.data.pagination) dispatch(setPagination(res.data.pagination))
  } finally {
    dispatch(setLoading({ isFetchingQuizzes: false }))
  }
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
