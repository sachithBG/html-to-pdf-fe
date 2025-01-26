import React, { useEffect, useState } from 'react';
import { Button, TextField, Typography, Box, CircularProgress, Dialog, IconButton, InputAdornment } from '@mui/material';
import { useSnackbar } from 'notistack';
import CloseIcon from '@mui/icons-material/Close'
import { resetPassword, sendOtp, verifyOtp } from '@/app/services/resetPasswordService';
import { Visibility, VisibilityOff } from '@mui/icons-material';

interface ResetPasswordProps {
    setRestPwdOpen: (open: boolean) => void; // Function to control modal visibility
    openResetPwd: boolean; // State to track modal visibility
    setSignInModalOpen: (open: boolean) => void; // Function to control sign-in modal visibility
}

const ResetPassword: React.FC<ResetPasswordProps> = ({
    setRestPwdOpen,
    openResetPwd,
    setSignInModalOpen,
}) => {
    const { enqueueSnackbar } = useSnackbar();
    const [step, setStep] = useState<'email' | 'otp' | 'newPassword'>('email');
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showPassword2, setShowPassword2] = useState(false);

    const handleClose = () => {
        setRestPwdOpen(false);
        setEmail('');
        setStep('email');
        setNewPassword('');
        setConfirmPassword('');
    }
    const handleSendOtp = async () => {
        if (!email) {
            enqueueSnackbar('Email is required.', { variant: 'error' });
            return;
        }
        setLoading(true);
        try {
            const response = await sendOtp(email);
            const data = await response.data;
            if (response.status === 200) {
                enqueueSnackbar('OTP sent to your email.', { variant: 'success' });
                setStep('otp');
            } else {
                enqueueSnackbar(data.message || 'Failed to send OTP.', { variant: 'error' });
            }
            // eslint-disable-next-line
        } catch (error) {
            enqueueSnackbar('An error occurred. Please try again.', { variant: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async () => {
        if (!otp) {
            enqueueSnackbar('OTP is required.', { variant: 'error' });
            return;
        }
        setLoading(true);
        try {
            const response = await verifyOtp(email, otp);
            const data = await response.data;
            if (response.status === 200) {
                enqueueSnackbar('OTP verified.', { variant: 'success' });
                setStep('newPassword');
            } else {
                enqueueSnackbar(data.message || 'Invalid OTP.', { variant: 'error' });
            }
            // eslint-disable-next-line
        } catch (error) {
            enqueueSnackbar('An error occurred. Please try again.', { variant: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const handleSetNewPassword = async () => {
        if (!newPassword || !confirmPassword) {
            enqueueSnackbar('All fields are required.', { variant: 'error' });
            return;
        }
        if (newPassword !== confirmPassword) {
            enqueueSnackbar('Passwords do not match.', { variant: 'error' });
            return;
        }
        setLoading(true);
        try {
            const response = await resetPassword(email, newPassword);
            const data = await response.data;
            if (response.status === 200) {
                enqueueSnackbar('Password reset successfully.', { variant: 'success' });
                handleClose();
            } else {
                enqueueSnackbar(data.message || 'Failed to reset password.', { variant: 'error' });
            }
            // eslint-disable-next-line
        } catch (error) {
            enqueueSnackbar('An error occurred. Please try again.', { variant: 'error' });
        } finally {
            setLoading(false);
        }
    };

    // eslint-disable-next-line
    const handleSignIn = () => {
        setSignInModalOpen(true);
        handleClose();
    };

    useEffect(() => {
        if (openResetPwd) {
            setEmail('');
            setStep('email');
            setNewPassword('');
            setOtp('');
            setConfirmPassword('');
        }
    }, [openResetPwd]);

    const togglePasswordVisibility = () => {
        setShowPassword((prev) => !prev);
    };

    const togglePasswordVisibility2 = () => {
        setShowPassword2((prev) => !prev);
    };

    return (
        <Dialog open={openResetPwd} onClose={handleClose}>
            <IconButton
                aria-label="close"
                onClick={() => setRestPwdOpen(false)}
                sx={(theme) => ({
                    position: 'absolute',
                    right: 8,
                    top: 8,
                    color: theme.palette.grey[500],
                })}
            >
                <CloseIcon />
            </IconButton>
            <Box sx={{ maxWidth: 400, mx: 'auto', mt: 4, px: 5, pb: 5 }}>
                {step === 'email' && (
                    <Box>
                        <Typography variant="h6">Reset Password</Typography>
                        <TextField
                            fullWidth
                            label="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            sx={{ my: 2 }}
                        />
                        <Button
                            variant="outlined"
                            color="info"
                            onClick={handleSendOtp}
                            disabled={loading}
                            fullWidth
                        >
                            {loading ? <CircularProgress size={20} /> : 'Send OTP'}
                        </Button>
                    </Box>
                )}

                {step === 'otp' && (
                    <Box>
                        <Typography variant="h6">Enter OTP</Typography>
                        <TextField
                            fullWidth
                            label="OTP"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            sx={{ my: 2 }}
                        />
                        <Button
                            variant="outlined"
                            color="info"
                            onClick={handleVerifyOtp}
                            disabled={loading}
                            fullWidth
                        >
                            {loading ? <CircularProgress size={20} /> : 'Verify OTP'}
                        </Button>
                    </Box>
                )}

                {step === 'newPassword' && (
                    <Box>
                        <Typography variant="h6">Set New Password</Typography>
                        <TextField
                            fullWidth
                            label="New Password"
                            type={showPassword ? "text" : "password"}
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            sx={{ my: 2 }}
                            slotProps={{
                                input: {
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                onClick={togglePasswordVisibility}
                                                onMouseDown={(event) => event.preventDefault()} // Prevent focus loss
                                                edge="end"
                                            >
                                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                },
                                // eslint-disable-next-line
                                htmlInput(ownerState) {
                                    // console.log(ownerState);
                                    return { maxLength: 8, minLength: 3 };
                                },
                            }}
                        />
                        <TextField
                            fullWidth
                            label="Confirm Password"
                            type={showPassword2 ? "text" : "password"}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            sx={{ my: 2 }}
                            slotProps={{
                                input: {
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                onClick={togglePasswordVisibility2}
                                                onMouseDown={(event) => event.preventDefault()} // Prevent focus loss
                                                edge="end"
                                            >
                                                {showPassword2 ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                },
                                // eslint-disable-next-line
                                htmlInput(ownerState) {
                                    // console.log(ownerState);
                                    return { maxLength: 8, minLength: 3 };
                                },
                            }}
                        />
                        <Button
                            variant="outlined"
                            color="info"
                            onClick={handleSetNewPassword}
                            disabled={loading}
                            fullWidth
                        >
                            {loading ? <CircularProgress size={20} /> : 'Set Password'}
                        </Button>
                    </Box>
                )}
            </Box>
        </Dialog>
    );
};

export default ResetPassword;
