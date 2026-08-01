import { GetNodeDiagnosticQuestionsService } from '#services/diagnostic/v2/admin/getNodeDiagnosticQuestionsService'
import { AddNodeDiagnosticQuestionService } from '#services/diagnostic/v2/admin/addNodeDiagnosticQuestionService'
import { UpdateNodeDiagnosticQuestionService } from '#services/diagnostic/v2/admin/updateNodeDiagnosticQuestionService'
import { DeleteNodeDiagnosticQuestionService } from '#services/diagnostic/v2/admin/deleteNodeDiagnosticQuestionService'
import { ImportDiagnosticQuestionsService } from '#services/diagnostic/v2/admin/importDiagnosticQuestionsService'
import XLSX from 'xlsx'

class DiagnosticNodesController {
  async getQuestions(req, res) {
    const { nodeId } = req.params
    const { page, perPage, search } = req.query
    const result = await GetNodeDiagnosticQuestionsService.call({ nodeId, page, perPage, search })
    res.json({ success: true, ...result })
  }

  async addQuestion(req, res) {
    const { nodeId } = req.params
    const { question, vignette, imageBlobId, imageCaption, answer, answerType, choices, explanation } = req.body
    const newQ = await AddNodeDiagnosticQuestionService.call({
      nodeId, question, vignette, imageBlobId, imageCaption, answer, answerType, choices, explanation,
    })
    res.status(201).json({ success: true, data: newQ })
  }

  async updateQuestion(req, res) {
    const { questionId } = req.params
    const { question, vignette, imageBlobId, imageCaption, answer, answerType, choices, explanation } = req.body
    const updated = await UpdateNodeDiagnosticQuestionService.call({
      questionId, question, vignette, imageBlobId, imageCaption, answer, answerType, choices, explanation,
    })
    res.json({ success: true, data: updated })
  }

  async deleteQuestion(req, res) {
    const { questionId } = req.params
    await DeleteNodeDiagnosticQuestionService.call({ questionId })
    res.json({ success: true })
  }

  async importQuestions(req, res) {
    const { nodeId } = req.params
    const buffer = req.file?.buffer
    if (!buffer) return res.status(400).json({ success: false, message: 'File tidak ditemukan' })
    const result = await ImportDiagnosticQuestionsService.call({ nodeId, buffer })
    res.json({ success: true, data: result })
  }

  downloadTemplate(req, res) {
    const wb = XLSX.utils.book_new()
    const ws = XLSX.utils.aoa_to_sheet([
      ['Pertanyaan', 'Vignette', 'Tipe', 'Pilihan A', 'Pilihan B', 'Pilihan C', 'Pilihan D', 'Pilihan E', 'Jawaban Benar', 'Keterangan Gambar'],
      ['Apa diagnosis yang paling mungkin?', 'Pasien 30 thn dengan sesak napas...', 'multiple_choice', 'Pneumonia', 'Asma', 'PPOK', 'TB Paru', '', 'Pneumonia', ''],
    ])
    XLSX.utils.book_append_sheet(wb, ws, 'Pertanyaan')
    const buf = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' })
    res.setHeader('Content-Disposition', 'attachment; filename="template_pertanyaan_diagnostik.xlsx"')
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
    res.send(buf)
  }
}

export default new DiagnosticNodesController()
