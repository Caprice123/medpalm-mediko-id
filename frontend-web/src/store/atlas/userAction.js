import { actions } from '@store/atlas/reducer'
import Endpoints from '@config/endpoint'
import { getWithToken } from '@utils/requestUtils'

const { setLoading, setModels, setPagination, setDetail } = actions

export const fetchAtlasModels = () => async (dispatch, getState) => {
  try {
    dispatch(setLoading({ key: 'isGetListAtlasLoading', value: true }))

    const { filter, pagination } = getState().atlas

    const queryParams = {}
    if (filter.university) queryParams.university = filter.university
    if (filter.semester) queryParams.semester = filter.semester
    if (filter.search) queryParams.search = filter.search
    queryParams.page = pagination.page
    queryParams.perPage = pagination.perPage

    const response = await getWithToken(Endpoints.api.atlas, queryParams)
    dispatch(setModels(response.data.data || []))
    dispatch(setPagination(response.data.pagination || { page: 1, perPage: 20, isLastPage: false }))
  } finally {
    dispatch(setLoading({ key: 'isGetListAtlasLoading', value: false }))
  }
}

export const fetchAtlasModel = (uniqueId) => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isGetDetailAtlasLoading', value: true }))

    const response = await getWithToken(Endpoints.api.atlas + `/${uniqueId}`)
    const model = response.data.data
    dispatch(setDetail(model))
    return model
  } finally {
    dispatch(setLoading({ key: 'isGetDetailAtlasLoading', value: false }))
  }
}
