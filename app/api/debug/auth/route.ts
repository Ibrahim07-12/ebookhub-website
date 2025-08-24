import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/drizzle';
import { users } from '@/lib/schema';
import { accounts } from '@/lib/schema';
import { sessions } from '@/lib/schema';

export async function GET(request: NextRequest) {
  try {
    // Test database connection
  const userArr = await db.select().from(users);
  const accountArr = await db.select().from(accounts);
  const sessionArr = await db.select().from(sessions);
  // Test schema structure
  const sampleUsers = userArr.slice(0, 3);

    return NextResponse.json({
      success: true,
      database: {
        connected: true,
        counts: {
          users: userArr.length,
          accounts: accountArr.length,
          sessions: sessionArr.length
        }
      },
      schema: {
        sampleUsers
      },
      environment: {
        hasGoogleClientId: !!process.env.GOOGLE_CLIENT_ID,
        hasGoogleClientSecret: !!process.env.GOOGLE_CLIENT_SECRET,
        hasNextAuthSecret: !!process.env.NEXTAUTH_SECRET,
        hasNextAuthUrl: !!process.env.NEXTAUTH_URL,
        hasDatabaseUrl: !!process.env.DATABASE_URL
      }
    });
  } catch (error) {
    console.error('Debug auth error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 });
  }
}
