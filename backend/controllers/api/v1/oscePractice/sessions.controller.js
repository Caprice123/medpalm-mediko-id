import { GetUserOsceSessionsService } from '#services/osce/user/getUserOsceSessionsService'
import { CreateOsceSessionService } from '#services/osce/user/createOsceSessionService'
import { StartOsceSessionService } from '#services/osce/user/startOsceSessionService'
import { EndOsceSessionService } from '#services/osce/user/endOsceSessionService'
import { GetSessionObservationsService } from '#services/osce/user/getSessionObservationsService'
import { SaveSessionObservationsService } from '#services/osce/user/saveSessionObservationsService'
import OsceSessionSerializer from '#serializers/api/v1/osceSessionSerializer';
import prisma from '#prisma/client';
import { GetSessionMessagesService } from '#services/osce/user/getSessionMessagesService'
import { SendOsceMessageService } from '#services/osce/user/sendOsceMessageService'

class SessionsController {
  // GET /api/v1/osce/sessions - Get user's session history
  async index(req, res) {
    const userId = req.user?.id
    const sessions = await GetUserOsceSessionsService.call(userId)

    return res.status(200).json({
        data: await OsceSessionSerializer.serializeListItems(sessions),
    })
  }

  // POST /api/v1/osce/sessions - Create new OSCE session (no credit deduction)
  async create(req, res) {
    const userId = req.user?.id
    const { topicId } = req.body

    const session = await CreateOsceSessionService.call(userId, topicId)

    return res.status(201).json({
        data: await OsceSessionSerializer.serialize(session),
    })
  }

  // POST /api/v1/osce/sessions/:sessionId/start - Start OSCE session (deducts credits)
  async startSession(req, res) {
    const userId = req.user?.id
    const { sessionId } = req.params

    await StartOsceSessionService.call(userId, sessionId)

    return res.status(200).json({
        data: {
            success: true,
        },
    })
  }

  // GET /api/v1/osce/sessions/:uniqueId - Get session details by uniqueId
  async show(req, res) {
    const userId = req.user?.id;
    const { uniqueId } = req.params;

    const session = await prisma.osce_sessions.findFirst({
        where: {
            unique_id: uniqueId,
            user_id: userId, // Ensure user owns this session
        },
        include: {
            osce_session_observations: {
                include: {
                    observation_snapshot: true
                }
            },
            osce_session_tag_snapshots: {
            include: {
                tags: {
                    include: {
                        tag_group: true
                    }
                }
            }
          },
            osce_session_topic_snapshot: true,
            osce_session_observation_group_snapshots: {
              include: {
                osce_session_observation_snapshots: {
                  include: {
                    session_observations: true,
                  },
                  orderBy: {
                    observation_name: 'asc',
                  },
                },
              },
            },
            osce_session_diagnoses: {
              orderBy: {
                id: 'asc',
              },
            },
            osce_session_therapies: {
              orderBy: {
                id: 'asc',
              },
            },
        },
    });

    if (!session) {
        return res.status(404).json({
            success: false,
            message: 'Session not found',
        });
    }

    return res.status(200).json({
        data: await OsceSessionSerializer.serialize(session),
    });
  }

  // GET /api/v1/osce/sessions/:sessionId/observations - Get observations for a session
  async getObservations(req, res) {
    const userId = req.user?.id
    const { sessionId } = req.params

    const result = await GetSessionObservationsService.call(userId, sessionId)

    return res.status(200).json({
      data: result,
    })
  }

  // POST /api/v1/osce/sessions/:sessionId/observations - Save observations for a session
  async saveObservations(req, res) {
    const userId = req.user?.id
    const { sessionId } = req.params
    const { observations } = req.body

    const savedObservations = await SaveSessionObservationsService.call(userId, sessionId, observations)
    // console.log(savedObservations)

    return res.status(200).json({
      data: savedObservations,
    })
  }

  // POST /api/v1/osce/sessions/:sessionId/end - End session with evaluation
  async endSession(req, res) {
      const userId = req.user?.id
      const { sessionId } = req.params
      const { diagnoses, therapies, observations } = req.body

      const result = await EndOsceSessionService.call(userId, sessionId, {
        diagnoses,
        therapies,
        observations,
      })

      return res.status(200).json({
        data: {
          score: {
            total: result.totalScore,
            max: result.maxScore,
            percentage: result.percentage,
          },
          feedback: result.feedback,
          diagnoses: result.diagnoses.map(d => ({
            id: d.id,
            type: d.type,
            diagnosis: d.diagnosis,
          })),
          therapies: result.therapies.map(t => ({
            id: t.id,
            therapy: t.therapy,
            order: t.order,
          })),
        },
      })
  }

  // GET /api/v1/osce/sessions/:sessionId/messages - Get messages for a session
    async getMessages(req, res) {
        const userId = req.user?.id
        const { sessionId } = req.params
        const { cursor, limit } = req.query

        const result = await GetSessionMessagesService.call(userId, sessionId, {
          cursor,
          limit: limit ? parseInt(limit) : undefined,
        })

        return res.status(200).json({
          data: result.messages.map(msg => ({
            id: msg.id,
            senderType: msg.sender_type,
            content: msg.content,
            creditsUsed: msg.credits_used,
            createdAt: msg.created_at,
          })),
          pagination: {
            hasMore: result.hasMore,
            nextCursor: result.nextCursor,
          },
        })
    }
  
    // POST /api/v1/osce/sessions/:sessionId/messages - Send message with streaming
    async sendMessage(req, res) {
      const userId = req.user?.id;
      const { sessionId } = req.params;
      const { message } = req.body;
  
      // Set headers for Server-Sent Events
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');
  
      // Track if client disconnected
      let clientDisconnected = false;
      const streamAbortController = new AbortController();
  
      req.on('close', () => {
        console.log('🔴 Client disconnected');
        clientDisconnected = true;
        streamAbortController.abort();
      });
  
      res.on('close', () => {
        console.log('🔴 Response stream closed');
        clientDisconnected = true;
        streamAbortController.abort();
      });
  
      res.on('error', (err) => {
        console.log('🔴 Response error:', err.message);
        clientDisconnected = true;
        streamAbortController.abort();
      });
  
      try {
        await SendOsceMessageService.call({
          userId,
          sessionId,
          message,
          streamAbortSignal: streamAbortController.signal,
          checkClientConnected: () => !clientDisconnected,
          onStream: (chunk, onSend) => {
            if (!clientDisconnected) {
              res.write(`data: ${JSON.stringify(chunk)}\n\n`)
              onSend()
            }
          },
          onComplete: (result) => {
            if (!clientDisconnected) {
              res.write(`data: ${JSON.stringify({ type: 'done', data: result })}\n\n`)
              res.end()
            }
          },
          onError: (error) => {
            if (!clientDisconnected) {
              res.write(`data: ${JSON.stringify({ type: 'error', error: error.message })}\n\n`)
              res.end()
            }
          },
        })
      } catch (error) {
        if (!clientDisconnected) {
          res.write(`data: ${JSON.stringify({ type: 'error', error: error.message })}\n\n`)
          res.end()
        }
      }
    }
}

export default new SessionsController();
