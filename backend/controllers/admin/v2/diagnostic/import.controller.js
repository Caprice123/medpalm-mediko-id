import XLSX from 'xlsx'
import { ImportDiagnosticCasesService, CASE_SHEET, QUESTION_SHEET } from '#services/diagnostic/v2/admin/importDiagnosticCasesService'

class ImportController {
  async create(req, res) {
    const { nodeId } = req.params
    const buffer = req.file?.buffer
    if (!buffer) return res.status(400).json({ success: false, message: 'File tidak ditemukan' })
    const result = await ImportDiagnosticCasesService.call({ nodeId, buffer, createdBy: req.user.id })
    res.json({ success: true, data: result })
  }

  // Two sheets, joined on "Case ID": one row per case carries the shared vignette, and
  // every question row names the case it belongs to.
  downloadTemplate(req, res) {
    const wb = XLSX.utils.book_new()

    const caseSheet = XLSX.utils.aoa_to_sheet([
      ['Case ID', 'Vignette', 'Keterangan Gambar', 'Penjelasan Kasus'],
      ['KASUS-1', 'Laki-laki 30 thn datang dengan sesak napas sejak 3 hari...', 'Foto toraks PA', ''],
    ])
    XLSX.utils.book_append_sheet(wb, caseSheet, CASE_SHEET)

    const questionSheet = XLSX.utils.aoa_to_sheet([
      ['Case ID', 'Pertanyaan', 'Tipe', 'Pilihan A', 'Pilihan B', 'Pilihan C', 'Pilihan D', 'Pilihan E', 'Jawaban Benar', 'Penjelasan Singkat', 'Penjelasan Panjang'],
      ['KASUS-1', 'Apa diagnosis yang paling mungkin?', 'multiple_choice', 'Pneumonia', 'Asma', 'PPOK', 'TB Paru', '', 'Pneumonia', '', ''],
      ['KASUS-1', 'Pemeriksaan penunjang apa yang paling tepat selanjutnya?', 'text', '', '', '', '', '', 'Kultur sputum', '', ''],
    ])
    XLSX.utils.book_append_sheet(wb, questionSheet, QUESTION_SHEET)

    const buf = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' })
    res.setHeader('Content-Disposition', 'attachment; filename="template_kasus_diagnostik.xlsx"')
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
    res.send(buf)
  }
}

export default new ImportController()
