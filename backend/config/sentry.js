import * as Sentry from '@sentry/node';

// Sentry.init() is called in instrument.js via --import before this module loads.
// Here we only set up Express integration and export helper utilities.

const isSentryEnabled = process.env.SENTRY_ENABLED === 'true' && !!process.env.SENTRY_DSN;

/**
 * Register Sentry's Express error handler on the app.
 * Call this after all routes are defined.
 * @param {Express} app
 */
export const initSentry = (app) => {
  if (!isSentryEnabled) {
    console.log('ℹ️ Sentry disabled (SENTRY_ENABLED != true or no DSN)');
    return;
  }
  Sentry.setupExpressErrorHandler(app);
  console.log('✅ Sentry initialized for error tracking');
};

/**
 * Get Sentry request handler middleware
 * In v10+, this is handled by setupExpressErrorHandler in initSentry
 * Keeping this for backwards compatibility as a no-op
 */
export const sentryRequestHandler = () => {
  return (req, res, next) => next();
};

/**
 * Get Sentry tracing handler middleware
 * In v10+, this is handled by setupExpressErrorHandler in initSentry
 * Keeping this for backwards compatibility as a no-op
 */
export const sentryTracingHandler = () => {
  return (req, res, next) => next();
};

/**
 * Get Sentry error handler middleware
 * In v10+, this is handled by setupExpressErrorHandler in initSentry
 * Keeping this for backwards compatibility as a no-op
 */
export const sentryErrorHandler = () => {
  return (err, req, res, next) => next(err);
};

/**
 * Manually capture an exception
 * @param {Error} error - Error to capture
 * @param {Object} context - Additional context
 */
export const captureException = (error, context = {}) => {
  if (!isSentryEnabled) {
    console.error('Sentry not initialized, error not captured:', error);
    return;
  }
  Sentry.captureException(error, {
    extra: context,
  });
};

/**
 * Manually capture a message
 * @param {string} message - Message to capture
 * @param {string} level - Severity level (fatal, error, warning, info, debug)
 */
export const captureMessage = (message, level = 'info') => {
  if (!isSentryEnabled) {
    console.log(`Sentry not initialized, message not captured [${level}]:`, message);
    return;
  }
  Sentry.captureMessage(message, level);
};

/**
 * Set user context for error tracking
 * @param {Object} user - User information
 */
export const setUser = (user) => {
  if (!isSentryEnabled) {
    return;
  }
  Sentry.setUser(user);
};

/**
 * Clear user context
 */
export const clearUser = () => {
  if (!isSentryEnabled) {
    return;
  }
  Sentry.setUser(null);
};

export default Sentry;
