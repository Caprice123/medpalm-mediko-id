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
  // GET /api/v1/osce/sessions/:sessionId/messages - Get messages for a session
  async index(req, res) {
      const userId = req.user?.id
      const { sessionId } = req.params

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

  // GET /api/v1/osce/sessions/:sessionId/diagnoses - Get diagnoses for a session
  async getDiagnoses(req, res) {
      const userId = req.user?.id
      const { sessionId } = req.params

      const diagnoses = await GetDiagnosesService.call(userId, sessionId)

      return res.status(200).json({
        data: diagnoses.map(d => ({
          id: d.id,
          type: d.type,
          diagnosis: d.diagnosis,
          createdAt: d.created_at,
        })),
      })
  }

  // PUT /api/v1/osce/sessions/:sessionId/diagnoses - Save diagnoses for a session
  async saveDiagnoses(req, res) {
      const userId = req.user?.id
      const { sessionId } = req.params
      const { utama, pembanding } = req.body

      const diagnoses = await SaveDiagnosesService.call(userId, sessionId, { utama, pembanding })

      return res.status(200).json({
        data: diagnoses.map(d => ({
          id: d.id,
          type: d.type,
          diagnosis: d.diagnosis,
          createdAt: d.created_at,
        })),
      })
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

    return res.status(200).json({
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
      const userId = req.user?.id
      const { sessionId } = req.params
      const { diagnoses, therapies } = req.body

      const result = await EndOsceSessionService.call(userId, sessionId, {
        diagnoses,
        therapies,
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
}

export default new SessionsController();
