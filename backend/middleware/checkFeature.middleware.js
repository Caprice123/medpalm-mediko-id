import prisma from '#prisma/client'

/**
 * Middleware factory to check if a feature is enabled
 * @param {string} constantKey - The constant key to check (e.g., 'skripsi_is_active', 'chatbot_is_active')
 * @param {string} errorMessage - Optional custom error message
 * @returns {Function} Express middleware
 *
 * @example
 * router.post('/api/skripsi', checkFeature('skripsi_is_active'), controller)
 * router.post('/api/chatbot', checkFeature('chatbot_is_active', 'Chatbot sedang tidak aktif'), controller)
 */
export const checkFeature = (constantKey, errorMessage = null) => {
  return async (req, res, next) => {
    try {
      // Get the constant value
      const constant = await prisma.constants.findUnique({
        where: { key: constantKey }
      })

      // Check if feature is enabled
      if (!constant || constant.value !== 'true') {
        return res.status(403).json({
          error: {
            message: `Feature sedang tidak aktif`
          }
        })
      }

      // Feature is enabled, continue
      next()
    } catch (error) {
      console.error('Error in checkFeature middleware:', error)
      next(error)
    }
  }
}

/**
 * Middleware factory to check multiple feature constants at once
 * @param {string[]} constantKeys - Array of constant keys to check
 * @param {string} errorMessage - Optional custom error message
 * @returns {Function} Express middleware
 *
 * @example
 * router.post('/api/skripsi', checkFeatures(['skripsi_is_active', 'skripsi_ai_researcher_enabled']), controller)
 */
export const checkFeatures = (constantKeys, errorMessage = null) => {
  return async (req, res, next) => {
    try {
      // Get all constants
      const constants = await prisma.constants.findMany({
        where: {
          key: { in: constantKeys }
        }
      })

      // Create a map for easy lookup
      const constantsMap = {}
      constants.forEach(c => { constantsMap[c.key] = c.value })

      // Check if all features are enabled
      for (const key of constantKeys) {
        if (!constantsMap[key] || constantsMap[key] !== 'true') {
          const message = errorMessage || `One or more required features are disabled`
          return res.status(403).json({
            error: message,
            disabledFeature: key
          })
        }
      }

      // All features are enabled, attach constants to request for reuse
      req.featureConstants = constantsMap

      next()
    } catch (error) {
      console.error('Error in checkFeatures middleware:', error)
      next(error)
    }
  }
}
