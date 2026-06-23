import PDFDocument from 'pdfkit'

// Helvetica only covers Latin-1 (U+0000–U+00FF). Strip anything outside that
// range so pdfkit doesn't emit garbled bytes (e.g. ⭐ → "+P").
function t(text) {
  if (!text) return ''
  return text.replace(/[^\x00-\xFF]/g, '').trim()
}

const PAGE_W = 595
const MARGIN = 40
const CW = PAGE_W - MARGIN * 2   // 515pt usable width
const MAX_Y = 820                  // page break threshold (A4 = 842, leave 22pt bottom)
const OPTION_LABELS = ['A', 'B', 'C', 'D', 'E']

const C = {
  primary:       '#0369a1',
  purple:        '#7c3aed',
  success:       '#16a34a',
  danger:        '#dc2626',
  successBg:     '#f0fdf4',
  dangerBg:      '#fff7f7',
  successBorder: '#bbf7d0',
  dangerBorder:  '#fecaca',
  scoreBg:       '#f0f9ff',
  scoreBorder:   '#bae6fd',
  gray:          '#6b7280',
  dark:          '#111827',
  text:          '#374151',
  white:         '#ffffff',
  lightGray:     '#e5e7eb',
}

function measureCardHeight(doc, q) {
  const qTextW = CW - 88

  doc.font('Helvetica-Bold').fontSize(12)
  const qTextH = doc.heightOfString(`${q.num}. ${t(q.questionText) || '(tanpa teks)'}`, { width: qTextW })

  let expH = 0
  if (q.explanation) {
    doc.font('Helvetica').fontSize(10)
    expH = 14 + doc.heightOfString(t(q.explanation), { width: CW - 36 }) + 16
  }

  let h = 24                                     // top + bottom padding
  h += qTextH + 10                               // question text
  if (q.questionImageBuffer) h += 210            // question image (200 + 10 gap)
  if (!q.isCorrect) h += 20                      // "jawaban kamu" line
  h += 20                                        // "jawaban benar" line
  if (q.optionImageBuffers?.length) {
    for (const buf of q.optionImageBuffers) {
      if (buf) h += 146                          // 16 label + 120 img + 10 gap
    }
  }
  h += expH

  return Math.ceil(h) + 8                        // small safety buffer
}

function ensureSpace(doc, y, needed) {
  if (y + needed > MAX_Y) {
    doc.addPage()
    return MARGIN
  }
  return y
}

export function generateChallengeAnswerKeyPdf({ userName, challengeTitle, score, finalRank, questions }) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: 'A4', margin: 0, autoFirstPage: true })
    const chunks = []
    doc.on('data', c => chunks.push(c))
    doc.on('end', () => resolve(Buffer.concat(chunks)))
    doc.on('error', reject)

    // ── HEADER ──────────────────────────────────────────────────────────────
    const headerGrad = doc.linearGradient(0, 0, PAGE_W, 80)
    headerGrad.stop(0, '#0369a1').stop(1, '#15803d')
    doc.rect(0, 0, PAGE_W, 80).fill(headerGrad)
    doc.font('Helvetica-Bold').fontSize(22).fillColor(C.white)
      .text('MedPal', 0, 22, { align: 'center', width: PAGE_W })
    doc.font('Helvetica').fontSize(11).fillColor('#c7e6f7')
      .text('Platform Belajar Medis', 0, 50, { align: 'center', width: PAGE_W })

    let y = 100

    // ── TITLE ───────────────────────────────────────────────────────────────
    doc.font('Helvetica-Bold').fontSize(18).fillColor(C.dark)
      .text('Kunci Jawaban', MARGIN, y, { align: 'center', width: CW })
    y += 28
    doc.font('Helvetica').fontSize(12).fillColor(C.gray)
      .text(t(challengeTitle), MARGIN, y, { align: 'center', width: CW })
    y += 24
    doc.font('Helvetica').fontSize(11).fillColor(C.text)
      .text(
        `Halo ${t(userName)}, challenge telah berakhir. Berikut adalah kunci jawaban beserta pembahasannya.`,
        MARGIN, y, { width: CW }
      )
    y += 40

    // ── SCORE BOX ───────────────────────────────────────────────────────────
    doc.rect(MARGIN, y, CW, 64).fill(C.scoreBg)
    doc.rect(MARGIN, y, CW, 64).stroke(C.scoreBorder)

    const half = CW / 2

    doc.font('Helvetica-Bold').fontSize(26).fillColor(C.primary)
      .text(String(score), MARGIN, y + 8, { width: half, align: 'center' })
    doc.font('Helvetica').fontSize(10).fillColor(C.gray)
      .text('Total Poin', MARGIN, y + 42, { width: half, align: 'center' })

    doc.moveTo(MARGIN + half, y + 10).lineTo(MARGIN + half, y + 54).stroke(C.scoreBorder)

    doc.font('Helvetica-Bold').fontSize(26).fillColor(C.purple)
      .text(`#${finalRank ?? '-'}`, MARGIN + half, y + 8, { width: half, align: 'center' })
    doc.font('Helvetica').fontSize(10).fillColor(C.gray)
      .text('Peringkat Akhir', MARGIN + half, y + 42, { width: half, align: 'center' })

    y += 80

    // ── SECTION HEADING ─────────────────────────────────────────────────────
    y = ensureSpace(doc, y, 40)
    doc.font('Helvetica-Bold').fontSize(14).fillColor(C.dark)
      .text('Pembahasan Soal', MARGIN, y)
    y += 28

    // ── QUESTIONS ───────────────────────────────────────────────────────────
    for (const q of questions) {
      const cardH = measureCardHeight(doc, q)

      // If card doesn't fit on the remaining page, start a new one
      if (y + cardH > MAX_Y) {
        doc.addPage()
        y = MARGIN
      }

      const isCorrect = q.isCorrect
      const bgColor     = isCorrect ? C.successBg     : C.dangerBg
      const borderColor = isCorrect ? C.successBorder : C.dangerBorder
      const statusColor = isCorrect ? C.success       : C.danger
      const badgeText   = isCorrect ? 'Benar'          : 'Salah'

      // Card background (drawn first so text renders on top)
      doc.rect(MARGIN, y, CW, cardH).fill(bgColor)
      doc.rect(MARGIN, y, CW, cardH).stroke(borderColor)

      let cy = y + 12

      // Badge (top-right corner)
      const badgeW = 60
      const badgeX = MARGIN + CW - badgeW - 8
      doc.rect(badgeX, cy, badgeW, 18).fill(statusColor)
      doc.font('Helvetica-Bold').fontSize(9).fillColor(C.white)
        .text(badgeText, badgeX, cy + 5, { width: badgeW, align: 'center' })

      // Question text
      const qTextW = CW - badgeW - 28
      const qText = `${q.num}. ${t(q.questionText) || '(tanpa teks)'}`
      doc.font('Helvetica-Bold').fontSize(12).fillColor(C.dark)
        .text(qText, MARGIN + 10, cy, { width: qTextW })
      doc.font('Helvetica-Bold').fontSize(12)
      cy += doc.heightOfString(qText, { width: qTextW }) + 10

      // Question image
      if (q.questionImageBuffer) {
        try {
          doc.image(q.questionImageBuffer, MARGIN + 10, cy, { fit: [CW - 20, 200] })
        } catch (e) {
          console.warn(`[PDF] Skipping question image for Q${q.num}:`, e.message)
        }
        cy += 210
      }

      // Answer lines
      if (!isCorrect) {
        doc.font('Helvetica').fontSize(11).fillColor(C.gray)
          .text('Jawaban kamu:  ', MARGIN + 10, cy, { continued: true })
        doc.font('Helvetica-Bold').fillColor(C.danger)
          .text(t(q.selectedOption) || 'Tidak dijawab')
        cy += 20
      }

      doc.font('Helvetica').fontSize(11).fillColor(C.gray)
        .text('Jawaban benar:  ', MARGIN + 10, cy, { continued: true })
      doc.font('Helvetica-Bold').fillColor(C.success)
        .text(t(q.correctOption) || '-')
      cy += 20

      // Option images
      if (q.optionImageBuffers?.length) {
        for (let i = 0; i < q.optionImageBuffers.length; i++) {
          const buf = q.optionImageBuffers[i]
          if (!buf) continue
          doc.font('Helvetica-Bold').fontSize(11).fillColor(C.text)
            .text(`Pilihan ${OPTION_LABELS[i] ?? i}:`, MARGIN + 10, cy)
          cy += 16
          try {
            doc.image(buf, MARGIN + 10, cy, { fit: [CW - 20, 120] })
          } catch (e) {
            console.warn(`[PDF] Skipping option image ${i} for Q${q.num}:`, e.message)
          }
          cy += 130
        }
      }

      // Explanation box
      if (q.explanation) {
        const expText = t(q.explanation)
        doc.font('Helvetica').fontSize(10)
        const expH = doc.heightOfString(expText, { width: CW - 36 })
        // Left accent bar
        doc.rect(MARGIN + 10, cy, 3, expH + 22).fill(C.primary)
        doc.font('Helvetica-Bold').fontSize(10).fillColor(C.primary)
          .text('Pembahasan:', MARGIN + 18, cy)
        cy += 14
        doc.font('Helvetica').fontSize(10).fillColor(C.text)
          .text(expText, MARGIN + 18, cy, { width: CW - 36 })
        cy += expH + 8
      }

      y += cardH + 12
    }

    // ── FOOTER ──────────────────────────────────────────────────────────────
    y = ensureSpace(doc, y, 40)
    doc.moveTo(MARGIN, y).lineTo(MARGIN + CW, y).stroke(C.lightGray)
    y += 12
    doc.font('Helvetica').fontSize(10).fillColor(C.gray)
      .text(
        'Dokumen ini dikirim otomatis oleh MedPal. © 2026 MedPal. All rights reserved.',
        MARGIN, y, { align: 'center', width: CW }
      )

    doc.end()
  })
}
