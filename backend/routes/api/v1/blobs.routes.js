import express from 'express'
import blobsController from '#controllers/api/v1/blobs.controller'

const router = express.Router()

// GET /api/v1/blobs/:blobId/url - Get presigned URL as JSON
router.get('/:blobId/url', blobsController.getUrl.bind(blobsController))

// GET /api/v1/blobs/:blobId - Serve blob image (redirect to presigned URL)
router.get('/:blobId', blobsController.show.bind(blobsController))

export default router
