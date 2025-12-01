import { useFormik } from "formik"
import { useDispatch } from "react-redux"
import { createTagGroup, fetchTags } from '@store/tags/action'
import { createTagGroupSchema } from "../../validationSchema/createTagGroupSchema"

export const useCreateTagGroup = (setUiState) => {
    const dispatch = useDispatch()

    const formik = useFormik({
        initialValues: {
            name: undefined,
            tagName: undefined,
        },
        validationSchema: createTagGroupSchema,
        onSubmit: async (values) => {
            const onSuccess = async () => {
                await dispatch(fetchTags())
            }
            await dispatch(createTagGroup(values, onSuccess))
        }
    })

    const onOpen = () => {
        setUiState(prev => ({ ...prev, isTagGroupModalOpen: true }))
        formik.resetForm()
    }

    const onHide = () => {
        setUiState(prev => ({ ...prev, isTagGroupModalOpen: false }))
    }

    return {
        formik,
        onOpen,
        onHide
    }
}