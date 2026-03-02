import { useFormik } from "formik"
import { useDispatch } from "react-redux"
import { updateTag, fetchAdminTags } from '@store/tags/adminAction'
import { updateTagSchema } from "../../validationSchema/updateTagSchema"
import { fetchTagGroups } from "../../../../../store/tagGroups/action"

export const useUpdateTag = (setUiState) => {
    const dispatch = useDispatch()

    const formik = useFormik({
        initialValues: {
            tagGroup: undefined,
            name: undefined,
        },
        validationSchema: updateTagSchema,
        onSubmit: async (values) => {
            const onSuccess = async () => {
                await dispatch(fetchAdminTags())
                onHide()
            }
            await dispatch(updateTag(values.id, values, onSuccess))
        }
    })

    const onOpen = async (tag, tagGroupName) => {
        await dispatch(fetchTagGroups())
        setUiState(prev => ({ ...prev, isTagModalOpen: true, mode: "update" }))
        formik.resetForm()
        formik.setValues({
            id: tag.id,
            tagGroup: { value: JSON.stringify({ name: tagGroupName }), label: tagGroupName },
            name: tag.name
        })
    }

    const onHide = () => {
        setUiState(prev => ({ ...prev, isTagModalOpen: false, mode: null }))
    }

    return {
        formik,
        onOpen,
        onHide
    }
}