import { firestore } from '../firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { sendReminderEmail } from '../lib/emailService';

// Function to check for reminders and send emails
const checkRemindersAndSendEmails = async () => {
  const now = new Date();
  const tenMinutesLater = new Date(now.getTime() + 10 * 60 * 1000);
    console.log('Checking reminders for:', tenMinutesLater);
  try {
    // Query Firestore for reminders that are 10 minutes away
    const remindersRef = collection(firestore, 'users'); // Adjust the path according to your structure
    const q = query(remindersRef, where("time", "<=", tenMinutesLater));

    const querySnapshot = await getDocs(q);

    querySnapshot.forEach(async (doc) => {
      const reminder = doc.data();
      const email = reminder.email; // Assuming email is stored in the reminder data
      const name = reminder.name;
      const time = reminder.time;

      // Send notification for upcoming medication
      await sendReminderEmail(email, {
        name,
        type: reminder.type,
        time: reminder.time,
        date: reminder.date,
      }, true);  // Set `isReminderNotification` to true
    });

  } catch (error) {
    console.error('Error fetching reminders or sending email:', error);
  }
};

export default checkRemindersAndSendEmails;
