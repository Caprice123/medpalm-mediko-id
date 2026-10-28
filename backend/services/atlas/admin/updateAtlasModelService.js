import { ValidationError } from '#errors/validationError'
import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'
import { bumpContentStat, publishedDelta, CONTENT_STAT_KEYS } from '#utils/contentStatsHelper'

export class UpdateAtlasModelService extends BaseService {
  static async call({ modelId, title, description, embedUrl, status, editorContent }) {
    await this.validate({ modelId, title, embedUrl })

    const existingModel = await prisma.atlas_models.findUnique({ where: { unique_id: modelId } })
    if (!existingModel) throw new ValidationError('Atlas model tidak ditemukan')

    const updatedModel = await prisma.$transaction(async tx => {
      const model = await tx.atlas_models.update({
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

      // Publishing or unpublishing moves the landing-page counter even though
      // no row was added or removed. Bumped inside the transaction so a
      // rollback takes the counter with it.
      await bumpContentStat(
        tx,
        CONTENT_STAT_KEYS.atlasModel,
        publishedDelta(existingModel, model)
      )

      return model
    })

    return updatedModel
  }

  static async validate({ modelId, title, embedUrl }) {
    if (!modelId || typeof modelId !== 'string') throw new ValidationError('Model ID wajib diisi')
    if (!title) throw new ValidationError('Judul wajib diisi')
    if (!embedUrl) throw new ValidationError('Embed URL wajib diisi')
  }
}
