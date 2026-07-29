import express from 'express'
import { asyncHandler } from '#utils/asyncHandler'
import featureV2Controller from '#controllers/api/v2/feature.controller'

const router = express.Router()

router.get('/', asyncHandler(featureV2Controller.index.bind(featureV2Controller)))

export default router
