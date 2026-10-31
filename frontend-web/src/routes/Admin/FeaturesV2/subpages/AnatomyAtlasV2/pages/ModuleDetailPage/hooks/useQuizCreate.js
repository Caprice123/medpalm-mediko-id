import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useFormik } from 'formik'
import { createAnatomyQuizV2, fetchAnatomyQuizV2, clearAnatomyQuizDetail } from '@store/anatomy/adminAction'
import { updateNodeAnatomyQuiz } from '@store/nodeAnatomy/adminAction'

export function useQuizCreate(onSuccess, nodeId, quiz = null) {
  const dispatch = useDispatch()
  const { detail, loading: anatomyLoading } = useSelector(s => s.anatomy)
  const { loading: nodeAnatomyLoading } = useSelector(s => s.nodeAnatomy)
  const isEdit = !!quiz
  const uniqueId = quiz?.uniqueId ?? null

  // Only the uniqueId is taken from the row that opened this form; every field comes from
  // the detail endpoint, since list rows carry no difficulty/estimatedMinutes.
  useEffect(() => {
    if (!uniqueId) return
    dispatch(fetchAnatomyQuizV2(uniqueId))
    return () => dispatch(clearAnatomyQuizDetail())
  }, [dispatch, uniqueId])

  // Guard against a detail left over from a previously opened quiz.
  const current = isEdit && detail?.uniqueId === uniqueId ? detail : null
  const isLoadingDetail = isEdit && !current

  const form = useFormik({
    enableReinitialize: true,
    initialValues: {
      title: current?.title ?? '',
      description: current?.description ?? '',
      embedUrl: current?.embedUrl ?? '',
      questionCount: current?.questionCount ?? '',
      difficulty: current?.difficulty ?? 'medium',
      estimatedMinutes: current?.estimatedMinutes ?? '',
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
        dispatch(updateNodeAnatomyQuiz(uniqueId, payload, () => onSuccess()))
      } else {
        dispatch(createAnatomyQuizV2({ ...payload, nodeId }, () => {
          resetForm()
          onSuccess()
        }))
      }
    },
  })

  const isSaving = isEdit ? nodeAnatomyLoading.isUpdatingQuiz : anatomyLoading.isCreateAnatomyQuizLoading

  return { form, isEdit, isSaving, isLoadingDetail }
}
