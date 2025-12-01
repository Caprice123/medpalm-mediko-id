import { useFormik } from "formik"
import { useDispatch } from "react-redux"
import { updateTag, fetchTags } from '@store/tags/action'
import { useParams } from "react-router-dom"
import { updateTagSchema } from "../../validationSchema/updateTagSchema"
import { fetchTagGroups } from "../../../../../store/tagGroups/action"

export const useUpdateTag = (setUiState) => {
    const dispatch = useDispatch()
    const { id } = useParams()

    const formik = useFormik({
        initialValues: {
            tagGroup: undefined,
            name: undefined,
        },
        validationSchema: updateTagSchema,
        onSubmit: async (values) => {
            const onSuccess = async () => {
                await dispatch(fetchTags())
                onHide()
            }
            await dispatch(updateTag(id, values, onSuccess))
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