"use client";
import { useState, useEffect } from 'react';
import { Button, TextField, Chip, IconButton, Popover, MenuItem, Select, InputLabel, FormControl, Paper, Box, Typography, Checkbox, ListItemText, Grid2, useTheme, Tooltip, Snackbar, Alert, Tabs, Tab, Skeleton } from '@mui/material';
import { RootState } from '@/redux/store';
import { useSelector } from 'react-redux';
import { getDefaultOrganization, Organization, OrganizationState } from '@/redux/slice/organizationSlice';
import { findAllAddons } from '@/app/services/addonService';
import { createTag, deleteTag, findAllTags, updateTag } from '@/app/services/tagService';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import dynamic from 'next/dynamic';
const ManageAddonsPage = dynamic(() => import('@/app/(pages)/setup/components/ManageAddons'), { ssr: false });
const ExternalKeyManager = dynamic(() => import('@/app/(pages)/setup/components/ExternalKeyManager'), { ssr: false });
const TemplateDataManager = dynamic(() => import('@/app/(pages)/setup/components/TemplateDataManager'), { ssr: false });

interface Addon {
    id: number;
    name: string;
}

interface Tag {
    id: number;
    name: string;
    addon_ids: number[];
    field_path: string;
    tag_type: string;
}

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function CustomTabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
        </div>
    );
}

function a11yProps(index: number) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

const TagManagementPage = () => {
    const [addons, setAddons] = useState<Addon[]>([]);
    const [selectedAddons, setSelectedAddons] = useState<number[]>([]);
    const [selectedType, setSelectedType] = useState<string>("CONTENT");
    const [tagKey, setTagKey] = useState('');
    const [tagName, setTagName] = useState('');
    const [tags, setTags] = useState<Tag[]>([]);
    const [editTag, setEditTag] = useState<Tag | any>(null);
    // const [popoverAnchor, setPopoverAnchor] = useState<HTMLElement | null>(null);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    // const [editTag, setEditTag] = useState<{ id: number; name: string } | null | any>(null);
    const [deleteAnchorEl, setDeleteAnchorEl] = useState<null | HTMLElement>(null);
    const [tagToDelete, setTagToDelete] = useState<number | null>(null);
    const [errors, setErrors] = useState<{ name?: string, field_path?: string, tag_type?: string }>({});

    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [copiedText, setCopiedText] = useState('');

    const currentOrg: Organization | any = useSelector((state: { organization: OrganizationState }) =>
        getDefaultOrganization(state.organization)
    );
    const { token } = useSelector((state: RootState) => state.session);
    const theme = useTheme();

    const openPopover = Boolean(anchorEl);
    const id = openPopover ? 'simple-popover' : undefined;

    const openDelete = Boolean(deleteAnchorEl);
    const idDelete = openDelete ? 'delete-popover' : undefined;
    const [tabValue, setTabValue] = useState(0);

    const [chosenAddon, setChosenAddon] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        // Fetch the available addons from the API
        // alert(tabValue)
        const fetchAddons = async () => {
            try {
                setIsLoading(true);
                const res = await findAllAddons(currentOrg?.id, token);
                if (res.status == 200) {
                    setAddons(() => res.data);
                    try {
                        const response = await findAllTags(res.data?.filter((a: any) => selectedAddons.includes(a.name)), token);
                        // axios.get(process.env.NEXT_PUBLIC_BASE_URL + "v1/tags", {
                        //     params: { addons: addons.filter(a => selectedAddons.includes(a.name)).map(a => a.id).join(',') },
                        // });
                        if (response.status == 200) {
                            setTags(response.data);
                        }
                    } catch (error) {
                        console.error("Error fetching tags:", error);
                    }
                }
            } catch (error) {
                console.error("Error fetching addons:", error);
            } finally {
                setIsLoading(false);
            }
        }
        if (token) fetchAddons();
        return () => {
            setAddons([]);
            setTags([]);
        }
    }, [currentOrg?.id, tabValue]);

    const handleAddonChange = async (event: any) => {
        setSelectedAddons(event.target.value);
        // console.log(event.target.value)
        try {
            const response = await findAllTags(event.target.value, token);
            if (response.status == 200) {
                setTags(response.data);
            }
        } catch (error) {
            console.error("Error fetching tags:", error);
        }
    };

    const handleSaveTag = async () => {
        // Clear previous errors
        setErrors({});

        // Validation
        const newErrors: { name?: string; field_path?: string; tag_type?: string } = {};
        if (!tagName) newErrors.name = 'Tag name is required';
        if (!tagKey) newErrors.field_path = 'Tag key is required';
        if (!selectedAddons.length) newErrors.tag_type = 'At least one addon must be selected';

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return; // Exit if there are validation errors
        }
        const newTag = {
            name: tagName,
            addon_ids: selectedAddons,
            organization_id: currentOrg.id,
            tag_type: selectedType || 'CONTENT',
            field_path: tagKey
        };
        try {
            const response = await createTag(newTag, token);
            if (response.status == 201) {
                setTags((prevTags) => [...prevTags, response.data]);
                setTagKey('');
                setTagName('');
            }
        } catch (error) {
            console.error("Error fetching addons:", error);
        }
    };

    const handleDeleteTag = async (tagId: number) => {
        try {
            const response = await deleteTag(tagId, token);
            if (response.status == 204) {
                setTags(tags.filter((tag) => tag.id !== tagId));
            }
        } catch (error) {
            console.error("Error fetching addons:", error);
        }
    };

    const handleConfirmDelete = () => {
        if (tagToDelete !== null) {
            handleDeleteTag(tagToDelete);
            handleDeleteClose();
        }
    };

    const handleEditClick = (event: React.MouseEvent<HTMLElement>, tag: Tag) => {
        setAnchorEl(event.currentTarget);
        setEditTag(tag);
    };

    const handleEditClose = () => {
        setAnchorEl(null);
        setEditTag(null);
    };

    const handleDeleteClick = (event: React.MouseEvent<HTMLElement>, tagId: number) => {
        setDeleteAnchorEl(event.currentTarget);
        setTagToDelete(tagId);
    };

    const handleDeleteClose = () => {
        setDeleteAnchorEl(null);
        setTagToDelete(null);
    };

    const handleUpdateTag = async () => {
        if (editTag) {
            try {
                const response = await updateTag(editTag, token);
                if (response.status == 200) {
                    setTags((prevTags) =>
                        prevTags.map((tag) => (tag.id + '' === response.data.id ? response.data : tag))
                    );
                    handleEditClose();
                }

            } catch (error) {
                console.error("Error fetching addons:", error);
            }
        }
    };

    // Handle Copy Tag
    //
    // const handleCopyTag1 = (tagKey: string) => {
    //     // console.log(tag)
    //     alert(tagKey)
    //     navigator.clipboard.writeText(`{{${tagKey}}}`).then(() => {
    //         setCopiedText(`{{${tagKey}}}`);
    //         setSnackbarOpen(true); // Show snackbar when copied
    //         setTimeout(() => setSnackbarOpen(false), 3000); // Hide snackbar after 3 seconds
    //     }).catch(err => {
    //         console.error('Failed to copy: ', err);
    //     });
    // };

    const handleCopyTag = (tagKey: string) => {
        const textToCopy = `{{${tagKey}}}`;

        if (navigator.clipboard && typeof navigator.clipboard?.writeText === 'function') {
            // Modern approach using Clipboard API
            navigator.clipboard.writeText(textToCopy)
                .then(() => {
                    handleSuccessCopy(textToCopy);
                })
                .catch((err) => {
                    console.error('Clipboard API failed, using fallback:', err);
                    fallbackCopyToClipboard(textToCopy); // Fallback if Clipboard API fails
                });
        } else {
            // Fallback for older browsers or restricted environments
            fallbackCopyToClipboard(textToCopy);
        }
    };

    const fallbackCopyToClipboard = (text: string) => {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed'; // Avoid scrolling to the bottom
        textArea.style.opacity = '0';
        textArea.style.left = '-9999px'; // Keep it hidden
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        try {
            const successful = document.execCommand('copy');
            if (successful) {
                handleSuccessCopy(text);
            } else {
                console.error('Fallback copy failed');
            }
        } catch (err) {
            console.error('Fallback copy error:', err);
        }
        document.body.removeChild(textArea);
    };

    const handleSuccessCopy = (copiedText: string) => {
        setCopiedText(copiedText);
        setSnackbarOpen(true); // Show snackbar when copied
        setTimeout(() => setSnackbarOpen(false), 3000); // Hide snackbar after 3 seconds
    };

    const handleChangeTab = (event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    };

    const handleAddonSelection = (event: any) => {
        setChosenAddon(event.target.value);
    };

    // template data -----------------------------------------------
    // const handleSaveTemplate = (updatedTemplate: any) => {
    //     setTemplates((prevTemplates) =>
    //         prevTemplates.map((template) =>
    //             template.id === updatedTemplate.id ? updatedTemplate : template
    //         )
    //     );
    // };

    return (
        <Box className="container mx-auto p-4">
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={tabValue} onChange={handleChangeTab} aria-label="basic tabs example">
                    <Tab label="Tag" {...a11yProps(0)} />
                    <Tab label="Type/Status" {...a11yProps(1)} />
                    <Tab label="Template Test data" {...a11yProps(2)} />
                    <Tab label="Addons" {...a11yProps(3)} />
                </Tabs>
            </Box>
            <CustomTabPanel value={tabValue} index={0}>
                {/* Addon Picker */}
                <Box mb={3} mt={4}>
                    <FormControl fullWidth size='small'>
                        <InputLabel>Addons</InputLabel>
                        <Select
                            multiple
                            value={selectedAddons}
                            onChange={handleAddonChange}
                            label="Addons"
                            required
                            size='small'
                            renderValue={(selected) => selected.map((id) => addons.find((addon) => addon.id === id)?.name).join(', ')}
                        >
                            {addons?.map((addon) => (
                                <MenuItem key={addon.id} value={addon.id}>
                                    <Checkbox checked={selectedAddons.includes(addon.id)} />
                                    <ListItemText primary={addon.name} />
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Box>
                <Box mb={2} mt={2}>
                    <FormControl fullWidth size='small'>
                        <InputLabel>Type</InputLabel>
                        <Select
                            value={selectedType}
                            onChange={(event) => {
                                setSelectedType(event.target.value);
                            }}
                            required
                            label="Type"
                            size='small'
                        >
                            {["CONTENT", "TABLE", "IMAGE"].map((t) => (
                                <MenuItem key={t} value={t}>
                                    {t}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Box>
                {/* Tag Name Input */}
                <TextField
                    label="Tag Name"
                    fullWidth
                    value={tagName}
                    onChange={(event) => setTagName(event.target.value)}
                    margin="normal"
                    error={Boolean(errors.name)}
                    helperText={errors.name}
                    disabled={selectedType == 'TABLE'}
                    size='small'
                />
                {/* Tag Key Input */}
                <TextField
                    label="Tag Key"
                    fullWidth
                    value={tagKey}
                    onChange={(event) => setTagKey(event.target.value)}
                    margin="normal"
                    error={Boolean(errors.field_path)}
                    helperText={errors.field_path}
                    disabled={selectedType == 'TABLE'}
                    size='small'
                />

                {/* Save Button */}
                <Button size='small' variant="outlined" color="primary" sx={{ float: 'right' }} onClick={handleSaveTag} disabled={selectedType == 'TABLE'}>
                    Save Tag
                </Button>

                {/* Display Tags */}
                <div style={{ marginTop: 20 }}>
                    <Grid2 container spacing={2}>
                        {tags?.filter(t => t.tag_type === selectedType).map((tag) => (
                            <Grid2 key={tag.id}>
                                <Paper
                                    elevation={3}
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        p: 1,
                                        borderRadius: '8px',
                                        boxShadow: 3,
                                        bgcolor: theme.palette.background.paper,
                                        ':hover': { boxShadow: 6 },
                                    }}
                                >
                                    <Chip
                                        label={tag.name}
                                        onDelete={(e) => handleEditClick(e, tag)}
                                        deleteIcon={<EditIcon sx={{
                                            color: theme.palette.mode === 'light' ? theme.palette.success.dark : theme.palette.secondary.light,
                                        }} />}
                                        sx={{
                                            borderRadius: '12px',
                                            borderColor: 'transparent',
                                            ml: 1,
                                            flexGrow: 1,
                                            '&:hover': { borderColor: theme.palette.primary.main },
                                        }}
                                        variant="outlined"
                                    />
                                    {/* Copy Icon Button */}
                                    <Tooltip title={"Copy Key " + tag.field_path}>
                                        <IconButton
                                            onClick={() => handleCopyTag(tag.field_path)}
                                            size="small"
                                            sx={{
                                                padding: '6px',
                                                '&:hover': {
                                                    backgroundColor: theme.palette.info.main,
                                                    color: theme.palette.common.white,
                                                },
                                            }}
                                        >
                                            <FileCopyIcon sx={{ fontSize: 16 }} />
                                        </IconButton>
                                    </Tooltip>
                                    {/* Delete Icon Button */}
                                    <IconButton
                                        onClick={(event) => handleDeleteClick(event, tag.id)}
                                        size="small"
                                        sx={{
                                            padding: '6px',
                                            '&:hover': {
                                                backgroundColor: theme.palette.error.main,
                                                color: theme.palette.common.white,
                                            },
                                        }}
                                    >
                                        <DeleteIcon sx={{ fontSize: 16 }} />
                                    </IconButton>
                                </Paper>

                            </Grid2>
                        ))}
                    </Grid2>
                </div>

                {/* Popover for Tag Delete Confirmation */}
                <Popover
                    id={id}
                    open={openPopover}
                    anchorEl={anchorEl}
                    onClose={handleEditClose}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'center',
                    }}
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'center',
                    }}
                >
                    <Box sx={{ p: 2, display: 'flex', alignItems: 'center' }}>
                        <TextField
                            value={editTag?.name || ''}
                            onChange={(e: any) => setEditTag({ ...editTag, name: e.target.value })}
                            size="small"
                            placeholder='name'
                        />
                        <TextField
                            value={editTag?.field_path?.split('._table_')[0] || ''}
                            onChange={(e: any) => setEditTag({ ...editTag, field_path: e.target.value })}
                            size="small"
                            placeholder='path'
                            sx={{ ml: 1 }}
                        />
                        <IconButton onClick={handleUpdateTag}>
                            <SaveIcon />
                        </IconButton>
                    </Box>
                </Popover>

                {/* Edit Tag */}
                <Popover
                    id={idDelete}
                    open={openDelete}
                    anchorEl={deleteAnchorEl}
                    onClose={handleDeleteClose}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'center',
                    }}
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'center',
                    }}
                >
                    <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <Typography>Are you sure you want to delete this addon?</Typography>
                        <Box sx={{ mt: 1, display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                            <Button variant='outlined' onClick={handleDeleteClose} color="primary" size='small'>
                                Cancel
                            </Button>
                            <Button variant='outlined' onClick={handleConfirmDelete} color="secondary" size='small'>
                                Confirm
                            </Button>
                        </Box>
                    </Box>
                </Popover>
                {/* Snackbar to show copied text */}
                <Snackbar
                    open={snackbarOpen}
                    autoHideDuration={3000}
                    onClose={() => setSnackbarOpen(false)}
                    anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                    sx={{ marginTop: 8 }}
                >
                    <Alert onClose={() => setSnackbarOpen(false)} severity="success" sx={{ width: '100%' }}>
                        Tag key copied: {copiedText}
                    </Alert>
                </Snackbar>
            </CustomTabPanel>
            <CustomTabPanel value={tabValue} index={1}>

                {/* Addon selection */}
                <FormControl fullWidth sx={{ mb: 3 }} size='small'>
                    <InputLabel>Choose Addon</InputLabel>
                    <Select
                        value={chosenAddon}
                        onChange={handleAddonSelection}
                        label="Choose Addon"
                        sx={{ maxWidth: 250 }}
                        size='small'
                    >
                        {addons?.map((addon) => (
                            <MenuItem key={addon.id} value={addon.id}>
                                {addon.name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                {isLoading ? (
                    <Skeleton variant="text" width="100%" height={40} />
                ) : (
                    chosenAddon && (
                        <ExternalKeyManager addonId={chosenAddon} />
                    )
                )}
            </CustomTabPanel>
            <CustomTabPanel value={tabValue} index={2}>
                {isLoading ? (
                    <Skeleton variant="rectangular" width="100%" height={300} />
                ) : (
                    <TemplateDataManager />
                )}
            </CustomTabPanel>
            <CustomTabPanel value={tabValue} index={3}>
                <ManageAddonsPage />
            </CustomTabPanel>
        </Box>
    );
};

export default TagManagementPage;
