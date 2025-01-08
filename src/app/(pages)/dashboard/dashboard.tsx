'use client';

import { useState, useEffect } from 'react';
import { Box, Card, Typography, Grid2, Skeleton, IconButton, Tooltip } from '@mui/material';
import { Line } from 'react-chartjs-2'; // Chart.js integration for charts
import { ContentCopy as ContentCopyIcon, CheckCircle as CheckCircleIcon } from '@mui/icons-material';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip as ChartTooltip, Legend } from 'chart.js';
import { useSelector } from 'react-redux';
import { getDefaultOrganization, Organization, OrganizationState } from '@/redux/slice/organizationSlice';
import { useSession } from 'next-auth/react';
import { chartMonthlyData } from '@/app/services/logsService';

// Registering Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, ChartTooltip, Legend);

// Sample data for charts
const chartData = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June'],
    datasets: [
        {
            label: 'PDF Generation Requests',
            data: [],
            fill: false,
            borderColor: '#4caf50',
            tension: 0.1,
        },
    ],
};

const Dashboard = () => {
    // States to manage loading state, data, and other interactions
    const [isLoading, setIsLoading] = useState(true);
    const [activeOrg, setActiveOrg] = useState<Organization>();
    const [orgs, setOrgs] = useState<Organization[]>([]);
    const [pdfTemplates, setPdfTemplates] = useState<any>([]);
    const [media, setMedia] = useState<any>([]);
    const [integrations, setIntegrations] = useState<any>([]);
    const [copiedToken, setCopiedToken] = useState(false);
    const [copiedCurl, setCopiedCurl] = useState(false);
    const [tooltipToken, setTooltipToken] = useState('Copy');
    const [tooltipCurl, setTooltipCurl] = useState('Copy');
    const [chartData, setChartData] = useState<any>(null);

    const { organizations } = useSelector((state: any) => state.organization);
    const currentOrg: Organization | any = useSelector((state: { organization: OrganizationState }) =>
        getDefaultOrganization(state.organization)
    );
    const { data: session }: any = useSession();

    // Simulate data fetching
    useEffect(() => {
        setOrgs(organizations);
        setActiveOrg(currentOrg);

        const fetchChartData = async () => {
            await chartMonthlyData(currentOrg.id, session?.user?.token).then((response) => {
                if (response.status == 200) {
                    const labels: string[] = response.data.map((item: any) => item.label);
                    const data = response.data.map((item: any) => item.value);
                    console.log("Chart data:", data);
                    setChartData({
                        labels,
                        datasets: [
                            {
                                label: 'PDF Requests',
                                data,
                                borderColor: '#4caf50',
                                tension: 0.2,
                                pointBackgroundColor: '#4caf50',
                            },
                        ],
                    });
                }
            }).catch((error) => {
                console.error('Error fetching chart data:', error);
                setIsLoading(false);
            });
        };

        setTimeout(() => {
            if (currentOrg?.id && session?.user?.token) {
                fetchChartData();
            }
            setPdfTemplates(['Invoice Template', 'Report Template', 'Receipt Template']);
            setMedia(['Image 1', 'Image 2', 'Image 3']);
            setIntegrations(['Zapier', 'Google Sheets', 'Webhooks']);
            setIsLoading(false);
        }, 3000); // Simulating API call delay
    }, [activeOrg]);

    const handleCopy = (text: string, type: 'token' | 'curl') => {
        navigator.clipboard.writeText(text).then(() => {
            if (type === 'token') {
                setCopiedToken(true);
                setTooltipToken('Copied');
                setTimeout(() => {
                    setCopiedToken(false);
                    setTooltipToken('Copy');
                }, 2000);
            } else if (type === 'curl') {
                setCopiedCurl(true);
                setTooltipCurl('Copied');
                setTimeout(() => {
                    setCopiedCurl(false);
                    setTooltipCurl('Copy');
                }, 2000);
            }
        });
    };

    return (
        <Box sx={{ p: 3 }}>
            {/* Current Active Organization Section */}
            <Card className="p-4 mb-6">
                <Typography variant="h6">Active Organization</Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                    {activeOrg?.name}
                </Typography>
                <Typography variant="body2" sx={{ mb: 2 }}>
                    Switch between organizations to see different data.
                </Typography>
                <Grid2 container spacing={2}>
                    {orgs.map((org, index) => (
                        <Grid2 size={{ xs: 4 }} key={index}>
                            <Card
                                sx={{
                                    p: 2,
                                    cursor: 'pointer',
                                    backgroundColor: activeOrg?.name === org.name ? '#4caf50' : '#f5f5f5',
                                    color: activeOrg?.name === org.name ? '#fff' : '#000',
                                }}
                                onClick={() => setActiveOrg(org)}
                            >
                                <Typography>{org.name}</Typography>
                            </Card>
                        </Grid2>
                    ))}
                </Grid2>
            </Card>

            {/* PDF Generation Chart Section */}
            <Card className="p-6 mb-6">
                <Typography variant="h6" sx={{ mb: 2 }}>
                    PDF Generation Trends ({activeOrg?.name})
                </Typography>
                {isLoading ? (
                    <Skeleton variant="rectangular" width="100%" height={300} />
                ) : (
                    <Line data={chartData} options={{ responsive: true }} />
                )}
            </Card>

            {/* PDF Templates Section */}
            <Grid2 container spacing={3}>
                <Grid2 size={{ xs: 12, sm: 6, md: 4 }}>
                    <Card className="p-4">
                        <Typography variant="h6" sx={{ mb: 2 }}>
                            PDF Templates
                        </Typography>
                        {isLoading ? (
                            <Skeleton variant="text" sx={{ width: '100%' }} />
                        ) : (
                            pdfTemplates.map((template: any, index: any) => (
                                <Typography key={index} variant="body2" sx={{ mb: 1 }}>
                                    {template}
                                </Typography>
                            ))
                        )}
                    </Card>
                </Grid2>

                {/* Media Section */}
                <Grid2 size={{ xs: 12, sm: 6, md: 4 }}>
                    <Card className="p-4">
                        <Typography variant="h6" sx={{ mb: 2 }}>
                            Media
                        </Typography>
                        {isLoading ? (
                            <Skeleton variant="text" sx={{ width: '100%' }} />
                        ) : (
                            media.map((item: any, index: any) => (
                                <Typography key={index} variant="body2" sx={{ mb: 1 }}>
                                    {item}
                                </Typography>
                            ))
                        )}
                    </Card>
                </Grid2>

                {/* Integrations Section */}
                <Grid2 size={{ xs: 12, sm: 6, md: 4 }}>
                    <Card className="p-4">
                        <Typography variant="h6" sx={{ mb: 2 }}>
                            Integrations
                        </Typography>
                        {isLoading ? (
                            <Skeleton variant="text" sx={{ width: '100%' }} />
                        ) : (
                            integrations.map((integration: any, index: number) => (
                                <Typography key={index} variant="body2" sx={{ mb: 1 }}>
                                    {integration}
                                </Typography>
                            ))
                        )}
                    </Card>
                </Grid2>
            </Grid2>

            {/* PDF Table Overview */}
            <Card className="mt-6 p-6">
                <Typography variant="h6" sx={{ mb: 2 }}>
                    PDF Table Overview ({activeOrg?.name})
                </Typography>
                {isLoading ? (
                    <Skeleton variant="rectangular" width="100%" height={200} />
                ) : (
                    <table className="min-w-full table-auto">
                        <thead>
                            <tr>
                                <th className="px-4 py-2 text-left">ID</th>
                                <th className="px-4 py-2 text-left">Template Name</th>
                                <th className="px-4 py-2 text-left">Created Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {/* You can replace this with your dynamic data */}
                            <tr>
                                <td className="border px-4 py-2">001</td>
                                <td className="border px-4 py-2">Invoice Template</td>
                                <td className="border px-4 py-2">2024-01-01</td>
                            </tr>
                            <tr>
                                <td className="border px-4 py-2">002</td>
                                <td className="border px-4 py-2">Report Template</td>
                                <td className="border px-4 py-2">2024-02-01</td>
                            </tr>
                        </tbody>
                    </table>
                )}
            </Card>

            {/* Copy Token and cURL Section */}
            <Box sx={{ mt: 6 }}>
                <Typography variant="h6">Generated Token:</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography variant="body2" sx={{ mr: 2 }}>
                        my_generated_token_12345
                    </Typography>
                    <Tooltip title={tooltipToken}>
                        <IconButton onClick={() => handleCopy('my_generated_token_12345', 'token')}>
                            {copiedToken ? <CheckCircleIcon color="success" /> : <ContentCopyIcon />}
                        </IconButton>
                    </Tooltip>
                </Box>

                <Typography variant="h6" sx={{ mt: 4 }}>
                    cURL Command:
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography variant="body2" sx={{ mr: 2 }}>
                        curl -X POST https://api.example.com/access -H "Authorization: Bearer my_generated_token_12345"
                    </Typography>
                    <Tooltip title={tooltipCurl}>
                        <IconButton onClick={() => handleCopy('curl -X POST https://api.example.com/access -H "Authorization: Bearer my_generated_token_12345"', 'curl')}>
                            {copiedCurl ? <CheckCircleIcon color="success" /> : <ContentCopyIcon />}
                        </IconButton>
                    </Tooltip>
                </Box>
            </Box>
        </Box>
    );
};

export default Dashboard;





// import { Grid2 as Grid, Skeleton } from '@mui/material'
// import React from 'react'

// export default function Dashboard() {
//     return (
//         <Grid container spacing={1}>
//             <Grid size={5} />
//             <Grid size={12}>
//                 <Skeleton height={14} />
//             </Grid>
//             <Grid size={12}>
//                 <Skeleton height={14} />
//             </Grid>
//             <Grid size={4}>
//                 <Skeleton height={100} />
//             </Grid>
//             <Grid size={8}>
//                 <Skeleton height={100} />
//             </Grid>

//             <Grid size={12}>
//                 <Skeleton height={150} />
//             </Grid>
//             <Grid size={12}>
//                 <Skeleton height={14} />
//             </Grid>

//             <Grid size={3}>
//                 <Skeleton height={100} />
//             </Grid>
//             <Grid size={3}>
//                 <Skeleton height={100} />
//             </Grid>
//             <Grid size={3}>
//                 <Skeleton height={100} />
//             </Grid>
//             <Grid size={3}>
//                 <Skeleton height={100} />
//             </Grid>
//         </Grid>
//     )
// }
