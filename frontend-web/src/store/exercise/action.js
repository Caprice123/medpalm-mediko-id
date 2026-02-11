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
    if (filters.topic) queryParams.topic = filters.topic
    if (filters.department) queryParams.department = filters.department
    if (filters.university) queryParams.university = filters.university
    if (filters.semester) queryParams.semester = filters.semester

    const route = Endpoints.api.exercises + '/topics'
    const response = await getWithToken(route, queryParams)

    dispatch(setTopics(response.data.data || response.data.topics || []))
    dispatch(updatePagination(response.data.pagination))
  } finally {
    dispatch(setLoading({ key: 'isTopicsLoading', value: false }))
  }
}

// ============= Sessionless Exercise Actions =============

/**
 * Start exercise topic directly (sessionless)
 */
export const startExerciseTopic = (topicId) => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isStartingExercise', value: true }))
    
    const route = Endpoints.api.exercises + '/start'
    const response = await postWithToken(route, { topicId })
    const data = response.data.data

    return data
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
    
    const route = Endpoints.api.exercises + '/submit'
    const response = await postWithToken(route, {
      topicId,
      answers
    })

    return response.data.data
  } finally {
    dispatch(setLoading({ key: 'isSubmitAnatomyQuizLoadingExercise', value: false }))
  }
}
