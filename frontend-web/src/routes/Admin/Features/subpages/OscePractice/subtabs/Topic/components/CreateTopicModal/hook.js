import { useEffect } from "react"
import { useDispatch } from "react-redux"
import { createOscePracticeSchema } from "./createOscePracticeSchema"
import { useFormik } from "formik"
import { fetchAdminOsceObservations } from "@store/oscePractice/adminAction"
import { createOsceTopic, fetchAdminOsceRubrics } from "@store/oscePractice/adminAction"
import { upload } from "@store/common/action"
import { arrayMove } from "@dnd-kit/sortable"
import { actions } from "@store/tags/reducer"

export const useCreateTopicModal = (onClose) => {
    const dispatch = useDispatch()
    const form = useFormik({
      initialValues: {
        title: '',
        description: '',
        scenario: '',
        guide: '',
        context: '',
        answerKey: '',
        physicalExamGuideline: '',
        knowledgeBase: [
          { key: '', value: '' }
        ],
        observations: [],
        aiModel: 'gemini-2.5-flash',
        attachments: [],
        rubricId: null,
        durationMinutes: 15,
        topicTags: [],
        batchTags: [],
        status: 'draft',
      },
      validationSchema: createOscePracticeSchema,
      onSubmit: async (values) => {
        const allTags = [...values.topicTags, ...values.batchTags].map(tag => tag.id || tag)
  
        const payload = {
          title: values.title,
          description: values.description,
          scenario: values.scenario,
          guide: values.guide,
          context: values.context,
          answerKey: values.answerKey,
          physicalExamGuideline: values.physicalExamGuideline,
          knowledgeBase: values.knowledgeBase,
          aiModel: values.aiModel,
          rubricId: values.rubricId,
          durationMinutes: parseInt(values.durationMinutes),
          tags: allTags,
          status: values.status,
          attachments: (values.attachments || []).map(att => ({
            blobId: att.blobId,
            filename: att.filename
          })),
          observations: (values.observations || []).map((obs, index) => ({
            observationId: obs.observationId,
            observationText: obs.observationText,
            observationImageBlobId: obs.blobId,
            requiresInterpretation: obs.requiresInterpretation,
            order: index
          }))
        }
  
        dispatch(createOsceTopic(payload, () => {
          onClose()
        }))
      }
    })

    useEffect(() => {
      dispatch(actions.updateFilter({ key: "tagGroupNames", value: ['topic', 'batch'] }))
      dispatch(fetchAdminOsceObservations())
      dispatch(fetchAdminOsceRubrics())
    }, [dispatch])

    const handleMultipleFilesSelect = async (files) => {
      for (const file of files) {
        // Validate file type
        if (!file.type.startsWith('image/')) {
          alert(`${file.name} is not an image file`)
          continue
        }
  
        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
          alert(`${file.name} is too large. Maximum size is 5MB`)
          continue
        }

        const result = await dispatch(upload(file, 'osce_topic_attachment'))
        if (result) {
          form.setFieldValue('attachments', prev => [...prev, {
            blobId: result.blobId,
            filename: result.filename,
            size: result.byteSize,
            url: result.url,
            contentType: result.contentType
          }])
        }
      }
    }
  
    const handleRemoveAttachment = (index) => {
      form.setFieldValue('attachments', prev => prev.filter((_, i) => i !== index))
    }
  
    const handleDragEnd = (event) => {
      const { active, over } = event
  
      if (active.id !== over.id) {
        form.setFieldValue('attachments', (items) => {
          const oldIndex = items.findIndex(item => (item.blobId || items.indexOf(item)) === active.id)
          const newIndex = items.findIndex(item => (item.blobId || items.indexOf(item)) === over.id)
          return arrayMove(items, oldIndex, newIndex)
        })
      }
    }

    return {
      form,
      handleMultipleFilesSelect,
      handleRemoveAttachment,
      handleDragEnd
    }
}
