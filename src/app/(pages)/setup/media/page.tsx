"use client";
import React, { useState, useCallback, useEffect } from 'react';
import { Box, Tab, Tabs, Typography, Container, Grid2 as Grid, Grid2, FormControl, InputLabel, Select, MenuItem, Checkbox, ListItemText } from '@mui/material';
import dynamic from 'next/dynamic';
import { deleteImg, findAllImages, uploadMedia } from '@/app/services/mediaService';
import { useSession } from 'next-auth/react';
import { findAllAddons } from '@/app/services/addonService';
import { getDefaultOrganization, Organization, OrganizationState } from '@/redux/slice/organizationSlice';
import { useSelector } from 'react-redux';
import { useSnackbar } from 'notistack';
import ImageManage from '../components/ImageArrange';
// const ImageManage = dynamic(() => import('../components/ImageManage'), { ssr: false });
const ImageList = dynamic(() => import('../components/ImageList'), { ssr: false });

interface Addon {
    id: number;
    name: string;
}

function MediaManageParent() {
    const [tabValue, setTabValue] = useState('1');
    const [imageList, setImageList] = useState<any[]>([]); // For storing list of images
    const { data: session }: any = useSession();
    const [isLoading, setIsLoading] = useState(true);
    const [addons, setAddons] = useState<Addon[]>([]);
    const [copiedToken, setCopiedToken] = useState(false); // Track if token was copied
    const [tooltipToken, setTooltipToken] = useState('Copy URL'); // Track if cURL command was copied
    const [selectedAddons, setSelectedAddons] = useState<number[]>([]);

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
                const res = await uploadMedia(currentOrg.id, newImage.preview!, add, session?.user?.token);
                if (res.status == 201) {
                    enqueueSnackbar(`Uploaded`, { variant: 'success' });
                    const img = res.data?.data;
                    // console.log(img)
                    setImageList((prevList) => [...prevList, {
                        id: img.id,
                        file_key: img.file_key,
                        addon_ids: img.addon_ids,
                        url: img.url,
                        organization_id: img.organization_id
                    }]);
                }
            } catch (e: any) {
                enqueueSnackbar(`Failed ${e?.message}`, { variant: 'error' });
                console.error(e);
            }
        },
        [currentOrg?.id, session, addons]
    );

    useEffect(() => {
        // Fetch the available addons from the API
        // alert(tabValue)
        const fetchAddons = async () => {
            try {
                setIsLoading(true);
                const res = await findAllAddons(currentOrg?.id, session?.user?.token);
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
                const res = await findAllImages(currentOrg?.id, session?.user?.token);
                setImageList(() => res);
            } catch (error) {
                console.error("Error fetching addons:", error);
            } finally {
                setIsLoading(false);
            }
        }
        if (session?.user?.token) {
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
                    const res = await findAllImages(currentOrg?.id, session?.user?.token, selectedAddons);
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

    const handleCopyUrl = (url: string) => {
        // console.log(tag)
        if (!url) return;
        navigator.clipboard.writeText(url).then(() => {
            // enqueueSnackbar(`Url key copied: {{${url}}}`, { variant: 'success' });
            setCopiedToken(true);
            setTooltipToken('Copied');
            const t =setTimeout(() => {
                setCopiedToken(false);
                setTooltipToken('Copy');
                clearTimeout(t);
            }, 2000);
        }).catch(err => {
            console.error('Failed to copy: ', err);
        });
    };

    const handleDelete = async (fileKey: string) => {
        try {
            const response = await deleteImg(fileKey, session?.user?.token);
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
                        handleCopy={(url: string) => handleCopyUrl(url)}
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
                <ImageManage onImageUpload={handleImageUpload} addons={addons} />
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
