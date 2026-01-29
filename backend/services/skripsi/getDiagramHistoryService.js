import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'
import { NotFoundError } from '#errors/notFoundError'

export class GetDiagramHistoryService extends BaseService {
  static async call({ tabId, userId }) {
    // Verify ownership through the set
    const tab = await prisma.skripsi_tabs.findFirst({
      where: {
        id: tabId
      },
      include: {
        skripsi_set: true
      }
    })

    if (!tab || tab.skripsi_set.user_id !== userId) {
      throw new NotFoundError('Tab not found')
    }

    // Fetch diagrams for this tab (exclude diagram_data for performance)
    const diagrams = await prisma.skripsi_diagrams.findMany({
      where: {
        tab_id: tabId
      },
      select: {
        id: true,
        tab_id: true,
        diagram_type: true,
        detail_level: true,
        orientation: true,
        layout_style: true,
        description: true,
        creation_method: true,
        credits_used: true,
        created_at: true
        // diagram_data excluded for performance
      },
      orderBy: {
        created_at: 'desc' // Newest first
      }
    })

    // Transform to camelCase format for frontend
    const serializedDiagrams = diagrams.map(diagram => ({
      id: diagram.id,
      tabId: diagram.tab_id,
      diagramType: diagram.diagram_type,
      detailLevel: diagram.detail_level,
      orientation: diagram.orientation,
      layoutStyle: diagram.layout_style,
      description: diagram.description,
      creationMethod: diagram.creation_method,
      creditsUsed: parseFloat(diagram.credits_used.toString()),
      createdAt: diagram.created_at.toISOString()
      // diagramData excluded - use detail endpoint to fetch
    }))

    return serializedDiagrams
  }
}
