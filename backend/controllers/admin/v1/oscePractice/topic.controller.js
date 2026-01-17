import { CreateOsceTopicService } from '#services/osce/admin/createOsceTopicService'
import { GetOsceTopicsService } from '#services/osce/admin/getOsceTopicsService'
import { GetOsceTopicDetailService } from '#services/osce/admin/getOsceTopicDetailService'
import { UpdateOsceTopicService } from '#services/osce/admin/updateOsceTopicService'
import { OsceTopicSerializer } from '#serializers/admin/v1/osceTopicSerializer'
import { OsceTopicListSerializer } from '#serializers/admin/v1/osceTopicListSerializer'

class TopicController {
  async index(req, res) {
    const { university, semester, status, page, perPage } = req.query

    const result = await GetOsceTopicsService.call({
      university,
      semester,
      status,
      page,
      perPage
    })

    return res.status(200).json({
      data: OsceTopicListSerializer.serialize(result.topics),
      pagination: result.pagination
    })
  }

  async create(req, res) {
    const {
      title,
      description,
      scenario,
      guide,
      context,
      answerKey,
      knowledgeBase,
      observations,
      aiModel,
      systemPrompt,
      durationMinutes,
      tags,
      status
    } = req.body

    const topic = await CreateOsceTopicService.call({
      title,
      description,
      scenario,
      guide,
      context,
      answerKey,
      knowledgeBase,
      observations,
      aiModel,
      systemPrompt,
      durationMinutes,
      tags,
      status,
      created_by: req.user.id
    })

    return res.status(201).json({
      data: OsceTopicSerializer.serialize(topic),
    })
  }

  async show(req, res) {
    const { id } = req.params

    const topic = await GetOsceTopicDetailService.call(id)

    return res.status(200).json({
      data: OsceTopicSerializer.serialize(topic)
    })
  }

  async update(req, res) {
    const { id } = req.params
    const {
      title,
      description,
      scenario,
      guide,
      context,
      answerKey,
      knowledgeBase,
      observations,
      aiModel,
      systemPrompt,
      durationMinutes,
      attachments,
      status,
      tags
    } = req.body

    const updatedTopic = await UpdateOsceTopicService.call(id, {
      title,
      description,
      scenario,
      guide,
      context,
      answerKey,
      knowledgeBase,
      observations,
      aiModel,
      systemPrompt,
      durationMinutes,
      attachments,
      status,
      tags
    })

    return res.status(200).json({
      data: OsceTopicSerializer.serialize(updatedTopic),
    })
  }
}

export default new TopicController()
