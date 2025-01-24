'use client';
import React from 'react'
import { ReactNode, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { setSession } from '@/redux/slice/sessionSlice';

interface AuthGuardProps {
    children: ReactNode;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
    const { token, status } = useSelector((state: RootState) => state.session);

    const dispatch = useDispatch();
    const pathname = usePathname();
    const router = useRouter();
    // const dispatch: AppDispatch = useDispatch();

    useEffect(() => {
        // console.log('AuthGuard', status, token);
        //check token expiration
        const storedToken: any = localStorage.getItem('token');
        const decoded: { sub: string; name: string; email: string } | any = jwt.decode(storedToken) as JwtPayload | any;
        const storedUser = decoded?.user ? JSON.parse(decoded?.user) : null;
        dispatch(setSession({
            token: storedToken, user: {
                id: storedUser.id, name: decoded.name, email: decoded.email,
                profile: storedUser?.profile || { id: null, theme: 'light', avatar: null }
            },
            status: 'authenticated'
        }));
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