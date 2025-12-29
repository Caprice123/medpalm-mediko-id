export class CalculatorTopicSerializer {
  static serialize(topic) {
    const fields = (topic.calculator_fields || []).map(field => ({
      key: field.key,
      type: field.type,
      label: field.label,
      placeholder: field.placeholder,
      description: field.description,
      unit: field.unit,
      is_required: field.is_required,
      options: (field.field_options || []).map(opt => ({
        value: opt.value,
        label: opt.label
      }))
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
