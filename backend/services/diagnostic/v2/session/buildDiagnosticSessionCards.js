import prisma from '#prisma/client'
import idriveService from '#services/idrive.service'

const RECORD_TYPE = 'diagnostic_case'

// Builds one card per case: the shared vignette/image on the case, then every question
// asked about it. `selected` is an ordered list of case ids and the output keeps that order.
export async function buildDiagnosticSessionCards({ selected, newIdSet, node, nodeMap }) {
  if (selected.length === 0) return []

  const cases = await prisma.diagnostic_quizzes.findMany({
    where: { id: { in: selected }, is_deleted: false },
    include: {
      diagnostic_questions: {
        where: { is_deleted: false },
        orderBy: { order: 'asc' },
      },
    },
  })
  const caseMap = new Map(cases.map(c => [c.id, c]))

  const attachments = await prisma.attachments.findMany({
    where: { record_type: RECORD_TYPE, record_id: { in: selected }, name: 'image' },
  })
  const blobIds = attachments.map(a => a.blob_id)
  const blobs = blobIds.length > 0
    ? await prisma.blobs.findMany({ where: { id: { in: blobIds } } })
    : []

  const attachmentMap = new Map(attachments.map(a => [a.record_id, a]))
  const blobMap = new Map(blobs.map(b => [b.id, b]))

  const blobKeys = []
  const caseBlobKeyMap = new Map()
  selected.forEach(id => {
    const att = attachmentMap.get(id)
    if (att) {
      const blob = blobMap.get(att.blob_id)
      if (blob) { blobKeys.push(blob.key); caseBlobKeyMap.set(id, blob.key) }
    }
  })

  const presignedUrls = blobKeys.length > 0
    ? await idriveService.getBulkSignedUrls(blobKeys, 3600)
    : []

  const urlMap = new Map()
  let idx = 0
  selected.forEach(id => { if (caseBlobKeyMap.has(id)) urlMap.set(id, presignedUrls[idx++]) })

  // Summary-note links stay per question, so they are looked up by question id
  const questionIds = cases.flatMap(c => c.diagnostic_questions.map(q => q.id))
  const noteRelations = questionIds.length > 0
    ? await prisma.content_relations.findMany({
        where: { source_type: 'diagnostic_question', source_id: { in: questionIds }, target_type: 'summary_note' },
      })
    : []
  const noteIds = [...new Set(noteRelations.map(r => r.target_id))]
  const notes = noteIds.length > 0
    ? await prisma.summary_notes.findMany({
        where: { id: { in: noteIds }, status: 'published', is_deleted: false },
        select: { id: true, unique_id: true, title: true },
      })
    : []
  const noteMap = new Map(notes.map(n => [n.id, n]))
  const notesByQuestion = new Map()
  noteRelations.forEach(r => {
    const note = noteMap.get(r.target_id)
    if (!note) return
    if (!notesByQuestion.has(r.source_id)) notesByQuestion.set(r.source_id, [])
    notesByQuestion.get(r.source_id).push({ uniqueId: note.unique_id, title: r.label || note.title })
  })

  return selected.map(id => {
    const diagnosticCase = caseMap.get(id)
    if (!diagnosticCase || diagnosticCase.diagnostic_questions.length === 0) return null

    let subtopicInfo, topicInfo
    if (nodeMap) {
      const n = nodeMap.get(id)
      subtopicInfo = n ? { id: n.id, name: n.name } : null
      topicInfo = n?.parent ? { id: n.parent.id, name: n.parent.name } : null
    } else if (node) {
      subtopicInfo = { id: node.id, name: node.name }
      topicInfo = node.parent ? { id: node.parent.id, name: node.parent.name } : null
    } else {
      subtopicInfo = null
      topicInfo = null
    }

    return {
      id: diagnosticCase.id,
      vignette: diagnosticCase.description,
      imageUrl: urlMap.get(id) || null,
      imageCaption: diagnosticCase.image_caption,
      explanation: diagnosticCase.explanation ?? '',
      references: diagnosticCase.references ?? [],
      isNew: newIdSet ? newIdSet.has(id) : false,
      subtopic: subtopicInfo,
      topic: topicInfo,
      questions: diagnosticCase.diagnostic_questions.map(q => ({
        id: q.id,
        question: q.question,
        answer: q.answer,
        answerType: q.answer_type,
        choices: q.choices,
        explanationShort: q.explanation_short ?? '',
        explanationLong: q.explanation_long ?? '',
        references: q.references ?? [],
        linkedSummaryNotes: notesByQuestion.get(q.id) || [],
      })),
    }
  }).filter(Boolean)
}
