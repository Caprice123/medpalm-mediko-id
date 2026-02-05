import AttachmentService from '#services/attachment/attachmentService'

export class CalculatorTopicSerializer {
  static async serialize(topic) {
    // Process fields with their options
    const fields = await Promise.all((topic.calculator_fields || []).map(async field => {
      // Get attachments for each option
      const optionsWithImages = await Promise.all((field.field_options || []).map(async opt => {
        const attachments = await AttachmentService.getAttachmentsWithUrls({
          recordType: 'calculator_field_option',
          recordId: opt.id,
          name: 'image'
        })

        const imageAttachment = attachments.length > 0 ? attachments[0] : null

        return {
          value: opt.value,
          label: opt.label,
          image: imageAttachment ? {
            id: imageAttachment.blob_id,
            url: imageAttachment.url,
            key: imageAttachment.blob?.key,
            filename: imageAttachment.blob?.filename,
            contentType: imageAttachment.blob?.content_type,
            byteSize: imageAttachment.blob?.byte_size
          } : null
        }
      }))

      return {
        key: field.key,
        type: field.type,
        label: field.label,
        placeholder: field.placeholder,
        description: field.description,
        unit: field.unit,
        display_conditions: field.display_conditions || null,
        is_required: field.is_required,
        options: optionsWithImages
      }
    }))

    const classifications = (topic.calculator_classifications || []).map(classification => ({
      name: classification.name,
      options: (classification.options || []).map(opt => ({
        value: opt.value,
        label: opt.label,
        conditions: (opt.conditions || []).map(cond => ({
          result_key: cond.result_key,
          operator: cond.operator,
          value: cond.value,
          logical_operator: cond.logical_operator
        }))
      }))
    }))

    const tags = (topic.calculator_topic_tags || []).map(tt => tt.tags)

    return {
      id: topic.id,
      title: topic.title,
      description: topic.description,
      clinical_references: topic.clinical_references,
      formula: topic.formula,
      result_label: topic.result_label,
      result_unit: topic.result_unit,
      status: topic.status,
      fields,
      classifications,
      tags
    }
  }
}
