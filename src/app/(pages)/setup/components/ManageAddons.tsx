import React, { useState, useEffect, useCallback } from 'react';
import {
    Box,
    Typography,
    Button,
    TextField,
    IconButton,
    Tooltip,
    CircularProgress,
    Skeleton,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Snackbar,
    Alert,
    Grid2,
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { createAddon, deleteAddon, findAllAddons, updateAddon } from '@/app/services/addonService';
import { useSession } from 'next-auth/react';
import { useSelector } from 'react-redux';
import { getDefaultOrganization, Organization, OrganizationState } from '@/redux/slice/organizationSlice';
// import CustomTabPanel from './CustomTabPanel'; // Assume this is a reusable tab panel component

const ManageAddonsPage: React.FC = () => {
    const [addons, setAddons] = useState<any[]>([]);
    const [newAddon, setNewAddon] = useState<{ id: any, name: string }>({ id: null, name: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [errors, setErrors] = useState<{ addonName?: string }>({});
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [addonToDelete, setAddonToDelete] = useState<any | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { data: session }: any = useSession();
    const currentOrg: Organization | any = useSelector((state: { organization: OrganizationState }) =>
        getDefaultOrganization(state.organization)
    );

    const fetchAddons = useCallback(async () => {
        setLoading(true);
        try {
            // Replace with your API call
            const response = await findAllAddons(currentOrg.id, session?.user?.token);
            if (response.status == 200) {
                setAddons(() => response.data)
            }
        } catch (fetchError) {
            console.error(fetchError);
            setError('Error fetching addons.');
        } finally {
            setLoading(false);
        }
    }, [currentOrg?.id]);

    useEffect(() => {
        if (currentOrg?.id)
            fetchAddons();
    }, [fetchAddons, currentOrg?.id]);

    const handleCreateAddon = async () => {
        if (!newAddon.name) {
            setErrors({ addonName: 'Addon name is required.' });
            return;
        }
        if (!newAddon.name.match(/^[A-Z_]+$/)) {
            setErrors({ addonName: 'Addon name must be in capital letters and underscores only' });
            return;
        }
        setIsSubmitting(true);
        try {
            if (newAddon.id) {
                const res = await updateAddon(newAddon, session?.user?.token);
                if (res.status == 200) {
                    setAddons((prev) => prev.map((addon) => (addon.id === newAddon.id ? { ...addon, name: newAddon.name } : addon)));
                    setSuccessMessage('Addon updated successfully.');
                }
            } else {
                const res = await createAddon(newAddon.name, currentOrg?.id || 0, session?.user?.token);
                // console.log(res.data)
                if (res.status == 200 || res.status == 201) {
                    setAddons((prev) => [...prev, { id: newAddon.id, name: newAddon.name, organization_id: currentOrg.id }]);
                    setSuccessMessage('Addon created successfully.');
                }
            }

            // fetchAddons();
            setNewAddon({ id: null, name: '' });
        } catch (createError) {
            console.error(createError)
            setError('Error creating addon.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteAddon = async () => {
        if (!addonToDelete) return;

        setIsSubmitting(true);
        try {
            // Replace with your API call
            const res = await deleteAddon(addonToDelete.id, session?.user?.token);
            if (res.status == 204) {
                setAddons(addons.filter((addon) => addon.id !== addonToDelete.id));
            }
            setSuccessMessage('Addon deleted successfully.');
            // fetchAddons();
            setIsDeleteDialogOpen(false);
        } catch (deleteError) {
            setError('Error deleting addon.');
            console.log(deleteError);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleEditAddon = async (addon: any) => {
        setNewAddon(addon);
        setErrors({ addonName: undefined });
        setSuccessMessage(null);
    };

    return (
        <Grid2 container>
            <Typography variant="h5" gutterBottom>
                Manage Addons
            </Typography>

            {/* Addon Form */}
            <Grid2 size={{ xs: 12 }} sx={{ marginBottom: 3 }}>
                <TextField
                    margin="dense"
                    label="Addon Name"
                    fullWidth
                    value={newAddon.name}
                    onChange={(e) => {
                        const value = e.target.value.toUpperCase().replace(/[^A-Z_]/g, '_');
                        setNewAddon((prev) => { return { ...prev, name: value } });
                        setErrors({ addonName: undefined });
                        setSuccessMessage(null);
                    }}
                    error={!!errors.addonName}
                    helperText={errors.addonName}
                />
                <Button
                    variant="outlined"
                    onClick={handleCreateAddon}
                    disabled={isSubmitting}
                    startIcon={isSubmitting && <CircularProgress size={20} />}
                    sx={{ marginTop: 2, float: 'right' }}
                    size='small'
                >
                    {isSubmitting ? 'Creating...' : newAddon.id ? 'Update' : 'Create Addon'}
                </Button>
            </Grid2>

            {/* Error Message */}
            {/* {error && <Alert severity="error" sx={{ marginBottom: 2 }}>{error}</Alert>} */}

            {/* Success Message */}
            {/* {successMessage && <Alert severity="success" sx={{ marginBottom: 2 }}>{successMessage}</Alert>} */}

            {/* Addon Table */}
            {/* <CustomTabPanel value="1" index={3}> */}
            <Grid2 size={{ xs: 12 }} sx={{ marginBottom: 3 }}>
                {loading ? (
                    <Skeleton variant="rectangular" width="100%" height={300} />
                ) : addons.length === 0 ? (
                    <Typography>No addons available.</Typography>
                ) : (
                    addons?.map((addon) => (
                        <Box
                            key={addon.id}
                            sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                padding: 1,
                                borderBottom: '1px solid #ccc',
                            }}
                        >
                            <Typography>{addon.name}</Typography>
                            <Box>
                                <Tooltip title="Edit">
                                    <IconButton onClick={() => handleEditAddon(addon)} size='small'>
                                        <EditIcon />
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title="Delete">
                                    <IconButton
                                        onClick={() => {
                                            setAddonToDelete(addon);
                                            setIsDeleteDialogOpen(true);
                                        }}
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                </Tooltip>
                            </Box>
                        </Box>
                    ))
                )}
            </Grid2>
            {/* </CustomTabPanel> */}

            {/* Delete Confirmation Dialog */}
            <Dialog open={isDeleteDialogOpen} onClose={() => setIsDeleteDialogOpen(false)}>
                <DialogTitle>Delete Addon</DialogTitle>
                <DialogContent>
                    <Typography>Are you sure you want to delete this addon?</Typography>
                </DialogContent>
                <DialogActions>
                    <Button variant='outlined' onClick={() => setIsDeleteDialogOpen(false)} disabled={isSubmitting} size='small'>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleDeleteAddon}
                        color="error"
                        variant='outlined'
                        disabled={isSubmitting}
                        startIcon={isSubmitting && <CircularProgress size={20} />}
                        size='small'
                    >
                        {isSubmitting ? 'Deleting...' : 'Delete'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Snackbar */}
            <Snackbar
                open={!!successMessage || !!error}
                autoHideDuration={3000}
                onClose={() => {
                    setError(null);
                    setSuccessMessage(null);
                }}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                sx={{ marginTop: 8 }}
            >
                {(successMessage || error) ? <Alert
                    onClose={() => {
                        setError(null);
                        setSuccessMessage(null);
                    }}
                    severity={successMessage ? 'success' : 'error'}
                >
                    {successMessage || error}
                </Alert> : <Box />}
            </Snackbar>
        </Grid2>
    );
};

export default ManageAddonsPage;
