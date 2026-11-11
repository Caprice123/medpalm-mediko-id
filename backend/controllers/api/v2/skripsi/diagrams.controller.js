import { GenerateDiagramService } from '#services/skripsi/generateDiagramService'
import { GetDiagramHistoryService } from '#services/skripsi/getDiagramHistoryService'
import { GetDiagramDetailService } from '#services/skripsi/getDiagramDetailService'
import { UpdateDiagramService } from '#services/skripsi/updateDiagramService'
import { CreateDiagramService } from '#services/skripsi/createDiagramService'
import { ValidationError } from '#errors/validationError'

// Diagram business logic is unchanged between V1 and V2 — the same services
// answer both. What changes is the error handling: V1 wrapped each action in
// its own try/catch that string-matched `error.message` for 'not found' to
// choose a status code, and reported failures as a bare `{ error }` body that
// no other endpoint in the project uses. Here the errors carry their own
// status through asyncHandler, like every other route.
class SkripsiDiagramsV2Controller {
  async generate(req, res) {
    const { type, detailLevel, orientation, layoutStyle, description } = req.body

    if (!description || !description.trim()) {
      throw new ValidationError('Deskripsi diagram wajib diisi')
    }

    const result = await GenerateDiagramService.call({
      tabId: parseInt(req.params.tabId),
      userId: req.user.id,
      diagramConfig: {
        type,
        detailLevel,
        orientation,
        layoutStyle,
        description: description.trim(),
      },
    })

    return res.status(200).json({ data: result })
  }

  // The history list deliberately omits diagram_data: a stored canvas is large
  // and the list only needs to name its entries.
  async history(req, res) {
    const diagrams = await GetDiagramHistoryService.call({
      tabId: parseInt(req.params.tabId),
      userId: req.user.id,
    })

    return res.status(200).json({ data: diagrams })
  }

  async show(req, res) {
    const diagram = await GetDiagramDetailService.call({
      diagramId: parseInt(req.params.diagramId),
      userId: req.user.id,
    })

    return res.status(200).json({ data: diagram })
  }

  // A diagram the user drew rather than generated.
  async create(req, res) {
    const { diagramData, diagramConfig, creationMethod } = req.body

    if (!diagramData) {
      throw new ValidationError('Data diagram wajib diisi')
    }

    const result = await CreateDiagramService.call({
      tabId: parseInt(req.params.tabId),
      userId: req.user.id,
      diagramData,
      diagramConfig,
      creationMethod: creationMethod || 'manual',
    })

    return res.status(201).json({ data: result })
  }

  async update(req, res) {
    const { diagramData } = req.body

    if (!diagramData) {
      throw new ValidationError('Data diagram wajib diisi')
    }

    const result = await UpdateDiagramService.call({
      diagramId: parseInt(req.params.diagramId),
      userId: req.user.id,
      diagramData,
    })

    return res.status(200).json({ data: result })
  }
}

export default new SkripsiDiagramsV2Controller()
