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
} from '@clerk/nextjs';
import './globals.css';

const items = [
  {
    text: "AI Powered chatbot capable of diagnosing your illness based on your symptoms and provides clinic recommendations based on your location.",
    imgSrc: "/chatbot.jpeg"
  },
  {
    text: "Find the nearest healthcare providers effortlessly with our interactive Google Map integration!",
    imgSrc: "/maps.jpeg"
  },
  {
    text: "Stay on track with automated email reminders for your medications—never miss a dose!",
    imgSrc: "/rem3.jpg"
  }
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
                    height: '100%',
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
                            <SignedOut>
                              <SignInButton mode="modal">
                                  <Button variant="contained" color="secondary">
                                    Sign In
                                  </Button>
                              </SignInButton>
                            </SignedOut>
                            <SignedIn>
                              <Button variant="contained" color="secondary" href='/dashboard'>
                                    Get Started
                                  </Button>
                            </SignedIn>
                            
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
                textAlign: 'center'
              }}
            >
              <Container sx={{alignItems: 'center'}}>
                <Typography variant="h3" align="center" mb={5} color={"#2c3f4d"}>
                  Features
                </Typography>
                <Grid container spacing={4} justifyContent={"center"}>
                  {/* Feature 1 */}
                  <Grid container item xs={12} key={0} alignItems="center" flexDirection="row" justifyContent="center">
                    <Grid item xs={12} md={6} justifyContent={"center"}>
                      <Box
                        sx={{
                          width: '70%',
                          height: '70%',
                          borderRadius: '5%',
                          overflow: 'hidden',
                          mb: 2 // Margin bottom to separate from the card
                        }}
                      >
                        <Image src={items[0].imgSrc} alt="Feature Image 1" layout="responsive" width={500} height={500} />
                      </Box>
                    </Grid>
                    <Grid item xs={12} md={6} justifyContent={"center"}>
                      <Card text={items[0].text} index={0} />
                    </Grid>
                  </Grid>

                  {/* Feature 2 */}
                  <Grid container item xs={12} key={1} alignItems="center" flexDirection="row-reverse" justifyContent={"center"}>
                    <Grid item xs={12} md={6} justifyContent={"center"}>
                      <Box
                        sx={{
                          width: '70%',
                          height: 'auto',
                          borderRadius: '5%',
                          overflow: 'hidden',
                          mb: 2 // Margin bottom to separate from the card
                        }}
                      >
                        <Image src={items[1].imgSrc} alt="Feature Image 2" layout="responsive" width={500} height={500} />
                      </Box>
                    </Grid>
                    <Grid item xs={12} md={6} justifyContent={"center"}>
                      <Card text={items[1].text} index={1} />
                    </Grid>
                  </Grid>

                  {/* Feature 3 */}
                  <Grid container item xs={12} key={2} alignItems="center" flexDirection="row" justifyContent={"center"}>
                    <Grid item xs={12} md={6} justifyContent={"center"}>
                      <Box
                        sx={{
                          width: '70%',
                          height: 'auto',
                          borderRadius: '5%',
                          overflow: 'hidden',
                          mb: 2, // Margin bottom to separate from the card
                          justifyContent:"center",
                        }}
                      >
                        <Image src={items[2].imgSrc} alt="Feature Image 3" layout="responsive" width={500} height={500} />
                      </Box>
                    </Grid>
                    <Grid item xs={12} md={6} justifyContent={"center"}>
                      <Card text={items[2].text} index={2} />
                    </Grid>
                  </Grid>
                </Grid>
              </Container>
            </Box>
            

            {/* Feedback Section */}
            <Box sx={{ py: 5, background: '#1c344f' }}>
                <Container>
                    <Typography variant="h4" align="center" color='white' gutterBottom>
                        We Value Your Feedback
                    </Typography>
                    <Box sx={{ maxWidth: '600px', margin: '0 auto' }}>
                        <FeedbackForm />
                    </Box>
                </Container>
            </Box>
            <Typography variant='body2' align='center' sx={{ fontSize: '0.875rem' }}>
              MedHub | Copyright @ 2024
            </Typography>
        </>
  );
}
