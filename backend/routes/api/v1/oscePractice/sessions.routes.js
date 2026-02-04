import express from 'express';
import sessionController from '#controllers/api/v1/oscePractice/sessions.controller';
import { asyncHandler } from '#utils/asyncHandler';
import { authenticateToken } from '#middleware/auth.middleware'
import { checkFeature } from '#middleware/checkFeature.middleware';

const router = express.Router();

const featureConstantKey = 'osce_practice_is_active'

// All routes require authentication
router.use(authenticateToken);
router.use(checkFeature(featureConstantKey))

router.get('/', asyncHandler(sessionController.index.bind(sessionController)));
router.post('/', asyncHandler(sessionController.create.bind(sessionController)));
router.post('/:sessionId/start', asyncHandler(sessionController.startSession.bind(sessionController)));
router.get('/:uniqueId', asyncHandler(sessionController.show.bind(sessionController)));
router.get('/:sessionId/messages', asyncHandler(sessionController.getMessages.bind(sessionController)));
router.post('/:sessionId/messages', asyncHandler(sessionController.sendMessage.bind(sessionController)));
router.post('/:sessionId/end', asyncHandler(sessionController.endSession.bind(sessionController)));
router.post('/:sessionId/observations', asyncHandler(sessionController.saveObservations.bind(sessionController)));
router.patch('/:sessionId/metadata', asyncHandler(sessionController.updateMetadata.bind(sessionController)));



export default router;
