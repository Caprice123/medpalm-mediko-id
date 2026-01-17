import { actions } from '@store/common/reducer'
import Endpoints from '@config/endpoint'
import { handleApiError } from '@utils/errorUtils'
import { postWithToken } from '../../utils/requestUtils'

const {
  setLoading,
} = actions

export const upload = (file, type) => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isUploading', value: true }))
    const formData = new FormData()
    formData.append('file', file)
    formData.append('type', type)

    const response = await postWithToken(Endpoints.api.uploadImage, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    const result = response.data.data

    return {
      blobId: result.blobId,
      key: result.key,
      filename: result.fileName,
      contentType: result.contentType,
      byteSize: result.byteSize,
      url: result.url // Presigned URL for viewing
    }
  } catch (err) {
    handleApiError(err, dispatch)
    throw err
  } finally {
    dispatch(setLoading({ key: 'isUploading', value: false }))
  }
}