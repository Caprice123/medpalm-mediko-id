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
    editorContent
  }) {
    await this.validate({ title, embedUrl, tags })

    const model = await prisma.atlas_models.create({
      data: {
        title,
        description: description || null,
        embed_url: embedUrl,
        editor_content: editorContent ? JSON.stringify(editorContent) : null,
        status,
        created_by: createdBy,
        atlas_model_tags: {
          create: tags.map(tag => ({
            tag_id: typeof tag === 'object' ? Number(tag.id) : Number(tag)
          }))
        }
      },
      include: {
        atlas_model_tags: {
          include: { tags: true }
        }
      }
    })

    return model
  }

  static async validate({ title, embedUrl, tags }) {
    if (!title) {
      throw new ValidationError('Title is required')
    }

    if (!embedUrl) {
      throw new ValidationError('Embed URL is required')
    }

    if (!tags || tags.length === 0) {
      throw new ValidationError('At least one tag is required')
    }

    const tagIds = tags.map(t => (typeof t === 'object' ? Number(t.id) : Number(t)))
    const existingTags = await prisma.tags.findMany({
      where: { id: { in: tagIds } }
    })

    if (existingTags.length !== tagIds.length) {
      throw new ValidationError('Some tags are invalid or inactive')
    }
  }
}
