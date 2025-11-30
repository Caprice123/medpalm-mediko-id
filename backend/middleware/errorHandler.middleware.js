import { ValidationError } from '../errors/validationError.js'
import { NotFoundError } from '../errors/notFoundError.js'

/**
 * Global error handling middleware
 * Catches all errors thrown in controllers and services
 */
export const errorHandler = (err, req, res, next) => {
  console.error('Error:', err)

  // Handle ValidationError (400 Bad Request)
  if (err instanceof ValidationError) {
    return res.status(400).json({
      success: false,
      error: err.message
    })
  }

  // Handle NotFoundError (404 Not Found)
  if (err instanceof NotFoundError) {
    return res.status(404).json({
      success: false,
      error: err.message
    })
  }

  // Handle custom errors with statusCode property
  if (err.statusCode) {
    return res.status(err.statusCode).json({
      success: false,
      error: err.message || 'An error occurred'
    })
  }

  // Handle Prisma errors
  if (err.code && err.code.startsWith('P')) {
    return res.status(400).json({
      success: false,
      error: 'Database error',
      message: err.message
    })
  }

  // Default to 500 Internal Server Error
  return res.status(500).json({
    success: false,
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  })
}
