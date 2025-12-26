import prisma from '../../../prisma/client.js'

const updateSkripsiConstantService = async (key, value) => {
  // Validate based on key type
  switch (key) {
    case 'credits_per_message':
      if (isNaN(value) || parseInt(value) < 0) {
        throw new Error(`${key} must be a positive number`)
      }
      break

    case 'max_ai_researcher_tabs':
      const tabs = parseInt(value)
      if (isNaN(tabs) || tabs < 1 || tabs > 3) {
        throw new Error('max_ai_researcher_tabs must be between 1 and 3')
      }
      break

    case 'enable_paraphraser':
    case 'enable_diagram_builder':
      if (value !== 'true' && value !== 'false') {
        throw new Error(`${key} must be 'true' or 'false'`)
      }
      break

    case 'ai_model':
      if (!value || value.trim().length === 0) {
        throw new Error('ai_model cannot be empty')
      }
      break
  }

  // Update or create the constant
  const constant = await prisma.skripsi_constants.upsert({
    where: { key },
    update: {
      value: value.toString(),
      updated_at: new Date()
    },
    create: {
      key,
      value: value.toString()
    }
  })

  return constant
}

export default updateSkripsiConstantService
