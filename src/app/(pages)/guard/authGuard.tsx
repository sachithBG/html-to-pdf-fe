'use client';
import React from 'react'
import { ReactNode, useEffect } from 'react';
import { signOut, useSession } from 'next-auth/react';
import { usePathname, useRouter } from 'next/navigation';

interface AuthGuardProps {
    children: ReactNode;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
    const { data: session, status }: any = useSession();
    const pathname = usePathname();
    const router = useRouter();

    useEffect(() => {
        // console.log('AuthGuard', status, session?.user?.token);
        //check token expiration
        if (status === 'unauthenticated' && pathname != '/' && pathname != '/test') {
            // signOut();
            router.push('/dashboard');
        }
        if (status === 'unauthenticated') {
            console.log('/Sign out')
            signOut({ redirect: false });
        }

    }, [session?.user?.token, status, pathname]);

    // if (status === 'loading' || !session?.user?.token) return null; // Prevents flashing of protected content
    return <>{children}</>;
};

export default AuthGuard;