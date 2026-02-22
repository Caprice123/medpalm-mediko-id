import * as Sentry from '@sentry/react';
import { useEffect } from 'react';
import {
  createRoutesFromChildren,
  matchRoutes,
  useLocation,
  useNavigationType,
} from 'react-router-dom';

/**
 * Initialize Sentry for error tracking in React
 */
export const initSentry = () => {
  // Only initialize if DSN is provided
  if (!import.meta.env.VITE_SENTRY_DSN) {
    console.warn('⚠️ Sentry DSN not configured. Error tracking is disabled.');
    return;
  }

  Sentry.init({
    dsn: import.meta.env.VITE_SENTRY_DSN,
    environment: import.meta.env.MODE || 'production',

    integrations: [
      // React Router v6-compatible tracing (works with BrowserRouter + useRoutes)
      Sentry.reactRouterV6BrowserTracingIntegration({
        useEffect,
        useLocation,
        useNavigationType,
        createRoutesFromChildren,
        matchRoutes,
      }),
      // Session replay — records user interactions on error
    //   Sentry.replayIntegration({
    //     maskAllText: true,
    //     blockAllMedia: true,
    //   }),
    ],

    // Capture 10% of transactions for performance monitoring
    tracesSampleRate: 0.1,

    // Enable distributed tracing for API calls
    tracePropagationTargets: [import.meta.env.VITE_API_BASE_URL],

    // Capture 10% of sessions, 100% of sessions with errors
    // replaysSessionSampleRate: 0.1,
    // replaysOnErrorSampleRate: 1.0,

    // Ignore noise / non-actionable errors
    ignoreErrors: [
      'ResizeObserver loop limit exceeded',
      'Non-Error promise rejection captured',
      'NetworkError',
      'Network request failed',
      'Failed to fetch',
      'AbortError',
      'cancelled',
    ],

    // Strip sensitive data before sending to Sentry
    beforeSend(event) {
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
 * Manually capture an exception
 * @param {Error} error
 * @param {Object} context - Additional context
 */
export const captureException = (error, context = {}) => {
  Sentry.captureException(error, { extra: context });
};

/**
 * Manually capture a message
 * @param {string} message
 * @param {string} level - fatal | error | warning | info | debug
 */
export const captureMessage = (message, level = 'info') => {
  Sentry.captureMessage(message, level);
};

/**
 * Set user context (call after login)
 * @param {Object} user
 */
export const setUser = (user) => {
  Sentry.setUser({
    id: user.id,
    email: user.email,
    username: user.name,
  });
};

/**
 * Clear user context (call after logout)
 */
export const clearUser = () => {
  Sentry.setUser(null);
};

/**
 * Sentry ErrorBoundary — wraps the app in main.jsx
 */
export const ErrorBoundary = Sentry.ErrorBoundary;

export default Sentry;
