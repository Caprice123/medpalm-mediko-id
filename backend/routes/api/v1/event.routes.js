import express from 'express'
import eventController from '#controllers/api/v1/event.controller'
import { authenticateToken, optionalAuthenticate } from '#middleware/auth.middleware'
import { asyncHandler } from '#utils/asyncHandler'

const router = express.Router()

// Public: the landing page's "Free Event" section lists events while logged
// out. Declared before the blanket authenticateToken below so that middleware
// never sees it. Optional auth still populates req.user when a token is sent,
// so a signed-in visitor keeps getting their own registration status and the
// full event payload from the same route.
router.get('/', optionalAuthenticate, asyncHandler(eventController.index.bind(eventController)))

router.use(authenticateToken)

router.get('/my-registrations', asyncHandler(eventController.myRegistrations.bind(eventController)))
router.post('/:code/register', asyncHandler(eventController.register.bind(eventController)))

export default router
