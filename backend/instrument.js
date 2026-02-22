// This file MUST be loaded before anything else via --import flag.
// It initialises Sentry before Express (or any other module) is loaded,
// which is required for correct instrumentation in ESM projects.
//
// Usage (already set in package.json scripts):
//   node --import ./instrument.js server.js

import 'dotenv/config';
import * as Sentry from '@sentry/node';
import { nodeProfilingIntegration } from '@sentry/profiling-node';

if (process.env.SENTRY_ENABLED === 'true' && process.env.SENTRY_DSN) {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    environment: process.env.NODE_ENV || 'production',

    integrations: [
      nodeProfilingIntegration(),
      Sentry.prismaIntegration({
        // Include the actual SQL query in each span.
        // WARNING: may contain sensitive data (user IDs, emails in WHERE clauses).
        // Disable in production if data privacy is a concern.
        dbStatements: true,
      }),
    ],

    // Capture 10% of transactions for performance monitoring
    tracesSampleRate: 0.1,

    // Capture 10% of profiles
    profilesSampleRate: 0.1,

    // Ignore non-actionable errors
    ignoreErrors: [
      'Non-Error promise rejection captured',
      'NetworkError',
      'Network request failed',
    ],

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
}
