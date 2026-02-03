import prisma from '#prisma/client'
import { ValidationError } from '#errors/validationError'

/**
 * Service to save/update the current diagram data to skripsi_tabs.content
 * This is called after generation and during auto-save to persist the diagram state
 */
export class SaveTabDiagramService {
  static async call({ tabId, userId, diagramData }) {
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
      throw new ValidationError('Tab not found or access denied')
    }

    // Ensure tab is diagram_builder type
    if (tab.tab_type !== 'diagram_builder') {
      throw new ValidationError('This tab is not a diagram builder')
    }

    // Save diagram data to tab content
    const updatedTab = await prisma.skripsi_tabs.update({
      where: { id: tabId },
      data: {
        content: JSON.stringify(diagramData),
        updated_at: new Date()
      }
    })

    return {
      tabId: updatedTab.id,
      content: JSON.parse(updatedTab.content || '{}'),
      updatedAt: updatedTab.updated_at
    }
  }
}
