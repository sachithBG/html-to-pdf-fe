'use client';
import React from 'react'
import { ReactNode, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

interface AuthGuardProps {
    children: ReactNode;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
    const { token, status } = useSelector((state: RootState) => state.session);
    
    
    const pathname = usePathname();
    const router = useRouter();
    // const dispatch: AppDispatch = useDispatch();

    useEffect(() => {
        // console.log('AuthGuard', status, token);
        //check token expiration
        const storedToken = localStorage.getItem('token');
        if (!storedToken && pathname != '/' && pathname != '/test') {
            // signOut();
            router.push('/dashboard');
        }
        if (!storedToken) {
            console.log('/Sign out');
            // dispatch(clearSession());
        }

    }, [token, status, pathname]);

    // if (status === 'loading' || !token) return null; // Prevents flashing of protected content
    return <>{children}</>;
};

export default AuthGuard;