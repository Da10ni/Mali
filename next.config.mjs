import { withSentryConfig } from '@sentry/nextjs';

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,  // Enable React strict mode
  swcMinify: true,        // Optional: Use SWC minifier for faster builds
};

const sentryWebpackPluginOptions = {
  authToken: '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',  // Replace with your Sentry auth token
  org: 'zeroverticle',    // Replace with your Sentry organization name
  project: 'javascript-nextjs',  // Replace with your Sentry project name
  release: process.env.SENTRY_RELEASE,  // Optional: Set the release version from environment variable
};

// Export the configuration with Sentry integration
export default withSentryConfig(nextConfig, sentryWebpackPluginOptions, {
  // For all available options, see:
  // https://www.npmjs.com/package/@sentry/webpack-plugin#options

  org: 'zeroverticle',           // Sentry organization
  project: 'javascript-nextjs',  // Sentry project
  silent: !process.env.CI,       // Silence logs if in CI environment

  // Optional: Upload a larger set of source maps for prettier stack traces (increases build time)
  widenClientFileUpload: true,

  // Route browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers
  // Note: Ensure that this does not conflict with your Next.js middleware.
  tunnelRoute: '/monitoring',

  // Automatically tree-shake Sentry logger statements to reduce bundle size
  disableLogger: true,

  // Enables automatic instrumentation of Vercel Cron Monitors
  automaticVercelMonitors: true,
  reactStrictMode: true,
  swcMinify: true,
  // Enable tracing for better error reporting
  traceMarks: true,
  // Optional: If you're having issues with dynamic routes
  experimental: {
    // If you're on Next.js 13 or 14, you might want to enable some experimental features
    serverActions: true,
  }
});
