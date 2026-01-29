import prisma from '#prisma/client'

/**
 * Service to create a new diagram entry
 * Can be used for both manually created and AI-generated diagrams
 */
export class CreateDiagramService {
  static async call({ tabId, userId, diagramData, diagramConfig = {}, creationMethod = 'manual' }) {
    // Verify tab exists and belongs to user
    const tab = await prisma.skripsi_tabs.findFirst({
      where: {
        id: tabId,
        skripsi_set: {
          user_id: userId,
          is_deleted: false
        }
      },
      include: {
        skripsi_set: true
      }
    })

    if (!tab) {
      throw new Error('Tab not found or access denied')
    }

    // Ensure tab is diagram_builder type
    if (tab.tab_type !== 'diagram_builder') {
      throw new Error('This tab is not a diagram builder')
    }

    // Validate creation_method
    const validMethods = ['manual', 'ai_generated']
    if (!validMethods.includes(creationMethod)) {
      throw new Error('Invalid creation_method. Must be "manual" or "ai_generated"')
    }

    // Create new diagram entry (fields are nullable for manual diagrams)
    const diagram = await prisma.skripsi_diagrams.create({
      data: {
        tab_id: tabId,
        diagram_type: diagramConfig.type || null,
        detail_level: diagramConfig.detailLevel || null,
        orientation: diagramConfig.orientation || null,
        layout_style: diagramConfig.layoutStyle || null,
        description: diagramConfig.description || null,
        diagram_data: JSON.stringify(diagramData),
        creation_method: creationMethod,
        credits_used: 0 // No credits used for manual diagrams
      }
    })

    return {
      diagramId: diagram.id,
      diagram: JSON.parse(diagram.diagram_data),
      createdAt: diagram.created_at
    }
  }
}
