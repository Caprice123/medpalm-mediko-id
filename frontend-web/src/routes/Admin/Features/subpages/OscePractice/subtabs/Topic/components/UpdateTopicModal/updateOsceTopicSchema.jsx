
import * as Yup from 'yup'

export const updateOsceTopicSchema = Yup.object().shape({
  title: Yup.string()
    .required('Title is required')
    .min(3, 'Title must be at least 3 characters'),
  description: Yup.string(),
  scenario: Yup.string()
    .required('Scenario is required')
    .min(10, 'Scenario must be at least 10 characters'),
  aiModel: Yup.string()
    .required('AI Model is required'),
  rubricId: Yup.number()
    .required('Rubric is required')
    .nullable(),
  durationMinutes: Yup.number()
    .required('Duration is required')
    .positive('Duration must be positive')
    .integer('Duration must be a whole number'),
  topicTags: Yup.array().min(1, 'At least one topic tag is required'),
  batchTags: Yup.array().min(1, 'At least one batch tag is required'),
  status: Yup.string().oneOf(['draft', 'published'])
})