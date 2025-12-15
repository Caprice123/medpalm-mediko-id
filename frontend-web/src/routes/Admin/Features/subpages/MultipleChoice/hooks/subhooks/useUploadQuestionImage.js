import { useFormik } from "formik"
import { useDispatch } from "react-redux"
import { uploadQuestionImage } from "@store/mcq/action"

export const useUploadQuestionImage = (onSuccess) => {
    const dispatch = useDispatch()

    const form = useFormik({
        initialValues: {
            file: null,
        },
        onSubmit: (values) => {
            dispatch(uploadQuestionImage(values, onSuccess))
        }
    })

    return { form }
}
