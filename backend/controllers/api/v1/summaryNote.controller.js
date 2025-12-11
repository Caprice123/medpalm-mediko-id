import { GetSummaryNotesService } from '../../../services/summaryNotes/getSummaryNotesService.js'
import { GetSummaryNoteByIdService } from '../../../services/summaryNotes/getSummaryNoteByIdService.js'
import { StartSummaryNoteSessionService } from '../../../services/summaryNotes/startSummaryNoteSessionService.js'
import { GetSummaryNoteSessionService } from '../../../services/summaryNotes/getSummaryNoteSessionService.js'

class SummaryNoteController {
  // Get all available summary notes for users
  async index(req, res) {
    const result = await GetSummaryNotesService.call(req.query)

    return res.status(200).json({
      success: true,
      data: result.data,
      pagination: result.pagination
    })
  }

  // Get a single summary note by ID
  async show(req, res) {
    const { id } = req.params

    const note = await GetSummaryNoteByIdService.call({ noteId: id })

    return res.status(200).json({
      success: true,
      data: note
    })
  }

  // Start a summary note session (select topic and deduct credits)
  async start(req, res) {
    const { userLearningSessionId, summaryNoteId } = req.body
    const userId = req.user.id

    const result = await StartSummaryNoteSessionService.call({
      userLearningSessionId,
      summaryNoteId,
      userId
    })

    return res.status(200).json({
      success: true,
      data: result,
      message: 'Summary note session started successfully'
    })
  }

  // Get session content
  async getSession(req, res) {
    const { sessionId } = req.params
    const userId = req.user.id

    const session = await GetSummaryNoteSessionService.call({
      userLearningSessionId: sessionId,
      userId
    })

    return res.status(200).json({
      success: true,
      data: session
    })
  }
}

export default new SummaryNoteController()
