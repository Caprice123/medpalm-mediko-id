import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'
import { v4 as uuidv4 } from 'uuid'
import attachmentService from '#services/attachment/attachmentService'
import { ValidationError } from '#errors/validationError'

export class CreateOsceSessionService extends BaseService {
  static async call(userId, topicId) {
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
          status: 'published',
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
        
        // Fetch ALL observation groups (entire table)
        const rubric = await tx.osce_rubrics.findFirst({
            where: {
                id: topic.osce_rubric_id
            }
        })

        console.log({
                osce_session_id: newSession.id,
                rubric_id: rubric.id,
                name: rubric.name,
                content: rubric.content
            })

        await tx.osce_session_rubric_snapshots.create({
            data: {
                osce_session_id: newSession.id,
                rubric_id: rubric.id,
                name: rubric.name,
                content: rubric.content
            }
        })
        
        const topicTags = await tx.osce_topic_tags.findMany({
            where: {
                topic_id: topic.id,
            },
            select: {
                tag_id: true,
            }
        })
        await tx.osce_session_tag_snapshots.createMany({
            data: topicTags.map((tag) => ({
                osce_session_id: newSession.id,
                tag_id: tag.tag_id, 
            }))
        })

        // Clone topic-level attachments
        const topicAttachments = await attachmentService.getAttachments('osce_topic', topic.id)
        for (const attachment of topicAttachments) {
          await tx.attachments.create({
            data: {
              name: attachment.name,
              record_type: 'osce_session',
              record_id: newSession.id,
              blob_id: attachment.blob_id,
            },
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
            knowledge_base: topic.knowledge_base,
            ai_model: topic.ai_model,
            system_prompt: topic.system_prompt,
            duration_minutes: topic.duration_minutes,
          },
        })

        // Snapshot ALL observation groups and observations
        for (const { group, observations } of Object.values(observationsByGroup)) {
          // Snapshot the ENTIRE observation group record
          const groupSnapshot = await tx.osce_session_observation_group_snapshots.create({
            data: {
              osce_session_id: newSession.id,
              group_id: group.id,
              group_name: group.name,
            },
          })

          // Snapshot each observation in this group
          for (const observation of observations) {
            // Check if this observation exists in the topic
            const topicObs = topicObsMap[observation.id]

            // Snapshot the ENTIRE observation record
            const obsSnapshot = await tx.osce_session_observation_snapshots.create({
              data: {
                group_snapshot_id: groupSnapshot.id,
                observation_id: observation.id,
                observation_group_id: observation.group_id,
                observation_name: observation.name,
                // If this observation is in the topic, add the topic-specific data
                observation_text: topicObs?.observation_text || null,
                requires_interpretation: topicObs?.requires_interpretation || false,
              },
            })

            // If this observation is in the topic, clone its attachments (images)
            if (topicObs) {
              const observationAttachments = await attachmentService.getAttachments(
                'osce_topic_observation',
                topicObs.id
              )

              for (const attachment of observationAttachments) {
                await tx.attachments.create({
                  data: {
                    name: attachment.name,
                    record_type: 'osce_session_observation_snapshot',
                    record_id: obsSnapshot.id,
                    blob_id: attachment.blob_id,
                  },
                })
              }
            }
          }
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
      })

      return session
  }
}
