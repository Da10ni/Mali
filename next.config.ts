import { NextConfig } from 'next';
const nextConfig: NextConfig = {
  webpack(config, { isServer }) {
    if (!isServer) {
      config.module.rules.push({
        test: /swagger-jsdoc/,
        use: 'null-loader',
      });
    }
    return config;
  },
};
