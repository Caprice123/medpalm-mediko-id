import prisma from '#prisma/client'
import { GenerateDiagramService } from '#services/skripsi/generateDiagramService'
import { GetDiagramHistoryService } from '#services/skripsi/getDiagramHistoryService'
import { UpdateDiagramService } from '#services/skripsi/updateDiagramService'

class SkripsiDiagramsController {
  /**
   * Generate a diagram using AI
   * POST /api/v1/skripsi/tabs/:tabId/diagrams
   */
  static async generateDiagram(req, res) {
    const { tabId } = req.params
    const { type, detailLevel, orientation, layoutStyle, description } = req.body
    const userId = req.user.id

      // Call service (no streaming)
      const result = await GenerateDiagramService.call({
        tabId: parseInt(tabId),
        userId,
        diagramConfig: {
          type,
          detailLevel,
          orientation,
          layoutStyle,
          description: description.trim()
        }
      })

      res.json({
        data: {
          diagramId: result.diagramId,
          diagram: result.diagram
        }
      })

    // const diagram = await prisma.skripsi_diagrams.findFirst({
    //     where: { id: 10 }
    // })
    // res.json({
    //     data: {
    //       diagramId: diagram.id,
    //       diagram: diagram.diagram_data
    //     }
    //   }) 
  }

  /**
   * Get diagram history for a tab
   * GET /api/v1/skripsi/tabs/:tabId/diagrams
   */
  static async getDiagramHistory(req, res) {
    const { tabId } = req.params
    const userId = req.user.id

      const diagrams = await GetDiagramHistoryService.call({
        tabId: parseInt(tabId),
        userId
      })

      res.json({
        data: diagrams
      })
  }

  /**
   * Update an existing diagram (after user edits it)
   * PUT /api/v1/skripsi/diagrams/:diagramId
   */
  static async updateDiagram(req, res) {
    const { diagramId } = req.params
    const { diagramData } = req.body
    const userId = req.user.id

      const result = await UpdateDiagramService.call({
        diagramId: parseInt(diagramId),
        userId,
        diagramData
      })

      res.json({
        data: result
      })
  }
}

export default SkripsiDiagramsController
