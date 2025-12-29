export class CalculatorTopicSerializer {
  static serialize(topic) {
    const topicFields = topic.calculator_fields || topic.fields || []

    return {
      id: topic.id,
      title: topic.title,
      description: topic.description,
      result_label: topic.result_label,
      result_unit: topic.result_unit,
      clinical_references: topic.clinical_references || [],
      calculator_fields: topicFields.map((field, index) => {
        const fieldOptions = field.field_options || []

        return {
          id: field.id,
          key: field.key,
          label: field.label,
          description: field.description,
          type: field.type,
          unit: field.unit,
          placeholder: field.placeholder,
          is_required: field.is_required,
          order: field.order !== undefined ? field.order : index,
          field_options: fieldOptions.map((option, optIndex) => ({
            id: option.id,
            value: option.value,
            label: option.label,
            order: option.order !== undefined ? option.order : optIndex
          }))
        }
      })
    }
  }
}
