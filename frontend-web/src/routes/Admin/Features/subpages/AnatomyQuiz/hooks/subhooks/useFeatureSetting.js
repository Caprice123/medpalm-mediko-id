import { useFormik } from "formik"
import { featureSettingSchema } from "../../validationSchema/featureSettingSchema"
import { useDispatch } from "react-redux"
import { updateAnatomyConstants } from "@store/anatomy/action"
import { fetchAnatomyConstants } from "../../../../../../../store/anatomy/action"

export const useFeatureSetting = (setUiState) => {
    const dispatch = useDispatch()
    const form = useFormik({
        initialValues: {
            anatomy_feature_title: '',
            anatomy_feature_description: '',
            anatomy_access_type: 'subscription',
            anatomy_credit_cost: '0',
            anatomy_is_active: true
        },
        validationSchema: featureSettingSchema,
        onSubmit: (values) => {
            dispatch(updateAnatomyConstants(values))
        }
    })

    const onOpen = async () => {
        setUiState(prev => ({ ...prev, setIsFeatureSettingModalOpen: true }))
        const constants = await dispatch(fetchAnatomyConstants())
        form.setValues(constants)
    }
    const onClose = () => {
        setUiState(prev => ({ ...prev, setIsFeatureSettingModalOpen: false }))
    }

    return {
        form,
        onOpen,
        onClose
    }
}