import { actions as caseActions } from '@store/diagnosticCases/reducer'
import Endpoints from '@config/endpoint'
import { getWithToken, postWithToken, putWithToken, deleteWithToken, downloadWithToken } from '@utils/requestUtils'

const BASE = Endpoints.admin.diagnosticNodesV2

export const fetchDiagnosticAdminCases = (nodeId, { search = '', append = false } = {}) => async (dispatch, getState) => {
  try {
    dispatch(caseActions.setLoading({ isFetchingCases: true }))
    const { pagination } = getState().diagnosticCases
    const params = { page: pagination.page, perPage: pagination.perPage }
    if (search) params.search = search
    const res = await getWithToken(`${BASE}/${nodeId}/cases`, params)
    dispatch(append ? caseActions.appendCases(res.data.cases || []) : caseActions.setCases(res.data.cases || []))
    if (res.data.pagination) dispatch(caseActions.setPagination(res.data.pagination))
  } finally {
    dispatch(caseActions.setLoading({ isFetchingCases: false }))
  }
}

export const loadMoreDiagnosticAdminCases = (nodeId, search = '') => (dispatch, getState) => {
  const { pagination } = getState().diagnosticCases
  if (pagination.isLastPage) return
  dispatch(caseActions.setPagination({ page: pagination.page + 1 }))
  dispatch(fetchDiagnosticAdminCases(nodeId, { search, append: true }))
}

// Full case detail (image, case explanation, references, every question with its own
// explanations and linked notes) — fire-and-return, no Redux state. Used by
// CaseFormModal, which only gets the list row otherwise.
// nodeId is only part of the path for symmetry with the list route — the endpoint
// resolves a case by its own id, so the unlinked page can pass none.
export const fetchDiagnosticCaseDetail = (nodeId, caseId) => async () => {
  const res = await getWithToken(`${BASE}/${nodeId ?? 0}/cases/${caseId}`)
  return res.data.data
}

export const addDiagnosticCase = (nodeId, payload, onSuccess) => async (dispatch) => {
  try {
    dispatch(caseActions.setLoading({ isAddingCase: true }))
    await postWithToken(`${BASE}/${nodeId}/cases`, payload)
    onSuccess?.()
  } finally {
    dispatch(caseActions.setLoading({ isAddingCase: false }))
  }
}

export const updateDiagnosticCase = (nodeId, caseId, payload, onSuccess) => async (dispatch) => {
  try {
    dispatch(caseActions.setLoading({ isUpdatingCase: true }))
    await putWithToken(`${BASE}/${nodeId}/cases/${caseId}`, payload)
    onSuccess?.()
  } finally {
    dispatch(caseActions.setLoading({ isUpdatingCase: false }))
  }
}

export const deleteDiagnosticCase = (nodeId, caseId, onSuccess) => async (dispatch) => {
  try {
    dispatch(caseActions.setLoading({ isDeletingCase: true }))
    await deleteWithToken(`${BASE}/${nodeId}/cases/${caseId}`)
    onSuccess?.()
  } finally {
    dispatch(caseActions.setLoading({ isDeletingCase: false }))
  }
}

export const importDiagnosticCases = (nodeId, file, onSuccess) => async (dispatch) => {
  try {
    dispatch(caseActions.setLoading({ isImportingCases: true }))
    const formData = new FormData()
    formData.append('file', file)
    const res = await postWithToken(`${BASE}/${nodeId}/cases/import`, formData)
    onSuccess?.(res.data.data)
  } finally {
    dispatch(caseActions.setLoading({ isImportingCases: false }))
  }
}

export const downloadDiagnosticTemplate = () => async () => {
  const res = await downloadWithToken(`${BASE}/cases/template`)
  const url = URL.createObjectURL(new Blob([res.data]))
  const a = document.createElement('a')
  a.href = url
  a.download = 'template-kasus-diagnostik.xlsx'
  a.click()
  URL.revokeObjectURL(url)
}

// diagnostic_question → summary_note content_relations. Links stay per question even
// though the case is the card — fire-and-return, no Redux state.
export const fetchDiagnosticQuestionSummaryNoteRelations = (questionId) => async () => {
  const res = await getWithToken(Endpoints.admin.contentRelations, {
    sourceType: 'diagnostic_question', sourceId: questionId, targetType: 'summary_note',
  })
  return res.data.data || []
}

export const addDiagnosticQuestionSummaryNoteRelation = (questionId, noteId, label) => async () => {
  await postWithToken(Endpoints.admin.contentRelations, {
    sourceType: 'diagnostic_question', sourceId: questionId, targetType: 'summary_note', targetId: noteId, label,
  })
}

export const updateDiagnosticQuestionSummaryNoteRelationLabel = (relationId, label) => async () => {
  await putWithToken(`${Endpoints.admin.contentRelations}/${relationId}`, { label })
}

export const removeDiagnosticQuestionSummaryNoteRelation = (relationId) => async () => {
  await deleteWithToken(`${Endpoints.admin.contentRelations}/${relationId}`)
}

const QUIZ_BASE = Endpoints.admin.diagnosticQuizV2

export const fetchUnlinkedDiagnosticCases = ({ search = '', append = false } = {}) => async (dispatch, getState) => {
  try {
    dispatch(caseActions.setLoading({ isFetchingCases: true }))
    const { pagination } = getState().diagnosticCases
    const params = { page: pagination.page, perPage: pagination.perPage }
    if (search) params.search = search
    const res = await getWithToken(`${QUIZ_BASE}/unlinked`, params)
    dispatch(append ? caseActions.appendCases(res.data.data || []) : caseActions.setCases(res.data.data || []))
    if (res.data.pagination) dispatch(caseActions.setPagination(res.data.pagination))
  } finally {
    dispatch(caseActions.setLoading({ isFetchingCases: false }))
  }
}

export const loadMoreUnlinkedDiagnosticCases = (search = '') => (dispatch, getState) => {
  const { pagination } = getState().diagnosticCases
  if (pagination.isLastPage) return
  dispatch(caseActions.setPagination({ page: pagination.page + 1 }))
  dispatch(fetchUnlinkedDiagnosticCases({ search, append: true }))
}

export const moveUnlinkedDiagnosticCase = (caseId, nodeId, onSuccess) => async (dispatch) => {
  try {
    dispatch(caseActions.setLoading({ isMovingCase: true }))
    await putWithToken(`${QUIZ_BASE}/unlinked/${caseId}/assign`, { nodeId })
    onSuccess?.()
  } finally {
    dispatch(caseActions.setLoading({ isMovingCase: false }))
  }
}

export const moveLinkedDiagnosticCase = (caseId, nodeId, onSuccess) => async (dispatch) => {
  try {
    dispatch(caseActions.setLoading({ isMovingCase: true }))
    await putWithToken(`${QUIZ_BASE}/cases/${caseId}/move`, { nodeId })
    onSuccess?.()
  } finally {
    dispatch(caseActions.setLoading({ isMovingCase: false }))
  }
}

export const updateUnlinkedDiagnosticCase = (caseId, payload, onSuccess) => async (dispatch) => {
  try {
    dispatch(caseActions.setLoading({ isUpdatingCase: true }))
    await putWithToken(`${QUIZ_BASE}/unlinked/${caseId}`, payload)
    onSuccess?.()
  } finally {
    dispatch(caseActions.setLoading({ isUpdatingCase: false }))
  }
}

export const deleteUnlinkedDiagnosticCase = (caseId, onSuccess) => async (dispatch) => {
  try {
    dispatch(caseActions.setLoading({ isDeletingCase: true }))
    await deleteWithToken(`${QUIZ_BASE}/unlinked/${caseId}`)
    onSuccess?.()
  } finally {
    dispatch(caseActions.setLoading({ isDeletingCase: false }))
  }
}
