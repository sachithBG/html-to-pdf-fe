import React from 'react';
import {
    Container,
    Typography,
    Card,
    CardContent,
    Grid,
    List,
    ListItem,
    ListItemText,
    Box,
    Divider,
    Button,
    Paper,
} from '@mui/material';
import { ArrowForward } from '@mui/icons-material';

const PDFDesignGuide: React.FC = () => {
    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            {/* Page Title */}
            {/* <Typography variant="h4" gutterBottom>
                PDF Design Guide
            </Typography> */}

            {/* Overview */}
            <Card sx={{ mb: 4 }}>
                <CardContent>
                    <Typography variant="h5" gutterBottom>
                        Overview
                    </Typography>
                    <Typography variant="body1">
                        This guide explains the steps to create and manage PDF templates, addons, tags, and dynamic tables, and
                        finally integrate the system using tokens and APIs.
                    </Typography>
                </CardContent>
            </Card>

            {/* Available Side Menu */}
            <Card sx={{ mb: 4 }}>
                <CardContent>
                    <Typography variant="h5" gutterBottom>
                        Available Side Menu
                    </Typography>
                    <List>
                        <ListItem>
                            <ListItemText primary="Setup" secondary="Pdf Design, Table Manage, Media, Config" />
                        </ListItem>
                        <ListItem>
                            <ListItemText primary="Integrations" secondary="Manage tokens and APIs" />
                        </ListItem>
                        <ListItem>
                            <ListItemText primary="Organization" secondary="Manage organizations" />
                        </ListItem>
                        <ListItem>
                            <ListItemText primary="Profile" secondary="Manage user profiles" />
                        </ListItem>
                    </List>
                </CardContent>
            </Card>

            {/* Steps Section */}
            <Grid container spacing={4}>
                {/* Create Addon */}
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                1. Create Addon
                            </Typography>
                            <Typography variant="body1">
                                Addons allow you to add reusable components that can be injected into templates.
                            </Typography>
                            <Box mt={2}>
                                <Button size='small' variant="outlined" color="primary">
                                    Create New Addon
                                </Button>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Create Tags */}
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                2. Create Tags
                            </Typography>
                            <Typography variant="body1">
                                Tags dynamically reference data fields in the template, such as{' '}
                                <code>{`{{jobOrder.name}}`}</code>.
                            </Typography>
                            <Box mt={2}>
                                <Button size='small' variant="outlined" color="primary">
                                    Add New Tag
                                </Button>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Create Dynamic Table */}
                <Grid item xs={12}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                3. Create Dynamic Table
                            </Typography>
                            <Typography variant="body1">
                                Dynamic tables organize data into tabular formats linked to JSON arrays.
                            </Typography>
                            <Box mt={2}>
                                <Button size='small' variant="outlined" color="primary">
                                    Create New Table
                                </Button>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Integration Section */}
            <Card sx={{ mt: 4, mb: 4 }}>
                <CardContent>
                    <Typography variant="h6" gutterBottom>
                        4. Integration
                    </Typography>
                    <Typography variant="body1">
                        Use tokens and APIs to integrate the generated PDFs into external systems.
                    </Typography>
                    <Paper elevation={2} sx={{ p: 2, mt: 2 }}>
                        <Typography variant="body2">
                            Example API Endpoint:
                            <code> POST /generate-pdf</code>
                        </Typography>
                        <Typography variant="body2">
                            Example Payload:
                            <pre>{`
{
    "templateId": "1234",
    "data": {
        "jobOrder": { "name": "Sample Job", "date": "2025-01-23" },
        "order": {
            "items": [
                { "item": "Item 1", "quantity": 2, "price": 50 },
                { "item": "Item 2", "quantity": 1, "price": 100 }
            ]
        }
    }
}
`}</pre>
                        </Typography>
                    </Paper>
                </CardContent>
            </Card>

            {/* Flowchart Section */}
            <Card>
                <CardContent>
                    <Typography variant="h6" gutterBottom>
                        Flowchart
                    </Typography>
                    <Box mt={2} textAlign="center">
                        {/* Placeholder for a flowchart */}
                        <Paper
                            elevation={2}
                            sx={{
                                height: 350,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: '100%',
                                // backgroundColor: '#f5f5f5',
                            }}
                        >
                            <Box
                                sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    gap: 4,
                                    p: 4,
                                    backgroundColor: "#f9f9f9",
                                    borderRadius: 2,
                                }}
                            >
                                {/* Start Node */}
                                <Box
                                    sx={{
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        backgroundColor: "#1976d2",
                                        color: "#fff",
                                        width: 120,
                                        height: 50,
                                        borderRadius: 1,
                                    }}
                                >
                                    Start
                                </Box>

                                <Box
                                    sx={{
                                        display: "flex",
                                        flexDirection: "row",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        gap: 4,
                                    }}
                                >
                                    {/* Create Addon */}
                                    <Box
                                        sx={{
                                            display: "flex",
                                            justifyContent: "center",
                                            alignItems: "center",
                                            backgroundColor: "#42a5f5",
                                            color: "#fff",
                                            width: 160,
                                            height: 50,
                                            borderRadius: 1,
                                        }}
                                    >
                                        Create Addon
                                    </Box>

                                    {/* Arrow */}
                                    <ArrowForward sx={{ fontSize: "2rem", color: "#888" }} />

                                    {/* Create Tags */}
                                    <Box
                                        sx={{
                                            display: "flex",
                                            justifyContent: "center",
                                            alignItems: "center",
                                            backgroundColor: "#42a5f5",
                                            color: "#fff",
                                            width: 160,
                                            height: 50,
                                            borderRadius: 1,
                                        }}
                                    >
                                        Create Tags
                                    </Box>
                                </Box>

                                <Box
                                    sx={{
                                        display: "flex",
                                        flexDirection: "row",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        gap: 4,
                                    }}
                                >
                                    {/* Create Table */}
                                    <Box
                                        sx={{
                                            display: "flex",
                                            justifyContent: "center",
                                            alignItems: "center",
                                            backgroundColor: "#42a5f5",
                                            color: "#fff",
                                            width: 160,
                                            height: 50,
                                            borderRadius: 1,
                                        }}
                                    >
                                        Create Table
                                    </Box>

                                    {/* Arrow */}
                                    <ArrowForward sx={{ fontSize: "2rem", color: "#888" }} />

                                    {/* Integration */}
                                    <Box
                                        sx={{
                                            display: "flex",
                                            justifyContent: "center",
                                            alignItems: "center",
                                            backgroundColor: "#1976d2",
                                            color: "#fff",
                                            width: 160,
                                            height: 50,
                                            borderRadius: 1,
                                        }}
                                    >
                                        Integration
                                    </Box>
                                </Box>

                                {/* End Node */}
                                <Box
                                    sx={{
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        backgroundColor: "#1565c0",
                                        color: "#fff",
                                        width: 120,
                                        height: 50,
                                        borderRadius: 1,
                                    }}
                                >
                                    End
                                </Box>
                            </Box>


                        </Paper>
                    </Box>
                </CardContent>
            </Card>

            <Divider sx={{ my: 4 }} />

            {/* Notes */}
            <Card>
                <CardContent>
                    <Typography variant="h6" gutterBottom>
                        Notes
                    </Typography>
                    <Typography variant="body1">
                        Ensure all JSON fields are mapped correctly. Test integrations thoroughly to handle edge cases.
                    </Typography>
                </CardContent>
            </Card>
        </Container>
    );
};

export default PDFDesignGuide;
