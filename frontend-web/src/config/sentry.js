import * as Sentry from '@sentry/react';
import { useEffect } from 'react';
import {
  createRoutesFromChildren,
  matchRoutes,
  useLocation,
  useNavigationType,
} from 'react-router-dom';

const isDev = import.meta.env.MODE === 'development';

/**
 * Initialize Sentry for error tracking in React
 */
export const initSentry = () => {
  if (isDev) {
    console.log('%c[Error Tracking] DEV mode — Sentry disabled, errors logged to console', 'color: orange; font-weight: bold');
    return;
  }

  // Only initialize if DSN is provided
  if (!import.meta.env.VITE_SENTRY_DSN) {
    console.warn('%c[Error Tracking] No DSN configured — error tracking disabled', 'color: orange; font-weight: bold');
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
      'Network Error',
      'Network request failed',
      'Failed to fetch',
      'AbortError',
      'cancelled',
    ],

    // Strip sensitive data before sending to Sentry
    beforeSend(event, hint) {
      // Drop 401/403 — expected auth failures, not application bugs
      const status = hint?.originalException?.response?.status;
      if (status === 401 || status === 403) {
        return null;
      }

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

  console.log('%c[Error Tracking] Sentry active — errors will be sent to Sentry', 'color: green; font-weight: bold');
};

export const captureException = (error, context = {}) => {
  if (isDev) {
    console.error('[Sentry captureException]', error, context);
    return;
  }
  Sentry.captureException(error, { extra: context });
};

export const captureMessage = (message, level = 'info', context = {}) => {
  if (isDev) {
    console.warn(`[Sentry captureMessage][${level}]`, message, context);
    return;
  }
  Sentry.captureMessage(message, { level, extra: context });
};

export const setUser = (user) => {
  if (isDev) return;
  Sentry.setUser({
    id: user.id,
    email: user.email,
    username: user.name,
  });
};

export const clearUser = () => {
  if (isDev) return;
  Sentry.setUser(null);
};

/**
 * Sentry ErrorBoundary — wraps the app in main.jsx
 */
export const ErrorBoundary = Sentry.ErrorBoundary;

export default Sentry;
