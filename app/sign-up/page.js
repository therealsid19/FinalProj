// app/sign-up/page.js
"use client";
import { SignUp } from '@clerk/nextjs';
import { Box, Container, Typography } from '@mui/material';

export default function SignUpPage() {
  return (
    <Container sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Box sx={{ textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom>
          Sign Up for MediBot
        </Typography>
        <SignUp
          path="/sign-up"
          routing="path"
          signInUrl="/sign-in"
          redirectUrl="/"
          appearance={{
            variables: {
              colorPrimary: "#0c4ca6",
              colorTextOnPrimaryBackground: "#fff",
            },
          }}
        />
      </Box>
    </Container>
  );
}
