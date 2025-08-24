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
