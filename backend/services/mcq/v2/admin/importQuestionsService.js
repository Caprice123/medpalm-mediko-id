import XLSX from 'xlsx'
import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'

const LETTER_TO_INDEX = { A: 0, B: 1, C: 2, D: 3, E: 4 }

export class ImportQuestionsService extends BaseService {
  static async call({ nodeId, buffer }) {
    const workbook = XLSX.read(buffer, { type: 'buffer' })
    const sheet = workbook.Sheets[workbook.SheetNames[0]]
    const rows = XLSX.utils.sheet_to_json(sheet, { defval: '' })

    const results = { imported: 0, errors: [] }

    for (const [i, row] of rows.entries()) {
      const rowNum = i + 2

      const question = String(row['Pertanyaan'] || '').trim()
      const optA = String(row['Opsi A'] || '').trim()
      const optB = String(row['Opsi B'] || '').trim()
      const optC = String(row['Opsi C'] || '').trim()
      const optD = String(row['Opsi D'] || '').trim()
      const correctLetter = String(row['Jawaban Benar'] || '').trim().toUpperCase()
      const explanation = String(row['Penjelasan'] || '').trim() || null

      const references = []
      for (let n = 1; n <= 3; n++) {
        const label = String(row[`Referensi ${n} Judul`] || '').trim()
        const url = String(row[`Referensi ${n} Link`] || '').trim()
        if (label || url) references.push({ label, url: url || undefined })
      }

      if (!question) { results.errors.push({ row: rowNum, message: 'Pertanyaan kosong' }); continue }

      const options = [optA, optB, optC, optD].filter(o => o)
      if (options.length < 2) { results.errors.push({ row: rowNum, message: 'Minimal 2 opsi diperlukan' }); continue }

      const correctIndex = LETTER_TO_INDEX[correctLetter]
      if (correctIndex === undefined || correctIndex >= options.length) {
        results.errors.push({ row: rowNum, message: `Jawaban benar tidak valid: "${correctLetter}"` }); continue
      }

      try {
        const q = await prisma.mcq_questions.create({
          data: { question, options, correct_answer: correctIndex, explanation, references, version: nodeId ? 2 : 1 },
        })

        if (nodeId) {
          await prisma.feature_node_records.create({
            data: { node_id: parseInt(nodeId), record_type: 'mcq_question', record_id: q.id },
          })
        }

        results.imported++
      } catch {
        results.errors.push({ row: rowNum, message: 'Gagal menyimpan' })
      }
    }

    if (nodeId && results.imported > 0) {
      await prisma.node_statistics.upsert({
        where: { node_id_record_type: { node_id: parseInt(nodeId), record_type: 'mcq_question' } },
        create: { node_id: parseInt(nodeId), record_type: 'mcq_question', total_count: results.imported },
        update: { total_count: { increment: results.imported } },
      })
    }

    return results
  }
}
