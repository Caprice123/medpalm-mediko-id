import { ValidationError } from '#errors/validationError'
import { NotFoundError } from '#errors/notFoundError'
import { captureException } from '#config/sentry'
import { AuthorizationError } from '#errors/authorizationError'

/**
 * Global error handling middleware
 * Catches all errors thrown in controllers and services
 */
export const errorHandler = (err, req, res, next) => {
  // Log error for debugging (only in development)
  if (process.env.NODE_ENV === 'development') {
    console.error('Error:', err)
  } else {
    // In production, only log error type and message (not full stack)
    console.error('Error:', {
      type: err.constructor.name,
      message: err.message,
      code: err.code
    })
  }

  // Capture exception in Sentry (with context)
  captureException(err, {
    url: req.originalUrl,
    method: req.method,
    userId: req.user?.id,
    body: req.body,
  })

  // Handle ValidationError (400 Bad Request) - returns custom message
  if (err instanceof ValidationError) {
    return res.status(400).json({
      error: err.message
    })
  }

  // Handle NotFoundError (404 Not Found) - returns custom message
  if (err instanceof NotFoundError) {
    return res.status(404).json({
      error: err.message
    })
  }

  if (err instanceof AuthorizationError) {
    return res.status(401).json({
      error: err.message
    })
  }

  // Handle custom errors with statusCode property
  if (err.statusCode) {
    return res.status(err.statusCode).json({
      error: err.message || 'An error occurred'
    })
  }

  // Handle Prisma errors (hide details in production)
  if (err.code && err.code.startsWith('P')) {
    return res.status(400).json({
      error: process.env.NODE_ENV === 'development'
        ? `Database error: ${err.message}`
        : 'Database error occurred'
    })
  }

  // Default to 500 Internal Server Error
  // In production, hide error details for security
  return res.status(500).json({
    error: 'Internal server error'
  })
}
