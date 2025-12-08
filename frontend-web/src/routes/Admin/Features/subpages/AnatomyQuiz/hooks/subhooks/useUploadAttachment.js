import { useFormik } from "formik"
import { uploadImageSchema } from "../../validationSchema/uploadImageSchema"
import { useDispatch } from "react-redux"
import { uploadAnatomyImage } from "@store/anatomy/action"

export const useUploadAttachment = (onSuccess) => {
    const dispatch = useDispatch()

    const form = useFormik({
        initialValues: {
            file: null,
        },
        validationSchema: uploadImageSchema,
        onSubmit: (values) => {
            dispatch(uploadAnatomyImage(values, onSuccess))
        }
    })

    return { form }
}