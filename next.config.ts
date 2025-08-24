

/**
 * Next.js config with CSP for Midtrans Snap.js sandbox
 */
const ContentSecurityPolicy = `
  default-src 'self';
  script-src 'self' 'unsafe-eval' 'unsafe-inline' https://app.sandbox.midtrans.com https://api.sandbox.midtrans.com https://snap-assets.al-pc-id.b.cdn.gtflabs.io https://pay.google.com https://js-agent.newrelic.com http://bam.nr-data.net;
  style-src 'self' 'unsafe-inline';
  img-src * blob: data:;
  connect-src *;
  frame-src https://app.sandbox.midtrans.com https://app.midtrans.com;
`;

const nextConfig = {
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

export default nextConfig;
