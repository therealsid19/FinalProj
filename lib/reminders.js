// lib/reminders.js
import { firestore } from '@/firebase';
import { collection, doc, setDoc, getDocs, deleteDoc } from 'firebase/firestore';

// Get reminders for a specific user and date
export const getReminders = async (userId, selectedDate) => {
  try {
    const dateString = selectedDate.toISOString().split('T')[0]; // Format the date as YYYY-MM-DD
    const remindersRef = collection(firestore, `users/${userId}/dates/${dateString}/reminders`);
    const querySnapshot = await getDocs(remindersRef);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error fetching reminders:', error);
    return [];
  }
};

// Add or update a reminder for a specific date
export const addReminder = async (userId, reminder) => {
    try {
      const dateString = reminder.date; // Format date as YYYY-MM-DD
      const reminderRef = doc(firestore, `users/${userId}/dates/${dateString}/reminders/${reminder.name}`);
      await setDoc(reminderRef, {
        name: reminder.name,
        time: reminder.time,
        type: reminder.type,
        
      }, { merge: true });
      console.log('Reminder added successfully');

      return {
        id: reminder.name, // Assuming name is used as the document ID
        ...reminder
      };
    } catch (error) {
      console.error('Error adding reminder:', error);
    }
  };

// Update an existing reminder for a specific date
export const updateReminder = async (userId, reminder) => {
  try {
    const dateString = reminder.date.split('T')[0]; // Ensure the date is formatted as YYYY-MM-DD
    const docRef = doc(firestore, `users/${userId}/dates/${dateString}/reminders/${reminder.name}`);
    await setDoc(docRef, reminder, { merge: true });
    return reminder;
  } catch (error) {
    console.error('Error updating reminder:', error);
  }
};

// Delete a reminder for a specific date
export const deleteReminder = async (userId, date, medicineName) => {
  try {
    console.log('Date',date)
    const dateString = date.toISOString().split('T')[0]; // Format the date as YYYY-MM-DD
    const docRef = doc(firestore, `users/${userId}/dates/${dateString}/reminders/${medicineName}`);
    await deleteDoc(docRef);
  } catch (error) {
    console.error('Error deleting reminder:', error);
  }
};
