"use client";
import * as React from 'react';
import { extendTheme, styled } from '@mui/material/styles';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import BarChartIcon from '@mui/icons-material/BarChart';
import DescriptionIcon from '@mui/icons-material/Description';
import LayersIcon from '@mui/icons-material/Layers';
import { AppProvider, Router, type Session } from '@toolpad/core/AppProvider';
import { DashboardLayout, SidebarFooterProps } from '@toolpad/core/DashboardLayout';
import { PageContainer } from '@toolpad/core/PageContainer';
import Grid from '@mui/material/Grid2';
import { Settings, Storage, Image, Brightness7, Brightness4 } from '@mui/icons-material';
import { usePathname, useRouter } from 'next/navigation';
import { Box, IconButton, Typography } from '@mui/material';
import LineStyleIcon from '@mui/icons-material/LineStyle';
import ReceiptIcon from '@mui/icons-material/Receipt';
import AddCardIcon from '@mui/icons-material/AddCard';
import BackupTableIcon from '@mui/icons-material/BackupTable';
import SignIn from './auth/ThemeSignInPage';
import AccountSlotsAccountSwitcher from './auth/components/AccountSlotsAccountSwitcher';

import { SessionProvider, useSession } from 'next-auth/react';
import { useSelector } from 'react-redux';
import AuthGuard from './guard/authGuard';

type NavigationItem = {
    topNav?: {
        icon: React.ReactNode;
        name: string;
    };
    kind?: 'header' | 'divider';
    segment?: string;
    title?: string;
    icon?: React.ReactNode;
    children?: NavigationItem[];
};

type Navigation = NavigationItem[] | any[];

const NAVIGATION: Navigation | any = [
    // {
    //     topNav: {
    //         icon: <Brightness7 />,
    //         name: 'Custom App Name', 
    //     }
    // },
    {
        kind: 'header',
        title: 'Main items',
    },
    {
        segment: 'dashboard',
        title: 'Dashboard',
        icon: <DashboardIcon />,
    },
    {
        segment: 'test',
        title: 'Test',
        icon: <ReceiptIcon />,
    },
    {
        kind: 'divider',
    },
    {
        kind: 'header',
        title: 'Setup',
    },
    {
        segment: 'setup',
        title: 'Pdf Design',
        icon: <BarChartIcon />,
        children: [
            {
                segment: 'editor',
                title: 'Page Edit',
                icon: <AddCardIcon />,
            },
            {
                segment: 'table-manage',
                title: 'Table Manage',
                icon: <BackupTableIcon />,
            },
            {
                segment: 'data-manage',
                title: 'Data Manage',
                icon: <Storage />,
            },
            {
                segment: 'media',
                title: 'Media',
                icon: <Image />,
            },
        ],
    },
    {
        segment: 'integrations',
        title: 'Integrations',
        icon: <LayersIcon />,
    },
    {
        segment: 'organization',
        title: 'Manage Organizations',
        icon: <LayersIcon />,
    },
    {
        segment: 'profile',
        title: 'Manage Profile',
        icon: <LayersIcon />,
    },
];

const demoTheme = extendTheme({
    colorSchemes: { light: true, dark: true },
    colorSchemeSelector: 'class',
    breakpoints: {
        values: {
            xs: 0,
            sm: 600,
            md: 600,
            lg: 1200,
            xl: 1536,
        },
    },
});

function useDemoRouter(initialPath: string): Router {
    const [pathname, setPathname] = React.useState(initialPath);
    const nextRouter = useRouter();

    return {
        pathname,
        searchParams: new URLSearchParams(),
        navigate: (path: string | URL) => {
            if (path == '/setup') path = '/setup/editor';
            nextRouter.push(String(path));
            return setPathname(String(path));

        },
    };
}

const Skeleton = styled('div')<{ height: number }>(({ theme, height }) => ({
    backgroundColor: theme.palette.action.hover,
    borderRadius: theme.shape.borderRadius,
    height,
    content: '" "',
}));

function SidebarFooter({ mini }: SidebarFooterProps) {
    const { organizations } = useSelector((state: any) => state.organization);

    return (
        <Box
            // variant="caption"
            sx={{ m: 1, whiteSpace: 'nowrap', overflow: 'hidden' }}
        >
            {
                organizations.find((organization: any) =>
                    organization.is_default)?.name ?? 'No organization selected'
            }
            {mini ? '© ' : ` © ${new Date(organizations.find((organization: any) =>
                organization.is_default)?.updated_at).getFullYear()} Made with Pdf Tool`}
        </Box>
    );
}

export default function DashboardLayoutBasic(props: any) {
    const { window } = props;
    const [mounted, setMounted] = React.useState(false);
    // cuurent route url
    const pathname = usePathname();
    const router = useDemoRouter(pathname ?? '/');
    // const [session, setSession] = React.useState<Session | null>({
    //     user: {
    //         name: 'Bharat Kashyap',
    //         email: 'bharatkashyap@outlook.com',
    //         image: 'https://avatars.githubusercontent.com/u/19550456',
    //     },
    // });



    // const authentication = React.useMemo(() => {
    //     return {
    //         signIn: () => {
    //             setSession({
    //                 user: {
    //                     name: 'Bharat Kashyap',
    //                     email: 'bharatkashyap@outlook.com',
    //                     image: 'https://avatars.githubusercontent.com/u/19550456',
    //                 },
    //             });
    //         },
    //         signOut: () => {
    //             setSession(null);
    //         },
    //     };
    // }, []);

    React.useEffect(() => {
        console.log(pathname, 'Pathname');
        setMounted(true);
    }, []);

    // Only render the component after the client has mounted (to avoid hydration errors)
    if (!mounted) {
        return null; // This prevents rendering until the component is mounted on the client side
    }

    // Remove this const when copying and pasting into your project.
    const demoWindow = window ? window() : undefined;

    return (
        // 
        <SessionProvider >
            <AuthGuard>
                <AppProvider
                    navigation={NAVIGATION}
                    branding={{
                        title: 'PDF Crafter: HTML to PDF Tool',
                        logo: <LineStyleIcon color='info' />
                    }}
                    router={router}
                    theme={demoTheme}
                    window={demoWindow}
                // authentication={authentication}
                // session={session}

                >
                    {/* <SignIn></SignIn> */}
                    <DashboardLayout slots={{ sidebarFooter: SidebarFooter, toolbarActions: AccountSlotsAccountSwitcher }}>
                        <PageContainer>
                            <Grid container spacing={1}>
                                {/* {JSON.stringify(session)} */}
                            </Grid>
                            {props.children}
                        </PageContainer>
                    </DashboardLayout>
                </AppProvider>
            </AuthGuard>
        </SessionProvider>
    );
}