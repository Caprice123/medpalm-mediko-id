import prisma from '#prisma/client'
import { ValidationError } from '#errors/validationError'

/**
 * Service to get full diagram details including diagram_data
 * Used when loading a specific diagram (not for list views)
 */
export class GetDiagramDetailService {
  static async call({ diagramId, userId }) {
    // Fetch diagram with ownership verification
    const diagram = await prisma.skripsi_diagrams.findFirst({
      where: {
        id: diagramId,
        skripsi_tab: {
          skripsi_set: {
            user_id: userId,
            is_deleted: false
          }
        }
      }
    })

    if (!diagram) {
      throw new ValidationError('Diagram not found or access denied')
    }

    // Parse diagram_data from JSON string
    let parsedDiagramData = null
    try {
      parsedDiagramData = JSON.parse(diagram.diagram_data)
    } catch (error) {
      console.error('Failed to parse diagram_data:', error)
      parsedDiagramData = null
    }

    return {
      id: diagram.id,
      tabId: diagram.tab_id,
      diagramType: diagram.diagram_type,
      detailLevel: diagram.detail_level,
      orientation: diagram.orientation,
      layoutStyle: diagram.layout_style,
      description: diagram.description,
      diagramData: parsedDiagramData, // Full diagram data included
      creationMethod: diagram.creation_method,
      creditsUsed: parseFloat(diagram.credits_used.toString()),
      createdAt: diagram.created_at.toISOString()
    }
  }
}
