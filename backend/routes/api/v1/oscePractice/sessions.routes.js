import express from 'express';
import sessionController from '#controllers/api/v1/oscePractice/sessions.controller';
import { asyncHandler } from '#utils/asyncHandler';
import { authenticateToken } from '#middleware/auth.middleware'

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

router.get('/', asyncHandler(sessionController.index.bind(sessionController)));
router.post('/', asyncHandler(sessionController.create.bind(sessionController)));
router.post('/:sessionId/start', asyncHandler(sessionController.startSession.bind(sessionController)));
router.get('/:uniqueId', asyncHandler(sessionController.show.bind(sessionController)));
router.get('/:sessionId/messages', asyncHandler(sessionController.getMessages.bind(sessionController)));
router.post('/:sessionId/messages', asyncHandler(sessionController.sendMessage.bind(sessionController)));
router.post('/:sessionId/end', asyncHandler(sessionController.endSession.bind(sessionController)));
router.post('/:sessionId/observations', asyncHandler(sessionController.saveObservations.bind(sessionController)));



export default router;
