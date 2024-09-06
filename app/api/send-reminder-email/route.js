// app/api/send-reminder-email/route.js
import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export async function POST(req) {
  try {
    const { to, reminder } = await req.json();

    const msg = {
      to,
      from: process.env.SENDGRID_VERIFIED_SENDER, // Verify this sender in SendGrid settings
      subject: 'New Medical Reminder Added',
      text: `You have added a new reminder for ${reminder.name} (${reminder.type}) at ${reminder.time} on ${reminder.date}.`,
    };

    await sgMail.send(msg);
    return new Response(JSON.stringify({ message: 'Reminder email sent successfully' }), { status: 200 });
  } catch (error) {
    console.error('Error sending email:', error);
    return new Response(JSON.stringify({ error: 'Error sending email' }), { status: 500 });
  }
}
