"use client";
import { useState, useEffect } from 'react';
import { Button, TextField, Chip, IconButton, Popover, MenuItem, Select, InputLabel, FormControl, Paper, Box, Typography, Checkbox, ListItemText, Grid2, useTheme, Tooltip, Snackbar, Alert } from '@mui/material';
import { AddCircle, Edit, Delete } from '@mui/icons-material';
import { useSession } from 'next-auth/react';
import { useSelector } from 'react-redux';
import { getDefaultOrganization, Organization, OrganizationState } from '@/redux/slice/organizationSlice';
import { findAllAddons } from '@/app/services/addonService';
import { createTag, deleteTag, findAllTags, updateTag } from '@/app/services/tagService';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import CloseIcon from '@mui/icons-material/Close';
// import axios from 'axios';

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
    const { data: session }: any = useSession();
    const theme = useTheme();

    const openPopover = Boolean(anchorEl);
    const id = openPopover ? 'simple-popover' : undefined;

    const openDelete = Boolean(deleteAnchorEl);
    const idDelete = openDelete ? 'delete-popover' : undefined;

    useEffect(() => {
        // Fetch the available addons from the API
        const fetchAddons = async () => {
            try {
                const res = await findAllAddons(currentOrg?.id, session?.user?.token);
                if (res.status == 200) {
                    setAddons((prev) => res.data);
                    try {
                        const response = await findAllTags(res.data?.filter((a: any) => selectedAddons.includes(a.name)), session?.user?.token);
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
            }
        }
        if (session?.user?.token) fetchAddons();
        return () => {
            setAddons([]);
            setTags([]);
        }
    }, [currentOrg?.id]);

    const handleAddonChange = async (event: any) => {
        setSelectedAddons(event.target.value);
        console.log(event.target.value)
        try {
            const response = await findAllTags(event.target.value, session?.user?.token);
            if (response.status == 200) {
                setTags(response.data);
            }
        } catch (error) {
            console.error("Error fetching tags:", error);
        }
    };

    const handleTagKeyChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setTagKey(event.target.value);
    };

    const handleTagNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setTagName(event.target.value);
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
            const response = await createTag(newTag, session?.user?.token);
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
            const response = await deleteTag(tagId, session?.user?.token);
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
                const response = await updateTag(editTag, session?.user?.token);
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
    const handleCopyTag = (tagKey: string) => {
        // console.log(tag)
        navigator.clipboard.writeText(`{{${tagKey}}}`).then(() => {
            setCopiedText(`{{${tagKey}}}`);
            setSnackbarOpen(true); // Show snackbar when copied
            setTimeout(() => setSnackbarOpen(false), 3000); // Hide snackbar after 3 seconds
        }).catch(err => {
            console.error('Failed to copy: ', err);
        });
    };


    return (
        <Box className="container mx-auto p-4">
            {/* Addon Picker */}
            <Box mb={3} mt={4}>
                <FormControl fullWidth>
                    <InputLabel>Addons</InputLabel>
                    <Select
                        multiple
                        value={selectedAddons}
                        onChange={handleAddonChange}
                        label="Addons"
                        required
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
                <FormControl fullWidth>
                    <InputLabel>Type</InputLabel>
                    <Select
                        value={selectedType}
                        onChange={(event) => {
                            setSelectedType(event.target.value);
                        }}
                        required
                        label="Type"
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
            />

            {/* Save Button */}
            <Button variant="contained" color="primary" onClick={handleSaveTag}>
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
                        <Button onClick={handleDeleteClose} color="primary">
                            Cancel
                        </Button>
                        <Button onClick={handleConfirmDelete} color="secondary">
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
        </Box>
    );
};

export default TagManagementPage;
