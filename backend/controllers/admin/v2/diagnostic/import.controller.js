import { ImportDiagnosticQuestionsService } from '#services/diagnostic/v2/admin/importDiagnosticQuestionsService'
import XLSX from 'xlsx'

class ImportController {
  async create(req, res) {
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

export default new ImportController()
