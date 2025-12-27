import express from 'express'
import blobsController from '#controllers/api/v1/blobs.controller'

const router = express.Router()

// GET /api/v1/blobs/:blobId - Serve blob image
router.get('/:blobId', blobsController.show.bind(blobsController))

export default router
