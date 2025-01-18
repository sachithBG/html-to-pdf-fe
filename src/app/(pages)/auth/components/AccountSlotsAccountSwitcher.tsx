import * as React from 'react';
import {
    AuthenticationContext,
    SessionContext,
    type Session,
} from '@toolpad/core/AppProvider';
import { Account } from '@toolpad/core/Account';
import CustomMenu from './CustomMenu';
import { ThemeSwitcher } from '@toolpad/core/DashboardLayout';
import SignIn from '../ThemeSignInPage';
import { signOut, useSession } from 'next-auth/react';
import SignUp from '../ThemeSignUpPage';
import { findOrganizationsByUserId } from '@/app/services/organizationService';
import { useDispatch } from 'react-redux';
import { addOrganizationAll, clearOrganizationState } from '@/redux/slice/organizationSlice';
import { authEvents } from '@/app/utils/authEvents';
import { useColorScheme } from '@mui/material';

// const demoSession = {
//     user: {
//         name: 'Bharat Kashyap',
//         email: 'bharatkashyap@outlook.com',
//         image: 'https://avatars.githubusercontent.com/u/19550456',
//     },
// };

class DemoSession {
    user: {
        name: string;
        email: string;
        image: string;
    };
    constructor(data: any) {
        this.user = {
            name: data?.name,
            email: data?.email,
            image: data?.avatar,
        }
    }
}


export default function AccountSlotsAccountSwitcher() {
    const [session, setSession] = React.useState<Session | any>(null);
    const { data: session2 }: any = useSession();
    const [isSignInModalOpen, setSignInModalOpen] = React.useState(false);
    const [isSignUpModalOpen, setSignUpModalOpen] = React.useState(false);
    const dispatch = useDispatch();
    const { setMode } = useColorScheme();

    const handleSignIn = () => {
        setSignInModalOpen(true);
    };
    const authentication = React.useMemo(() => {
        return {
            signIn: () => {
                handleSignIn();
                // setSession(new DemoSession(session2?.user));
            },
            signOut: () => {
                setSession(null);
                signOut();
            },
        };
    }, []);

    React.useEffect(() => {
        if (session2?.user?.id) {
            // console.log(session2);
            setSession(() => new DemoSession(session2?.user));
            findOrganizationsByUserId(session2?.user.id, session2?.user?.token).then((res) => {
                console.log(res.data, 'Organizations fetched');
                if (res.data && res.data.length > 0) {
                    console.log('Dispatching organizations');
                    dispatch(clearOrganizationState());
                    dispatch(addOrganizationAll(res.data));

                }
            }).catch((err) => {
                console.log(err, 'Error fetching organizations');
            });
             setMode(session2?.user?.theme || 'light');
        }

        //clear the organization state on signout
        // if (!session2) {
        //     dispatch(clearOrganizationState());
        // }
        authEvents.on('triggerSignIn', handleSignIn);
        return () => {
            dispatch(clearOrganizationState());
            authEvents.off('triggerSignIn', handleSignIn);
        }
    }, [session2?.user?.id]);

    return (
        <AuthenticationContext.Provider value={authentication}>
            <SessionContext.Provider value={session} >
                {/* preview-start */}

                <ThemeSwitcher />
                <SignIn open={isSignInModalOpen} onClose={setSignInModalOpen} setSignUpModalOpen={setSignUpModalOpen}></SignIn>
                <SignUp setSignInModalOpen={setSignInModalOpen} openSignUp={isSignUpModalOpen} setSignUpModalOpen={setSignUpModalOpen}></SignUp>
                <Account
                    slots={{
                        popoverContent: CustomMenu,
                    }}
                />
                {/* preview-end */}
            </SessionContext.Provider>
        </AuthenticationContext.Provider>
    );
}

