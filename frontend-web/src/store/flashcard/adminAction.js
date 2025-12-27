import { actions } from '@store/flashcard/reducer'
import Endpoints from '@config/endpoint'
import { handleApiError } from '@utils/errorUtils'
import { getWithToken, postWithToken, putWithToken, deleteWithToken } from '../../utils/requestUtils'

const {
  setLoading,
  setDecks,
  setDetail,
  updatePagination,
} = actions

export const fetchAdminFlashcardDecks = () => async (dispatch, getState) => {
  try {
    dispatch(setLoading({ key: 'isGetListDecksLoading', value: true }))

    const { filters, pagination } = getState().flashcard
    const queryParams = {
      page: pagination.page,
      perPage: pagination.perPage
    }
    if (filters.university) queryParams.university = filters.university
    if (filters.semester) queryParams.semester = filters.semester

    const route = Endpoints.admin.flashcards
    const response = await getWithToken(route, queryParams)

    const decks = response.data.data || []
    const paginationData = response.data.pagination

    dispatch(setDecks(decks))
    if (paginationData) {
      dispatch(updatePagination(paginationData))
    }
  } catch (err) {
    handleApiError(err, dispatch)
  } finally {
    dispatch(setLoading({ key: 'isGetListDecksLoading', value: false }))
  }
}

export const fetchFlashcardDeck = (deckId, onSuccess) => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isGetDetailFlashcardDeckLoading', value: true }))

    const route = Endpoints.admin.flashcards + `/${deckId}`
    const response = await getWithToken(route)

    const deck = response.data.data || response.data.deck
    dispatch(setDetail(deck))
    if (onSuccess) onSuccess()
    return deck
  } catch (err) {
    handleApiError(err, dispatch)
  } finally {
    dispatch(setLoading({ key: 'isGetDetailFlashcardDeckLoading', value: false }))
  }
}

/**
 * Generate flashcards using Gemini (admin only)
 */
export const generateFlashcards = (content, type, cardCount = 10) => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isGeneratingCards', value: true }))

    const requestBody = {
      content,
      type,
      cardCount
    }

    const route = Endpoints.admin.flashcards + `/generate`
    const response = await postWithToken(route, requestBody)
    const cards = response.data.data || response.data.cards || []
    return cards
  } catch (err) {
    handleApiError(err, dispatch)
  } finally {
    dispatch(setLoading({ key: 'isGeneratingCards', value: false }))
  }
}

/**
 * Generate flashcards from PDF using Gemini (admin only)
 * Only sends blobId - backend retrieves file from blob storage
 */
export const generateFlashcardsFromPDF = (pdfFile, cardCount = 10, blobId) => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isGeneratingCards', value: true }))

    // Generate flashcards using only blobId (no file upload)
    const requestBody = {
      cardCount,
      blobId
    }

    const route = Endpoints.admin.flashcards + `/generate-from-pdf`
    const response = await postWithToken(route, requestBody)

    const data = response.data.data || {}
    const cards = data.cards || []

    return { cards, blobId }
  } catch (err) {
    handleApiError(err, dispatch)
  } finally {
    dispatch(setLoading({ key: 'isGeneratingCards', value: false }))
  }
}

/**
 * Create new flashcard deck (admin only)
 * Supports both JSON (text-based) and FormData (PDF-based)
 */
export const createFlashcardDeck = (deckData) => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isCreatingDeck', value: true }))

    const route = Endpoints.admin.flashcards
    await postWithToken(route, deckData)
  } catch (err) {
    handleApiError(err, dispatch)
  } finally {
    dispatch(setLoading({ key: 'isCreatingDeck', value: false }))
  }
}

/**
 * Update deck cards (admin only)
 */
export const updateDeckCards = (deckId, cards) => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isUpdatingDeck', value: true }))

    const route = Endpoints.admin.flashcards + `/${deckId}`
    await putWithToken(
      route,
      { cards }
    )
  } catch (err) {
    handleApiError(err, dispatch)
  } finally {
    dispatch(setLoading({ key: 'isUpdatingDeck', value: false }))
  }
}

/**
 * Update full flashcard deck (admin only)
 * Supports FormData for image uploads
 */
export const updateFlashcardDeck = (deckId, deckData) => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isUpdatingDeck', value: true }))

    const route = Endpoints.admin.flashcards + `/${deckId}`
    await putWithToken(route, deckData)
  } catch (err) {
    handleApiError(err, dispatch)
  } finally {
    dispatch(setLoading({ key: 'isUpdatingDeck', value: false }))
  }
}

/**
 * Delete deck (admin only)
 */
export const deleteFlashcardDeck = (deckId) => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isDeletingDeck', value: true }))

    const route = Endpoints.admin.flashcards + `/${deckId}`
    await deleteWithToken(route)
  } catch (err) {
    handleApiError(err, dispatch)
  } finally {
    dispatch(setLoading({ key: 'isDeletingDeck', value: false }))
  }
}

/**
 * Upload card image (admin only)
 * Uses centralized upload endpoint
 * Returns the uploaded image data with blobId
 */
export const uploadCardImage = (imageFile) => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isUploadingImage', value: true }))

    const formData = new FormData()
    formData.append('file', imageFile) // Changed from 'image' to 'file'
    formData.append('type', 'flashcard_card') // Specify type for blob categorization

    const route = Endpoints.api.uploadImage // Use centralized upload endpoint
    const response = await postWithToken(route, formData)

    const data = response.data.data
    return {
      url: data.url, // Presigned URL for preview
      key: data.key, // Blob key for backend reference
      filename: data.filename,
      contentType: data.contentType,
      byteSize: data.byteSize
    }
  } catch (err) {
    handleApiError(err, dispatch)
    throw err
  } finally {
    dispatch(setLoading({ key: 'isUploadingImage', value: false }))
  }
}
