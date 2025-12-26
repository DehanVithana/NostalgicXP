import { Resend } from 'resend';
import { NextRequest, NextResponse } from 'next/server';

// Initialize Resend with your API Key
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  try {
    const payload = await req.json();

    // Verify this is an incoming email event
    if (payload.type === 'email.received') {
      const emailId = payload.data.email_id;

      // 1. Fetch the full email content from Resend
      const { data: incomingEmail, error: fetchError } = await resend.emails.receiving.get(emailId);
      
      if (fetchError || !incomingEmail) {
        console.error('Error fetching email:', fetchError);
        return NextResponse.json({ error: 'Failed to fetch email content' }, { status: 500 });
      }

      // 2. Forward it to your personal Gmail
      // IMPORTANT: The 'from' address MUST be a verified domain in your Resend dashboard
      await resend.emails.send({
        from: 'Dehan Vithana <contact@dehanvithana.com>', 
        to: ['dehan.m.vithana@gmail.com'], // Replace with your actual Gmail
        subject: `[Fwd: ${incomingEmail.subject}]`,
        html: incomingEmail.html || `<p>${incomingEmail.text}</p>`,
        replyTo: incomingEmail.from, // This allows you to reply directly to the sender
      });

      console.log(`Successfully forwarded email from: ${incomingEmail.from}`);
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
