'use client'

import { Box, Button, Stack, TextField, InputAdornment } from "@mui/material";
import MicIcon from '@mui/icons-material/Mic';
import Navbar from '../components/NavBar';
import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import FOG from 'vanta/dist/vanta.fog.min';
import ReactMarkdown from 'react-markdown';

export default function Chatbot() {
    const [vantaEffect, setVantaEffect] = useState(null);
    const vantaRef = useRef(null);
    const [messages, setMessages] = useState([
        {
            role: "assistant",
            content: "Hi, I am Ava, your personal healthcare assistant. How can I help you today?"
        }
    ]);
    const [message, setMessage] = useState('');
    const [isListening, setIsListening] = useState(false);

    useEffect(() => {
        if (!vantaEffect) {
            setVantaEffect(
                FOG({
                    el: vantaRef.current, // Attach Vanta effect to the container
                    THREE, // Pass the THREE.js instance
                    mouseControls: true,
                    touchControls: true,
                    gyroControls: false,
                    minHeight: 200.00,
                    minWidth: 200.00,
                    highlightColor: 0x29ff,
                    midtoneColor: 0x2382da,
                    lowlightColor: 0xa1ff,
                    baseColor: 0xa2ccd7,
                    blurFactor: 0.72,
                    speed: 1.40,
                    zoom: 0.50,
                })
            );
        }

        return () => {
            if (vantaEffect) vantaEffect.destroy();
        };
    }, [vantaEffect]);

    const sendMessage = async () => {
        setMessages((messages) => [
            ...messages,
            { role: "user", content: message },
            { role: "assistant", content: '' }
        ]);
        setMessage('');

        const response = await fetch('/api/chat', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify([...messages, { role: "user", content: message }])
        });

        const reader = response.body.getReader();
        const decoder = new TextDecoder();

        

        let result = '';
        reader.read().then(function processText({ done, value }) {
            if (done) {
                return result;
            }
            const text = decoder.decode(value || new Uint8Array(), { stream: true });
            setMessages((messages) => {
                let lastMessage = messages[messages.length - 1];
                let otherMessages = messages.slice(0, messages.length - 1);
                return [
                    ...otherMessages,
                    { ...lastMessage, content: lastMessage.content + text },
                ];
            });
            return reader.read().then(processText);
        });
    };

    // Function to handle voice input
    const handleVoiceInput = () => {
        if (!('webkitSpeechRecognition' in window)) {
            alert('Speech recognition is not supported in this browser.');
            return;
        }

        const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
        recognition.lang = 'en-US';
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        recognition.onstart = () => {
            setIsListening(true);
        };

        recognition.onresult = (event) => {
            const speechResult = event.results[0][0].transcript;
            setMessage(speechResult);
            setIsListening(false);
        };

        recognition.onerror = (event) => {
            console.error('Speech recognition error:', event.error);
            setIsListening(false);
        };

        recognition.onend = () => {
            setIsListening(false);
        };

        recognition.start();
    };

    return (
        <>
        <Navbar />
        <Box
            ref={vantaRef} // Attach Vanta.js effect here
            sx={{
                width: "100vw",
                height: "100vh",
                position: 'relative', // Ensure Vanta.js covers the whole page
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                overflow: 'hidden',
            }}
        >
            <Stack
                direction="column"
                width="700px"
                height="700px"
                border="1px solid white"
                p={2}
                spacing={3}
                bgcolor={"white"}
                borderRadius={4}
            >
                <Stack
                    direction="column"
                    spacing={2}
                    flexGrow={1}
                    overflow="auto"
                    maxHeight="100%"
                >
                    {messages.map((message, index) => (
                        <Box
                            key={index}
                            display="flex"
                            justifyContent={message.role === 'assistant' ? 'flex-start' : 'flex-end'}
                        >
                            <Box
                                bgcolor={message.role === 'assistant' ? 'primary.main' : 'secondary.main'}
                                color="white"
                                borderRadius={16}
                                p={3}
                            >
                                <ReactMarkdown>{message.content}</ReactMarkdown>
                            </Box>
                        </Box>
                    ))}
                </Stack>
                <Stack
                    direction="row"
                    spacing={2}
                >
                    <TextField
                        label="Message"
                        fullWidth
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <Button onClick={handleVoiceInput} disabled={isListening}>
                                        <MicIcon />
                                    </Button>
                                </InputAdornment>
                            )
                        }}
                    />
                    <Button variant="contained" onClick={sendMessage}>
                        Send
                    </Button>
                </Stack>
            </Stack>
        </Box>
        </>
    );
}
