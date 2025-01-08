'use client';
import React, { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    IconButton,
    PaletteMode,
    ThemeProvider,
    createTheme,
} from '@mui/material';
import { SnackbarProvider, closeSnackbar } from 'notistack';
import CloseIcon from '@mui/icons-material/Close';
import { toggleTheme } from '../redux/slice/ToggleTheme';

export const secondary_main = '#E4E8F8';

export default function ThemeProvidr({
    children,
}: {
    children: React.ReactNode;
}) {
    const theme = useSelector((state: any) => state.toggleTheme.theme);
    const dispatch = useDispatch();

    // useEffect(() => {
    //     let prefersDarkMode: any = window?.localStorage.getItem('theme'); // useMediaQuery('(prefers-color-scheme: dark)');
    //     if (!prefersDarkMode) window?.localStorage.setItem('theme', 'light');
    //     prefersDarkMode = window?.localStorage.getItem('theme');
    //     if (prefersDarkMode != theme)
    //         dispatch(toggleTheme(prefersDarkMode === 'dark' ? 'light' : 'dark'));
    //     // console.log('dis ' + theme);
    // }, []);

    // useEffect(() => {
    //     window?.localStorage.setItem('theme', theme);
    //     // console.log('local ' + theme);
    // }, [theme]);

    const getDesignTokens = (mode: PaletteMode) => ({
        palette: {
            mode,
            ...(mode === 'light'
                ? {
                    // palette values for light mode
                    secondary: {
                        main: secondary_main,
                        light: '#F3F4FB',
                        dark: '#8185A1',
                        contrastText: '#ff',
                    },
                }
                : {
                    // palette values for dark mode
                    secondary: {
                        main: 'rgb(34, 43, 69)',
                        light: '#7982C3',
                        dark: '#121D65',
                        contrastText: '#rgba(0,0,0,0.87)',
                    },
                    background: {
                        default: 'rgb(34, 43, 69)',
                        paper: 'rgb(34, 43, 69)',
                    },
                    components: {
                        MuiPaper: {
                            styleOverrides: {
                                root: {
                                    backgroundColor: 'red',
                                },
                            },
                        },
                    },
                }),
        },
    });

    let themeAction = useMemo(() => createTheme(getDesignTokens(theme)), [theme]);

    return (
        <ThemeProvider theme={themeAction}>
            <SnackbarProvider
                maxSnack={3}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                preventDuplicate
                dense
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
            >
                {children}
            </SnackbarProvider>
        </ThemeProvider>
    );
}
