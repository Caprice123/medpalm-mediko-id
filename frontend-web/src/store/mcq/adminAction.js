import { actions } from '@store/mcq/reducer'
import Endpoints from '@config/endpoint'
import { getWithToken, postWithToken, putWithToken, deleteWithToken } from '@utils/requestUtils'

const { setLoading, setTopics, setPagination, setSelectedTopic, setQuestions, removeTopic, clearUploadedQuestionImage, setPage } = actions

/**
 * Fetch all MCQ topics for admin panel
 */
export const fetchAdminMcqTopics = () => async (dispatch, getState) => {
  try {
    dispatch(setLoading({ key: 'isTopicsLoading', value: true }))

    const { filter, pagination } = getState().mcq

    const queryParams = {}
    if (filter.status) queryParams.status = filter.status
    if (filter.search) queryParams.search = filter.search
    if (filter.topic) queryParams.topic = filter.topic
    if (filter.department) queryParams.department = filter.department
    if (filter.university) queryParams.university = filter.university
    if (filter.semester) queryParams.semester = filter.semester
    queryParams.page = pagination.page
    queryParams.limit = pagination.limit

    const route = Endpoints.admin.mcq + "/topics"
    const response = await getWithToken(route, queryParams)

    dispatch(setTopics(response.data.data || []))
    dispatch(setPagination(response.data.pagination || { page: 1, limit: 30, isLastPage: false }))
  } finally {
    dispatch(setLoading({ key: 'isTopicsLoading', value: false }))
  }
}

/**
 * Fetch single topic for admin editing
 */
export const fetchMcqTopicDetail = (topicId, onSuccess) => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isTopicLoading', value: true }))

    const route = Endpoints.admin.mcq + `/topics/${topicId}`
    const response = await getWithToken(route)

    const topic = response.data.data
    dispatch(setSelectedTopic(topic))
    dispatch(setQuestions(topic.questions || []))
    if (onSuccess) onSuccess(topic)
    return topic
  } finally {
    dispatch(setLoading({ key: 'isTopicLoading', value: false }))
  }
}

/**
 * Generate MCQ questions from text or PDF (admin only)
 */
export const generateMcqQuestions = ({ content, type, questionCount, blobId }, onSuccess) => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isGenerating', value: true }))

    const requestBody = { type, questionCount }
    if (type === 'pdf') {
      requestBody.blobId = blobId
    } else if (type === 'text' && content) {
      requestBody.content = content
    } else {
      throw new Error('Invalid generation type or missing required data')
    }

    const route = Endpoints.admin.mcq + "/generate"
    const response = await postWithToken(route, requestBody)

    const questions = response.data.data
    if (onSuccess) onSuccess(questions)
    return questions
  } finally {
    dispatch(setLoading({ key: 'isGenerating', value: false }))
  }
}

/**
 * Create new MCQ topic (admin only)
 */
export const createMcqTopic = (topicData) => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isCreatingTopic', value: true }))

    const route = Endpoints.admin.mcq + "/topics"
    const response = await postWithToken(route, topicData)

    const topic = response.data.data
    dispatch(setPage(1))
    dispatch(fetchAdminMcqTopics())
    dispatch(clearUploadedQuestionImage())
    return topic
  } finally {
    dispatch(setLoading({ key: 'isCreatingTopic', value: false }))
  }
}

/**
 * Update MCQ topic (admin only)
 */
export const updateMcqTopic = (topicId, topicData, onSuccess) => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isUpdatingTopic', value: true }))

    const route = Endpoints.admin.mcq + `/topics/${topicId}`
    await putWithToken(route, topicData)

    if (onSuccess) onSuccess()
  } finally {
    dispatch(setLoading({ key: 'isUpdatingTopic', value: false }))
  }
}

/**
 * Delete MCQ topic (admin only)
 */
export const deleteMcqTopic = (topicId) => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isDeletingTopic', value: true }))

    const route = Endpoints.admin.mcq + `/topics/${topicId}`
    await deleteWithToken(route)

    dispatch(removeTopic(topicId))
  } finally {
    dispatch(setLoading({ key: 'isDeletingTopic', value: false }))
  }
}
