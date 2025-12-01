import * as Yup from 'yup'

export const createCalculatorTopicSchema = Yup.object({
  title: Yup.string().required('Title is required'),
  description: Yup.string().required('Description is required'),
  clinical_references: Yup.array().min(1, 'At least one reference is required'),
  tags: Yup.array().min(1, 'At least one tag is required'),
  formula: Yup.string().required('Formula is required'),
  result_label: Yup.string().required('Result label is required'),
  result_unit: Yup.string().required('Result unit is required'),
  fields: Yup.array().min(1, 'At least one field is required'),
  classifications: Yup.array().min(1, 'At least one classification is required'),
})