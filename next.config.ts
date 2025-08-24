import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "script-src 'self' https://snap-assets.al-pc-id-b.cdn.gftlabs.io https://api.sandbox.midtrans.com https://app.sandbox.midtrans.com 'unsafe-eval';"
          }
        ]
      }
    ];
  },
};

export default nextConfig;
