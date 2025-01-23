'use client';
import React from 'react';
import {
    IconButton,
} from '@mui/material';
import { SnackbarProvider, closeSnackbar } from 'notistack';
import CloseIcon from '@mui/icons-material/Close';
import AuthGuard from '@/app/(pages)/guard/authGuard';

export const secondary_main = '#E4E8F8';

export default function ThemeProvidr({
    children,
}: {
    children: React.ReactNode;
}) {
    // const theme = useSelector((state: any) => state.toggleTheme.theme);
    // const getDesignTokens = (mode: PaletteMode) => ({
    //     palette: {
    //         mode,
    //         ...(mode === 'light'
    //             ? {
    //                 // palette values for light mode
    //                 secondary: {
    //                     main: secondary_main,
    //                     light: '#F3F4FB',
    //                     dark: '#8185A1',
    //                     contrastText: '#ff',
    //                 },
    //             }
    //             : {
    //                 // palette values for dark mode
    //                 secondary: {
    //                     main: 'rgb(34, 43, 69)',
    //                     light: '#7982C3',
    //                     dark: '#121D65',
    //                     contrastText: '#rgba(0,0,0,0.87)',
    //                 },
    //                 background: {
    //                     default: 'rgb(34, 43, 69)',
    //                     paper: 'rgb(34, 43, 69)',
    //                 },
    //                 components: {
    //                     MuiPaper: {
    //                         styleOverrides: {
    //                             root: {
    //                                 backgroundColor: 'red',
    //                             },
    //                         },
    //                     },
    //                 },
    //             }),
    //     },
    // });

    // const themeAction = useMemo(() => createTheme(getDesignTokens(theme)), [theme]);

    return (
        // <ThemeProvider theme={themeAction}>
                <AuthGuard>
                    <SnackbarProvider
                        maxSnack={3}
                        autoHideDuration={3000}
                        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                        preventDuplicate
                        dense
                        hideIconVariant
                        action={(key) => (
                            <IconButton
                                key="close"
                                color="inherit"
                                onClick={() => closeSnackbar(key)}
                                size="small"
                                aria-label="Alert"
                            >
                                <CloseIcon />
                            </IconButton>
                        )}

                        classes={{
                            root: 'custom-snackbar', // Use your custom class
                        }}
                    // iconVariant={{
                    //     success: null,
                    //     error: null,
                    //     warning: null,
                    //     info: null,
                    // }}
                    >
                        {children}
                    </SnackbarProvider>
                </AuthGuard>
        // </ThemeProvider>
    );
}
