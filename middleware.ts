import { NextResponse } from "next/server";

import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const response = NextResponse.next();
  response.headers.set(
    "Content-Security-Policy",
    "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' https://app.sandbox.midtrans.com https://api.sandbox.midtrans.com https://snap-assets.al-pc-id.b.cdn.gtflabs.io https://pay.google.com https://js-agent.newrelic.com http://bam.nr-data.net; style-src 'self' 'unsafe-inline'; img-src * blob: data:; connect-src *; frame-src https://app.sandbox.midtrans.com https://app.midtrans.com;"
  );
  return response;
}

export const config = {
  matcher: "/:path*",
};
