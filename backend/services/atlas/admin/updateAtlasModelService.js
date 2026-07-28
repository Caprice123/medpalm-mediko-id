import { ValidationError } from '#errors/validationError'
import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'

export class UpdateAtlasModelService extends BaseService {
  static async call({ modelId, title, description, embedUrl, tags, status, editorContent }) {
    await this.validate({ modelId, title, embedUrl, tags })

    const existingModel = await prisma.atlas_models.findUnique({ where: { unique_id: modelId } })
    if (!existingModel) throw new ValidationError('Atlas model tidak ditemukan')

    const hasTags = tags !== undefined && tags !== null

    const updatedModel = await prisma.$transaction(async tx => {
      if (hasTags) {
        await tx.atlas_model_tags.deleteMany({ where: { model_id: existingModel.id } })
      }

      return tx.atlas_models.update({
        where: { unique_id: modelId },
        data: {
          title,
          description: description || null,
          embed_url: embedUrl,
          editor_content: editorContent !== undefined ? (editorContent ? JSON.stringify(editorContent) : null) : undefined,
          ...(status && { status }),
          updated_at: new Date(),
          ...(hasTags && tags.length > 0 ? {
            atlas_model_tags: {
              create: tags.map(tag => ({ tag_id: typeof tag === 'object' ? Number(tag.id) : Number(tag) }))
            }
          } : {}),
        },
        include: { atlas_model_tags: { include: { tags: true } } },
      })
    })

    return updatedModel
  }

  static async validate({ modelId, title, embedUrl, tags }) {
    if (!modelId || typeof modelId !== 'string') throw new ValidationError('Model ID wajib diisi')
    if (!title) throw new ValidationError('Judul wajib diisi')
    if (!embedUrl) throw new ValidationError('Embed URL wajib diisi')

    if (tags !== undefined && tags !== null && tags.length > 0) {
      const tagIds = tags.map(t => (typeof t === 'object' ? Number(t.id) : Number(t)))
      const existingTags = await prisma.tags.findMany({ where: { id: { in: tagIds } } })
      if (existingTags.length !== tagIds.length) throw new ValidationError('Beberapa tag tidak valid atau tidak aktif')
    }
  }
}
