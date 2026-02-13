import * as Sentry from '@sentry/node';
import { nodeProfilingIntegration } from '@sentry/profiling-node';

// Track if Sentry is initialized
let isSentryInitialized = false;

/**
 * Initialize Sentry for error tracking and performance monitoring
 * @param {Express} app - Express application instance
 */
export const initSentry = (app) => {
  if (process.env.SENTRY_ENABLED != "true") {
    console.log("Sentry is not enabled")
    isSentryInitialized = false;
    return
  }

  // Only initialize if DSN is provided
  if (!process.env.SENTRY_DSN) {
    console.warn('⚠️ Sentry DSN not configured. Error tracking is disabled.');
    isSentryInitialized = false;
    return;
  }

  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    environment: process.env.NODE_ENV || 'production',

    // Set tracesSampleRate to capture 10% of transactions for performance monitoring
    tracesSampleRate: 0.1,

    // Set profilesSampleRate to capture 10% profiles for performance monitoring
    profilesSampleRate: 0.1,

    integrations: [
      // Enable profiling
      nodeProfilingIntegration(),
    ],

    // Ignore certain errors
    ignoreErrors: [
      // Browser extensions errors
      'Non-Error promise rejection captured',
      // Network errors that aren't actionable
      'NetworkError',
      'Network request failed',
    ],

    // Filter sensitive data
    beforeSend(event, hint) {
      // Filter out sensitive request data
      if (event.request) {
        delete event.request.cookies;
        if (event.request.headers) {
          delete event.request.headers.authorization;
          delete event.request.headers.cookie;
        }
      }

      return event;
    },
  });

  // Setup Express error handler (replaces old Handlers API)
  Sentry.setupExpressErrorHandler(app);

  isSentryInitialized = true;
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
  if (!isSentryInitialized) {
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
  if (!isSentryInitialized) {
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
  if (!isSentryInitialized) {
    return;
  }
  Sentry.setUser(user);
};

/**
 * Clear user context
 */
export const clearUser = () => {
  if (!isSentryInitialized) {
    return;
  }
  Sentry.setUser(null);
};

export default Sentry;
