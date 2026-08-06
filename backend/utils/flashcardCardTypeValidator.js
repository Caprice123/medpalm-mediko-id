import { Prisma } from '@prisma/client'
import { ValidationError } from '#errors/validationError'

const CLOZE_TOKEN_REGEX = /\{\{(\d+)\}\}/g

function referencedClozeNumbers(text) {
  const numbers = new Set()
  let match
  CLOZE_TOKEN_REGEX.lastIndex = 0
  while ((match = CLOZE_TOKEN_REGEX.exec(text)) !== null) {
    numbers.add(parseInt(match[1]))
  }
  return [...numbers].sort((a, b) => a - b)
}

function validateBasic({ front, back }) {
  if (!front?.trim()) throw new ValidationError('Front wajib diisi')
  if (!back?.trim()) throw new ValidationError('Back wajib diisi')
  return { front: front.trim(), back: back.trim(), clozeAnswers: Prisma.DbNull, occlusionRegions: Prisma.DbNull }
}

function validateCloze({ front, clozeAnswers }) {
  if (!front?.trim()) throw new ValidationError('Teks cloze wajib diisi')

  const numbers = referencedClozeNumbers(front)
  if (numbers.length === 0) throw new ValidationError('Teks cloze harus memiliki minimal satu blank, contoh: {{1}}')

  const maxNumber = numbers[numbers.length - 1]
  const answers = []
  for (let n = 1; n <= maxNumber; n++) {
    const answer = Array.isArray(clozeAnswers) ? clozeAnswers[n - 1] : undefined
    if (numbers.includes(n)) {
      if (!answer?.toString().trim()) throw new ValidationError(`Jawaban untuk blank {{${n}}} wajib diisi`)
      answers.push(answer.toString().trim())
    } else {
      answers.push('')
    }
  }

  return { front: front.trim(), back: null, clozeAnswers: answers, occlusionRegions: Prisma.DbNull }
}

function validateOcclusion({ front, blobId, occlusionRegions }) {
  if (!blobId) throw new ValidationError('Gambar wajib diunggah untuk kartu occlusion')
  if (!Array.isArray(occlusionRegions) || occlusionRegions.length === 0) {
    throw new ValidationError('Minimal satu area occlusion wajib ditambahkan')
  }

  const regions = occlusionRegions.map((region, i) => {
    const { x, y, width, height, label } = region || {}
    if ([x, y, width, height].some(v => typeof v !== 'number' || Number.isNaN(v))) {
      throw new ValidationError(`Koordinat area occlusion ke-${i + 1} tidak valid`)
    }
    if (!label?.toString().trim()) throw new ValidationError(`Label area occlusion ke-${i + 1} wajib diisi`)
    return { id: region.id ?? `region-${i + 1}`, x, y, width, height, label: label.toString().trim() }
  })

  return { front: front?.trim() || null, back: null, clozeAnswers: Prisma.DbNull, occlusionRegions: regions }
}

export function validateCardTypeFields({ type, front, back, blobId, clozeAnswers, occlusionRegions }) {
  if (type === 'cloze') return validateCloze({ front, clozeAnswers })
  if (type === 'occlusion') return validateOcclusion({ front, blobId, occlusionRegions })
  return validateBasic({ front, back })
}
