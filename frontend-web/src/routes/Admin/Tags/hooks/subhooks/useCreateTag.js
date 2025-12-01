import { useFormik } from "formik"
import { createTagSchema } from "../../validationSchema/createTagSchema"
import { useDispatch } from "react-redux"
import { createTag, fetchTags } from '@store/tags/action'
import { fetchTagGroups } from "../../../../../store/tagGroups/action"

export const useCreateTag = (setUiState) => {
    const dispatch = useDispatch()

    const onHide = () => {
        setUiState(prev => ({ ...prev, isTagModalOpen: false, mode: null }))
    }

    const formik = useFormik({
        initialValues: {
            tagGroup: undefined,
            name: undefined,
        },
        validationSchema: createTagSchema,
        onSubmit: async (values) => {
            const onSuccess = async () => {
                await dispatch(fetchTags())
                onHide()
            }
            await dispatch(createTag(values, onSuccess))
        }
    })

    const onOpen = async (tagGroup) => {
        await dispatch(fetchTagGroups())
        setUiState(prev => ({ ...prev, isTagModalOpen: true, mode: "create" }))
        formik.resetForm()
        if (tagGroup) {
            formik.setFieldValue('tagGroup', { value: JSON.stringify({ name: tagGroup }), label: tagGroup })
        }
    }

    return {
        formik,
        onOpen,
        onHide
    }
}