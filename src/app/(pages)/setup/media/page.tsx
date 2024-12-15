"use client";
import React, { useState, useCallback } from 'react';
import { Box, Tab, Tabs, Typography, Container, Grid2 as Grid, Button, Stack } from '@mui/material';
import ImageManage from '../components/imageManage';

function MediaManageParent() {
    const [tabValue, setTabValue] = useState('1');
    const [imageList, setImageList] = useState<any[]>([]); // For storing list of images

    // Handle Tab Change
    const handleChange = (event: React.SyntheticEvent, newValue: string) => {
        setTabValue(newValue);
    };

    // Callback function for uploading image (pass to MediaManage)
    const handleImageUpload = useCallback(
        (newImage: any) => {
            setImageList((prevList) => [...prevList, newImage]);
        },
        []
    );

    return (
        <Container>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={tabValue} onChange={handleChange} aria-label="Media management tabs">
                    <Tab label="All Images" value="1" />
                    <Tab label="New Image" value="2" />
                </Tabs>
            </Box>

            {/* All Images Tab */}
            <TabPanel value={tabValue} index="1">
                <Typography variant="h6" gutterBottom>
                    All Created Images
                </Typography>
                <Grid container spacing={2}>
                    {imageList.map((image, index) => (
                        <Grid size={{ xs: 6, md: 4 }} key={index}>
                            <Box sx={{ border: '1px solid #ccc', padding: 2 }}>
                                <img src={image.preview} alt={`image-${index}`} className="w-full h-auto" />
                                <Typography variant="body2" mt={1}>
                                    Key: {image.key}
                                </Typography>
                                <Stack direction="row" spacing={1}>
                                    {image.addons.map((addon: string, i: number) => (
                                        <Button key={i} size='small' sx={{ fontSize: 8 }} variant="outlined">
                                            {addon}
                                        </Button>
                                    ))}
                                </Stack>
                            </Box>
                        </Grid>
                    ))}
                </Grid>
            </TabPanel>

            {/* New Image Tab */}
            <TabPanel value={tabValue} index="2">
                <ImageManage onImageUpload={handleImageUpload} />
            </TabPanel>
        </Container>
    );
}

// TabPanel Component
function TabPanel(props: { value: string; index: string; children: React.ReactNode }) {
    const { value, index, children } = props;
    return value === index && <Box sx={{ padding: 2 }}>{children}</Box>;
}

export default MediaManageParent;
