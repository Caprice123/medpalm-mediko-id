import { actions } from './reducer'
import Endpoints from '@config/endpoint'
import { getWithToken, postWithToken, putWithToken, deleteWithToken, downloadWithToken } from '@utils/requestUtils'

const { setCards, appendCards, setPagination, setLoading } = actions

export const fetchNodeCards = (nodeId, { append = false } = {}) => async (dispatch, getState) => {
  try {
    dispatch(setLoading({ isFetchingCards: true }))
    const { pagination } = getState().nodeCards
    const res = await getWithToken(`${Endpoints.admin.featureNodes}/${nodeId}/cards`, {
      page: pagination.page,
      perPage: pagination.perPage,
    })
    dispatch(append ? appendCards(res.data.data || []) : setCards(res.data.data || []))
    if (res.data.pagination) dispatch(setPagination(res.data.pagination))
  } finally {
    dispatch(setLoading({ isFetchingCards: false }))
  }
}

export const loadMoreNodeCards = (nodeId) => (dispatch, getState) => {
  const { pagination } = getState().nodeCards
  if (pagination.isLastPage) return
  dispatch(setPagination({ page: pagination.page + 1 }))
  dispatch(fetchNodeCards(nodeId, { append: true }))
}

// Full card detail (image, explanations, references, cloze/occlusion data) — fire-and-return,
// no Redux state. Used by CardFormModal/CardPreviewModal, which only get the lightweight list
// row (id/type/front/back) from the table.
export const fetchNodeCardDetail = (nodeId, cardId) => async () => {
  const res = await getWithToken(`${Endpoints.admin.featureNodes}/${nodeId}/cards/${cardId}`)
  return res.data.data
}

export const addNodeCard = (nodeId, payload, onSuccess) => async (dispatch) => {
  try {
    dispatch(setLoading({ isAddingCard: true }))
    await postWithToken(`${Endpoints.admin.featureNodes}/${nodeId}/cards`, payload)
    onSuccess?.()
  } finally {
    dispatch(setLoading({ isAddingCard: false }))
  }
}

export const updateNodeCard = (nodeId, cardId, payload, onSuccess) => async (dispatch) => {
  try {
    dispatch(setLoading({ isUpdatingCard: true }))
    await putWithToken(`${Endpoints.admin.featureNodes}/${nodeId}/cards/${cardId}`, payload)
    onSuccess?.()
  } finally {
    dispatch(setLoading({ isUpdatingCard: false }))
  }
}

export const deleteNodeCard = (nodeId, cardId, onSuccess) => async (dispatch) => {
  try {
    dispatch(setLoading({ isDeletingCard: true }))
    await deleteWithToken(`${Endpoints.admin.featureNodes}/${nodeId}/cards/${cardId}`)
    onSuccess?.()
  } finally {
    dispatch(setLoading({ isDeletingCard: false }))
  }
}

export const moveNodeCard = (nodeId, cardId, targetNodeId, onSuccess) => async (dispatch) => {
  try {
    dispatch(setLoading({ isMovingCard: true }))
    await putWithToken(`${Endpoints.admin.featureNodes}/${nodeId}/cards/${cardId}/move`, { targetNodeId })
    onSuccess?.()
  } finally {
    dispatch(setLoading({ isMovingCard: false }))
  }
}

export const importNodeCards = (nodeId, file, onSuccess) => async (dispatch) => {
  try {
    dispatch(setLoading({ isImportingCards: true }))
    const formData = new FormData()
    formData.append('file', file)
    const res = await postWithToken(`${Endpoints.admin.featureNodes}/${nodeId}/cards/import`, formData)
    onSuccess?.(res.data.data)
  } finally {
    dispatch(setLoading({ isImportingCards: false }))
  }
}

// flashcard_card → summary_note content_relations — fire-and-return, no Redux state
export const fetchCardSummaryNoteRelations = (cardId) => async () => {
  const res = await getWithToken(Endpoints.admin.contentRelations, {
    sourceType: 'flashcard_card', sourceId: cardId, targetType: 'summary_note',
  })
  return res.data.data || []
}

export const addCardSummaryNoteRelation = (cardId, noteId, label) => async () => {
  await postWithToken(Endpoints.admin.contentRelations, {
    sourceType: 'flashcard_card', sourceId: cardId, targetType: 'summary_note', targetId: noteId, label,
  })
}

export const updateCardSummaryNoteRelationLabel = (relationId, label) => async () => {
  await putWithToken(`${Endpoints.admin.contentRelations}/${relationId}`, { label })
}

export const removeCardSummaryNoteRelation = (relationId) => async () => {
  await deleteWithToken(`${Endpoints.admin.contentRelations}/${relationId}`)
}

export const downloadCardsTemplate = () => async () => {
  const res = await downloadWithToken(`${Endpoints.admin.featureNodes}/cards/template`)
  const url = URL.createObjectURL(new Blob([res.data]))
  const a = document.createElement('a')
  a.href = url
  a.download = 'template-kartu-flashcard.xlsx'
  a.click()
  URL.revokeObjectURL(url)
}
