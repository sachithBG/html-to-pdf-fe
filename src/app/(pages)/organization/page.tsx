'use client';
import React, { useState, useEffect } from 'react';
import {
    Container,
    Typography,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    IconButton,
    Switch,
    Divider,
    FormGroup,
    Box,
    Chip,
    Grid2,
    Avatar,
    Popover,
    Paper
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import CloseIcon from '@mui/icons-material/Close';
import { LoadingButton } from '@mui/lab';
import { createOrganization, findOrganizationsByUserId, setDefaultOrganization, updateOrg } from '@/app/services/organizationService';
import { RootState } from '@/redux/store';
import { addOrganization, addOrganizationAll, clearOrganizationState, Organization, updateOrganization } from '@/redux/slice/organizationSlice';
import { useDispatch, useSelector } from 'react-redux';
import { createAddon, deleteAddon, findAllAddons, updateAddon } from '@/app/services/addonService';
import { uploadOrgLogo } from '@/app/services/mediaService';
import { isValidS3Url } from '@/app/utils/constant';

export default function OrganizationPage() {
    const [organizations, setOrganizations] = useState<Organization[]>([]);
    const [open, setOpen] = useState(false);
    const [currentOrg, setCurrentOrg] = useState<Partial<Organization> | Organization | any>({});
    const [errors, setErrors] = useState<{ name?: string, addonName?: string }>({});
    const [addons, setAddons] = useState<any[]>([]);
    const [newAddon, setNewAddon] = useState<string>('');
    const [loadingSave, setLoadingSave] = useState(false);
    const [loadingAddons, setLoadingAddons] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState<boolean | null>(null);
    const [addonsSuccess, setAddonsSuccess] = useState<boolean | null>(null);

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [editAddon, setEditAddon] = useState<{ id: number; name: string } | null | any>(null);
    const [deleteAnchorEl, setDeleteAnchorEl] = useState<null | HTMLElement>(null);
    const [addonToDelete, setAddonToDelete] = useState<number | null>(null);

    const { token, user } = useSelector((state: RootState) => state.session);
    const dispatch = useDispatch();

    const avatarUrl =
        typeof currentOrg?.logo === 'string' && isValidS3Url(currentOrg?.logo)
            ? currentOrg?.logo // Use the validated URL
            : currentOrg?.logo instanceof File
                ? URL.createObjectURL(currentOrg?.logo) // Use a blob URL for a File object
                : undefined;

    useEffect(() => {
        // Fetch organizations from API
        console.log(user, 'Session');
        // alert(user.id)
        if (user?.id) {
            // API call to get organizations
            findOrganizationsByUserId(user?.id, token)
                .then((res: any) => {
                    // console.log(res.data, 'Organizations fetched2');
                    if (res.data) {
                        dispatch(clearOrganizationState());
                        dispatch(addOrganizationAll(res.data));
                        setOrganizations(res.data);
                    }
                }).catch((err: any) => {
                    console.error(err);
                });
        }
    }, [user?.id]);

    const handleOpen = (org?: Organization) => {
        setCurrentOrg(org || {});
        setErrors({});
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setCurrentOrg({});
        setErrors({});
        setSaveSuccess(null);
    };

    const validate = () => {
        const tempErrors: { name?: string } = {};
        if (!currentOrg.name) tempErrors.name = "Name is required";
        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };

    const handleSave = () => {
        if (!validate()) return;

        const uploadImage = async (file: any) => {
            // Implement the image upload logic here
            // This function should return a promise that resolves with the uploaded image URL
            if (file) console.log('file exsit');
            return await uploadOrgLogo(currentOrg?.id, file!, token);
        };
        

        const saveOrganization = (org: Organization | any) => {
            if (org.id) {
                // Update organization API call
                // org = { ...org, userId: session?.user?.id };
                updateOrg(org, token)
                    .then((res: any) => {
                        console.log(res);
                        if (res.status == 200) {
                            dispatch(updateOrganization(org));
                            setOrganizations(organizations.map((o) => (o.id === org.id ? org : o)));
                        }
                    }).catch((err: any) => {
                        console.error(err);
                    });
            } else {
                // Create organization API call
                org = { ...org, user_id: user?.id };
                createOrganization(org, token)
                    .then((res: any) => {
                        if (res.data) {
                            dispatch(addOrganization(res.data));
                            setOrganizations([...organizations, res.data]);
                        }
                    }).catch((err: any) => {
                        console.error(err);
                    });
            }
            // handleClose();
        };

        if (typeof currentOrg?.logo === 'string' && !isValidS3Url(currentOrg.logo)) {// && currentOrg.logo.startsWith('blob:')
            // If the logo is a blob URL, upload the image first
            setLoadingSave(true);
            uploadImage(currentOrg.logo).then((uploadedImageUrl) => {
                // console.log(uploadedImageUrl)
                const updatedOrg: any = { ...currentOrg, logo: uploadedImageUrl?.url || currentOrg.logo };
                saveOrganization(updatedOrg);
                setLoadingSave(false);
                setSaveSuccess(true);
            }).catch((err: any) => {
                console.error('Image upload failed', err);
                setLoadingSave(false);
                setSaveSuccess(false);
            });
        } else {
            // If the logo is already a URL, proceed with saving the organization
            saveOrganization(currentOrg);
        }
    };

    const setDefault = (orgId: number) => {
        // Implement the setDefault API call here
        // This function should update the default organization
        setDefaultOrganization(orgId, token).then((res: any) => {
            if (res?.status == 200) {
                const updatedOrgs = organizations.map((org) => ({ ...org, is_default: org.id === orgId }));
                setOrganizations(() => updatedOrgs);
                dispatch(clearOrganizationState());
                dispatch(addOrganizationAll(updatedOrgs));
            }
        }).catch((err: any) => {
            console.error(err);
        });
    };

    const handleSaveAddons = () => {
        setLoadingAddons(true);
        handleAddAddon();
        // Implement the save addons logic here
        // This function should update the addons for the organization
        setTimeout(() => {
            setAddonsSuccess(true);
            setLoadingAddons(false);
        }, 1000);
    };

    const handleAddAddon = async () => {
        if (!newAddon.match(/^[A-Z_]+$/)) {
            setErrors({ addonName: 'Addon name must be in capital letters and underscores only' });
            return;
        }
        const res = await createAddon(newAddon, currentOrg?.id || 0, token);
        console.log(res.data)
        setAddons([...addons, { id: res.data.id, name: newAddon, organization_id: currentOrg.id }]);
        setNewAddon('');
    };

    const handleDeleteAddon = async (addonId: number) => {
        const res = await deleteAddon(addonId, token);
        if (res.status == 204) {
            setAddons(addons.filter((addon) => addon.id !== addonId));
        }
    };

    const handleEditClick = (event: React.MouseEvent<HTMLElement>, addon: { id: number; name: string }) => {
        setAnchorEl(event.currentTarget);
        setEditAddon(addon);
    };

    const handleEditClose = () => {
        setAnchorEl(null);
        setEditAddon(null);
    };

    const handleEditSave = async () => {
        if (editAddon) {
            const res = await updateAddon(editAddon, token);
            if (res.status == 200) {
                setAddons(addons.map((addon) => (addon.id === editAddon.id ? { ...addon, name: editAddon.name } : addon)));
                handleEditClose();
            }
        }
    };

    const handleDeleteClick = (event: React.MouseEvent<HTMLElement>, addonId: number) => {
        setDeleteAnchorEl(event.currentTarget);
        setAddonToDelete(addonId);
    };

    const handleDeleteClose = () => {
        setDeleteAnchorEl(null);
        setAddonToDelete(null);
    };

    const handleConfirmDelete = () => {
        if (addonToDelete !== null) {
            handleDeleteAddon(addonToDelete);
            handleDeleteClose();
        }
    };

    const openPopover = Boolean(anchorEl);
    const id = openPopover ? 'simple-popover' : undefined;

    const openDelete = Boolean(deleteAnchorEl);
    const idDelete = openDelete ? 'delete-popover' : undefined;

    useEffect(() => {
        const fetchAddons = async () => {
            const res = await findAllAddons(currentOrg.id, token);
            if (res.status == 200) {
                setAddons(() => res.data)
            }
        }
        if (currentOrg.id && token) fetchAddons();
    }, [currentOrg.id])

    return (
        <Container>
            {/* <Typography variant="h4" gutterBottom>
                Manage Organizations
            </Typography> */}
            <Button variant="outlined" size='small' color="primary" sx={{ float: 'right' }} startIcon={<AddIcon />} onClick={() => handleOpen()}>
                New
            </Button>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell>Default</TableCell>
                        <TableCell>Created At</TableCell>
                        <TableCell>Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {organizations.map((org) => (
                        <TableRow key={org.id}>
                            <TableCell>{org.name}</TableCell>
                            <TableCell><Switch
                                checked={org.is_default}
                                onChange={() => setDefault(org.id)}
                                color="primary"
                            /></TableCell>
                            <TableCell>{new Date(org.created_at).toLocaleDateString()}</TableCell>
                            <TableCell>
                                <IconButton onClick={() => handleOpen(org)}>
                                    <EditIcon />
                                </IconButton>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <Dialog  open={open} onClose={(event, reason) => {
                if (reason !== 'backdropClick') {
                    handleClose();
                }
            }} hideBackdrop={false} maxWidth='md' fullWidth>
                <IconButton
                    aria-label="close"
                    onClick={() => handleClose()}
                    sx={(theme) => ({
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: theme.palette.grey[500],
                    })}
                >
                    <CloseIcon />
                </IconButton>

                <DialogTitle>{currentOrg.id ? 'Edit Organization' : 'Add Organization'}</DialogTitle>
                <DialogContent>
                    <TextField
                        margin="dense"
                        label="Name"
                        fullWidth
                        value={currentOrg.name || ''}
                        onChange={(e) => setCurrentOrg({ ...currentOrg, name: e.target.value })}
                        error={!!errors.name}
                        helperText={errors.name}
                    />
                </DialogContent>
                <DialogContent sx={{ justifyItems: 'center' }}>
                    <input
                        accept="image/*"
                        type="file"
                        onChange={(e: any) => {
                            const file = e.target?.files[0];
                            setCurrentOrg({ ...currentOrg, logo: file });
                            // if (file && false) {
                            //     const reader = new FileReader();
                            //     reader.onloadend = () => {
                            //         const logoUrl = URL.createObjectURL(file);
                            //         setCurrentOrg({ ...currentOrg, logo: logoUrl });
                            //     };
                            //     reader.readAsDataURL(file);
                            // }
                        }}
                        // style={{ display: 'none' }}
                        id="logo-upload"
                    />

                    <label htmlFor="logo-upload" style={{ alignItems: 'center', justifyContent: 'center' }}>
                        <IconButton component="span">
                            <Avatar
                                src={avatarUrl}
                                alt="logo"
                                sx={{ width: 100, height: 100 }}
                            >
                                {!currentOrg.logo && currentOrg.name?.charAt(0)}
                            </Avatar>
                        </IconButton>
                    </label>
                </DialogContent>
                <DialogContent>
                    <LoadingButton
                        onClick={handleSave}
                        color="primary"
                        loading={loadingSave}
                        startIcon={saveSuccess === true ? <CheckCircleIcon color="success" /> : saveSuccess === false ? <ErrorIcon color="error" /> : null}
                        sx={{ float: 'right' }}
                        variant='outlined'
                        size='small'
                    >
                        Save
                    </LoadingButton>
                    <Divider sx={{ margin: '16px 0', mt: 5 }} />
                    {currentOrg.id && <Box>
                        <Typography variant="h6" gutterBottom>
                            Manage Addons
                        </Typography>

                        <TextField
                            margin="dense"
                            label="Addon Name"
                            fullWidth
                            value={newAddon}
                            onChange={(e) => {
                                const value = e.target.value.toUpperCase().replace(/[^A-Z_]/g, '_');
                                setNewAddon(value);
                                setErrors({ addonName: undefined });
                                setAddonsSuccess(null);
                            }}
                            error={!!errors.addonName}
                            helperText={errors.addonName}
                        />
                        {/* <LoadingButton
                            onClick={handleAddAddon}
                            color="primary"
                            loading={loadingAddons}
                            startIcon={addonsSuccess === true ? <CheckCircleIcon color="success" /> : addonsSuccess === false ? <ErrorIcon color="error" /> : null}
                            sx={{ mr: 1 }}
                        >
                            Add Addon
                        </LoadingButton>| */}
                        <Grid2 sx={{ width: '100%' }}>
                            <LoadingButton
                                onClick={handleSaveAddons}
                                color="primary"
                                loading={loadingAddons}
                                startIcon={addonsSuccess === true ? <CheckCircleIcon color="success" /> : addonsSuccess === false ? <ErrorIcon color="error" /> : null}
                                sx={{ m: 1, float: 'right' }}
                                size='small'
                                variant='outlined'
                            >
                                Save
                            </LoadingButton>
                        </Grid2>
                        <FormGroup sx={{ width: '100%' }}>
                            <Grid2 container direction="row" spacing={1} mt={1} sx={{ maxHeight: 200, overflow: 'auto' }}>
                                {addons.map((addon) => (
                                    <Paper elevation={3} key={addon.id} sx={{
                                        display: 'flex', alignItems: 'center', mb: 1, p: 0,
                                        pl: .5, width: 'min-content',
                                        // borderRadius: '100px 0 0 100px',
                                    }} >
                                        <Chip
                                            key={addon.id}
                                            label={addon.name}
                                            onDelete={(event) => handleEditClick(event, addon)}
                                            deleteIcon={<EditIcon sx={(theme) => ({
                                                color: theme.palette.mode === 'light' ? theme.palette.success.dark : theme.palette.secondary.light,
                                            })} />}
                                            sx={{ ml: -.5, border: 'none' }}
                                            variant="outlined"
                                        />|
                                        <IconButton onClick={(event) => handleDeleteClick(event, addon.id)} size='small'>
                                            <DeleteIcon sx={{ fontSize: 16 }} />
                                        </IconButton>
                                    </Paper>
                                ))}
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
                                            value={editAddon?.name || ''}
                                            onChange={(e) => setEditAddon({ ...editAddon, name: e.target.value })}
                                            size="small"
                                        />
                                        <IconButton onClick={handleEditSave}>
                                            <SaveIcon />
                                        </IconButton>
                                    </Box>
                                </Popover>
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
                                            <Button variant='outlined' size='small' onClick={handleDeleteClose} color="primary">
                                                Cancel
                                            </Button>
                                            <Button variant='outlined' size='small' onClick={handleConfirmDelete} color="secondary">
                                                Confirm
                                            </Button>
                                        </Box>
                                    </Box>
                                </Popover>
                            </Grid2>
                        </FormGroup>
                    </Box>}
                </DialogContent>
                <DialogActions>
                    <Button variant='outlined' size='small' onClick={handleClose} color="primary">
                        Cancel
                    </Button>

                </DialogActions>
            </Dialog>
        </Container>
    );
};
