import { GetPublishedOsceTopicsService } from '#services/osce/user/getPublishedOsceTopicsService'
import { GetUserOsceSessionsService } from '#services/osce/user/getUserOsceSessionsService'
import { StartOsceSessionService } from '#services/osce/user/startOsceSessionService'
import { GetSessionMessagesService } from '#services/osce/user/getSessionMessagesService'
import { SendOsceMessageService } from '#services/osce/user/sendOsceMessageService'
import { GetDiagnosesService } from '#services/osce/user/getDiagnosesService'
import { SaveDiagnosesService } from '#services/osce/user/saveDiagnosesService'
import { GetTherapiesService } from '#services/osce/user/getTherapiesService'
import { SaveTherapiesService } from '#services/osce/user/saveTherapiesService'
import { EndOsceSessionService } from '#services/osce/user/endOsceSessionService'
import { GetSessionObservationsService } from '#services/osce/user/getSessionObservationsService'
import { SaveSessionObservationsService } from '#services/osce/user/saveSessionObservationsService'
import OsceTopicSerializer from '#serializers/api/v1/osceTopicSerializer';
import OsceSessionSerializer from '#serializers/api/v1/osceSessionSerializer';
import prisma from '#prisma/client';

class SessionsController {
  // GET /api/v1/osce/sessions - Get user's session history
  async index(req, res) {
    const sessions = await GetUserOsceSessionsService.call(userId)

    return res.status(200).json({
        data: OsceSessionSerializer.serializeListItems(sessions),
    })
  }

  // POST /api/v1/osce/sessions - Start new OSCE session
  async start(req, res) {
    const userId = req.user?.id
    const { topicId } = req.body

    const session = await StartOsceSessionService.call(userId, topicId)

    return res.status(201).json({
        data: OsceSessionSerializer.serialize(session),
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
            osce_topic: {
            select: {
                id: true,
                title: true,
                description: true,
                scenario: true,
                system_prompt: true,
                ai_model: true,
                duration_minutes: true,
            },
            },
            osce_session_observations: {
            include: {
                observation: {
                select: {
                    id: true,
                    name: true,
                    group_id: true,
                },
                },
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
        data: OsceSessionSerializer.serialize(session),
    });
  }

  // GET /api/v1/osce/sessions/:sessionId/messages - Get messages for a session
  async getMessages(req, res) {
    try {
      const userId = req.user?.id
      const { sessionId } = req.params

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required',
        })
      }

      const messages = await GetSessionMessagesService.call(userId, sessionId)

      return res.status(200).json({
        data: messages.map(msg => ({
          id: msg.id,
          senderType: msg.sender_type,
          content: msg.content,
          creditsUsed: msg.credits_used,
          createdAt: msg.created_at,
        })),
      })
    } catch (error) {
      console.error('[SessionsController.getMessages] Error:', error)
      return res.status(500).json({
        success: false,
        message: error.message || 'Failed to fetch messages',
      })
    }
  }

  // POST /api/v1/osce/sessions/:sessionId/messages - Send message with streaming
  async sendMessage(req, res) {
    const userId = req.user?.id;
    const { sessionId } = req.params;
    const { message } = req.body;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
      });
    }

    if (!message || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Message is required',
      });
    }

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

  // GET /api/v1/osce/sessions/:sessionId/diagnoses - Get diagnoses for a session
  async getDiagnoses(req, res) {
    try {
      const userId = req.user?.id
      const { sessionId } = req.params

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required',
        })
      }

      const diagnoses = await GetDiagnosesService.call(userId, sessionId)

      return res.status(200).json({
        data: diagnoses.map(d => ({
          id: d.id,
          type: d.type,
          diagnosis: d.diagnosis,
          createdAt: d.created_at,
        })),
      })
    } catch (error) {
      console.error('[SessionsController.getDiagnoses] Error:', error)
      return res.status(500).json({
        success: false,
        message: error.message || 'Failed to fetch diagnoses',
      })
    }
  }

  // PUT /api/v1/osce/sessions/:sessionId/diagnoses - Save diagnoses for a session
  async saveDiagnoses(req, res) {
    try {
      const userId = req.user?.id
      const { sessionId } = req.params
      const { utama, pembanding } = req.body

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required',
        })
      }

      const diagnoses = await SaveDiagnosesService.call(userId, sessionId, { utama, pembanding })

      return res.status(200).json({
        message: 'Diagnoses saved successfully',
        data: diagnoses.map(d => ({
          id: d.id,
          type: d.type,
          diagnosis: d.diagnosis,
          createdAt: d.created_at,
        })),
      })
    } catch (error) {
      console.error('[SessionsController.saveDiagnoses] Error:', error)
      return res.status(500).json({
        success: false,
        message: error.message || 'Failed to save diagnoses',
      })
    }
  }

  // GET /api/v1/osce/sessions/:sessionId/therapies - Get therapies for a session
  async getTherapies(req, res) {
    try {
      const userId = req.user?.id
      const { sessionId } = req.params

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required',
        })
      }

      const therapies = await GetTherapiesService.call(userId, sessionId)

      return res.status(200).json({
        data: therapies.map(t => ({
          id: t.id,
          therapy: t.therapy,
          order: t.order,
          createdAt: t.created_at,
        })),
      })
    } catch (error) {
      console.error('[SessionsController.getTherapies] Error:', error)
      return res.status(500).json({
        success: false,
        message: error.message || 'Failed to fetch therapies',
      })
    }
  }

  // PUT /api/v1/osce/sessions/:sessionId/therapies - Save therapies for a session
  async saveTherapies(req, res) {
    try {
      const userId = req.user?.id
      const { sessionId } = req.params
      const { therapies } = req.body

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required',
        })
      }

      const savedTherapies = await SaveTherapiesService.call(userId, sessionId, therapies)

      return res.status(200).json({
        message: 'Therapies saved successfully',
        data: savedTherapies.map(t => ({
          id: t.id,
          therapy: t.therapy,
          order: t.order,
          createdAt: t.created_at,
        })),
      })
    } catch (error) {
      console.error('[SessionsController.saveTherapies] Error:', error)
      return res.status(500).json({
        success: false,
        message: error.message || 'Failed to save therapies',
      })
    }
  }

  // GET /api/v1/osce/sessions/:sessionId/observations - Get observations for a session
  async getObservations(req, res) {
    const userId = req.user?.id
    const { sessionId } = req.params

    const result = await GetSessionObservationsService.call(userId, sessionId)

    return res.status(200).json({
      success: true,
      data: result,
    })
  }

  // POST /api/v1/osce/sessions/:sessionId/observations - Save observations for a session
  async saveObservations(req, res) {
    const userId = req.user?.id
    const { sessionId } = req.params
    const { observations } = req.body

    const savedObservations = await SaveSessionObservationsService.call(userId, sessionId, observations)

    return res.status(200).json({
      success: true,
      message: 'Observations saved successfully and locked',
      data: savedObservations.map(obs => ({
        id: obs.id,
        observationId: obs.observation_id,
        name: obs.osce_observation.name,
        groupName: obs.osce_observation.group?.name || '',
        isChecked: obs.is_checked,
        notes: obs.notes,
      })),
    })
  }

  // POST /api/v1/osce/sessions/:sessionId/end - End session with evaluation
  async endSession(req, res) {
    try {
      const userId = req.user?.id
      const { sessionId } = req.params
      const { diagnoses, therapies } = req.body

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required',
        })
      }

      const result = await EndOsceSessionService.call(userId, sessionId, {
        diagnoses,
        therapies,
      })

      return res.status(200).json({
        message: 'Session ended and evaluated successfully',
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
    } catch (error) {
      console.error('[SessionsController.endSession] Error:', error)
      return res.status(500).json({
        success: false,
        message: error.message || 'Failed to end session',
      })
    }
  }
}

export default new SessionsController();
