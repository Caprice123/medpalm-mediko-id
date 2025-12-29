import { actions } from '@store/exercise/reducer'
import Endpoints from '@config/endpoint'
import { handleApiError } from '@utils/errorUtils'
import { getWithToken, postWithToken } from '../../utils/requestUtils'

const {
  setLoading,
  setTopics,
  setTags,
  updatePagination
} = actions

// ============= Topics Actions =============

/**
 * Fetch all exercise topics (user endpoint)
 */
export const fetchExerciseTopics = () => async (dispatch, getState) => {
  try {
    dispatch(setLoading({ key: 'isTopicsLoading', value: true }))


    const { filters, pagination } = getState().exercise

    const queryParams = {
      page: pagination.page,
      perPage: pagination.perPage
    }

    if (filters.search) queryParams.search = filters.search
    if (filters.university) queryParams.university = filters.university
    if (filters.semester) queryParams.semester = filters.semester

    const response = await getWithToken(Endpoints.exercises.topics, queryParams)

    dispatch(setTopics(response.data.data || response.data.topics || []))

    // Update pagination
    if (response.data.pagination) {
      dispatch(updatePagination(response.data.pagination))
    } else {
      // If no pagination in response, assume it's the last page
      dispatch(updatePagination({ isLastPage: true }))
    }
  } catch (err) {
    handleApiError(err, dispatch)
  } finally {
    dispatch(setLoading({ key: 'isTopicsLoading', value: false }))
  }
}

// ============= Tags Actions =============

/**
 * Fetch all tags (admin endpoint)
 */
export const fetchExerciseTags = (type = null) => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isTagsLoading', value: true }))
    

    const queryParams = {}
    if (type) queryParams.type = type

    const response = await getWithToken(Endpoints.exercises.admin.tags, queryParams)

    dispatch(setTags(response.data.data || response.data.tags || []))
  } catch (err) {
    handleApiError(err, dispatch)
  } finally {
    dispatch(setLoading({ key: 'isTagsLoading', value: false }))
  }
}


// ============= Sessionless Exercise Actions =============

/**
 * Start exercise topic directly (sessionless)
 */
export const startExerciseTopic = (topicId) => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isStartingExercise', value: true }))
    

    const response = await postWithToken(Endpoints.exercises.start, { topicId })
    const data = response.data.data

    return data
  } catch (err) {
    handleApiError(err, dispatch)
  } finally {
    dispatch(setLoading({ key: 'isStartingExercise', value: false }))
  }
}

/**
 * Submit exercise answers and update progress (sessionless)
 */
export const submitExerciseProgress = (topicId, answers) => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isSubmitAnatomyQuizLoadingExercise', value: true }))
    

    const response = await postWithToken(Endpoints.exercises.submit, {
      topicId,
      answers
    })

    return response.data.data
  } catch (err) {
    handleApiError(err, dispatch)
  } finally {
    dispatch(setLoading({ key: 'isSubmitAnatomyQuizLoadingExercise', value: false }))
  }
}
