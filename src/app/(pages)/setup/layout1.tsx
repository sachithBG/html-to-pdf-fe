"use client";
import * as React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { Avatar, Menu, MenuItem, useMediaQuery } from '@mui/material';
import { Settings, Storage, Image, Brightness7, Brightness4 } from '@mui/icons-material';
import Link from 'next/link';
import { toggleTheme } from '@/redux/slice/ToggleTheme';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

const drawerWidth = 240;

// Main styled component
const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })<{
    open?: boolean;
}>(({ theme }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: `-${drawerWidth}px`,
    variants: [
        {
            props: ({ open }) => open,
            style: {
                transition: theme.transitions.create('margin', {
                    easing: theme.transitions.easing.easeOut,
                    duration: theme.transitions.duration.enteringScreen,
                }),
                marginLeft: 0,
            },
        },
    ],
}));

const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme }) => ({
    transition: theme.transitions.create(['margin', 'width'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    variants: [
        {
            props: ({ open }) => open,
            style: {
                width: `calc(100% - ${drawerWidth}px)`,
                marginLeft: `${drawerWidth}px`,
                transition: theme.transitions.create(['margin', 'width'], {
                    easing: theme.transitions.easing.easeOut,
                    duration: theme.transitions.duration.enteringScreen,
                }),
            },
        },
    ],
}));

// Custom AppBar
const AppBarCustom = styled(AppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme, open }) => ({
    transition: theme.transitions.create(['margin', 'width'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
    }),
}));

interface AppBarProps extends MuiAppBarProps {
    open?: boolean;
}

const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
    // marginTop: 2
}));

export default function MyLayout({ children }: { children: React.ReactNode }) {
    const theme = useTheme();
    const [open, setOpen] = React.useState(false);
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const dispatch = useDispatch();

    const colorMode = useSelector((state: RootState) => state.toggleTheme.theme);
    const isMobile = useMediaQuery('(max-width: 768px)');

    const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleProfileMenuClose = () => {
        setAnchorEl(null);
    };

    const handleDrawerOpen = (e: any) => {
        e.preventDefault();
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    const toggleTheme_ = () => {
        dispatch(toggleTheme(colorMode));
    };

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <AppBarCustom position="fixed" open={open}>
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        onClick={(e) => handleDrawerOpen(e)}
                        edge="start"
                        sx={[
                            { mr: 2 },
                            open && { display: 'none' },
                        ]}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
                        PDF Generator
                    </Typography>

                    {/* Theme Toggle Button */}
                    <IconButton color="inherit" onClick={toggleTheme_}>
                        {colorMode == 'dark' ? <Brightness7 /> : <Brightness4 />}
                    </IconButton>

                    {/* Profile Avatar */}
                    <IconButton color="inherit" onClick={handleProfileMenuOpen}>
                        <Avatar alt="Profile" src="/profile.svg" />
                    </IconButton>
                    <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleProfileMenuClose}>
                        <MenuItem onClick={handleProfileMenuClose}>Profile</MenuItem>
                        <MenuItem onClick={handleProfileMenuClose}>My account</MenuItem>
                        <MenuItem onClick={handleProfileMenuClose}>Logout</MenuItem>
                    </Menu>
                </Toolbar>
            </AppBarCustom>
            <Drawer
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    '& .MuiDrawer-root': {
                        marginTop: 2,
                    },
                    '& .MuiDrawer-paper': {
                        width: drawerWidth,
                        boxSizing: 'border-box',

                    },
                }}
                variant={isMobile ? 'temporary' : 'persistent'}
                anchor="left"
                open={open}
            >
                <DrawerHeader>
                    <IconButton onClick={handleDrawerClose}>
                        {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
                    </IconButton>
                </DrawerHeader>
                <Divider />
                <List>
                    <ListItem component={Link} href="/setup/editor">
                        <ListItemIcon><Settings /></ListItemIcon>
                        <ListItemText primary="Setup" />
                    </ListItem>
                    <Divider />
                    <ListItem component={Link} href="/setup/data-manage">
                        <ListItemIcon><Storage /></ListItemIcon>
                        <ListItemText primary="Data Manage" />
                    </ListItem>
                    <Divider />
                    <ListItem component={Link} href="/setup/media">
                        <ListItemIcon><Image /></ListItemIcon>
                        <ListItemText primary="Media" />
                    </ListItem>
                </List>
            </Drawer>
            <Main open={open}>
                <DrawerHeader />
                <Typography sx={{ marginBottom: 2 }}>
                </Typography>
                <Box sx={{ mt: 4 }}>
                    {children}
                </Box>
            </Main>
        </Box>
    );
};
