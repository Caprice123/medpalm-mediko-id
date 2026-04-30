import express from 'express'
import webinarController from '#controllers/api/v1/webinar.controller'
import { authenticateToken } from '#middleware/auth.middleware'
import { asyncHandler } from '#utils/asyncHandler'

const router = express.Router()

router.use(authenticateToken)

router.get('/', asyncHandler(webinarController.index.bind(webinarController)))
router.get('/my-registrations', asyncHandler(webinarController.myRegistrations.bind(webinarController)))
router.get('/:uniqueId', asyncHandler(webinarController.show.bind(webinarController)))
router.post('/:uniqueId/register', asyncHandler(webinarController.register.bind(webinarController)))

export default router
