import XLSX from 'xlsx'
import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'
import { ValidationError } from '#errors/validationError'
import { bumpNodeStat } from '#utils/nodeStatisticsHelper'
import { bumpContentStat, CONTENT_STAT_KEYS } from '#utils/contentStatsHelper'

const RECORD_TYPE = 'diagnostic_case'
export const CASE_SHEET = 'Kasus'
export const QUESTION_SHEET = 'Soal'

const cell = (row, key) => String(row[key] ?? '').trim()

export class ImportDiagnosticCasesService extends BaseService {
  static async call({ nodeId, buffer }) {
    const workbook = XLSX.read(buffer, { type: 'buffer' })
    const caseSheet = workbook.Sheets[CASE_SHEET]
    const questionSheet = workbook.Sheets[QUESTION_SHEET]

    if (!caseSheet || !questionSheet) {
      throw new ValidationError(`File Excel harus memiliki sheet "${CASE_SHEET}" dan "${QUESTION_SHEET}" — unduh template terbaru`)
    }

    const caseRows = XLSX.utils.sheet_to_json(caseSheet, { defval: '' })
    const questionRows = XLSX.utils.sheet_to_json(questionSheet, { defval: '' })
    if (caseRows.length === 0) throw new ValidationError(`Sheet ${CASE_SHEET} tidak memiliki data`)

    const results = { imported: 0, errors: [] }

    // Pass 1 — the case rows define which Case IDs exist and what vignette they carry.
    const caseByKey = new Map()
    caseRows.forEach((row, i) => {
      const rowNum = i + 2
      const key = cell(row, 'Case ID')
      if (!key) {
        results.errors.push({ row: rowNum, message: `[${CASE_SHEET}] Case ID wajib diisi` })
        return
      }
      if (caseByKey.has(key)) {
        results.errors.push({ row: rowNum, message: `[${CASE_SHEET}] Case ID "${key}" sudah digunakan di baris lain` })
        return
      }
      caseByKey.set(key, {
        vignette: cell(row, 'Vignette') || null,
        image_caption: cell(row, 'Keterangan Gambar') || null,
        explanation: cell(row, 'Penjelasan Kasus') || null,
      })
    })

    // Pass 2 — every question row is attached to one of those Case IDs.
    const questionsByKey = new Map()
    questionRows.forEach((row, i) => {
      const rowNum = i + 2
      const key = cell(row, 'Case ID')
      if (!key) {
        results.errors.push({ row: rowNum, message: `[${QUESTION_SHEET}] Case ID wajib diisi` })
        return
      }
      if (!caseByKey.has(key)) {
        results.errors.push({ row: rowNum, message: `[${QUESTION_SHEET}] Case ID "${key}" tidak ada di sheet ${CASE_SHEET}` })
        return
      }

      const question = cell(row, 'Pertanyaan')
      const answer = cell(row, 'Jawaban Benar')
      const answerType = cell(row, 'Tipe') === 'text' ? 'text' : 'multiple_choice'
      const choices = ['A', 'B', 'C', 'D', 'E'].map(l => cell(row, `Pilihan ${l}`)).filter(Boolean)

      if (!question) {
        results.errors.push({ row: rowNum, message: `[${QUESTION_SHEET}] Kolom Pertanyaan kosong` })
        return
      }
      if (!answer) {
        results.errors.push({ row: rowNum, message: `[${QUESTION_SHEET}] Kolom Jawaban Benar kosong` })
        return
      }
      if (answerType === 'multiple_choice' && choices.length < 2) {
        results.errors.push({ row: rowNum, message: `[${QUESTION_SHEET}] Soal pilihan ganda butuh minimal 2 pilihan` })
        return
      }
      if (answerType === 'multiple_choice' && !choices.includes(answer)) {
        results.errors.push({ row: rowNum, message: `[${QUESTION_SHEET}] Jawaban Benar harus salah satu dari pilihan` })
        return
      }

      if (!questionsByKey.has(key)) questionsByKey.set(key, [])
      questionsByKey.get(key).push({
        question,
        answer,
        answer_type: answerType,
        choices: answerType === 'multiple_choice' ? choices : null,
        explanation_short: cell(row, 'Penjelasan Singkat') || null,
        explanation_long: cell(row, 'Penjelasan Panjang') || null,
        references: [],
        order: questionsByKey.get(key).length,
      })
    })

    for (const [key, caseData] of caseByKey.entries()) {
      const questions = questionsByKey.get(key)
      if (!questions?.length) {
        results.errors.push({ row: null, message: `Case ID "${key}" dilewati — tidak punya soal` })
        continue
      }

      try {
        await prisma.$transaction(async (tx) => {
          const created = await tx.diagnostic_cases.create({
            data: { ...caseData, references: [], diagnostic_questions: { create: questions } },
          })
          await tx.feature_node_records.create({
            data: { node_id: parseInt(nodeId), record_type: RECORD_TYPE, record_id: created.id },
          })
          await bumpNodeStat(tx, parseInt(nodeId), RECORD_TYPE, 1)
          await bumpContentStat(tx, CONTENT_STAT_KEYS.diagnosticQuestion, questions.length)
        })
        results.imported++
      } catch {
        results.errors.push({ row: null, message: `Case ID "${key}" gagal disimpan` })
      }
    }

    return results
  }
}
