// lib/reminders.js
import { firestore } from '@/firebase';
import { collection, doc, setDoc, getDocs, deleteDoc } from 'firebase/firestore';
import { sendReminderEmail } from './emailService';
import schedule from 'node-schedule';


// Get reminders for a specific user and date
export const getReminders = async (userId, selectedDate) => {
  try {
    const dateString = selectedDate.toISOString().split('T')[0]; // Format the date as YYYY-MM-DD
    console.log(userId, dateString);
    const remindersRef = collection(firestore, `users/${userId}/dates/${dateString}/reminders`);
    const querySnapshot = await getDocs(remindersRef);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error fetching reminders:', error);
    return [];
  }
};

// Add or update a reminder for a specific date
export const addReminder = async (userId, reminder, userEmail) => {
    try {
      const dateString = reminder.date;
      const reminderRef = doc(firestore, `users/${userId}/dates/${dateString}/reminders/${reminder.name}`);
      
      // Save the reminder in Firestore
      await setDoc(reminderRef, {
        name: reminder.name,
        time: reminder.time,
        type: reminder.type,
        email: userEmail,
      }, { merge: true });
    
      console.log('Reminder added successfully');
    
      // Send an email immediately after adding the reminder
      await sendReminderEmail(userEmail, reminder, false);
  
      // Schedule email to be sent 10 minutes before the reminder time
      const reminderTime = new Date(reminder.time); // Parse reminder time into Date object
      const notificationTime = new Date(reminderTime.getTime() - 10 * 60 * 1000); // Calculate time 10 mins before
      console.log('Notification time:', notificationTime);
  
      // Schedule the job to send an email 10 minutes before the reminder time
      const job = schedule.scheduleJob(notificationTime, async () => {
        try {
          await sendReminderEmail(userEmail, reminder, true); 
          job.cancel();
        } catch (error) {
          console.error('Error sending scheduled reminder email:', error);
        }
      });
  
      return {
        id: reminder.name, 
        ...reminder
      };
    } catch (error) {
      console.error('Error adding reminder:', error);
    }
};


// Update an existing reminder for a specific date
export const updateReminder = async (userId, reminder, userEmail) => {
  try {
    const dateString = reminder.date.split('T')[0]; 
    const docRef = doc(firestore, `users/${userId}/dates/${dateString}/reminders/${reminder.name}`);
    await setDoc(docRef, { ...reminder, email: userEmail }, { merge: true });
    return reminder;
  } catch (error) {
    console.error('Error updating reminder:', error);
  }
};

// Delete a reminder for a specific date
export const deleteReminder = async (userId, date, medicineName) => {
  try {
    console.log('Date',date)
    const dateString = date.toISOString().split('T')[0]; 
    const docRef = doc(firestore, `users/${userId}/dates/${dateString}/reminders/${medicineName}`);
    await deleteDoc(docRef);
  } catch (error) {
    console.error('Error deleting reminder:', error);
  }
};
