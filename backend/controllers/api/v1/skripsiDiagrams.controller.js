import prisma from '#prisma/client'
import { GenerateDiagramService } from '#services/skripsi/generateDiagramService'
import { GetDiagramHistoryService } from '#services/skripsi/getDiagramHistoryService'
import { GetDiagramDetailService } from '#services/skripsi/getDiagramDetailService'
import { UpdateDiagramService } from '#services/skripsi/updateDiagramService'
import { CreateDiagramService } from '#services/skripsi/createDiagramService'

class SkripsiDiagramsController {
  /**
   * Generate a diagram using AI
   * POST /api/v1/skripsi/tabs/:tabId/diagrams
   */
  static async generateDiagram(req, res) {
    const { tabId } = req.params
    const { type, detailLevel, orientation, layoutStyle, description } = req.body
    const userId = req.user.id

    try {
      // Call service to generate diagram
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
        data: result
      })
    } catch (error) {
      console.error('Error generating diagram:', error)
      res.status(error.statusCode || 500).json({
        error: error.message || 'Failed to generate diagram'
      })
    }

    // const diagram = await prisma.skripsi_diagrams.findFirst({
    //     where: { id: 13 }
    // })
    // res.json({
    //     data: {
    //       diagramId: diagram.id,
    //       diagram: JSON.parse(diagram.diagram_data)
    //     }
    //   })
  }

  /**
   * Get diagram history for a tab (without diagram_data for performance)
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
   * Get full diagram details including diagram_data
   * GET /api/v1/skripsi/diagrams/:diagramId
   */
  static async getDiagramDetail(req, res) {
    const { diagramId } = req.params
    const userId = req.user.id

    try {
      const diagram = await GetDiagramDetailService.call({
        diagramId: parseInt(diagramId),
        userId
      })

      res.json({
        data: diagram
      })
    } catch (error) {
      console.error('Error fetching diagram detail:', error)
      res.status(error.message.includes('not found') || error.message.includes('access denied') ? 404 : 500).json({
        error: error.message || 'Failed to fetch diagram detail'
      })
    }
  }

  /**
   * Create a new diagram entry
   * POST /api/v1/skripsi/tabs/:tabId/diagrams/manual
   */
  static async createDiagram(req, res) {
    const { tabId } = req.params
    const { diagramData, diagramConfig, creationMethod } = req.body
    const userId = req.user.id

    try {
      const result = await CreateDiagramService.call({
        tabId: parseInt(tabId),
        userId,
        diagramData,
        diagramConfig,
        creationMethod: creationMethod || 'manual' // Default to 'manual' if not provided
      })

      res.json({
        data: result
      })
    } catch (error) {
      console.error('Error creating diagram:', error)
      res.status(error.message.includes('not found') || error.message.includes('access denied') ? 404 : 400).json({
        error: error.message || 'Failed to create diagram'
      })
    }
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
