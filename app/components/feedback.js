// Make sure to run npm install @formspree/react
// For more help visit https://formspr.ee/react-help
import React from 'react';
import { useForm, ValidationError } from '@formspree/react';
import { TextField, Button } from '@mui/material';

function FeedbackForm() {
  const [state, handleSubmit] = useForm("xnnarony");
  if (state.succeeded) {
      return <p>Thank you for your feedback!</p>;
  }
  return (
    <form onSubmit={handleSubmit}>
        <TextField
        id="email"
        type="email"
        name="email"
        label="Email Address"
        fullWidth
        margin="normal"
        required
        InputProps={{
            style: { backgroundColor: "white" }
        }}
        />
        <ValidationError 
        prefix="Email" 
        field="email"
        errors={state.errors}
        />
        <TextField
        id="message"
        name="message"
        label="Your Message"
        fullWidth
        margin="normal"
        multiline
        rows={4}
        required
        InputProps={{
        style: { backgroundColor: "white" }
    }}
        />
        <ValidationError 
        prefix="Message" 
        field="message"
        errors={state.errors}
        />
        <Button 
        type="submit" 
        disabled={state.submitting}
        variant="contained"
        color="secondary"
        sx={{ mt: 2 }}
        >
        Submit
        </Button>
    </form>
  );
}

function feedback() {
  return (
    <FeedbackForm />
  );
}

export default feedback;
