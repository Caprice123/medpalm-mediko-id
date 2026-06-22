import { actions } from '@store/challenge/reducer'
import Endpoints from '@config/endpoint'
import { getWithToken, postWithToken } from '@utils/requestUtils'

const { setLoading, setChallenges, setPagination, setDetail, setChallengeBadges, setChallengeLeaderboard, setMyBadges } = actions

export const fetchChallenges = (tab = 'ongoing') => async (dispatch, getState) => {
  try {
    dispatch(setLoading({ key: 'isGetListLoading', value: true }))
    const { filter, pagination } = getState().challenge
    const queryParams = { page: pagination.page, perPage: pagination.perPage, tab }
    if (filter.search) queryParams.search = filter.search
    if (filter.university) queryParams.universityId = filter.university
    if (filter.semester) queryParams.semesterId = filter.semester

    const response = await getWithToken(Endpoints.api.challenges, queryParams)
    dispatch(setChallenges(response.data.data || []))
    dispatch(setPagination(response.data.pagination || { page: 1, perPage: 20, isLastPage: false }))
  } finally {
    dispatch(setLoading({ key: 'isGetListLoading', value: false }))
  }
}

export const fetchChallengeDetail = (uniqueId, { silent = false } = {}) => async (dispatch) => {
  try {
    if (!silent) dispatch(setLoading({ key: 'isGetDetailLoading', value: true }))
    const response = await getWithToken(`${Endpoints.api.challenges}/${uniqueId}`)
    dispatch(setDetail(response.data.data))
    return response.data.data
  } finally {
    if (!silent) dispatch(setLoading({ key: 'isGetDetailLoading', value: false }))
  }
}

export const fetchChallengeBadges = (uniqueId) => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isGetChallengeBadgesLoading', value: true }))
    const response = await getWithToken(`${Endpoints.api.challenges}/${uniqueId}/badges`)
    dispatch(setChallengeBadges(response.data.data || []))
  } finally {
    dispatch(setLoading({ key: 'isGetChallengeBadgesLoading', value: false }))
  }
}

export const fetchChallengeLeaderboard = (uniqueId, { silent = false } = {}) => async (dispatch) => {
  try {
    if (!silent) dispatch(setLoading({ key: 'isGetChallengeLeaderboardLoading', value: true }))
    const response = await getWithToken(`${Endpoints.api.challenges}/${uniqueId}/leaderboard`)
    const { leaderboard, myRank, myBadge } = response.data.data
    dispatch(setChallengeLeaderboard({ leaderboard, myRank, myBadge }))
  } finally {
    if (!silent) dispatch(setLoading({ key: 'isGetChallengeLeaderboardLoading', value: false }))
  }
}

export const startChallenge = (uniqueId) => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isStartLoading', value: true }))
    const response = await postWithToken(`${Endpoints.api.challenges}/${uniqueId}/start`)
    return response.data.data
  } finally {
    dispatch(setLoading({ key: 'isStartLoading', value: false }))
  }
}

export const fetchMyBadges = () => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isGetMyBadgesLoading', value: true }))
    const response = await getWithToken(Endpoints.api.challengeMyBadges)
    dispatch(setMyBadges(response.data.data || []))
  } finally {
    dispatch(setLoading({ key: 'isGetMyBadgesLoading', value: false }))
  }
}

export const saveAnswer = (uniqueId, answer) => async () => {
  try {
    const response = await postWithToken(`${Endpoints.api.challenges}/${uniqueId}/answer`, answer)
    return response.data
  } catch {
    return null
  }
}

export const submitChallenge = (uniqueId) => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isSubmitLoading', value: true }))
    const response = await postWithToken(`${Endpoints.api.challenges}/${uniqueId}/submit`)
    return response.data.data
  } finally {
    dispatch(setLoading({ key: 'isSubmitLoading', value: false }))
  }
}
