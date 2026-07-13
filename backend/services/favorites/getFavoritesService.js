import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'
import { ValidationError } from '#errors/validationError'

export class GetFavoritesService extends BaseService {
  static async call({ userId, recordType }) {
    if (!recordType) throw new ValidationError('recordType wajib diisi')

    const records = await prisma.user_favorites.findMany({
      where: { user_id: userId, record_type: recordType },
      orderBy: { created_at: 'desc' },
    })

    if (recordType === 'summary_note' && records.length > 0) {
      const noteIds = records.map(r => r.record_id)
      const notes = await prisma.summary_notes.findMany({
        where: { id: { in: noteIds } },
        select: { id: true, unique_id: true, title: true },
      })
      const noteMap = new Map(notes.map(n => [n.id, n]))
      return records.map(r => {
        const note = noteMap.get(r.record_id)
        return { ...r, metadata: note ? { uniqueId: note.unique_id, title: note.title } : null }
      })
    }

    return records
  }
}
