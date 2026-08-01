import XLSX from 'xlsx'
import { GetNodeQuestionsService } from '#services/mcq/v2/admin/getNodeQuestionsService'
import { AddNodeQuestionService } from '#services/mcq/v2/admin/addNodeQuestionService'
import { UpdateNodeQuestionService } from '#services/mcq/v2/admin/updateNodeQuestionService'
import { DeleteNodeQuestionService } from '#services/mcq/v2/admin/deleteNodeQuestionService'
import { MoveNodeQuestionService } from '#services/mcq/v2/admin/moveNodeQuestionService'
import { ImportQuestionsService } from '#services/mcq/v2/admin/importQuestionsService'
import { NodeQuestionsSerializer } from '#serializers/admin/v1/nodeQuestionsSerializer'

class NodeQuestionsController {
  async getNodeQuestions(req, res) {
    const { nodeId } = req.params
    const { page = 1, perPage = 20 } = req.query
    const { questions, pagination } = await GetNodeQuestionsService.call({ nodeId, page, perPage })
    return res.status(200).json({ data: NodeQuestionsSerializer.serializeList(questions), pagination })
  }

  async addNodeQuestion(req, res) {
    const { nodeId } = req.params
    const { question, options, correctIndex, explanation, references, blobId } = req.body
    const created = await AddNodeQuestionService.call({ nodeId, question, options, correctIndex, explanation, references, blobId })
    return res.status(201).json({ data: NodeQuestionsSerializer.serialize(created) })
  }

  async updateNodeQuestion(req, res) {
    const { questionId } = req.params
    const { question, options, correctIndex, explanation, references, blobId } = req.body
    const updated = await UpdateNodeQuestionService.call({ questionId, question, options, correctIndex, explanation, references, blobId })
    return res.status(200).json({ data: NodeQuestionsSerializer.serialize(updated) })
  }

  async deleteNodeQuestion(req, res) {
    const { nodeId, questionId } = req.params
    await DeleteNodeQuestionService.call({ nodeId, questionId })
    return res.status(200).json({ data: { success: true } })
  }

  async moveNodeQuestion(req, res) {
    const { nodeId, questionId } = req.params
    const { targetNodeId } = req.body
    await MoveNodeQuestionService.call({ nodeId, questionId, targetNodeId })
    return res.status(200).json({ data: { success: true } })
  }

  async importQuestions(req, res) {
    const { nodeId } = req.params
    const results = await ImportQuestionsService.call({ nodeId, buffer: req.file.buffer })
    return res.status(200).json({ data: results })
  }

  downloadTemplate(req, res) {
    const wb = XLSX.utils.book_new()
    const ws = XLSX.utils.aoa_to_sheet([
      ['Pertanyaan', 'Opsi A', 'Opsi B', 'Opsi C', 'Opsi D', 'Jawaban Benar', 'Penjelasan'],
      ['Berapa ruang jantung manusia?', '2 ruang', '3 ruang', '4 ruang', '5 ruang', 'C', 'Jantung memiliki 4 ruang'],
    ])
    ws['!cols'] = [{ wch: 40 }, { wch: 20 }, { wch: 20 }, { wch: 20 }, { wch: 20 }, { wch: 16 }, { wch: 40 }]
    XLSX.utils.book_append_sheet(wb, ws, 'Template Soal MCQ')
    const buffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' })
    res.setHeader('Content-Disposition', 'attachment; filename="template-soal-mcq.xlsx"')
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
    return res.send(buffer)
  }
}

export default new NodeQuestionsController()
