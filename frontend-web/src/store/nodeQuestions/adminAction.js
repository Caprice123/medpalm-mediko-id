import { actions } from './reducer'
import Endpoints from '@config/endpoint'
import { getWithToken, postWithToken, putWithToken, deleteWithToken, downloadWithToken } from '@utils/requestUtils'

const { setQuestions, setPagination, setLoading } = actions

export const fetchNodeQuestions = (nodeId, overrides = {}) => async (dispatch, getState) => {
  try {
    dispatch(setLoading({ isFetchingQuestions: true }))
    const { pagination } = getState().nodeQuestions
    const page = overrides.page ?? pagination.page
    const res = await getWithToken(`${Endpoints.admin.featureNodes}/${nodeId}/questions`, {
      page,
      perPage: pagination.perPage,
    })
    dispatch(setQuestions(res.data.data || []))
    if (res.data.pagination) dispatch(setPagination(res.data.pagination))
  } finally {
    dispatch(setLoading({ isFetchingQuestions: false }))
  }
}

export const addNodeQuestion = (nodeId, payload, onSuccess) => async (dispatch) => {
  try {
    dispatch(setLoading({ isAddingQuestion: true }))
    await postWithToken(`${Endpoints.admin.featureNodes}/${nodeId}/questions`, payload)
    onSuccess?.()
  } finally {
    dispatch(setLoading({ isAddingQuestion: false }))
  }
}

export const updateNodeQuestion = (nodeId, questionId, payload, onSuccess) => async (dispatch) => {
  try {
    dispatch(setLoading({ isUpdatingQuestion: true }))
    await putWithToken(`${Endpoints.admin.featureNodes}/${nodeId}/questions/${questionId}`, payload)
    onSuccess?.()
  } finally {
    dispatch(setLoading({ isUpdatingQuestion: false }))
  }
}

export const deleteNodeQuestion = (nodeId, questionId, onSuccess) => async (dispatch) => {
  try {
    dispatch(setLoading({ isDeletingQuestion: true }))
    await deleteWithToken(`${Endpoints.admin.featureNodes}/${nodeId}/questions/${questionId}`)
    onSuccess?.()
  } finally {
    dispatch(setLoading({ isDeletingQuestion: false }))
  }
}

export const moveNodeQuestion = (nodeId, questionId, targetNodeId, onSuccess) => async (dispatch) => {
  try {
    dispatch(setLoading({ isMovingQuestion: true }))
    await putWithToken(`${Endpoints.admin.featureNodes}/${nodeId}/questions/${questionId}/move`, { targetNodeId })
    onSuccess?.()
  } finally {
    dispatch(setLoading({ isMovingQuestion: false }))
  }
}

export const importNodeQuestions = (nodeId, file, onSuccess) => async (dispatch) => {
  try {
    dispatch(setLoading({ isImportingQuestions: true }))
    const formData = new FormData()
    formData.append('file', file)
    const res = await postWithToken(`${Endpoints.admin.featureNodes}/${nodeId}/questions/import`, formData)
    onSuccess?.(res.data.data)
  } finally {
    dispatch(setLoading({ isImportingQuestions: false }))
  }
}

export const downloadQuestionsTemplate = () => async () => {
  const res = await downloadWithToken(`${Endpoints.admin.featureNodes}/questions/template`)
  const url = URL.createObjectURL(new Blob([res.data]))
  const a = document.createElement('a')
  a.href = url
  a.download = 'template-soal-mcq.xlsx'
  a.click()
  URL.revokeObjectURL(url)
}
