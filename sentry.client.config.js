// sentry.client.config.js
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: 'https://5058dbb340fb2a33304c76e9504d252f@o4509099222958080.ingest.us.sentry.io/4509099226497024',  // Replace with your DSN
  tracesSampleRate: 1.0,  // Adjust tracing rate (0.0 to 1.0)
});
