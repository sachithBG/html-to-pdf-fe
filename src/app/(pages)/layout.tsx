"use client";
import * as React from 'react';
import { extendTheme } from '@mui/material/styles';
import DashboardIcon from '@mui/icons-material/Dashboard';
import BarChartIcon from '@mui/icons-material/BarChart';
import LayersIcon from '@mui/icons-material/Layers';
import { AppProvider, Router } from '@toolpad/core/AppProvider';
import { DashboardLayout, SidebarFooterProps } from '@toolpad/core/DashboardLayout';
import { PageContainer } from '@toolpad/core/PageContainer';
import Grid from '@mui/material/Grid2';
import { Storage, Image as Img } from '@mui/icons-material';
import { usePathname, useRouter } from 'next/navigation';
import { Box } from '@mui/material';
import LineStyleIcon from '@mui/icons-material/LineStyle';
import ReceiptIcon from '@mui/icons-material/Receipt';
import AddCardIcon from '@mui/icons-material/AddCard';
import BallotIcon from '@mui/icons-material/Ballot';
import BackupTableIcon from '@mui/icons-material/BackupTable';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import AccountSlotsAccountSwitcher from './auth/components/AccountSlotsAccountSwitcher';

import { useSession } from 'next-auth/react';
import { useSelector } from 'react-redux';
import { authEvents } from '../utils/authEvents';

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
        title: 'TestZone',
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
                segment: 'pdf-template',
                title: 'Template',
                icon: <AddCardIcon />,
                // children: [{
                //     segment: 'edit',
                //     title: 'Edit',
                // },
                // {
                //     segment: 'create',
                //     title: 'New',
                // }]
            },
            {
                segment: 'table-manage',
                title: 'Table Manage',
                icon: <BackupTableIcon />,
            },
            {
                segment: 'media',
                title: 'Media',
                icon: <Img />,
            },
            {
                segment: 'data-manage',
                title: 'Config',
                icon: <Storage />,
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
        icon: <BallotIcon />,
    },
    {
        segment: 'profile',
        title: 'Manage Profile',
        icon: <ManageAccountsIcon />,
    },
];

const demoTheme = extendTheme({
    colorSchemes: {
        light: {
            palette: {
                mode: 'light',
                background: {
                    default: '#f9f9f9',
                    paper: '#ffffff',
                },
                text: {
                    primary: '#000000',
                    secondary: '#555555',
                },
            },
        },
        dark: {
            palette: {
                mode: 'dark',
                background: {
                    default: '#28292a', // Set dark background to #28292a
                    paper: '#28292a',   // Slightly lighter for card-like components
                },
                text: {
                    primary: '#ffffff', // Bright text for dark background
                    secondary: '#b0b0b0',
                },
            },
        },
    },
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
    const { status }: any = useSession();

    return {
        pathname,
        searchParams: new URLSearchParams(),
        navigate: (path: string | URL) => {
            if (path == '/setup') {
                path = '/setup/editor';
            } else if (status === 'unauthenticated') {
                path = '/dashboard';
                authEvents.emit('triggerSignIn');
            }
            nextRouter.push(String(path));
            return setPathname(String(path));
        },
    };
}

// const Skeleton = styled('div')<{ height: number }>(({ theme, height }) => ({
//     backgroundColor: theme.palette.action.hover,
//     borderRadius: theme.shape.borderRadius,
//     height,
//     content: '" "',
// }));

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
    // const theme = useSelector((state: any) => state.toggleTheme.theme);
    // cuurent route url
    const pathname = usePathname();
    // const { data: session, status }: any = useSession();
    // const router_ = useRouter();
    const router = useDemoRouter(pathname ?? '/');
    // const r = useDemoRouter('/dashboard');
    // const [router_app, setRouter_app] = React.useState(router);

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

    // React.useEffect(() => {
    //     if (status === 'unauthenticated') {
    //         router_.push('/dashboard');
    //         setRouter_app(r);
    //     } else
    //         setRouter_app(router);
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
    // const theme = mode === 'light' ? lightTheme : darkTheme;
    return (
        //

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
    );
}