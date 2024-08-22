// app/page.js
"use client";
import styles from './page.module.css';
import Navbar from './components/NavBar';
import { FaClinicMedical, FaCalendarAlt, FaRobot } from 'react-icons/fa';
import { Box, Typography, Button } from '@mui/material';
import {
  ClerkProvider,
  SignInButton,
  SignedIn,
  SignedOut,
  SignIn,
  UserButton
} from '@clerk/nextjs'


export default function HomePage() {
  return (
    <div className={styles.container}>
      <Navbar />
      
      {/* Hero Section */}
      <section className={styles.hero}>
        <h1 className={styles.title}>Your Health, Simplified</h1>
        <p className={styles.subtitle}>Login to access personalized healthcare features.</p>
      </section>
      <SignedOut >
      <Box sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',    
        height: '50vh',          
        flexDirection: 'column',  
        textAlign: 'center',      
      }}>
  
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            maxWidth: '300px',
            padding: '20px',
            borderRadius: '10px',
            textAlign: 'center',
          }}
        >
          <SignIn
            routing="hash"
            redirectUrl="/"
            appearance={{
              variables: {
                colorPrimary: "#1E90FF",
            
   
         
              },

            }}
          />
        </Box>
      </Box>
      </SignedOut>
      <SignedIn>
        <Box sx ={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',    
          height: '20vh',          
          flexDirection: 'column',  
          textAlign: 'center',    
        }}>
        <Button
          variant="contained"
          color="primary"
          sx={{
        
            fontSize: { xs: '14px', sm: '16px' },
          }}
          onClick={() => router.push('/chatbot')}
        >
          Go to Chatbot
        </Button>
        </Box>
      </SignedIn>
      
      


      {/* Features Section */}
      <section className={styles.features}>
        <div className={styles.card}>
          <FaClinicMedical className={styles.icon} />
          <h3 className={styles.cardTitle}>Nearest Clinics</h3>
          <p className={styles.cardDescription}>Find clinics near you with ease.</p>
        </div>
        <div className={styles.card}>
          <FaCalendarAlt className={styles.icon} />
          <h3 className={styles.cardTitle}>Medicine Reminders</h3>
          <p className={styles.cardDescription}>Never miss a dose with our reminders.</p>
        </div>
        <div className={styles.card}>
          <FaRobot className={styles.icon} />
          <h3 className={styles.cardTitle}>Medical Chatbot</h3>
          <p className={styles.cardDescription}>Get instant medical advice 24/7.</p>
        </div>
      </section>
    </div>
  );
}
