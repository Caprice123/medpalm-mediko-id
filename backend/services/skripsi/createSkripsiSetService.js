import prisma from '../../prisma/client.js'
import { BaseService } from '../baseService.js'
import { ValidationError } from '../../errors/validationError.js'

export class CreateSkripsiSetService extends BaseService {
  static async call({ userId, title, description }) {
    if (!title || title.trim() === '') {
      throw new ValidationError('Title is required')
    }

    // Create the set
    const set = await prisma.skripsi_sets.create({
      data: {
        user_id: userId,
        title: title.trim(),
        description: description?.trim() || null,
        editor_content: ''
      }
    })

    // Get constants to determine which tabs to create
    const constants = await prisma.constants.findMany({
      where: {
        key: {
          in: [
            'skripsi_ai_researcher_enabled',
            'skripsi_ai_researcher_count',
            'skripsi_paraphraser_enabled',
            'skripsi_diagram_builder_enabled'
          ]
        }
      }
    })

    const constantsMap = Object.fromEntries(
      constants.map(c => [c.key, c.value])
    )

    // Build tabs array based on constants
    const tabsToCreate = []

    // Add AI Researcher tabs
    const aiResearcherEnabled = constantsMap['skripsi_ai_researcher_enabled'] === 'true'
    const aiResearcherCount = parseInt(constantsMap['skripsi_ai_researcher_count'] || '3')

    if (aiResearcherEnabled) {
      for (let i = 1; i <= aiResearcherCount; i++) {
        tabsToCreate.push({
          tab_type: `ai_researcher_${i}`,
          title: `AI Researcher ${i}`
        })
      }
    }

    // Add Paraphraser tab
    const paraphraserEnabled = constantsMap['skripsi_paraphraser_enabled'] === 'true'
    if (paraphraserEnabled) {
      tabsToCreate.push({
        tab_type: 'paraphraser',
        title: 'Paraphraser'
      })
    }

    // Add Diagram Builder tab
    const diagramBuilderEnabled = constantsMap['skripsi_diagram_builder_enabled'] === 'true'
    if (diagramBuilderEnabled) {
      tabsToCreate.push({
        tab_type: 'diagram_builder',
        title: 'Diagram Builder'
      })
    }

    // Create tabs if any are configured
    if (tabsToCreate.length > 0) {
      await prisma.skripsi_tabs.createMany({
        data: tabsToCreate.map(tab => ({
          set_id: set.id,
          tab_type: tab.tab_type,
          title: tab.title,
          content: ''
        }))
      })
    }

    // Fetch the complete set with tabs
    const completeSet = await prisma.skripsi_sets.findUnique({
      where: { id: set.id },
      include: {
        tabs: {
          orderBy: { id: 'asc' }
        }
      }
    })

    return completeSet
  }
}
