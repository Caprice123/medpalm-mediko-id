import express from 'express';
import topicController from '#controllers/api/v1/oscePractice/topics.controller';
import { asyncHandler } from '#utils/asyncHandler';
import { authenticateToken } from '#middleware/auth.middleware'

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

router.get('/', asyncHandler(topicController.index.bind(topicController)));

export default router;
