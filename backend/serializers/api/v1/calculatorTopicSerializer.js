import AttachmentService from '#services/attachment/attachmentService'

export class CalculatorTopicSerializer {
  static async serialize(topic) {
    const topicFields = topic.calculator_fields || topic.fields || []
    const topicTags = (topic.calculator_topic_tags || [])
      .filter(tt => tt.tags)
      .map(tt => ({
        id: tt.tags.id,
        name: tt.tags.name,
        tagGroupId: tt.tags.tag_group_id
      }))

    // Process fields with their options and attachments
    const fieldsWithImages = await Promise.all(topicFields.map(async (field, index) => {
      const fieldOptions = field.field_options || []

      // Get attachments for each option
      const optionsWithImages = await Promise.all(fieldOptions.map(async (option, optIndex) => {
        const attachments = await AttachmentService.getAttachmentsWithUrls({
          recordType: 'calculator_field_option',
          recordId: option.id,
          name: 'image'
        })

        const imageAttachment = attachments.length > 0 ? attachments[0] : null

        return {
          id: option.id,
          value: option.value,
          label: option.label,
          order: option.order !== undefined ? option.order : optIndex,
          image: imageAttachment ? {
            url: imageAttachment.url,
            filename: imageAttachment.blob?.filename,
            contentType: imageAttachment.blob?.content_type
          } : null
        }
      }))

      return {
        id: field.id,
        key: field.key,
        label: field.label,
        description: field.description,
        type: field.type,
        unit: field.unit,
        placeholder: field.placeholder,
        display_conditions: field.display_conditions || null,
        is_required: field.is_required,
        order: field.order !== undefined ? field.order : index,
        field_options: optionsWithImages
      }
    }))

    return {
      id: topic.id,
      title: topic.title,
      description: topic.description,
      result_label: topic.result_label,
      result_unit: topic.result_unit,
      clinical_references: topic.clinical_references || [],
      tags: topicTags,
      calculator_fields: fieldsWithImages
    }
  }
}
