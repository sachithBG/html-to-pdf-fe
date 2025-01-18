"use client";
import React from "react";
import { useRouter } from "next/navigation"; // Or use `next/router` for older versions
import { Button, Typography, Box, Container } from "@mui/material";
import { DashboardLayout } from "@toolpad/core/DashboardLayout";
import { PageContainer } from "@toolpad/core/PageContainer";
import ThemeProvidr from "@/provider/ThemeProvidr";

export default function PageNotFound() {
    const router = useRouter();

    const handleBack = () => {
        // Navigate back to the home page or a default route
        router.push("/");
    };

    return (
        <ThemeProvidr>
            <DashboardLayout defaultSidebarCollapsed={true}>
                <PageContainer>
                    <Container>
                        <Box sx={{ textAlign: "center", marginTop: 5 }}>
                            <Typography variant="h3" gutterBottom>
                                404 - Page Not Found 1234
                            </Typography>
                            <Typography variant="h6">
                                Oops! It seems the page you&#39;re looking for doesn&apos;t exist.
                            </Typography>
                            <Button variant="outlined" size="small" color="primary" onClick={handleBack}>
                                Go to Homepage
                            </Button>
                        </Box>
                    </Container>
                </PageContainer>
            </DashboardLayout>
        </ThemeProvidr>
    );
}
