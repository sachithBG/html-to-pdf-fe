import * as React from 'react';
import {
    SignInPage,
    type AuthProvider,
    type AuthResponse,
} from '@toolpad/core/SignInPage';
import { Button, Checkbox, Dialog, FormControl, FormControlLabel, IconButton, InputAdornment, InputLabel, OutlinedInput, TextField, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { signIn } from 'next-auth/react';
import { AccountCircle, Visibility, VisibilityOff } from '@mui/icons-material';

const providers = [
    // { id: 'github', name: 'GitHub' },
    // { id: 'google', name: 'Google' },
    { id: 'credentials', name: 'Email and Password' },
];

function CustomEmailField() {
    return (
        <TextField
            id="input-with-icon-textfield"
            label="Email"
            name="email"
            type="email"
            size="small"
            required
            fullWidth
            slotProps={{
                input: {
                    startAdornment: (
                        <InputAdornment position="start">
                            <AccountCircle fontSize="inherit" />
                        </InputAdornment>
                    ),
                },
            }}
            variant="outlined"
        />
    );
}

function CustomPasswordField() {
    const [showPassword, setShowPassword] = React.useState(false);

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (event: React.MouseEvent) => {
        event.preventDefault();
    };

    return (
        <FormControl sx={{ my: 2 }} fullWidth variant="outlined">
            <InputLabel size="small" htmlFor="outlined-adornment-password">
                Password
            </InputLabel>
            <OutlinedInput
                id="outlined-adornment-password"
                type={showPassword ? 'text' : 'password'}
                name="password"
                size="small"
                endAdornment={
                    <InputAdornment position="end">
                        <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickShowPassword}
                            onMouseDown={handleMouseDownPassword}
                            edge="end"
                            size="small"
                        >
                            {showPassword ? (
                                <VisibilityOff fontSize="inherit" />
                            ) : (
                                <Visibility fontSize="inherit" />
                            )}
                        </IconButton>
                    </InputAdornment>
                }
                label="Password"
            />
        </FormControl>
    );
}

function CustomButton() {
    return (
        <Button
            type="submit"
            variant="outlined"
            color="info"
            size="small"
            disableElevation
            fullWidth
            sx={{ my: 2 }}
        >
            Log In
        </Button>
    );
}

const signIn_: (provider: AuthProvider, formData: any, onOpen: any) => void | Promise<AuthResponse> = async (
    provider, formData: any, onOpen: any
) => {
    const promise = new Promise<AuthResponse>(async (resolve) => {
        if (provider.id === "credentials") {
            // console.log('Remember me', formData.get('rememberMe'));
            const result: any = await signIn('credentials', {
                redirect: false,
                email: formData?.get('email'),
                password: formData?.get('password'),
                rememberMe: formData?.get('rememberMe'),
            });
            // console.log(result);
            if (result?.ok) {
                // onOpen(false);
                // Close modal only on successful login
                // resolve({ success: 'Login Success' });
                resolve({
                    success: 'Check your email for a verification link.',
                });
                // setTimeout(() => {
                onOpen(false);
                // }, 1000);
                // return { error: result.error };
            } else if (result?.status === 401) {
                resolve({ error: result.error });
            } else {
                resolve({ error: 'An error occurred during signin.' });
            }

        } else {
            // Handle other providers if needed
            onOpen(false);
            setTimeout(() => {
                console.log(`Sign in with ${provider.id}`);
                resolve({ error: 'Invalid credentials.' });
            }, 500);
        }
    });
    return promise;
};

function RememberMe() {
    const [checked, setChecked] = React.useState(false);
    return (
        <FormControlLabel
            control={
                <Checkbox
                    name="rememberMe"
                    checked={checked}
                    value={checked}
                    onChange={(event) => setChecked(event.target.checked)}
                    color="primary"
                    sx={{ padding: 0.5, '& .MuiSvgIcon-root': { fontSize: 20 } }}
                />
            }
            slotProps={{
                typography: {
                    fontSize: 14,
                },
            }}
            color="textSecondary"
            label="Remember me"
        />
    );
}

export default function SignIn({ open, onClose, setSignUpModalOpen }: any) {

    const handleClose = () => {
        onClose(false);
    };

    const handleSignUp = () => {
        onClose(false);
        setSignUpModalOpen(true);
    };

    const handleForgotPassword = () => {
        onClose(false);
        setSignUpModalOpen(true);
    };

    return (
        <Dialog open={open} onClose={handleClose} sx={{
            m: 0, p: 0,
            '& .MuiPaper-root, .MuiBox-root': { minHeight: 'unset' },
            '& .MuiContainer-root': { p: 0 }
        }} >
            <IconButton
                aria-label="close"
                onClick={() => onClose(false)}
                sx={(theme) => ({
                    position: 'absolute',
                    right: 8,
                    top: 8,
                    color: theme.palette.grey[500],
                })}
            >
                <CloseIcon />
            </IconButton>
            <SignInPage
                signIn={(provider, formData): any => signIn_(provider, formData, onClose)}
                providers={providers}
                sx={{
                    '& form > .MuiStack-root': {
                        marginTop: '2rem',
                        rowGap: '0.5rem',
                    },
                }}
                slots={{
                    title: () => <h2 style={{ marginBottom: 8, minWidth: '400px', textAlign: 'center' }}>Login</h2>,
                    // subtitle: () => <Alert sx={{ mb: 2, px: 1, py: 0.25 }} severity="success">
                    //     We are investigating an ongoing outage.
                    // </Alert>,
                    // emailField: CustomEmailField,
                    // passwordField: CustomPasswordField,
                    // submitButton: CustomButton,
                    signUpLink: () => <Typography variant="body2" onClick={handleSignUp} sx={{ cursor: 'pointer' }}>
                        Sign up
                    </Typography>,
                    forgotPasswordLink: () => <Typography variant="body2" onClick={handleForgotPassword}>
                        Forgot password?
                    </Typography>,
                    // userNameField: () => null,
                    emailField: CustomEmailField,
                    passwordField: CustomPasswordField,
                    submitButton: CustomButton,
                    rememberMe: RememberMe,
                }}
            />
        </Dialog>
    );
}
