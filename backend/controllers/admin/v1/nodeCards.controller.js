import XLSX from 'xlsx'
import { GetNodeCardsService } from '#services/flashcard/v2-1/admin/getNodeCardsService'
import { AddNodeCardService } from '#services/flashcard/v2-1/admin/addNodeCardService'
import { UpdateNodeCardService } from '#services/flashcard/v2-1/admin/updateNodeCardService'
import { DeleteNodeCardService } from '#services/flashcard/v2-1/admin/deleteNodeCardService'
import { MoveNodeCardService } from '#services/flashcard/v2-1/admin/moveNodeCardService'
import { ImportCardsService } from '#services/flashcard/v2-1/admin/importCardsService'
import { NodeCardsSerializer } from '#serializers/admin/v1/nodeCardsSerializer'

class NodeCardsController {
  async getNodeCards(req, res) {
    const { nodeId } = req.params
    const { page = 1, perPage = 20 } = req.query
    const { cards, pagination } = await GetNodeCardsService.call({ nodeId, page, perPage })
    return res.status(200).json({ data: NodeCardsSerializer.serializeList(cards), pagination })
  }

  async addNodeCard(req, res) {
    const { nodeId } = req.params
    const { front, back, blobId, references } = req.body
    const card = await AddNodeCardService.call({ nodeId, front, back, blobId, references })
    return res.status(201).json({ data: NodeCardsSerializer.serialize(card) })
  }

  async updateNodeCard(req, res) {
    const { cardId } = req.params
    const { front, back, blobId, references } = req.body
    const card = await UpdateNodeCardService.call({ cardId, front, back, blobId, references })
    return res.status(200).json({ data: NodeCardsSerializer.serialize(card) })
  }

  async deleteNodeCard(req, res) {
    const { cardId } = req.params
    await DeleteNodeCardService.call({ cardId })
    return res.status(200).json({ data: { success: true } })
  }

  async moveNodeCard(req, res) {
    const { cardId } = req.params
    const { targetNodeId } = req.body
    await MoveNodeCardService.call({ cardId, targetNodeId })
    return res.status(200).json({ data: { success: true } })
  }

  async importCards(req, res) {
    const { nodeId } = req.params
    const results = await ImportCardsService.call({ nodeId, buffer: req.file.buffer })
    return res.status(200).json({ data: results })
  }

  downloadTemplate(req, res) {
    const wb = XLSX.utils.book_new()
    const ws = XLSX.utils.aoa_to_sheet([
      ['Depan', 'Belakang'],
      ['Apa fungsi jantung?', 'Memompa darah ke seluruh tubuh'],
    ])
    ws['!cols'] = [{ wch: 40 }, { wch: 40 }]
    XLSX.utils.book_append_sheet(wb, ws, 'Template Kartu Flashcard')
    const buffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' })
    res.setHeader('Content-Disposition', 'attachment; filename="template-kartu-flashcard.xlsx"')
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
    return res.send(buffer)
  }
}

export default new NodeCardsController()
