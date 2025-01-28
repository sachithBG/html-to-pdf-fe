"use client";
import React, { useState, useCallback, useEffect } from 'react';
import { Box, Tab, Tabs, Typography, Container, Grid2 as Grid, Grid2, FormControl, InputLabel, Select, MenuItem, Checkbox, ListItemText, TextField } from '@mui/material';
import dynamic from 'next/dynamic';
import { deleteImg, findAllImages, uploadMedia } from '@/app/services/mediaService';
import { findAllAddons } from '@/app/services/addonService';
import { getDefaultOrganization, Organization, OrganizationState } from '@/redux/slice/organizationSlice';
import { useSelector } from 'react-redux';
import { useSnackbar } from 'notistack';
import ImageManage from '../components/ImageArrange';
import { RootState } from '@/redux/store';
// const ImageManage = dynamic(() => import('../components/ImageManage'), { ssr: false });
const ImageList = dynamic(() => import('../components/ImageList'), { ssr: false });

interface Addon {
    id: number;
    name: string;
}

function MediaManageParent() {
    const [tabValue, setTabValue] = useState('1');
    const [imageList, setImageList] = useState<any[]>([]); // For storing list of images
    const { token } = useSelector((state: RootState) => state.session);
    const [isLoading, setIsLoading] = useState(true);
    const [addons, setAddons] = useState<Addon[]>([]);
    const [copiedToken, setCopiedToken] = useState<Map<number, boolean>>(new Map()); // Track if token was copied for each image
    const [tooltipToken, setTooltipToken] = useState<Map<number, string>>(new Map()); // Track tooltip text for each image
    const [selectedAddons, setSelectedAddons] = useState<number[]>([]);
    const [imageName, setImageName] = useState<string>('');

    const { enqueueSnackbar } = useSnackbar();
    // Handle Tab Change
    const handleChange = (event: React.SyntheticEvent, newValue: string) => {
        setTabValue(newValue);
    };

    const currentOrg: Organization | any = useSelector((state: { organization: OrganizationState }) =>
        getDefaultOrganization(state.organization)
    );

    // Callback function for uploading image (pass to MediaManage)
    const handleImageUpload = useCallback(
        async (newImage: any) => {
            try {
                // console.log(newImage);
                const add = addons.filter(a => newImage.addons.includes(a.name)).map(a => a.id);
                // console.log(add);
                const res = await uploadMedia(currentOrg.id, newImage.preview!, add, token, imageName);
                if (res.status == 201) {
                    enqueueSnackbar(`Uploaded`, { variant: 'success' });
                    const img = res.data?.data;
                    // console.log(img)
                    setImageList((prevList) => [...prevList, {
                        id: img.id,
                        file_key: img.file_key,
                        addon_ids: img.addon_ids,
                        url: img.url,
                        organization_id: img.organization_id,
                        name: imageName
                    }]);
                }
            } catch (e: any) {
                enqueueSnackbar(`Failed ${e?.message}`, { variant: 'error' });
                console.error(e);
            }
        },
        [currentOrg?.id, token, addons]
    );

    useEffect(() => {
        // Fetch the available addons from the API
        // alert(tabValue)
        const fetchAddons = async () => {
            try {
                setIsLoading(true);
                const res = await findAllAddons(currentOrg?.id, token);
                if (res.status == 200) {
                    setAddons(() => res.data);
                }
            } catch (error) {
                console.error("Error fetching addons:", error);
            } finally {
                setIsLoading(false);
            }
        }

        const fetchImgs = async () => {
            try {
                const res = await findAllImages(currentOrg?.id, token);
                setImageList(() => res);
            } catch (error) {
                console.error("Error fetching addons:", error);
            } finally {
                setIsLoading(false);
            }
        }
        if (token) {
            fetchAddons();
            fetchImgs();
        }
        return () => {
            setAddons([]);
        }
    }, [currentOrg?.id]);

    useEffect(() => {
        if (currentOrg?.id) {
            const fetchImgs = async () => {
                try {
                    const res = await findAllImages(currentOrg?.id, token, selectedAddons);
                    setImageList(() => res);
                } catch (error) {
                    console.error("Error fetching addons:", error);
                } finally {
                    setIsLoading(false);
                }
            }
            setIsLoading(true);
            fetchImgs();
        }
    }, [selectedAddons]);

    // const handleCopyUrl2 = (url: string, id: number) => {
    //     if (!url) return;

    //     // Copy URL to clipboard
    //     navigator.clipboard.writeText(url)
    //         .then(() => {
    //             // Update copiedToken state to mark it as copied for the specific image ID
    //             setCopiedToken((prev) => new Map(prev).set(id, true));

    //             // Set tooltip text to 'Copied' for this specific image
    //             setTooltipToken((prev) => new Map(prev).set(id, 'Copied'));

    //             // Reset after a short delay
    //             const t = setTimeout(() => {
    //                 setCopiedToken((prev) => new Map(prev).set(id, false));
    //                 setTooltipToken((prev) => new Map(prev).set(id, 'Copy URL'));
    //                 clearTimeout(t);
    //             }, 2000);
    //         })
    //         .catch(err => {
    //             console.error('Failed to copy: ', err);
    //         });
    // };

    const handleCopyUrl = (url: string, id: number) => {
        if (!url) return;

        if (navigator.clipboard && typeof navigator.clipboard?.writeText === 'function') {
            // Modern approach using Clipboard API
            navigator.clipboard.writeText(url)
                .then(() => {
                    setCopiedToken((prev) => new Map(prev).set(id, true));
                    setTooltipToken((prev) => new Map(prev).set(id, 'Copied'));
                    const t = setTimeout(() => {
                        setCopiedToken((prev) => new Map(prev).set(id, false));
                        setTooltipToken((prev) => new Map(prev).set(id, 'Copy URL'));
                        clearTimeout(t);
                    }, 2000);
                })
                .catch((err) => {
                    console.error('Clipboard API failed, using fallback:', err);
                    fallbackCopyToClipboard(url, id); // Fallback if Clipboard API fails
                });
        } else {
            // Fallback for older browsers or restricted environments
            fallbackCopyToClipboard(url, id);
        }
    };

    const fallbackCopyToClipboard = (url: string, id: number) => {
        const textArea = document.createElement('textarea');
        textArea.value = url;
        textArea.style.position = 'fixed'; // Avoid scrolling to the bottom
        textArea.style.opacity = '0';
        textArea.style.left = '-9999px'; // Keep it hidden
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        try {
            const successful = document.execCommand('copy');
            if (successful) {
                setCopiedToken((prev) => new Map(prev).set(id, true));
                setTooltipToken((prev) => new Map(prev).set(id, 'Copied'));
                const t = setTimeout(() => {
                    setCopiedToken((prev) => new Map(prev).set(id, false));
                    setTooltipToken((prev) => new Map(prev).set(id, 'Copy URL'));
                    clearTimeout(t);
                }, 2000);
            } else {
                console.error('Fallback copy failed');
            }
        } catch (err) {
            console.error('Fallback copy error:', err);
        }
        document.body.removeChild(textArea);
    };

    const handleDelete = async (fileKey: string) => {
        try {
            const response = await deleteImg(fileKey, token);
            if (response.status == 204) {
                setImageList((prev) => [...prev.filter(i => i.file_key != fileKey)]);
            }
        } catch (error) {
            console.error("Error fetching addons:", error);
        }
    };

    const handleAddonChange = (event: any) => {
        setSelectedAddons(event.target.value as number[]);
    };

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
                <Grid2 size={{ lg: 6 }} sx={{m:5}}>
                    <FormControl fullWidth size='small'>
                        <InputLabel>Filter By Addons</InputLabel>
                        <Select
                            multiple
                            value={selectedAddons}
                            onChange={handleAddonChange}
                            label="Filter By Addons"
                            required
                            size='small'
                            renderValue={(selected) => addons.filter(a => selected.includes(a.id)).map(a=> a.name).join(', ')}
                        >
                            {addons?.map((addon) => (
                                <MenuItem key={addon.id} value={addon.id}>
                                    <Checkbox checked={selectedAddons.includes(addon.id)} />
                                    <ListItemText primary={addon.name} />
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    
                </Grid2>
                {!isLoading && <Grid container spacing={2}>
                    <ImageList
                        imageList={imageList}
                        addons={addons}
                        handleDelete={(fileKey: string) => handleDelete(fileKey)}
                        handleCopy={(url: string, id: number) => handleCopyUrl(url, id)}
                        tooltipImg={tooltipToken}
                        copiedToken={copiedToken}
                    />
                    {/* {imageList.map((image, index) => (
                        <Grid size={{ xs: 6, md: 4 }} key={index + image.file_key}>
                            <Box sx={{ border: '1px solid #ccc', padding: 2 }}>
                                <Image src={image.url} width={200} height={200} alt={`image-${index}`} className="w-full h-auto" />
                                <Typography variant="body2" mt={1}>
                                    Created At: {new Date(image.updated_at).toLocaleDateString()}
                                </Typography>
                                <Stack direction="row" spacing={1}>
                                    {addons?.filter((a: any) => image.addon_ids.includes(a.id + '')) ?.map(a=> a.name)?.map((addon: string, i: number) => (
                                        <Button key={i} size='small' sx={{ fontSize: 8 }} variant="outlined">
                                            {addon}
                                        </Button>
                                    ))}
                                </Stack>
                            </Box>
                        </Grid>
                    ))} */}
                </Grid>}
            </TabPanel>

            {/* New Image Tab */}
            <TabPanel value={tabValue} index="2">
                <ImageManage onImageUpload={handleImageUpload} addons={addons}
                    imageName={imageName} setImageName={setImageName}/>
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
