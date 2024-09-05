const functions = require("firebase-functions");
const admin = require("firebase-admin");
const sendGridMail = require("@sendgrid/mail");

// Initialize Firebase Admin
admin.initializeApp();

// Load environment variables
require("dotenv").config();

// Set SendGrid API Key from .env.local
sendGridMail.setApiKey(process.env.SENDGRID_API_KEY);

// Function to check reminders and send emails 10 minutes before the time
exports.sendReminderEmails = functions.pubsub.schedule("every 1 minutes").onRun(async (context) => {
  const now = new Date();
  const tenMinutesLater = new Date(now.getTime() + 10 * 60000); // 10 minutes from now

  const currentDate = tenMinutesLater.toISOString().split("T")[0]; // Format to YYYY-MM-DD
  const currentTime = tenMinutesLater.toISOString().split("T")[1].substring(0, 5); // HH:mm format

  try {
    // Query Firestore for reminders that match the current date and time (10 minutes later)
    const remindersSnapshot = await admin.firestore().collectionGroup("reminders")
        .where("date", "==", currentDate)
        .where("time", "==", currentTime)
        .get();

    remindersSnapshot.forEach((doc) => {
      const reminder = doc.data();

      // Construct email message
      const msg = {
        to: reminder.email, // User's email address stored in Firestore
        from: "healthapp148@gmail.com", // Verified sender email from SendGrid
        subject: `Reminder: Take your medication - ${reminder.name}`,
        text: `This is a reminder to take your medication: ${reminder.name} at ${reminder.time}. Please don't forget!`,
      };

      // Send email using SendGrid
      sendGridMail.send(msg)
          .then(() => console.log(`Reminder email sent to ${reminder.email}`))
          .catch((error) => console.error("Error sending email:", error));
    });
  } catch (error) {
    console.error("Error querying reminders:", error);
  }
});
