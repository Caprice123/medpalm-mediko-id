import prisma from '#prisma/client'
import { GetUserFeatureNodesService } from '#services/featureNodes/user/getUserFeatureNodesService'
import { UserFeatureNodesSerializer } from '#serializers/api/v1/userFeatureNodesSerializer'
import bunnyStreamService from '#services/bunnyStream.service'
import IDriveService from '#services/idrive.service'

class FeatureNodesController {
  async index(req, res) {
    const { nodeType, parentId, parentSlug, slug, visibility, classification, layer, page, perPage } = req.query
    const result = await GetUserFeatureNodesService.call({
      nodeType,
      parentId: parentId !== undefined ? (parentId === 'null' ? null : parentId) : undefined,
      parentSlug,
      slug,
      visibility,
      classification,
      layer,
      page,
      perPage,
    })

    // Bulk-fetch video attachments for all nodes in one query
    const nodeIds = result.data.map(n => n.id)
    const videoAttachments = nodeIds.length
      ? await prisma.attachments.findMany({
          where: { record_type: 'feature_node', record_id: { in: nodeIds }, name: 'video' },
          include: { blob: true },
        })
      : []

    const videoEmbedUrlMap = {}
    await Promise.all(videoAttachments.map(async (att) => {
      if (!att.blob) return
      if (att.blob.provider === 'bunny_stream') {
        videoEmbedUrlMap[att.record_id] = bunnyStreamService.embedUrl(att.blob.key, { autoplay: true })
      } else {
        videoEmbedUrlMap[att.record_id] = await IDriveService.getSignedUrl(att.blob.key, 7 * 24 * 60 * 60)
      }
    }))

    res.json({
      data: UserFeatureNodesSerializer.serializeList(result.data, videoEmbedUrlMap),
      pagination: result.pagination,
    })
  }
  async preview(req, res) {
    const { id } = req.params
    const { type } = req.query
    const ALLOWED = ['flashcard_card', 'mcq_question', 'summary_note']
    if (!ALLOWED.includes(type)) return res.status(400).json({ message: 'Tipe tidak valid' })

    const records = await prisma.feature_node_records.findMany({
      where: { node_id: parseInt(id), record_type: type },
      select: { record_id: true },
    })
    const ids = records.map(r => r.record_id)
    if (!ids.length) return res.json({ data: [] })

    let items = []
    if (type === 'flashcard_card') {
      const rows = await prisma.flashcard_cards.findMany({
        where: { id: { in: ids }, is_deleted: false },
        select: { id: true, front: true, back: true },
        orderBy: { order: 'asc' },
      })
      items = rows.map(r => ({ id: r.id, front: r.front, back: r.back }))
    } else if (type === 'mcq_question') {
      const rows = await prisma.mcq_questions.findMany({
        where: { id: { in: ids } },
        select: { id: true, question: true, options: true, correct_answer: true, explanation: true },
        orderBy: { order: 'asc' },
      })
      items = rows.map(r => ({ id: r.id, question: r.question, options: r.options, correctAnswer: r.correct_answer, explanation: r.explanation ?? null }))
    } else if (type === 'summary_note') {
      const rows = await prisma.summary_notes.findMany({
        where: { id: { in: ids }, is_deleted: false },
        select: { id: true, unique_id: true, title: true, description: true, content: true },
      })
      items = rows.map(r => ({
        id: r.id,
        uniqueId: r.unique_id,
        title: r.title,
        description: r.description ?? null,
        readingMinutes: Math.max(1, Math.ceil((r.content?.length ?? 0) / 1500)),
      }))
    }

    return res.json({ data: items })
  }

  async batchStats(req, res) {
    const { nodeIds, type = 'flashcard_card' } = req.query
    if (!nodeIds) return res.json({ data: {} })
    const ids = String(nodeIds).split(',').map(Number).filter(Boolean)
    const rows = await prisma.node_statistics.findMany({
      where: { node_id: { in: ids }, record_type: type },
      select: { node_id: true, total_count: true },
    })
    const data = Object.fromEntries(rows.map(r => [r.node_id, r.total_count]))
    return res.json({ data })
  }

  async stats(req, res) {
    const { id } = req.params
    const rows = await prisma.node_statistics.findMany({
      where: { node_id: parseInt(id), record_type: { in: ['flashcard_card', 'summary_note', 'mcq_question'] } },
      select: { record_type: true, total_count: true },
    })
    const map = Object.fromEntries(rows.map(r => [r.record_type, r.total_count]))
    return res.json({
      data: {
        flashcardCards: map['flashcard_card'] ?? 0,
        summaryNotes: map['summary_note'] ?? 0,
        mcqQuestions: map['mcq_question'] ?? 0,
      },
    })
  }
}

export default new FeatureNodesController()
