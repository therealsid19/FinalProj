// app/sign-in/page.js
"use client";
import { SignIn } from '@clerk/nextjs';
import { Box, Container, Typography } from '@mui/material';

export default function SignInPage() {
  return (
    <Container sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Box sx={{ textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom>
          Sign In to MediBot
        </Typography>
        <SignIn
          path="/sign-in"
          routing="path"
          signUpUrl="/sign-up"
          redirectUrl="/"
          appearance={{
            variables: {
              colorPrimary: "#0c4ca6",
              colorTextOnPrimaryBackground: "#fff",
            },
          }}
          // Enable Google OAuth and Email/Password Sign-In
          additionalSignInOptions={[
            {
              provider: "oauth_google",
              strategy: "oauth_google",
            },
          ]}
        />
      </Box>
    </Container>
  );
}
