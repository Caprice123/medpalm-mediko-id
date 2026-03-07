import AttachmentService from '#services/attachment/attachmentService'

export class CalculatorTopicSerializer {
  static async serialize(topic) {
    // Process fields with their options
    const fields = await Promise.all((topic.calculator_fields || []).map(async field => {
      // Get field-level image attachment
      const fieldAttachments = await AttachmentService.getAttachmentsWithUrls({
        recordType: 'calculator_field',
        recordId: field.id,
        name: 'image'
      })
      const fieldImage = fieldAttachments.length > 0 ? fieldAttachments[0] : null

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
        image: fieldImage ? {
          id: fieldImage.blob_id,
          url: fieldImage.url,
          key: fieldImage.blob?.key,
          filename: fieldImage.blob?.filename,
          contentType: fieldImage.blob?.content_type,
          byteSize: fieldImage.blob?.byte_size
        } : null,
        options: optionsWithImages
      }
    }))

    const results = (topic.calculator_results || []).map(result => ({
      key: result.key,
      formula: result.formula,
      result_label: result.result_label,
      result_unit: result.result_unit
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
      uniqueId: topic.unique_id,
      title: topic.title,
      description: topic.description,
      clinical_references: topic.clinical_references,
      status: topic.status,
      fields,
      results,
      classifications,
      tags
    }
  }
}
