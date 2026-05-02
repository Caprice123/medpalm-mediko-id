import { actions } from '@store/banner/reducer'
import Endpoints from '@config/endpoint'
import { getWithToken } from '@utils/requestUtils'

const { setLoading, setActiveBanners } = actions

export const fetchActiveBanners = () => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isGetActiveBannersLoading', value: true }))
    const response = await getWithToken(Endpoints.api.banners)
    dispatch(setActiveBanners(response.data.data || []))
  } finally {
    dispatch(setLoading({ key: 'isGetActiveBannersLoading', value: false }))
  }
}
