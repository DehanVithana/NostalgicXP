import { Resend } from 'resend';
import { NextRequest, NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  try {
    const payload = await req.json();

    // 1. Check if the event is an incoming email
    if (payload.type === 'email.received') {
      const emailId = payload.data.email_id;

      // 2. Fetch the full email content
      const { data: incomingEmail, error: fetchError } = await resend.emails.receiving.get(emailId);
      
      if (fetchError || !incomingEmail) {
        return NextResponse.json({ error: 'Failed to fetch email' }, { status: 500 });
      }

      // 3. Forward the email to your Gmail
      await resend.emails.send({
        from: `Dehan Vithana <contact@dehanvithana.com>`, // Must be your verified domain
        to: [dehan.m.vithana@gmail.com'], // Your personal Gmail
        subject: `[Fwd: ${incomingEmail.subject}]`,
        html: incomingEmail.html || '',
        text: incomingEmail.text || '',
        replyTo: incomingEmail.from, // So you can hit "Reply" in Gmail
      });
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 400 });
  }
}
