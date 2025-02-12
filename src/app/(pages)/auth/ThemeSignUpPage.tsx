import React, { useState, useRef } from 'react';
import { Box, TextField, Typography, Button, Alert, IconButton, Dialog, InputAdornment } from '@mui/material';
import Grid2 from '@mui/material/Grid2'; // Grid2 component
import LineStyleIcon from '@mui/icons-material/LineStyle';
import { signUpUser } from '@/app/services/authService';
import CloseIcon from '@mui/icons-material/Close';
import { Visibility, VisibilityOff } from '@mui/icons-material';


const SignUp = ({ setSignInModalOpen, openSignUp, setSignUpModalOpen }: any) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [errorName, setErrorName] = useState(false);
    const [errorEmail, setErrorEmail] = useState(false);
    const [errorPassword, setErrorPassword] = useState(false);

    const nameRef = useRef<HTMLInputElement | null>(null);
    const emailRef = useRef<HTMLInputElement | null>(null);
    const passwordRef = useRef<HTMLInputElement | null>(null);

    // const handleOpen = () => setSignUpModalOpen(true);
    const handleClose = () => setSignUpModalOpen(false);

    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);


    const handleValidation = () => {
        let isValid = true;

        if (!name.trim()) {
            setErrorName(true);
            nameRef.current?.focus();
            isValid = false;
        }

        if (!email.trim()) {
            setErrorEmail(true);
            if (isValid) emailRef.current?.focus();
            isValid = false;
        }

        if (!password.trim()) {
            setErrorPassword(true);
            if (isValid) passwordRef.current?.focus();
            isValid = false;
        }

        return isValid;
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        if (handleValidation()) {
            try {
                const res = await signUpUser(name, email, password); // API call function for signup
                // console.log(res);
                
                if (res?.data?.name && res?.data?.email) {
                    // Show success message
                    setSuccessMessage('Signup successful! Redirecting to sign-in...');
                    setErrorMessage(null); // Clear any previous error

                    setTimeout(() => {
                        setSuccessMessage(null); // Clear success message
                        handleSignIn(); // Navigate to sign-in modal
                    }, 2000);
                } else if (res?.data?.error) {
                    
                    // Show error message
                    setErrorMessage(res?.data.error);
                    setSuccessMessage(null); // Clear any previous success
                } else {
                    // Generic error handling
                    setErrorMessage('Something went wrong. Please try again.');
                    setSuccessMessage(null); // Clear any previous success
                }
            } catch (error: any) {
                console.error('Signup error:', error);
                
                // Check if the error is from the API response
                if (error?.response?.data?.error) {
                    setErrorMessage(error.response.data.error); // Server-side error message
                }
                // Handle network or unexpected errors
                else if (error.message) {
                    setErrorMessage(`Network error: ${error.message}`);
                }
                // Generic fallback
                else {
                    setErrorMessage('An unexpected error occurred. Please try again later.');
                }
                setSuccessMessage(null);
            }
        }
    };

    const handleSignIn = () => {
        setSignInModalOpen(true);
        setSignUpModalOpen(false);
    };

    const togglePasswordVisibility = () => {
        setShowPassword((prev) => !prev);
    };

    return (
        <Dialog open={openSignUp} onClose={handleClose}>
            <IconButton
                aria-label="close"
                onClick={() => setSignUpModalOpen(false)}
                sx={(theme) => ({
                    position: 'absolute',
                    right: 8,
                    top: 8,
                    color: theme.palette.grey[500],
                })}
            >
                <CloseIcon />
            </IconButton>
            <Box
                component="form"
                onSubmit={handleSubmit}
                sx={{
                    // position: 'absolute',
                    // top: '50%',
                    // left: '50%',
                    // transform: 'translate(-50%, -50%)',
                    width: "100%",
                    maxWidth: '444px',
                    bgcolor: 'background.paper',
                    boxShadow: 24,
                    p: 4,
                }}
            >
                <Grid2 container spacing={2} direction="column" alignItems="center">
                    <Grid2>
                        <LineStyleIcon color="info" />
                    </Grid2>
                    <Grid2>
                        <Typography>Sign Up</Typography>
                    </Grid2>
                </Grid2>

                <TextField
                    inputRef={nameRef}
                    label="Name"
                    value={name}
                    onChange={(e) => {
                        setName(e.target.value);
                        setErrorName(false);
                    }}
                    onBlur={() => !name.trim() && setErrorName(true)}
                    error={errorName}
                    helperText={errorName ? 'Name is required.' : ''}
                    fullWidth
                    margin="normal"
                />

                <TextField
                    inputRef={emailRef}
                    label="Email"
                    type="email"
                    value={email}
                    onChange={(e) => {
                        setEmail(e.target.value);
                        setErrorEmail(false);
                    }}
                    onBlur={() => !email.trim() && setErrorEmail(true)}
                    error={errorEmail}
                    helperText={errorEmail ? 'Email is required.' : ''}
                    fullWidth
                    margin="normal"
                />

                <TextField
                    inputRef={passwordRef}
                    label="Password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => {
                        setPassword(e.target.value);
                        setErrorPassword(false);
                    }}
                    onBlur={() => !password.trim() && setErrorPassword(true)}
                    error={errorPassword}
                    helperText={errorPassword ? 'Password is required.' : ''}
                    fullWidth
                    margin="normal"
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

                {/* Success Message */}
                {successMessage && (
                    <Alert severity="success" sx={{ mb: 2 }}>
                        {successMessage}
                    </Alert>
                )}

                {/* Error Message */}
                {errorMessage && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {errorMessage}
                    </Alert>
                )}

                <Button type="submit" variant="outlined" size='small' color="primary" fullWidth>
                    Sign Up
                </Button>

                <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
                    <Typography variant="body2" sx={{ mr: 1 }}>
                        Already have an account?{' '}
                    </Typography>
                    <Typography
                        variant="body2"
                        onClick={handleSignIn}
                        sx={{ cursor: 'pointer' }}
                        color="primary"
                    >
                        Sign In
                    </Typography>
                </Box>
            </Box>
        </Dialog>
    );
};

export default SignUp;
