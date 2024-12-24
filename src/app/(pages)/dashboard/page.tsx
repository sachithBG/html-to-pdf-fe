'use client';

import { useState, useEffect } from 'react';
import {
    Box,
    Card,
    Typography,
    Grid2,
    Skeleton,
    IconButton,
    Tooltip,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    useTheme,
} from '@mui/material';
import { Line } from 'react-chartjs-2';
import { ContentCopy as ContentCopyIcon, CheckCircle as CheckCircleIcon } from '@mui/icons-material';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip as ChartTooltip, Legend } from 'chart.js';
import { motion } from 'framer-motion';

// Registering Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, ChartTooltip, Legend);

// Sample chart data
const chartData = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June'],
    datasets: [
        {
            label: 'PDF Requests',
            data: [120, 90, 80, 110, 130, 140],
            borderColor: '#4caf50',
            tension: 0.2,
            pointBackgroundColor: '#4caf50',
        },
    ],
};

// Animation variants
const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
};

const Dashboard = () => {
    const theme = useTheme(); // Accessing MUI theme for dynamic background
    const [isLoading, setIsLoading] = useState(true);
    const [activeOrg, setActiveOrg] = useState('Organization A');
    const [orgs, setOrgs] = useState(['Organization A', 'Organization B', 'Organization C']);
    const [pdfTemplates, setPdfTemplates] = useState<string[]>([]);
    const [media, setMedia] = useState<string[]>([]);
    const [integrations, setIntegrations] = useState<string[]>([]);
    const [copiedToken, setCopiedToken] = useState(false);

    useEffect(() => {
        setTimeout(() => {
            setPdfTemplates(['Invoice Template', 'Receipt Template', 'Summary Report']);
            setMedia(['Image 1', 'Image 2', 'Video 1']);
            setIntegrations(['Zapier', 'Google Sheets', 'Slack']);
            setIsLoading(false);
        }, 1500);
    }, [activeOrg]);

    const handleCopy = () => {
        navigator.clipboard.writeText('my_generated_token_12345').then(() => {
            setCopiedToken(true);
            setTimeout(() => setCopiedToken(false), 2000);
        });
    };

    return (
        <Box
            sx={{
                p: 4,
                backgroundColor: theme.palette.background.default, // Dynamically applied background color
                minHeight: '100vh',
            }}
        >
            {/* Organization Switcher */}
            <motion.div initial="hidden" animate="visible" variants={fadeIn} transition={{ duration: 0.5 }}>
                <Card sx={{ p: 3, mb: 4 }}>
                    <Typography variant="h6">Active Organization</Typography>
                    <Typography variant="body1" sx={{ mb: 2 }}>
                        {activeOrg}
                    </Typography>
                    <Grid2 container spacing={2}>
                        {orgs.map((org, index) => (
                            <Grid2 size={4} key={index}>
                                <Card
                                    sx={{
                                        p: 2,
                                        cursor: 'pointer',
                                        backgroundColor: activeOrg === org ? '#4caf50' : theme.palette.background.paper,
                                        color: activeOrg === org ? '#fff' : theme.palette.text.primary,
                                    }}
                                    onClick={() => setActiveOrg(org)}
                                >
                                    <Typography align="center">{org}</Typography>
                                </Card>
                            </Grid2>
                        ))}
                    </Grid2>
                </Card>
            </motion.div>

            {/* PDF Generation Trends */}
            <motion.div initial="hidden" animate="visible" variants={fadeIn} transition={{ duration: 0.5, delay: 0.2 }}>
                <Card sx={{ p: 3, mb: 4 }}>
                    <Typography variant="h6" sx={{ mb: 2 }}>
                        PDF Requests Trends
                    </Typography>
                    {isLoading ? (
                        <Skeleton variant="rectangular" height={300} />
                    ) : (
                        <Line data={chartData} options={{ responsive: true }} />
                    )}
                </Card>
            </motion.div>

            {/* Dashboard Sections */}
            <Grid2 container spacing={3}>
                {/* PDF Templates */}
                <Grid2 size={{ xs: 12, sm: 6, md: 4 }} >
                    <motion.div initial="hidden" animate="visible" variants={fadeIn} transition={{ duration: 0.5, delay: 0.3 }}>
                        <Card sx={{ p: 3 }}>
                            <Typography variant="h6">PDF Templates</Typography>
                            {isLoading
                                ? [...Array(3)].map((_, i) => <Skeleton key={i} height={20} sx={{ mb: 1 }} />)
                                : pdfTemplates.map((template, i) => (
                                    <Typography key={i} sx={{ mb: 1 }}>
                                        {template}
                                    </Typography>
                                ))}
                        </Card>
                    </motion.div>
                </Grid2>

                {/* Media */}
                <Grid2 size={{ xs: 12, sm: 6, md: 4 }}>
                    <motion.div initial="hidden" animate="visible" variants={fadeIn} transition={{ duration: 0.5, delay: 0.4 }}>
                        <Card sx={{ p: 3 }}>
                            <Typography variant="h6">Media</Typography>
                            {isLoading
                                ? [...Array(3)].map((_, i) => <Skeleton key={i} height={20} sx={{ mb: 1 }} />)
                                : media.map((item, i) => (
                                    <Typography key={i} sx={{ mb: 1 }}>
                                        {item}
                                    </Typography>
                                ))}
                        </Card>
                    </motion.div>
                </Grid2>

                {/* Integrations */}
                <Grid2 size={{ xs: 12, sm: 6, md: 4 }}>
                    <motion.div initial="hidden" animate="visible" variants={fadeIn} transition={{ duration: 0.5, delay: 0.5 }}>
                        <Card sx={{ p: 3 }}>
                            <Typography variant="h6">Integrations</Typography>
                            {isLoading
                                ? [...Array(3)].map((_, i) => <Skeleton key={i} height={20} sx={{ mb: 1 }} />)
                                : integrations.map((integration, i) => (
                                    <Typography key={i} sx={{ mb: 1 }}>
                                        {integration}
                                    </Typography>
                                ))}
                        </Card>
                    </motion.div>
                </Grid2>
            </Grid2>

            {/* API Token Section */}
            <motion.div initial="hidden" animate="visible" variants={fadeIn} transition={{ duration: 0.5, delay: 0.6 }}>
                <Card sx={{ mt: 4, p: 3 }}>
                    <Typography variant="h6">API Token</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                        <Typography variant="body1" sx={{ mr: 2 }}>
                            my_generated_token_12345
                        </Typography>
                        <Tooltip title={copiedToken ? 'Copied!' : 'Copy'}>
                            <IconButton onClick={handleCopy}>
                                {copiedToken ? <CheckCircleIcon color="success" /> : <ContentCopyIcon />}
                            </IconButton>
                        </Tooltip>
                    </Box>
                </Card>
            </motion.div>
        </Box>
    );
};

export default Dashboard;
