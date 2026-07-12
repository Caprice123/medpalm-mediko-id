import { ValidationError } from '#errors/validationError'
import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'

const VALID_TYPES = ['flashcard_deck', 'mcq_topic', 'summary_note']

export class CreateContentRelationService extends BaseService {
  static async call({ sourceType, sourceId, targetType, targetId }) {
    if (!VALID_TYPES.includes(sourceType)) throw new ValidationError('Tipe sumber tidak valid')
    if (!VALID_TYPES.includes(targetType)) throw new ValidationError('Tipe target tidak valid')
    if (!sourceId) throw new ValidationError('ID sumber wajib diisi')
    if (!targetId) throw new ValidationError('ID target wajib diisi')
    if (sourceType === targetType && sourceId === targetId) throw new ValidationError('Tidak bisa menghubungkan konten dengan dirinya sendiri')

    try {
      const relation = await prisma.content_relations.create({
        data: {
          source_type: sourceType,
          source_id: Number(sourceId),
          target_type: targetType,
          target_id: Number(targetId),
        },
      })
      return relation
    } catch (e) {
      if (e.code === 'P2002') throw new ValidationError('Relasi ini sudah ada')
      throw e
    }
  }
}
