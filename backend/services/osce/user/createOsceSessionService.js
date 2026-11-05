import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'
import { v4 as uuidv4 } from 'uuid'
import { ValidationError } from '#errors/validationError'

export class CreateOsceSessionService extends BaseService {
  static async call(userId, topicId, userRole) {
    if (!userId) {
      throw new ValidationError('User ID is required')
    }

    if (!topicId) {
      throw new ValidationError('Topic ID is required')
    }

      // Verify topic exists and is published
      const topic = await prisma.osce_topics.findFirst({
        where: {
          unique_id: topicId,
          ...(userRole === 'user' && { status: 'published' }),
        },
      })

      if (!topic) {
        throw new ValidationError('Topic not found or not available')
      }


      // Fetch ALL observations (entire table) with their groups
      const allObservations = await prisma.osce_observations.findMany({
        include: {
          osce_observation_group: true,
        },
        orderBy: {
          id: 'asc',
        },
      })

      // Fetch topic-specific observations (the ones configured for this topic)
      const topicObservations = await prisma.osce_topic_observations.findMany({
        where: {
          topic_id: topic.id,
        },
      })

      // Create a map of topic observations for quick lookup
      const topicObsMap = {}
      topicObservations.forEach((topicObs) => {
        topicObsMap[topicObs.observation_id] = topicObs
      })

      // Group all observations by their observation group
      const observationsByGroup = {}
      allObservations.forEach((obs) => {
        const groupId = obs.group_id

        if (!observationsByGroup[groupId]) {
          observationsByGroup[groupId] = {
            group: obs.osce_observation_group,
            observations: [],
          }
        }

        observationsByGroup[groupId].observations.push(obs)
      })

      // Everything the snapshots need is read up front: an interactive transaction holds a
      // connection open, and the reads that used to sit inside it (one rubric, the tags, and
      // an attachment lookup per observation) were what pushed it past the 5s timeout.
      const [rubric, topicTags, topicAttachments, topicObsAttachments] = await Promise.all([
        prisma.osce_rubrics.findFirst({ where: { id: topic.osce_rubric_id } }),
        prisma.osce_topic_tags.findMany({ where: { topic_id: topic.id }, select: { tag_id: true } }),
        prisma.attachments.findMany({
          where: { record_type: 'osce_topic', record_id: topic.id },
          select: { name: true, blob_id: true },
        }),
        prisma.attachments.findMany({
          where: { record_type: 'osce_topic_observation', record_id: { in: topicObservations.map(o => o.id) } },
          select: { record_id: true, name: true, blob_id: true },
        }),
      ])

      // blob rows are not needed for a clone — only the name/blob_id pair is copied
      const attachmentsByTopicObs = new Map()
      topicObsAttachments.forEach((attachment) => {
        if (!attachmentsByTopicObs.has(attachment.record_id)) attachmentsByTopicObs.set(attachment.record_id, [])
        attachmentsByTopicObs.get(attachment.record_id).push(attachment)
      })

      // Create session with complete snapshots in a transaction
      const session = await prisma.$transaction(async (tx) => {
        // Create the session
        const newSession = await tx.osce_sessions.create({
          data: {
            unique_id: uuidv4(),
            user_id: userId,
            osce_topic_id: topic.id,
            status: 'created',
            time_taken: 0,
            credits_used: 0,
          },
        })
        
        await tx.osce_session_rubric_snapshots.create({
            data: {
                osce_session_id: newSession.id,
                rubric_id: rubric.id,
                name: rubric.name,
                content: rubric.content
            }
        })

        await tx.osce_session_tag_snapshots.createMany({
            data: topicTags.map((tag) => ({
                osce_session_id: newSession.id,
                tag_id: tag.tag_id,
            }))
        })

        // Clone topic-level attachments
        if (topicAttachments.length > 0) {
          await tx.attachments.createMany({
            data: topicAttachments.map((attachment) => ({
              name: attachment.name,
              record_type: 'osce_session',
              record_id: newSession.id,
              blob_id: attachment.blob_id,
            })),
          })
        }

        // Create topic snapshot
        await tx.osce_session_topic_snapshots.create({
          data: {
            osce_session_id: newSession.id,
            title: topic.title,
            description: topic.description,
            scenario: topic.scenario,
            guide: topic.guide,
            context: topic.context,
            answer_key: topic.answer_key,
            physical_exam_guideline: topic.physical_exam_guideline,
            knowledge_base: topic.knowledge_base,
            ai_model: topic.ai_model,
            system_prompt: topic.system_prompt,
            duration_minutes: topic.duration_minutes,
          },
        })

        // Snapshot ALL observation groups and observations. One round trip per group
        // instead of one per observation — the rows written are the same, but a topic with
        // a few hundred observations used to mean a few hundred sequential INSERTs.
        const clonedAttachments = []
        for (const { group, observations } of Object.values(observationsByGroup)) {
          // Snapshot the ENTIRE observation group record
          const groupSnapshot = await tx.osce_session_observation_group_snapshots.create({
            data: {
              osce_session_id: newSession.id,
              group_id: group.id,
              group_name: group.name,
            },
          })

          // Snapshot the ENTIRE observation record for every observation in this group
          const obsSnapshots = await tx.osce_session_observation_snapshots.createManyAndReturn({
            data: observations.map((observation) => {
              // Check if this observation exists in the topic
              const topicObs = topicObsMap[observation.id]
              return {
                group_snapshot_id: groupSnapshot.id,
                observation_id: observation.id,
                observation_group_id: observation.group_id,
                observation_name: observation.name,
                // If this observation is in the topic, add the topic-specific data
                observation_text: topicObs?.observation_text || null,
                requires_interpretation: topicObs?.requires_interpretation || false,
              }
            }),
            select: { id: true, observation_id: true },
          })

          // If an observation is in the topic, clone its attachments (images). Matched by
          // observation_id rather than array position, so insertion order is irrelevant.
          obsSnapshots.forEach((obsSnapshot) => {
            const topicObs = topicObsMap[obsSnapshot.observation_id]
            if (!topicObs) return
            for (const attachment of attachmentsByTopicObs.get(topicObs.id) || []) {
              clonedAttachments.push({
                name: attachment.name,
                record_type: 'osce_session_observation_snapshot',
                record_id: obsSnapshot.id,
                blob_id: attachment.blob_id,
              })
            }
          })
        }

        if (clonedAttachments.length > 0) {
          await tx.attachments.createMany({ data: clonedAttachments })
        }

        // Return complete session with all relations
        return await tx.osce_sessions.findUnique({
          where: { id: newSession.id },
          include: {
            osce_topic: {
              select: {
                id: true,
              },
            },
            osce_session_observations: {
                include: {
                    observation_snapshot: {
                        include: {
                            group_snapshot: true
                            }
                        }
                    },
            }
          },
        })
      }, { timeout: 20_000, maxWait: 10_000 })

      return session
  }
}
