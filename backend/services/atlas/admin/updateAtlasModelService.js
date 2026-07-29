import { ValidationError } from '#errors/validationError'
import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'

export class UpdateAtlasModelService extends BaseService {
  static async call({ modelId, title, description, embedUrl, status, editorContent }) {
    await this.validate({ modelId, title, embedUrl })

    const existingModel = await prisma.atlas_models.findUnique({ where: { unique_id: modelId } })
    if (!existingModel) throw new ValidationError('Atlas model tidak ditemukan')

    const updatedModel = await prisma.$transaction(async tx => {
      return tx.atlas_models.update({
        where: { unique_id: modelId },
        data: {
          title,
          description: description || null,
          embed_url: embedUrl,
          editor_content: editorContent !== undefined ? (editorContent ? JSON.stringify(editorContent) : null) : undefined,
          ...(status && { status }),
          updated_at: new Date(),
        },
      })
    })

    return updatedModel
  }

  static async validate({ modelId, title, embedUrl }) {
    if (!modelId || typeof modelId !== 'string') throw new ValidationError('Model ID wajib diisi')
    if (!title) throw new ValidationError('Judul wajib diisi')
    if (!embedUrl) throw new ValidationError('Embed URL wajib diisi')
  }
}
