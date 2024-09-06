// lib/emailService.js
export const sendReminderEmail = async (to, reminder, isReminderNotification = false) => {
    try {
      const response = await fetch('/api/send-reminder-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ to, reminder, isReminderNotification }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to send email');
      }
  
      const data = await response.json();
      console.log('Reminder email sent successfully:', data.message);
    } catch (error) {
      console.error('Error sending email:', error);
    }
  };
  