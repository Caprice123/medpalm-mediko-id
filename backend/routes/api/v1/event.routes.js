import express from 'express'
import eventController from '#controllers/api/v1/event.controller'
import { authenticateToken } from '#middleware/auth.middleware'
import { asyncHandler } from '#utils/asyncHandler'

const router = express.Router()

router.use(authenticateToken)

router.get('/my-registrations', asyncHandler(eventController.myRegistrations.bind(eventController)))
router.get('/', asyncHandler(eventController.index.bind(eventController)))
router.post('/:code/register', asyncHandler(eventController.register.bind(eventController)))

export default router
