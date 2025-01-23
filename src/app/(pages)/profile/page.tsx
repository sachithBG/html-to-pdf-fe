'use client';
import React, { useEffect, useState } from 'react';
import { Button, TextField, Avatar, Switch, FormControlLabel, FormGroup, Paper, Typography, Box, Container, Divider, IconButton, Grid2, useColorScheme } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import { updateNameByUserId, updateThemeByUserId } from '@/app/services/profileService';
import { uploadAvator } from '@/app/services/mediaService';
import { useDispatch, useSelector } from 'react-redux';
import { toggleTheme } from '@/redux/slice/ToggleTheme';
import { isValidS3Url } from '@/app/utils/constant';
import { RootState } from '@/redux/store';
import { authEvents } from '@/app/utils/authEvents';
import { getDefaultOrganization, Organization, OrganizationState } from '@/redux/slice/organizationSlice';
import { setSession } from '@/redux/slice/sessionSlice';


const ProfilePage: React.FC = () => {
    const [theme, setTheme] = useState<'dark' | 'light'>('light');
    const [avatar, setAvatar] = useState<File | null>(null);
    const [name, setName] = useState<string>('');
    const [errors, setErrors] = useState<{ name?: string; avatar?: string }>({});
    const [loadingName, setLoadingName] = useState(false);
    const [loadingTheme, setLoadingTheme] = useState(false);
    const [loadingAvatar, setLoadingAvatar] = useState(false);
    const [success, setSuccess] = useState<{ name?: boolean; avatar?: boolean; theme?: boolean }>({});
    const { token, user, status } = useSelector((state: RootState) => state.session);
    const dispatch = useDispatch();
    const { setMode } = useColorScheme();
    const currentOrg: Organization | any = useSelector((state: { organization: OrganizationState }) =>
            getDefaultOrganization(state.organization)
        );
    
    const avatarUrl =
        typeof avatar === 'string' && isValidS3Url(avatar)
            ? avatar // Use the validated URL
            : avatar instanceof File
                ? URL.createObjectURL(avatar) // Use a blob URL for a File object
                : undefined;

    const handleThemeToggle = async (t: 'dark' | 'light') => {
        setTheme(t);
        setLoadingTheme(true);
        dispatch(toggleTheme(t));
        setMode(t);
        try {
            await updateThemeByUserId(user?.id, t, token);
            setSuccess((prev) => ({ ...prev, theme: true }));
        } catch (error) {
            setSuccess((prev) => ({ ...prev, theme: false }));
            console.error(error);
        } finally {
            setLoadingTheme(false);
        }
    };

    const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            setAvatar(event.target.files[0]);
            setErrors((prev) => ({ ...prev, avatar: undefined }));
            setSuccess((prev) => ({ ...prev, theme: undefined }));
        }
    };

    const handleUserNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setName(event.target.value);
        setErrors((prev) => ({ ...prev, name: undefined }));
        setSuccess((prev) => ({ ...prev, name: undefined }));
    };

    const handleChangeName = async () => {
        try {
            if (!name) {
                setErrors((prev) => ({ ...prev, name: 'Name is required' }));
                return;
            }
            setLoadingName(true);
            const res = await updateNameByUserId(user?.id, name, token);
            if (res?.status === 200) {
                setSuccess((prev) => ({ ...prev, name: true }));
            }
        } catch (error) {
            setSuccess((prev) => ({ ...prev, name: false }));
            setErrors((prev) => ({ ...prev, name: 'Error updating name' }));
            console.error(error);
        } finally {
            setLoadingName(false);
        }
    };

    const validate = () => {
        const newErrors: { name?: string; avatar?: string } = {};
        if (!name) newErrors.name = 'User name is required';
        if (!avatar) newErrors.avatar = 'Avatar is required';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validate()) return;
        setLoadingAvatar(true);
        try {
            const avatarUrl = await uploadAvator(user?.id, currentOrg?.id,avatar!, token);
            if (!avatarUrl?.file) {
                setErrors((prev) => ({ ...prev, avatar: 'Error uploading avatar' }));
                setSuccess((prev) => ({ ...prev, avatar: false }));
                setAvatar(avatarUrl.file);
                const prf: any = user?.profile ? user.profile : {};
                const usr: any = user ? user : {};
                dispatch(setSession({ token, user: { ...usr, profile: { ...prf, avatar: avatarUrl?.file }}, status: 'authenticated' }));
                return;
            }
            // await updateImageByUserId(session?.user?.id, avatarUrl.url, token);
            setSuccess((prev) => ({ ...prev, avatar: true }));
            const t = setTimeout(() => {
                setSuccess((prev) => ({ ...prev, avatar: false }));
                clearTimeout(t);
            }, 2000);
        } catch (error) {
            setSuccess((prev) => ({ ...prev, avatar: false }));
            setErrors((prev) => ({ ...prev, avatar: 'Error updating avatar' }));
            console.error(error);
        } finally {
            setLoadingAvatar(false);
        }
    };

    useEffect(() => {
        if (user?.name) {
            setName(user?.name);
        }
        if (user?.profile?.theme) {
            setTheme(user?.profile?.theme);
        }
        if (user?.profile?.avatar) {
            setAvatar(user?.profile?.avatar);
        }
    }, [user?.name, user?.profile?.theme]);

    if (status === 'loading') {
        return <Typography>Loading...</Typography>;
    }

    if (status === 'unauthenticated') {
        return (
            <Container>
                <Typography>Please sign in to view your profile.</Typography>
                <Button variant='outlined' size='small' onClick={() => authEvents.emit('triggerSignIn')}>Sign In</Button>
            </Container>
        );
    }

    return (
        <Container maxWidth="xl">
            <Paper elevation={3} sx={{ padding: 3, marginTop: 5 }}>
                <Typography variant="h4" gutterBottom>
                    Profile Management
                </Typography>
                <FormGroup>
                    <Grid2 container spacing={2}>
                        <Grid2 size={8}>
                            <TextField
                                label="Name"
                                value={name}
                                onChange={handleUserNameChange}
                                error={!!errors.name}
                                helperText={errors.name}
                                required
                                fullWidth
                                margin="normal"
                                size='small'
                            />
                        </Grid2>
                        <Grid2 size={4} sx={{ display: 'flex', alignItems: 'center' }}>
                            <LoadingButton
                                variant="outlined"
                                color="inherit"
                                size='small'
                                onClick={handleChangeName}
                                loading={loadingName}
                                startIcon={success.name === true ? <CheckCircleIcon color="success" /> : success.name === false ? <ErrorIcon color="error" /> : null}
                            >
                                Update
                            </LoadingButton>
                        </Grid2>
                    </Grid2>
                    <Divider sx={{ margin: '16px 0' }} />
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={theme === 'dark'}
                                    onChange={() => handleThemeToggle(theme === 'dark' ? 'light' : 'dark')}
                                />
                            }
                            label={`Theme: ${theme}`}
                        />
                        {success.theme === true && <CheckCircleIcon color="success" sx={{ ml: 1 }} />}
                        {success.theme === false && <ErrorIcon color="error" sx={{ ml: 1 }} />}
                        {loadingTheme && <Typography sx={{ ml: 1 }}>Loading...</Typography>}
                    </Box>
                    <Divider sx={{ margin: '16px 0' }} />
                    <Grid2 container justifyContent={'center'}>
                            <input
                                width={20}
                            accept="image/*"
                            type="file"
                            onChange={handleAvatarChange}
                            style={{ display: 'none' }}
                            id="avatar-upload"
                            />
                        <label htmlFor="avatar-upload">
                            <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 2 }}>
                                <IconButton component="span">
                                    <Avatar
                                        src={avatarUrl}
                                        alt="Profile Avatar"
                                        sx={{ width: 100, height: 100 }}
                                    >
                                        {!avatar && name.charAt(0)}
                                    </Avatar>
                                </IconButton>
                            </Box>
                        </label>
                    </Grid2>
                    
                    {errors.avatar && <Typography color="error" sx={{ marginTop: 1, textAlign: 'center' }}>{errors.avatar}</Typography>}
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 2 }}>
                        <Typography variant="caption" color="textSecondary">
                            Click on the avatar to upload a new one
                        </Typography>
                        {success.avatar === true && <CheckCircleIcon color="success" sx={{ ml: 1 }} />}
                        <LoadingButton
                            variant="outlined"
                            size='small'
                            color="primary"
                            onClick={handleSubmit}
                            loading={loadingAvatar}
                            sx={{ marginTop: 3 }}
                            disabled={typeof avatar === 'string' && isValidS3Url(avatar)}
                            endIcon={success.avatar === true ? <CheckCircleIcon color="success" /> : errors.avatar ? <ErrorIcon color="error" /> : null}
                        >
                            Update Profile Image
                        </LoadingButton>
                    </Box>

                </FormGroup>
            </Paper>
        </Container>
    );
};

export default ProfilePage;