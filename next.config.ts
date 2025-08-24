const ContentSecurityPolicy = `
  default-src 'self';
  script-src 'self' 'unsafe-eval' https://app.sandbox.midtrans.com https://api.sandbox.midtrans.com https://snap-assets.al-pc-id.b.cdn.gtflabs.io https://pay.google.com https://js-agent.newrelic.com http://bam.nr-data.net;
  style-src 'self' 'unsafe-inline';
  img-src * blob: data:;
  connect-src *;
  frame-src https://app.sandbox.midtrans.com https://app.midtrans.com;
`;

module.exports = {
  // ...existing config...
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: ContentSecurityPolicy.replace(/\s{2,}/g, ' ').trim(),
          },
        ],
      },
    ];
  },
};
import type { NextConfig } from "next";

const nextConfig = {
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value: "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://snap-assets.al-pc-id-b.cdn.gftlabs.io https://api.sandbox.midtrans.com https://app.sandbox.midtrans.com;"
          }
        ]
      }
    ];
  },
};
export default nextConfig;
