import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useFormik } from "formik"
import { upload } from "@store/common/action"
import { arrayMove } from "@dnd-kit/sortable"
import { actions } from "@store/tags/reducer"
import { updateOsceTopic, fetchAdminOsceObservations, fetchAdminOsceRubrics } from '@store/oscePractice/adminAction'
import { updateOsceTopicSchema } from "./updateOsceTopicSchema"

export const useUpdateTopicModal = (onClose) => {
    const dispatch = useDispatch()
    const { topicDetail } = useSelector(state => state.oscePractice)
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
      validationSchema: updateOsceTopicSchema,
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

        dispatch(updateOsceTopic(topicDetail.uniqueId, payload, () => {
          onClose()
        }))
      }
    })

    useEffect(() => {
      dispatch(actions.updateFilter({ key: "tagGroupNames", value: ['topic', 'batch'] }))
      dispatch(fetchAdminOsceObservations())
      dispatch(fetchAdminOsceRubrics())
    }, [dispatch])

    // Populate form when topicDetail loads
    useEffect(() => {
      if (topicDetail) {
        const topicTagsFromTopic = topicDetail.tags?.filter(tag =>
          tag.tagGroup?.name === 'topic'
        ) || []
        const batchTagsFromTopic = topicDetail.tags?.filter(tag =>
          tag.tagGroup?.name === 'batch'
        ) || []

        form.setValues({
          title: topicDetail.title || '',
          description: topicDetail.description || '',
          scenario: topicDetail.scenario || '',
          guide: topicDetail.guide || '',
          context: topicDetail.context || '',
          answerKey: topicDetail.answerKey || '',
          physicalExamGuideline: topicDetail.physicalExamGuideline || '',
          knowledgeBase: (topicDetail.knowledgeBase && topicDetail.knowledgeBase.length > 0) ? topicDetail.knowledgeBase : [{ key: '', value: '' }],
          observations: topicDetail.observations ? topicDetail.observations.map(obs => ({
            observationId: obs.observationId,
            observationName: obs.observationName,
            groupName: obs.groupName,
            observationText: obs.observationText || '',
            blobId: obs.observationImageBlobId,
            filename: obs.observationImageFilename,
            size: obs.observationImageSize,
            url: obs.observationImageUrl,
            contentType: obs.observationImageContentType,
            requiresInterpretation: obs.requiresInterpretation || false
          })) : [],
          aiModel: topicDetail.aiModel || 'gemini-2.5-flash',
          attachments: topicDetail.attachments ? topicDetail.attachments.map(att => ({
            blobId: att.blobId,
            filename: att.filename,
            url: att.url,
            contentType: att.contentType,
            existing: true
          })) : [],
          rubricId: topicDetail.rubricId || '',
          durationMinutes: topicDetail.durationMinutes || 15,
          topicTags: topicTagsFromTopic,
          batchTags: batchTagsFromTopic,
          status: topicDetail.status || 'draft'
        })
      }
    }, [topicDetail])

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
