
import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export async function POST(req) {
  try {
    const { to, reminder, isReminderNotification } = await req.json();

    const msg = {
      to,
      from: process.env.SENDGRID_VERIFIED_SENDER,
      subject: isReminderNotification 
               ? `Reminder: Medication for ${reminder.name} in 10 Minutes` 
               : 'New Medical Reminder Added',
      text: isReminderNotification 
            ? `This is a friendly reminder that your medication for ${reminder.name} (${reminder.type}) is scheduled at ${reminder.time} on ${reminder.date}. Please take it on time.` 
            : `You have added a new reminder for ${reminder.name} (${reminder.type}) at ${reminder.time} on ${reminder.date}.`,
    };

    await sgMail.send(msg);
    return new Response(JSON.stringify({ message: 'Reminder email sent successfully' }), { status: 200 });
  } catch (error) {
    console.error('Error sending email:', error);
    return new Response(JSON.stringify({ error: 'Error sending email' }), { status: 500 });
  }
}
