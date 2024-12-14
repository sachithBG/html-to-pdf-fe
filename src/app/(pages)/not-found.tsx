"use client";
import React from 'react';
import { Button, Typography, Box, Container } from "@mui/material";
import { useRouter } from "next/navigation"; // Next.js 13 navigation hook

export default function SetupPageNotFound() {
    const router = useRouter();

    const handleBack = () => {
        // Navigate back to the setup homepage or any route you prefer
        router.push('/setup');
    };

    return (
        <Container sx={{ textAlign: 'center', marginTop: 5 }}>
            <Typography variant="h3" gutterBottom>
                40422 - Page Not Found
            </Typography>
            <Typography variant="h6">
                Oops! The page you're looking for under /setup doesn't exist.
            </Typography>
            <Button variant="contained" color="primary" onClick={handleBack}>
                Go to Setup Home
            </Button>
        </Container>
    );
}
