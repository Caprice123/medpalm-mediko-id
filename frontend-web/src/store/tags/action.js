import { actions } from '@store/tags/reducer'
import Endpoints from '@config/endpoint'
import { handleApiError } from '@utils/errorUtils'
import { getWithToken, postWithToken, putWithToken } from '../../utils/requestUtils'

const {
  setLoading,
  setTags,
} = actions

// ============= Tags Actions =============
export const fetchTags = () => async (dispatch, getState) => {
  try {
    dispatch(setLoading({ key: 'isGetListTagsLoading', value: true }))

    const { tagGroupNames } = getState().tags
    const queryParams = {}
    if (tagGroupNames) queryParams.tagGroupNames = tagGroupNames.join(",")

    const route = Endpoints.tags
    const response = await getWithToken(route, queryParams)
    const { data } = response.data
    dispatch(setTags(data))
  } catch (err) {
    handleApiError(err, dispatch)
  } finally {
    dispatch(setLoading({ key: 'isGetListTagsLoading', value: false }))
  }
}

export const createTag = (form, onSuccess) => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isCreateTagLoading', value: true }))

    const route = Endpoints.tags
    const requestBody = {
        groupName: form.tagGroup ? JSON.parse(form.tagGroup.value).name : null,
        name: form.name
    }
    await postWithToken(route, requestBody)
    if (onSuccess) onSuccess()
  } catch (err) {
    handleApiError(err, dispatch)
  } finally {
    dispatch(setLoading({ key: 'isCreateTagLoading', value: false }))
  }
}

export const updateTag = (id, form, onSuccess) => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isUpdateTagLoading', value: true }))

    const subRoute = `/${id}`
    const route = Endpoints.tags + subRoute
    const requestBody = {
        groupName: form.tagGroup ? JSON.parse(form.tagGroup.value).name : null,
        name: form.name
    }
    await putWithToken(route, requestBody)
    if (onSuccess) onSuccess()
  } catch (err) {
    handleApiError(err, dispatch)
  } finally {
    dispatch(setLoading({ key: 'isUpdateTagLoading', value: false }))
  }
}

/**
 * Create tag group (admin only)
 */
export const createTagGroup = (groupData) => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isCreating', value: true }))

    const response = await postWithToken(Endpoints.tagGroups.create, groupData)

    return response.data.data || response.data
  } catch (err) {
    handleApiError(err, dispatch)
  } finally {
    dispatch(setLoading({ key: 'isCreating', value: false }))
  }
}
