import express from 'express';
import osceController from '#controllers/api/v1/osce.controller';
import { asyncHandler } from '#utils/asyncHandler';
import { authenticateToken } from '#middleware/auth.middleware'

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// GET /api/v1/osce/topics - List all published topics
router.get('/topics', asyncHandler(osceController.listTopics.bind(osceController)));

// GET /api/v1/osce/sessions - Get user's session history
router.get('/sessions', asyncHandler(osceController.listSessions.bind(osceController)));

// POST /api/v1/osce/sessions - Start a new OSCE session
router.post('/sessions', asyncHandler(osceController.startSession.bind(osceController)));

// GET /api/v1/osce/sessions/:uniqueId - Get specific session details
router.get('/sessions/:uniqueId', asyncHandler(osceController.getSession.bind(osceController)));

// GET /api/v1/osce/sessions/:sessionId/messages - Get messages for a session
router.get('/sessions/:sessionId/messages', asyncHandler(osceController.getMessages.bind(osceController)));

// POST /api/v1/osce/sessions/:sessionId/messages - Send message with streaming
router.post('/sessions/:sessionId/messages', osceController.sendMessage.bind(osceController));

// GET /api/v1/osce/sessions/:sessionId/diagnoses - Get diagnoses for a session
router.get('/sessions/:sessionId/diagnoses', asyncHandler(osceController.getDiagnoses.bind(osceController)));

// PUT /api/v1/osce/sessions/:sessionId/diagnoses - Save diagnoses for a session
router.put('/sessions/:sessionId/diagnoses', asyncHandler(osceController.saveDiagnoses.bind(osceController)));

// GET /api/v1/osce/sessions/:sessionId/therapies - Get therapies for a session
router.get('/sessions/:sessionId/therapies', asyncHandler(osceController.getTherapies.bind(osceController)));

// PUT /api/v1/osce/sessions/:sessionId/therapies - Save therapies for a session
router.put('/sessions/:sessionId/therapies', asyncHandler(osceController.saveTherapies.bind(osceController)));

// GET /api/v1/osce/sessions/:sessionId/observations - Get observations for a session
router.get('/sessions/:sessionId/observations', asyncHandler(osceController.getObservations.bind(osceController)));

// POST /api/v1/osce/sessions/:sessionId/observations - Save observations for a session
router.post('/sessions/:sessionId/observations', asyncHandler(osceController.saveObservations.bind(osceController)));

// POST /api/v1/osce/sessions/:sessionId/end - End session with evaluation
router.post('/sessions/:sessionId/end', asyncHandler(osceController.endSession.bind(osceController)));

export default router;
