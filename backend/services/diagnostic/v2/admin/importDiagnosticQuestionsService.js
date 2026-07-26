import XLSX from 'xlsx'
import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'

const RECORD_TYPE = 'diagnostic_question'

export class ImportDiagnosticQuestionsService extends BaseService {
  static async call({ nodeId, buffer }) {
    const workbook = XLSX.read(buffer, { type: 'buffer' })
    const sheet = workbook.Sheets[workbook.SheetNames[0]]
    const rows = XLSX.utils.sheet_to_json(sheet, { defval: '' })

    const results = { imported: 0, errors: [] }

    for (const [i, row] of rows.entries()) {
      const rowNum = i + 2
      const question = String(row['Pertanyaan'] || '').trim()
      const vignette = String(row['Vignette'] || '').trim()
      const answer = String(row['Jawaban Benar'] || '').trim()
      const answerType = String(row['Tipe'] || 'multiple_choice').trim()
      const choicesRaw = ['A', 'B', 'C', 'D', 'E'].map(l => String(row[`Pilihan ${l}`] || '').trim()).filter(Boolean)
      const imageCaption = String(row['Keterangan Gambar'] || '').trim()

      if (!question) { results.errors.push({ row: rowNum, message: 'Kolom Pertanyaan kosong' }); continue }
      if (!answer) { results.errors.push({ row: rowNum, message: 'Kolom Jawaban Benar kosong' }); continue }

      try {
        const newQuestion = await prisma.diagnostic_questions.create({
          data: {
            question,
            vignette: vignette || null,
            image_caption: imageCaption || null,
            answer,
            answer_type: answerType,
            choices: answerType === 'multiple_choice' && choicesRaw.length >= 2 ? choicesRaw : null,
            quiz_id: null,
          },
        })

        await prisma.feature_node_records.create({
          data: { node_id: parseInt(nodeId), record_type: RECORD_TYPE, record_id: newQuestion.id },
        })

        results.imported++
      } catch {
        results.errors.push({ row: rowNum, message: 'Gagal menyimpan' })
      }
    }

    if (results.imported > 0) {
      await prisma.node_statistics.upsert({
        where: { node_id_record_type: { node_id: parseInt(nodeId), record_type: RECORD_TYPE } },
        create: { node_id: parseInt(nodeId), record_type: RECORD_TYPE, total_count: results.imported },
        update: { total_count: { increment: results.imported } },
      })
    }

    return results
  }
}
