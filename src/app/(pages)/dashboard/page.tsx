'use client';

import { useState, useEffect, useMemo } from 'react';
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
import { useDispatch, useSelector } from 'react-redux';
import { addOrganizationAll, clearOrganizationState, getDefaultOrganization, Organization, OrganizationState } from '@/redux/slice/organizationSlice';
import { setDefaultOrganization } from '@/app/services/organizationService';
import { useSession } from 'next-auth/react';
import { chartMonthlyData } from '@/app/services/logsService';
import PdfTemplatesList from '../setup/pdf-template/PdfTemplatesList';
import { readAllPdfTemplatePage } from '@/app/services/pdfService';

// Registering Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, ChartTooltip, Legend);

// Sample chart data
// const chartData = {
//     labels: ['January', 'February', 'March', 'April', 'May', 'June'],
//     datasets: [
//         {
//             label: 'PDF Requests',
//             data: [120, 90, 80, 110, 130, 140],
//             borderColor: '#4caf50',
//             tension: 0.2,
//             pointBackgroundColor: '#4caf50',
//         },
//     ],
// };

const chartOptions: any = {
    responsive: true,
    plugins: {
        legend: {
            display: true, // Show or hide the legend
            position: 'top', // Position of the legend (e.g., 'top', 'bottom')
        },
    },
    scales: {
        y: {
            beginAtZero: true, // Start the Y-axis at 0
            ticks: {
                stepSize: 1, // Ensure ticks are whole numbers
                callback: function (value: any) {
                    return Number.isInteger(value) ? value : null; // Only display whole numbers
                },
            },
        },
    },
};

// Animation variants
const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
};

const Dashboard = () => {
    const theme = useTheme(); // Accessing MUI theme for dynamic background
    const { organizations } = useSelector((state: any) => state.organization);
    const currentOrg: Organization | any = useSelector((state: { organization: OrganizationState }) =>
        getDefaultOrganization(state.organization)
    );
    const [isLoading, setIsLoading] = useState(true);
    const [orgs, setOrgs] = useState<Organization[]>(organizations);
    const [pdfTemplates, setPdfTemplates] = useState<string[]>([]);
    const [media, setMedia] = useState<string[]>([]);
    const [integrations, setIntegrations] = useState<string[]>([]);
    const [copiedToken, setCopiedToken] = useState(false);
    const [chartData, setChartData] = useState<any>({});

    const { data: session }: any = useSession();
    const dispatch = useDispatch();

    const [page, setPage] = useState(1);
    const pageSize = 5;

    const handlePageChange = (event: any, value: any) => {
        setPage(value);
    };

    useEffect(() => {
        setIsLoading(true);
        setOrgs(organizations);
        const fetchChartData = async () => {
            await chartMonthlyData(currentOrg.id, session?.user?.token).then((response) => {
                if (response.status == 200) {
                    const labels: string[] = response.data.map((item: any) => item.label);
                    const data = response.data.map((item: any) => item.value);
                    // console.log("Chart data:", data);
                    // console.log("Chart data:", labels);
                    setChartData({
                        labels: labels,
                        datasets: [
                            {
                                label: 'PDF Requests',
                                data,
                                borderColor: '#4caf50',
                                tension: .2,
                                pointBackgroundColor: '#4caf50',
                            },
                        ],
                    });
                }
                setIsLoading(false);
            }).catch((error) => {
                console.error('Error fetching chart data:', error);
                setIsLoading(false);
            });
        };
        setTimeout(() => {
            if (currentOrg?.id && session?.user?.token) {
                fetchChartData();
            }
            setPdfTemplates(['Invoice Template', 'Receipt Template', 'Summary Report']);
            setMedia(['Image 1', 'Image 2', 'Video 1']);
            setIntegrations(['Zapier', 'Google Sheets', 'Slack']);

        }, 1500);
    }, [currentOrg]);

    const handleCopy = () => {
        navigator.clipboard.writeText('my_generated_token_12345').then(() => {
            setCopiedToken(true);
            setTimeout(() => setCopiedToken(false), 2000);
        });
    };

    const setDefault = (orgId: number) => {
        // Implement the setDefault API call here
        // This function should update the default organization
        setDefaultOrganization(orgId, session?.user?.token).then((res: any) => {
            if (res?.status == 200) {
                let updatedOrgs = organizations.map((org: any) => ({ ...org, is_default: org.id === orgId }));
                dispatch(clearOrganizationState());
                dispatch(addOrganizationAll(updatedOrgs));
            }
        }).catch((err: any) => {
            console.error(err);
        });
    };

    // Memoize the truncated token calculation to avoid recalculating on every render
    const truncatedToken = useMemo(() => {
        return currentOrg?.refresh_token?.length > 15
            ? `${currentOrg?.refresh_token?.slice(0, 40)}...`
            : currentOrg?.refresh_token || 'No token available';
    }, [currentOrg?.refresh_token]);

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
                        {currentOrg?.name}
                    </Typography>
                    <Grid2 container spacing={2}>
                        {orgs.map((org, index) => (
                            <Grid2 size={4} key={index}>
                                <Card
                                    sx={{
                                        p: 2,
                                        cursor: 'pointer',
                                        backgroundColor: currentOrg?.name === org?.name ? '#4caf50' : theme.palette.background.paper,
                                        color: currentOrg?.name === org?.name ? '#fff' : theme.palette.text.primary,
                                    }}
                                    onClick={() => setDefault(org.id)}
                                >
                                    <Typography align="center">{org?.name}</Typography>
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
                    {isLoading && chartData ? (
                        <Skeleton variant="rectangular" height={300} />
                    ) : (
                        <Line data={chartData} options={chartOptions} />
                    )}
                </Card>
            </motion.div>

            {/* Dashboard Sections */}
            {/* PDF Templates List Section */}
            {!isLoading && <PdfTemplatesList
                currentOrg={currentOrg}
                session={session}
                page={page}
                pageSize={pageSize}
                onPageChange={handlePageChange}
                readAllPdfTemplatePage={readAllPdfTemplatePage} // API function to fetch templates
            />}
            {/* <Grid2 container spacing={3}> */}
            {/* PDF Templates */}
            {/* <Grid2 size={{ xs: 12, sm: 6, md: 4 }} >
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
                </Grid2> */}
            {/* </Grid2> */}

            {/* API Token Section */}
            <motion.div initial="hidden" animate="visible" variants={fadeIn} transition={{ duration: 0.5, delay: 0.6 }}>
                <Card sx={{ mt: 4, p: 3 }}>
                    <Typography variant="h6">API Token</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                        <Typography variant="body1" sx={{ mr: 2 }}>
                            {truncatedToken || 'No token available'}
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
