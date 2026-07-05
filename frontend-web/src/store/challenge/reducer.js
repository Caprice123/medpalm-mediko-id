import { createSlice } from '@reduxjs/toolkit'
import { resetAllState } from '../globalAction'

const initialState = {
  challenges: [],
  detail: undefined,
  challengeBadges: [],
  challengeLeaderboard: [],
  challengeMyRank: null,
  challengeMyBadge: null,
  challengeTotalParticipants: null,
  challengeRewards: [],
  challengeReward: null,
  challengeRewardRead: null,
  adminRewards: [],
  adminDisbursements: [],
  questions: [],
  badges: [],
  myBadges: [],
  leaderboard: [],
  filter: {
    search: undefined,
    status: undefined,
    scoringType: undefined,
    university: undefined,
    semester: undefined,
  },
  pagination: {
    page: 1,
    perPage: 20,
    isLastPage: false,
  },
  questionsPagination: {
    page: 1,
    perPage: 50,
    isLastPage: false,
  },
  leaderboardPagination: {
    page: 1,
    perPage: 20,
    isLastPage: false,
  },
  loading: {
    isGetListLoading: false,
    isGetDetailLoading: false,
    isGetChallengeBadgesLoading: false,
    isGetChallengeLeaderboardLoading: false,
    isCreateLoading: false,
    isUpdateLoading: false,
    isDeleteLoading: false,
    isGetQuestionsLoading: false,
    isQuestionMutating: false,
    isGetBadgesLoading: false,
    isBadgeMutating: false,
    isGetLeaderboardLoading: false,
    isGetMyBadgesLoading: false,
    isStartLoading: false,
    isSubmitLoading: false,
    isImporting: false,
    isGetAdminRewardLoading: false,
    isRewardMutating: false,
    isGetDisbursementsLoading: false,
    isDisbursementMutating: false,
  },
  error: null,
}

const { reducer, actions } = createSlice({
  name: 'challenge',
  initialState,
  reducers: {
    setLoading: (state, { payload: { key, value } }) => {
      state.loading[key] = value
    },
    setChallenges: (state, { payload }) => {
      state.challenges = payload
    },
    setDetail: (state, { payload }) => {
      state.detail = payload
    },
    setChallengeBadges: (state, { payload }) => {
      state.challengeBadges = payload
    },
    setChallengeLeaderboard: (state, { payload: { leaderboard, myRank, myBadge, totalParticipants } }) => {
      state.challengeLeaderboard = leaderboard
      state.challengeMyRank = myRank
      state.challengeMyBadge = myBadge
      state.challengeTotalParticipants = totalParticipants ?? null
    },
    setQuestions: (state, { payload }) => {
      state.questions = payload
    },
    setBadges: (state, { payload }) => {
      state.badges = payload
    },
    setMyBadges: (state, { payload }) => {
      state.myBadges = payload
    },
    setLeaderboard: (state, { payload }) => {
      state.leaderboard = payload
    },
    setPagination: (state, { payload }) => {
      state.pagination = payload
    },
    setPage: (state, { payload }) => {
      state.pagination.page = payload
    },
    setQuestionsPagination: (state, { payload }) => {
      state.questionsPagination = payload
    },
    setQuestionsPage: (state, { payload }) => {
      state.questionsPagination.page = payload
    },
    setLeaderboardPagination: (state, { payload }) => {
      state.leaderboardPagination = payload
    },
    setLeaderboardPage: (state, { payload }) => {
      state.leaderboardPagination.page = payload
    },
    updateFilter: (state, { payload: { key, value } }) => {
      state.filter[key] = value
    },
    setChallengeReward: (state, { payload: { rewards, reward, rewardRead } }) => {
      state.challengeRewards = rewards ?? []
      state.challengeReward = reward ?? null
      state.challengeRewardRead = rewardRead ?? false
    },
    setRewardRead: (state) => {
      state.challengeRewardRead = true
    },
    setAdminRewards: (state, { payload }) => {
      state.adminRewards = payload
    },
    setAdminDisbursements: (state, { payload }) => {
      state.adminDisbursements = payload
    },
  },
  extraReducers: (builder) => {
    builder.addCase(resetAllState, (state) => ({
      ...initialState,
      loading: state.loading,
    }))
  },
})

export { actions }
export default reducer
