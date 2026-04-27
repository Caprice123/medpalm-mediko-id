import { actions } from '@store/user/reducer'
import Endpoints from '@config/endpoint'
import { getWithToken, putWithToken, patchWithToken, deleteWithToken } from '../../utils/requestUtils'

const {
  setLoading,
  setUsers,
  setDetail,
  setSubscriptions,
  setSubscriptionPagination,
  setCreditBuckets,
  setFeatureSubscriptions,
} = actions

// ============= Users Actions =============
export const fetchUsers = () => async (dispatch, getState) => {
  try {
    dispatch(setLoading({ key: 'isGetUsersLoading', value: true }))

    const { email, name, status } = getState().user.filter
    const { page, perPage } = getState().user.pagination
    const queryParams = {
        email,
        name,
        status: status?.value,
        page: page || 1,
        perPage: perPage || 50,
    }

    const route = Endpoints.admin.users
    const response = await getWithToken(route, queryParams)
    const { data } = response.data
    dispatch(setUsers(data))
  } finally {
    dispatch(setLoading({ key: 'isGetUsersLoading', value: false }))
  }
}

export const adjustCredit = (userId, credit, { creditType = 'permanent', creditExpiryDays = null } = {}, onSuccess) => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isAdjustCreditLoading', value: true }))

    const route = Endpoints.admin.users + "/credits"
    const requestBody = {
        userId,
        credit,
        credit_type: creditType,
        credit_expiry_days: creditExpiryDays
    }
    await putWithToken(route, requestBody)
    if (onSuccess) onSuccess()
    await dispatch(fetchUserDetail(userId))
    await dispatch(fetchUserCreditBuckets(userId))
  } finally {
    dispatch(setLoading({ key: 'isAdjustCreditLoading', value: false }))
  }
}

export const fetchUserCreditBuckets = (userId) => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isFetchCreditBucketsLoading', value: true }))
    const route = `${Endpoints.admin.users}/${userId}/credit-buckets`
    const response = await getWithToken(route)
    dispatch(setCreditBuckets(response.data.data))
  } finally {
    dispatch(setLoading({ key: 'isFetchCreditBucketsLoading', value: false }))
  }
}

export const updateCreditBucket = (userId, bucketId, { balance, expiresAt }, onSuccess) => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isUpdateCreditBucketLoading', value: true }))
    const route = `${Endpoints.admin.users}/${userId}/credit-buckets/${bucketId}`
    await putWithToken(route, { balance, expires_at: expiresAt })
    if (onSuccess) onSuccess()
    await dispatch(fetchUserCreditBuckets(userId))
  } finally {
    dispatch(setLoading({ key: 'isUpdateCreditBucketLoading', value: false }))
  }
}

export const deleteCreditBucket = (userId, bucketId, onSuccess) => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isDeleteCreditBucketLoading', value: true }))
    const route = `${Endpoints.admin.users}/${userId}/credit-buckets/${bucketId}`
    await deleteWithToken(route)
    if (onSuccess) onSuccess()
    await dispatch(fetchUserCreditBuckets(userId))
  } finally {
    dispatch(setLoading({ key: 'isDeleteCreditBucketLoading', value: false }))
  }
}

export const adjustSubscription = (form, onSuccess) => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isAdjustSubscriptionLoading', value: true }))

    const subRoute = "/subscriptions"
    const route = Endpoints.admin.users + subRoute
    const requestBody = {
        userId: form.userId,
        durationDays: form.durationDays,
    }
    await putWithToken(route, requestBody)
    if (onSuccess) onSuccess()
  } finally {
    dispatch(setLoading({ key: 'isAdjustSubscriptionLoading', value: false }))
  }
}

export const addSubscription = (userId, startDate, endDate, onSuccess) => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isAddSubscriptionLoading', value: true }))

    const route = Endpoints.admin.subscriptions
    const requestBody = {
        userId,
        startDate,
        endDate,
    }
    await putWithToken(route, requestBody)
    if (onSuccess) onSuccess()
    // Fetch updated user details and subscriptions
    await dispatch(fetchUserDetail(userId))
    await dispatch(fetchUserSubscriptions(userId))
  } finally {
    dispatch(setLoading({ key: 'isAddSubscriptionLoading', value: false }))
  }
}

export const updateSubscription = (subscriptionId, userId, startDate, endDate, onSuccess) => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isUpdateSubscriptionLoading', value: true }))

    const route = `${Endpoints.admin.subscriptions}/${subscriptionId}`
    await patchWithToken(route, { startDate, endDate })
    if (onSuccess) onSuccess()
    await dispatch(fetchUserSubscriptions(userId))
  } finally {
    dispatch(setLoading({ key: 'isUpdateSubscriptionLoading', value: false }))
  }
}

export const deleteSubscription = (subscriptionId, userId, onSuccess) => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isDeleteSubscriptionLoading', value: true }))

    const route = `${Endpoints.admin.subscriptions}/${subscriptionId}`
    await deleteWithToken(route)
    if (onSuccess) onSuccess()
    await dispatch(fetchUserDetail(userId))
    await dispatch(fetchUserSubscriptions(userId))
  } finally {
    dispatch(setLoading({ key: 'isDeleteSubscriptionLoading', value: false }))
  }
}

export const fetchUserDetail = (userId) => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isFetchUserDetailLoading', value: true }))

    const route = `${Endpoints.admin.users}/${userId}`
    const response = await getWithToken(route)
    const userData = response.data.data

    // Set user detail in state and update user in list
    dispatch(setDetail(userData))

    return userData
  } finally {
    dispatch(setLoading({ key: 'isFetchUserDetailLoading', value: false }))
  }
}

export const fetchUserSubscriptions = (userId) => async (dispatch, getState) => {
  try {
    dispatch(setLoading({ key: 'isFetchUserSubscriptionsLoading', value: true }))

    const { page, perPage } = getState().user.subscriptionPagination
    const { subscriptionFilter } = getState().user
    const queryParams = {
      page: page || 1,
      perPage: perPage || 20,
      status: subscriptionFilter || 'all',
    }

    const route = `${Endpoints.admin.users}/${userId}/subscriptions`
    const response = await getWithToken(route, queryParams)
    const { data, pagination } = response.data

    dispatch(setSubscriptions(data))
    dispatch(setSubscriptionPagination(pagination))
  } finally {
    dispatch(setLoading({ key: 'isFetchUserSubscriptionsLoading', value: false }))
  }
}

export const updateUserRole = (userId, role, onSuccess) => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isUpdateUserRoleLoading', value: true }))

    const route = `${Endpoints.admin.users}/${userId}/role`
    const requestBody = { role }
    await putWithToken(route, requestBody)
    if (onSuccess) onSuccess()
    // Fetch updated user details and refresh users list
    await dispatch(fetchUserDetail(userId))
    await dispatch(fetchUsers())
  } finally {
    dispatch(setLoading({ key: 'isUpdateUserRoleLoading', value: false }))
  }
}

export const updateUserPermissions = (userId, permissions, onSuccess) => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isUpdateUserPermissionsLoading', value: true }))

    const route = `${Endpoints.admin.users}/${userId}/permissions`
    const requestBody = { permissions }
    await putWithToken(route, requestBody)
    if (onSuccess) onSuccess()
    // Fetch updated user details and refresh users list
    await dispatch(fetchUserDetail(userId))
    await dispatch(fetchUsers())
  } finally {
    dispatch(setLoading({ key: 'isUpdateUserPermissionsLoading', value: false }))
  }
}

export const fetchUserFeatureSubscriptions = (userId) => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isFetchFeatureSubscriptionsLoading', value: true }))
    const response = await getWithToken(Endpoints.admin.userFeatureSubscriptions(userId))
    dispatch(setFeatureSubscriptions(response.data.data || []))
  } finally {
    dispatch(setLoading({ key: 'isFetchFeatureSubscriptionsLoading', value: false }))
  }
}

export const updateUserFeatureSubscriptions = (userId, activeFeatures, onSuccess) => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isUpdateFeatureSubscriptionsLoading', value: true }))
    const response = await putWithToken(Endpoints.admin.userFeatureSubscriptions(userId), { activeFeatures })
    dispatch(setFeatureSubscriptions(response.data.data || []))
    if (onSuccess) onSuccess()
  } finally {
    dispatch(setLoading({ key: 'isUpdateFeatureSubscriptionsLoading', value: false }))
  }
}
