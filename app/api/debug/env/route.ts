import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const googleClientId = process.env.GOOGLE_CLIENT_ID;
  const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const nextAuthSecret = process.env.NEXTAUTH_SECRET;
  const nextAuthUrl = process.env.NEXTAUTH_URL;
  
  return NextResponse.json({
    environment: {
      hasGoogleClientId: !!googleClientId,
      googleClientIdLength: googleClientId?.length || 0,
      googleClientIdPrefix: googleClientId?.substring(0, 10) + '...',
      hasGoogleClientSecret: !!googleClientSecret,
      googleClientSecretLength: googleClientSecret?.length || 0,
      hasNextAuthSecret: !!nextAuthSecret,
      nextAuthSecretLength: nextAuthSecret?.length || 0,
      nextAuthUrl: nextAuthUrl,
      nodeEnv: process.env.NODE_ENV
    }
  });
}
