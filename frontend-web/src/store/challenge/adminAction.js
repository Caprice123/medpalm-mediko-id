import { actions } from '@store/challenge/reducer'
import Endpoints from '@config/endpoint'
import { getWithToken, postWithToken, putWithToken, deleteWithToken } from '@utils/requestUtils'

const { setLoading, setChallenges, setPagination, setDetail, setQuestions, setQuestionsPagination, setBadges, setLeaderboard, setLeaderboardPagination } = actions

// Challenges
export const fetchAdminChallenges = () => async (dispatch, getState) => {
  try {
    dispatch(setLoading({ key: 'isGetListLoading', value: true }))
    const { filter, pagination } = getState().challenge
    const queryParams = { page: pagination.page, perPage: pagination.perPage }
    if (filter.search) queryParams.search = filter.search
    if (filter.status) queryParams.status = filter.status
    if (filter.scoringType) queryParams.scoringType = filter.scoringType
    if (filter.university) queryParams.universityId = filter.university
    if (filter.semester) queryParams.semesterId = filter.semester

    const response = await getWithToken(Endpoints.admin.challenges, queryParams)
    dispatch(setChallenges(response.data.data || []))
    dispatch(setPagination(response.data.pagination || { page: 1, perPage: 20, isLastPage: false }))
  } finally {
    dispatch(setLoading({ key: 'isGetListLoading', value: false }))
  }
}

export const createChallenge = (data, onSuccess) => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isCreateLoading', value: true }))
    await postWithToken(Endpoints.admin.challenges, data)
    if (onSuccess) onSuccess()
  } finally {
    dispatch(setLoading({ key: 'isCreateLoading', value: false }))
  }
}

export const updateChallenge = (uniqueId, data, onSuccess) => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isUpdateLoading', value: true }))
    await putWithToken(`${Endpoints.admin.challenges}/${uniqueId}`, data)
    if (onSuccess) onSuccess()
  } finally {
    dispatch(setLoading({ key: 'isUpdateLoading', value: false }))
  }
}

export const deleteChallenge = (uniqueId, onSuccess) => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isDeleteLoading', value: true }))
    await deleteWithToken(`${Endpoints.admin.challenges}/${uniqueId}`)
    if (onSuccess) onSuccess()
  } finally {
    dispatch(setLoading({ key: 'isDeleteLoading', value: false }))
  }
}

// Questions
export const fetchAdminQuestions = (challengeUniqueId) => async (dispatch, getState) => {
  try {
    dispatch(setLoading({ key: 'isGetQuestionsLoading', value: true }))
    const { questionsPagination } = getState().challenge
    const response = await getWithToken(
      `${Endpoints.admin.challenges}/${challengeUniqueId}/questions`,
      { page: questionsPagination.page, perPage: questionsPagination.perPage }
    )
    dispatch(setQuestions(response.data.data || []))
    dispatch(setQuestionsPagination(response.data.pagination || { page: 1, perPage: 50, isLastPage: false }))
  } finally {
    dispatch(setLoading({ key: 'isGetQuestionsLoading', value: false }))
  }
}

export const createQuestion = (challengeUniqueId, data, onSuccess) => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isQuestionMutating', value: true }))
    await postWithToken(`${Endpoints.admin.challenges}/${challengeUniqueId}/questions`, data)
    if (onSuccess) onSuccess()
  } finally {
    dispatch(setLoading({ key: 'isQuestionMutating', value: false }))
  }
}

export const updateQuestion = (challengeUniqueId, questionUniqueId, data, onSuccess) => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isQuestionMutating', value: true }))
    await putWithToken(`${Endpoints.admin.challenges}/${challengeUniqueId}/questions/${questionUniqueId}`, data)
    if (onSuccess) onSuccess()
  } finally {
    dispatch(setLoading({ key: 'isQuestionMutating', value: false }))
  }
}

export const deleteQuestion = (challengeUniqueId, questionUniqueId, onSuccess) => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isQuestionMutating', value: true }))
    await deleteWithToken(`${Endpoints.admin.challenges}/${challengeUniqueId}/questions/${questionUniqueId}`)
    if (onSuccess) onSuccess()
  } finally {
    dispatch(setLoading({ key: 'isQuestionMutating', value: false }))
  }
}

// Badges
export const fetchAdminBadges = (challengeUniqueId) => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isGetBadgesLoading', value: true }))
    const response = await getWithToken(`${Endpoints.admin.challenges}/${challengeUniqueId}/badges`)
    dispatch(setBadges(response.data.data || []))
  } finally {
    dispatch(setLoading({ key: 'isGetBadgesLoading', value: false }))
  }
}

export const createBadge = (challengeUniqueId, data, onSuccess) => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isBadgeMutating', value: true }))
    await postWithToken(`${Endpoints.admin.challenges}/${challengeUniqueId}/badges`, data)
    if (onSuccess) onSuccess()
  } finally {
    dispatch(setLoading({ key: 'isBadgeMutating', value: false }))
  }
}

export const updateBadge = (challengeUniqueId, badgeUniqueId, data, onSuccess) => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isBadgeMutating', value: true }))
    await putWithToken(`${Endpoints.admin.challenges}/${challengeUniqueId}/badges/${badgeUniqueId}`, data)
    if (onSuccess) onSuccess()
  } finally {
    dispatch(setLoading({ key: 'isBadgeMutating', value: false }))
  }
}

export const deleteBadge = (challengeUniqueId, badgeUniqueId, onSuccess) => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isBadgeMutating', value: true }))
    await deleteWithToken(`${Endpoints.admin.challenges}/${challengeUniqueId}/badges/${badgeUniqueId}`)
    if (onSuccess) onSuccess()
  } finally {
    dispatch(setLoading({ key: 'isBadgeMutating', value: false }))
  }
}

// Leaderboard (admin)
export const fetchAdminLeaderboard = (challengeUniqueId) => async (dispatch, getState) => {
  try {
    dispatch(setLoading({ key: 'isGetLeaderboardLoading', value: true }))
    const { leaderboardPagination } = getState().challenge
    const response = await getWithToken(
      `${Endpoints.admin.challenges}/${challengeUniqueId}/leaderboard`,
      { page: leaderboardPagination.page, perPage: leaderboardPagination.perPage }
    )
    dispatch(setLeaderboard(response.data.data || []))
    dispatch(setLeaderboardPagination(response.data.pagination || { page: 1, perPage: 20, isLastPage: false }))
  } finally {
    dispatch(setLoading({ key: 'isGetLeaderboardLoading', value: false }))
  }
}
