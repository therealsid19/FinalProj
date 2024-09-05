// app/page.js
"use client";
import styles from './page.module.css';
import Link from 'next/link';
import Navbar from './components/NavBar';
import { useEffect } from "react";
import AnimatedTitle from './components/AnimatedTitle';
import Image from 'next/image';
import Card from "./components/Card";
import { FaClinicMedical, FaCalendarAlt, FaRobot } from 'react-icons/fa';
import { AppBar, Toolbar, Container, Grid, Box, Typography, Button } from '@mui/material';
import FeedbackForm from './components/feedback';
import {
  ClerkProvider,
  SignInButton,
  SignedIn,
  SignedOut,
  SignIn,
  UserButton
} from '@clerk/nextjs'

const items = [
  "AI Powered chatbot capable of diagnosing your illness based on your symptoms", 
  "Provides personalized Clinic Recommendations based on your location and requirement", 
  "Timely Medication Remainder", 
  ];


export default function HomePage() {
  return (
    <>
            {/* Navigation Bar */}
            <Navbar />

            {/* Hero Section */}
            <Box
                
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '95vh',
                    background: 'linear-gradient(180deg, #0c4ca6, #1c68d4, #2b8fd6, #30b4cf)',
                    color: 'white',
                    textAlign: 'center',
                    flexDirection: 'column',
                    p: 3
                }}
            >
                <Container>
                    <Grid container spacing={4} alignItems="center">
                        <Grid item xs={12} md={6}>
                            <Image src='/robot.png' 
                              width={500} 
                              height={500} 
                              style={{ objectFit: 'contain' }} />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <AnimatedTitle/>
                            <Typography variant="h5" paragraph>
                                Your AI-powered healthcare assistant. Get instant medical advice, find nearby clinics, and take control of your health with ease.
                            </Typography>
                            <Button variant="contained" color="secondary" size="large">
                                Get Started
                            </Button>
                        </Grid>
                    </Grid>
                </Container>
            </Box>

            {/* Features Section */}
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                width: '100%',
                justifyContent: 'center',
                minHeight: '90vh',
                background: '#d3e1eb',
                padding: '50px 0',
                color: 'white',
              }}
            >
              <Container>
                <Typography variant="h3" align="center" mb={5} color={"#2c3f4d"}>
                  Features
                </Typography>

                <div className="Features" align="center">
                  {items.map((item, i) => (
                    <Card key={i} text={item} index={i} />
                  ))}
                </div>
              </Container>
            </Box>
            

            {/* Feedback Section */}
            <Box sx={{ py: 5, background: '#f0dbaf' }}>
                <Container>
                    <Typography variant="h4" align="center" color='black' gutterBottom>
                        We Value Your Feedback
                    </Typography>
                    <Box sx={{ maxWidth: '600px', margin: '0 auto' }}>
                        <FeedbackForm />
                    </Box>
                </Container>
            </Box>
        </>

    // <div className={styles.container}>
    //   <Navbar />
      
    //   {/* Hero Section */}
    //   <section className={styles.hero}>
    //     <h1 className={styles.title}>Your Health, Simplified</h1>
    //     <p className={styles.subtitle}>Login to access personalized healthcare features.</p>
    //   </section>
    //   <SignedOut >
    //   <Box sx={{
    //     display: 'flex',
    //     justifyContent: 'center',
    //     alignItems: 'center',    
    //     height: '90vh',          
    //     flexDirection: 'column',  
    //     textAlign: 'center',      
    //   }}>
  
    //     <Box
    //       sx={{
    //         display: 'flex',
    //         justifyContent: 'center',
    //         alignItems: 'center',
    //         width: '100%',
    //         maxWidth: '300px',
    //         padding: '20px',
    //         borderRadius: '10px',
    //         textAlign: 'center',
    //         marginBottom: '50px',
    //       }}
    //     >
    //       <SignIn
    //         routing="hash"
    //         redirectUrl="/"
    //         appearance={{
    //           variables: {
    //             colorPrimary: "#1E90FF",
    //           },

    //         }}
    //       />
    //     </Box>
    //   </Box>
    //   </SignedOut>
    //   <SignedIn>
    //     <Box sx ={{
    //       display: 'flex',
    //       justifyContent: 'center',
    //       alignItems: 'center',    
    //       height: '20vh',          
    //       flexDirection: 'column',  
    //       textAlign: 'center',    
    //     }}>
    //     <Button
    //       variant="contained"
    //       color="primary"
    //       sx={{
        
    //         fontSize: { xs: '14px', sm: '16px' },
    //       }}
    //       href = "/dashboard"
    //     >
    //       Go to Nearest Clinic
    //     </Button>
    //     </Box>
    //   </SignedIn>
      
      


    //   {/* Features Section */}
    //   <section className={styles.features}>
    //     <div className={styles.card}>
    //       <FaClinicMedical className={styles.icon} />
    //       <h3 className={styles.cardTitle}>Nearest Clinics</h3>
    //       <p className={styles.cardDescription}>Find clinics near you with ease.</p>
    //     </div>
    //     <div className={styles.card}>
    //       <FaCalendarAlt className={styles.icon} />
    //       <h3 className={styles.cardTitle}>Medicine Reminders</h3>
    //       <p className={styles.cardDescription}>Never miss a dose with our reminders.</p>
    //     </div>
    //     <div className={styles.card}>
    //       <FaRobot className={styles.icon} />
    //       <h3 className={styles.cardTitle}>Medical Chatbot</h3>
    //       <p className={styles.cardDescription}>Get instant medical advice 24/7.</p>
    //       <Link href="/chatbot" className={styles.chatbotButton}>
    //         Start Chat
    //       </Link>
    //     </div>
    //   </section>
    // </div>
  );
}
