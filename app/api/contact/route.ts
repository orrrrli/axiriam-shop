import { NextRequest, NextResponse } from 'next/server';
import { sendContactFormEmail } from '@/lib/utils/email';

const DEMO_MODE = process.env.DEMO_MODE === 'true';

export async function POST(req: NextRequest) {
  try {
    const { name, email, subject, message } = await req.json();

    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'Please provide all required fields' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Please provide a valid email address' },
        { status: 400 }
      );
    }

    // DEMO MODE: Skip email sending
    if (DEMO_MODE) {
      console.log('Demo mode: Contact form submission received:', { name, email, subject });
      return NextResponse.json(
        { message: 'Demo mode: Your message has been received! (Email not sent)' },
        { status: 200 }
      );
    }

    await sendContactFormEmail({ name, email, subject, message });

    return NextResponse.json(
      { message: 'Your message has been sent successfully!' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: 'Failed to send message. Please try again later.' },
      { status: 500 }
    );
  }
}
