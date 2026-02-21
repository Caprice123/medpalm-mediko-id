import { actions } from '@store/common/reducer'
import Endpoints from '@config/endpoint'
import { handleApiError } from '@utils/errorUtils'
import { postWithToken } from '../../utils/requestUtils'

const {
  setLoading,
} = actions

export const upload = (file, type, onSuccess) => async (dispatch) => {
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
    const data = response.data.data

    const result = {
      blobId: data.blobId,
      key: data.key,
      filename: data.fileName,
      contentType: data.contentType,
      byteSize: data.byteSize,
      url: data.url // Presigned URL for viewing
    }
    if (onSuccess) onSuccess(result)

    return result
  } finally {
    dispatch(setLoading({ key: 'isUploading', value: false }))
  }
}