import express from 'express';
import topicController from '#controllers/api/v1/oscePractice/topics.controller';
import { asyncHandler } from '#utils/asyncHandler';
import { authenticateToken } from '#middleware/auth.middleware'
import { checkFeature } from '#middleware/checkFeature.middleware';

const router = express.Router();

const featureConstantKey = 'osce_practice_is_active'

// All routes require authentication
router.use(authenticateToken);
router.use(checkFeature(featureConstantKey))

router.get('/', asyncHandler(topicController.index.bind(topicController)));

export default router;
