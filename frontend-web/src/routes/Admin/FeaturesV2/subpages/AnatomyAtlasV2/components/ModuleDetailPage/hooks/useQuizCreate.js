import { useDispatch, useSelector } from 'react-redux'
import { useFormik } from 'formik'
import { createAnatomyQuizV2 } from '@store/anatomy/adminAction'
import { updateNodeAnatomyQuiz } from '@store/nodeAnatomy/adminAction'

export function useQuizCreate(onSuccess, nodeId, quiz = null) {
  const dispatch = useDispatch()
  const { loading: anatomyLoading } = useSelector(s => s.anatomy)
  const { loading: nodeAnatomyLoading } = useSelector(s => s.nodeAnatomy)
  const isEdit = !!quiz

  const form = useFormik({
    enableReinitialize: true,
    initialValues: {
      title: quiz?.title ?? '',
      description: quiz?.description ?? '',
      embedUrl: quiz?.embedUrl ?? '',
      questionCount: quiz?.questionCount ?? '',
      difficulty: quiz?.difficulty ?? 'medium',
      estimatedMinutes: quiz?.estimatedMinutes ?? '',
    },
    onSubmit: (values, { resetForm }) => {
      const payload = {
        title: values.title.trim(),
        description: values.description.trim(),
        embedUrl: values.embedUrl.trim(),
        questionCount: parseInt(values.questionCount) || 0,
        difficulty: values.difficulty || 'medium',
        estimatedMinutes: values.estimatedMinutes ? parseInt(values.estimatedMinutes) : null,
        tags: [],
        status: 'published',
      }
      if (isEdit) {
        dispatch(updateNodeAnatomyQuiz(quiz.uniqueId, payload, () => onSuccess()))
      } else {
        dispatch(createAnatomyQuizV2({ ...payload, nodeId }, () => {
          resetForm()
          onSuccess()
        }))
      }
    },
  })

  const isSaving = isEdit ? nodeAnatomyLoading.isUpdatingQuiz : anatomyLoading.isCreateAnatomyQuizLoading

  return { form, isEdit, isSaving }
}
