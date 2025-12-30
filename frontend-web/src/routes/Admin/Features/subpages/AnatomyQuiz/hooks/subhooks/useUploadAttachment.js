import { useFormik } from "formik"
import { uploadImageSchema } from "../../validationSchema/uploadImageSchema"
import { useDispatch } from "react-redux"
import { upload } from '@store/common/action'

export const useUploadAttachment = (onSuccess) => {
    const dispatch = useDispatch()

    const form = useFormik({
        initialValues: {
            file: null,
        },
        validationSchema: uploadImageSchema,
        onSubmit: async (values) => {
            const result = await dispatch(upload(values.file, 'anatomy'))
            const imageInfo = {
                blobId: result.blobId,
                image_url: result.url,
                fileName: result.filename,
                fileSize: result.byteSize
            }
            if (onSuccess) onSuccess(imageInfo)
        }
    })

    return { form }
}
