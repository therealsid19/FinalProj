# 🏥 MedHub

MedHub is a healthcare assistant web application that helps users find nearby clinics and hospitals based on their location, manage their medication schedules with calendar reminders, and access a chatbot for symptom checking and treatment suggestions. MedHub simplifies healthcare management with Google Maps integration, email notifications, and real-time chatbot assistance.

## ✨ Features

### 🔐 User Login
- Secure login using Google Authentication.
  
### 🗺️ Google Maps Integration
- Find the **nearest clinics and hospitals** based on your current location using Google Maps.
  
### 💊 Medication Reminders
- Add medication schedules to your calendar.
- Get email notifications after adding a reminder.
- Receive medication reminders **10 minutes before** the scheduled time.

### 🤖 Chatbot Assistance
- Chat with a bot about your symptoms.
- Get **treatment suggestions** and advice based on your inputs.

## 🚀 Getting Started

### Prerequisites

- Node.js
- Clerk and Firebase account (for authentication and database)
- Google Cloud API Key (for Maps services)
- SendGrid API Key (for Email services)

### Installation

1. Clone the repository:

```bash
   git clone https://github.com/yourusername/MedHub.git
```

3. Navigate into the project directory:
```bash
   cd MedHub
```

5. Install the dependencies:
```bash
   npm install
```

6. Create a `.env` file for your environment variables:

```bash
   CLERK_SECRET_KEY=your-clerk-secret-key
   NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your-google-maps-api-key
   NEXT_PUBLIC_FIREBASE_API_KEY=your-firebase-api-key
   SENDGRID_API_KEY=your-sendgrid-api-key
```

7. Start the development server:

```bash
   npm run dev
```

## 🛠️ Technologies Used

- **React**: Frontend framework for building user interfaces.
- **Google Maps API**: To locate nearby clinics and hospitals.
- **Clerk and Firebase**: For user authentication and database management.
- **SendGrid**: For sending email reminders to users.
- **Framer Motion**: For smooth animations in the UI.
- **React-Icons**: For feature icons in the UI.

## 🎨 UI/UX

The MedHub interface is designed with simplicity in mind, providing an intuitive user experience to:

- View nearby clinics and hospitals on an interactive map.
- Set up medication schedules and receive timely email reminders.
- Access healthcare advice via a chatbot in real-time.

## 🌟 Future Enhancements

- **X-ray Image Readings**: AI-powered x-ray image analysis to assist users.
- **Advanced Symptom Checking**: More detailed symptom-based analysis with predictive diagnosis.

## 📧 Contact

For more information, feel free to contact us at:

- Website: [https://final-proj-five.vercel.app/](https://final-proj-five.vercel.app/)
