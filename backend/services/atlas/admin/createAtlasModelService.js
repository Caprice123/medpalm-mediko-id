import { ValidationError } from '#errors/validationError'
import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'

export class CreateAtlasModelService extends BaseService {
  static async call({
    title,
    description,
    embedUrl,
    tags,
    createdBy,
    status = 'draft',
    version = 1,
    editorContent
  }) {
    await this.validate({ title, embedUrl, tags, version })

    const normalizedTags = (tags || []).map(tag => ({
      tag_id: typeof tag === 'object' ? Number(tag.id) : Number(tag)
    }))

    const model = await prisma.atlas_models.create({
      data: {
        title,
        description: description || null,
        embed_url: embedUrl,
        editor_content: editorContent ? JSON.stringify(editorContent) : null,
        status,
        version,
        created_by: createdBy,
        ...(normalizedTags.length > 0 && {
          atlas_model_tags: { create: normalizedTags }
        }),
      },
      include: {
        atlas_model_tags: {
          include: { tags: true }
        }
      }
    })

    return model
  }

  static async validate({ title, embedUrl, tags, version }) {
    if (!title) {
      throw new ValidationError('Judul wajib diisi')
    }

    if (!embedUrl) {
      throw new ValidationError('Embed URL wajib diisi')
    }

    if (version !== 2 && (!tags || tags.length === 0)) {
      throw new ValidationError('Minimal satu tag wajib dipilih')
    }

    if (tags && tags.length > 0) {
      const tagIds = tags.map(t => (typeof t === 'object' ? Number(t.id) : Number(t)))
      const existingTags = await prisma.tags.findMany({ where: { id: { in: tagIds } } })
      if (existingTags.length !== tagIds.length) {
        throw new ValidationError('Beberapa tag tidak valid')
      }
    }
  }
}
