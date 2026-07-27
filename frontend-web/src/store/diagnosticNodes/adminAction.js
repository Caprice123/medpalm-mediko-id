import { actions as questionActions } from '@store/nodeQuestions/reducer'
import Endpoints from '@config/endpoint'
import { getWithToken, postWithToken, putWithToken, deleteWithToken, downloadWithToken } from '@utils/requestUtils'

const BASE = Endpoints.admin.diagnosticNodesV2

export const fetchDiagnosticAdminQuestions = (nodeId, overrides = {}) => async (dispatch, getState) => {
  try {
    dispatch(questionActions.setLoading({ isFetchingQuestions: true }))
    const { pagination } = getState().nodeQuestions
    const page = overrides.page ?? pagination.page
    const res = await getWithToken(`${BASE}/${nodeId}/questions`, { page, perPage: pagination.perPage })
    dispatch(questionActions.setQuestions(res.data.questions || []))
    if (res.data.pagination) dispatch(questionActions.setPagination(res.data.pagination))
  } finally {
    dispatch(questionActions.setLoading({ isFetchingQuestions: false }))
  }
}

export const addDiagnosticQuestion = (nodeId, payload, onSuccess) => async (dispatch) => {
  try {
    dispatch(questionActions.setLoading({ isAddingQuestion: true }))
    await postWithToken(`${BASE}/${nodeId}/questions`, payload)
    onSuccess?.()
  } finally {
    dispatch(questionActions.setLoading({ isAddingQuestion: false }))
  }
}

export const updateDiagnosticQuestion = (nodeId, questionId, payload, onSuccess) => async (dispatch) => {
  try {
    dispatch(questionActions.setLoading({ isUpdatingQuestion: true }))
    await putWithToken(`${BASE}/${nodeId}/questions/${questionId}`, payload)
    onSuccess?.()
  } finally {
    dispatch(questionActions.setLoading({ isUpdatingQuestion: false }))
  }
}

export const deleteDiagnosticQuestion = (nodeId, questionId, onSuccess) => async (dispatch) => {
  try {
    dispatch(questionActions.setLoading({ isDeletingQuestion: true }))
    await deleteWithToken(`${BASE}/${nodeId}/questions/${questionId}`)
    onSuccess?.()
  } finally {
    dispatch(questionActions.setLoading({ isDeletingQuestion: false }))
  }
}

export const importDiagnosticQuestions = (nodeId, file, onSuccess) => async (dispatch) => {
  try {
    dispatch(questionActions.setLoading({ isImportingQuestions: true }))
    const formData = new FormData()
    formData.append('file', file)
    const res = await postWithToken(`${BASE}/${nodeId}/questions/import`, formData)
    onSuccess?.(res.data.data)
  } finally {
    dispatch(questionActions.setLoading({ isImportingQuestions: false }))
  }
}

export const downloadDiagnosticTemplate = () => async () => {
  const res = await downloadWithToken(`${BASE}/questions/template`)
  const url = URL.createObjectURL(new Blob([res.data]))
  const a = document.createElement('a')
  a.href = url
  a.download = 'template-soal-diagnostik.xlsx'
  a.click()
  URL.revokeObjectURL(url)
}

const QUIZ_BASE = Endpoints.admin.diagnosticQuizV2

export const fetchUnlinkedDiagnosticQuestions = (overrides = {}) => async (dispatch, getState) => {
  try {
    dispatch(questionActions.setLoading({ isFetchingQuestions: true }))
    const { pagination } = getState().nodeQuestions
    const page = overrides.page ?? 1
    const params = { page, perPage: pagination.perPage }
    if (overrides.search) params.search = overrides.search
    const res = await getWithToken(`${QUIZ_BASE}/unlinked`, params)
    dispatch(questionActions.setQuestions(res.data.data || []))
    if (res.data.pagination) dispatch(questionActions.setPagination(res.data.pagination))
  } finally {
    dispatch(questionActions.setLoading({ isFetchingQuestions: false }))
  }
}

export const moveUnlinkedDiagnosticQuestion = (questionId, nodeId, onSuccess) => async (dispatch) => {
  try {
    dispatch(questionActions.setLoading({ isMovingQuestion: true }))
    await putWithToken(`${QUIZ_BASE}/unlinked/${questionId}/assign`, { nodeId })
    onSuccess?.()
  } finally {
    dispatch(questionActions.setLoading({ isMovingQuestion: false }))
  }
}

export const moveLinkedDiagnosticQuestion = (questionId, nodeId, onSuccess) => async (dispatch) => {
  try {
    dispatch(questionActions.setLoading({ isMovingQuestion: true }))
    await putWithToken(`${QUIZ_BASE}/questions/${questionId}/move`, { nodeId })
    onSuccess?.()
  } finally {
    dispatch(questionActions.setLoading({ isMovingQuestion: false }))
  }
}

export const updateUnlinkedDiagnosticQuestion = (questionId, payload, onSuccess) => async (dispatch) => {
  try {
    dispatch(questionActions.setLoading({ isUpdatingQuestion: true }))
    await putWithToken(`${QUIZ_BASE}/unlinked/${questionId}`, payload)
    onSuccess?.()
  } finally {
    dispatch(questionActions.setLoading({ isUpdatingQuestion: false }))
  }
}

export const deleteUnlinkedDiagnosticQuestion = (questionId, onSuccess) => async (dispatch) => {
  try {
    dispatch(questionActions.setLoading({ isDeletingQuestion: true }))
    await deleteWithToken(`${QUIZ_BASE}/unlinked/${questionId}`)
    onSuccess?.()
  } finally {
    dispatch(questionActions.setLoading({ isDeletingQuestion: false }))
  }
}

