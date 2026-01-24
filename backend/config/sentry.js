import * as Sentry from '@sentry/node';
import { nodeProfilingIntegration } from '@sentry/profiling-node';

/**
 * Initialize Sentry for error tracking and performance monitoring
 * @param {Express} app - Express application instance
 */
export const initSentry = (app) => {
  // Only initialize in production
  if (process.env.NODE_ENV !== 'production') {
    console.log('ℹ️ Sentry disabled in development mode');
    return;
  }

  if (process.env.SENTRY_ENABLED == "true") {
    console.log("Sentry is not enabled")
    return
  }

  // Only initialize if DSN is provided
  if (!process.env.SENTRY_DSN) {
    console.warn('⚠️ Sentry DSN not configured. Error tracking is disabled.');
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
      // Enable HTTP calls tracing
      new Sentry.Integrations.Http({ tracing: true }),
      // Enable Express.js middleware tracing
      new Sentry.Integrations.Express({ app }),
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

  console.log('✅ Sentry initialized for error tracking');
};

/**
 * Get Sentry request handler middleware
 * Must be used before any other middleware
 */
export const sentryRequestHandler = () => {
  // Return no-op middleware if not in production
  if (process.env.NODE_ENV !== 'production') {
    return (req, res, next) => next();
  }
  return Sentry.Handlers.requestHandler();
};

/**
 * Get Sentry tracing handler middleware
 * Must be used after request handler
 */
export const sentryTracingHandler = () => {
  // Return no-op middleware if not in production
  if (process.env.NODE_ENV !== 'production') {
    return (req, res, next) => next();
  }
  return Sentry.Handlers.tracingHandler();
};

/**
 * Get Sentry error handler middleware
 * Must be used after all routes but before any other error middleware
 */
export const sentryErrorHandler = () => {
  // Return no-op middleware if not in production
  if (process.env.NODE_ENV !== 'production') {
    return (err, req, res, next) => next(err);
  }
  return Sentry.Handlers.errorHandler({
    shouldHandleError(error) {
      // Send all errors to Sentry
      return true;
    },
  });
};

/**
 * Manually capture an exception
 * @param {Error} error - Error to capture
 * @param {Object} context - Additional context
 */
export const captureException = (error, context = {}) => {
  if (process.env.NODE_ENV !== 'production') {
    return; // No-op in development
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
  if (process.env.NODE_ENV !== 'production') {
    return; // No-op in development
  }
  Sentry.captureMessage(message, level);
};

/**
 * Set user context for error tracking
 * @param {Object} user - User information
 */
export const setUser = (user) => {
  if (process.env.NODE_ENV !== 'production') {
    return; // No-op in development
  }
  Sentry.setUser(user);
};

/**
 * Clear user context
 */
export const clearUser = () => {
  if (process.env.NODE_ENV !== 'production') {
    return; // No-op in development
  }
  Sentry.setUser(null);
};

export default Sentry;
