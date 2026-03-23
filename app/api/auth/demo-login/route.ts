import { NextRequest, NextResponse } from 'next/server';
import { demoSignIn, setDemoSession } from '@/lib/demo-auth';

const DEMO_MODE = process.env.DEMO_MODE === 'true';

export async function POST(req: NextRequest) {
  if (!DEMO_MODE) {
    return NextResponse.json({ error: 'Demo mode not enabled' }, { status: 400 });
  }

  try {
    const { email, password } = await req.json();

    const session = demoSignIn(email, password);

    if (!session) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    return NextResponse.json({ 
      user: session.user,
      message: 'Demo login successful'
    }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Login failed' }, { status: 500 });
  }
}
