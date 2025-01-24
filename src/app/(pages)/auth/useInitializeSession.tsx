import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { clearSession, setLoading, setSession } from '@/redux/slice/sessionSlice';
import jwt, { JwtPayload } from 'jsonwebtoken';

const useInitializeSession = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        const initializeSession = async () => {
            dispatch(setLoading());
            const storedToken:any = localStorage.getItem('token');
            // Validate the token in the Redux store
            // dispatch(validateSession());

            if (storedToken) {
                try {
                    // You can directly set user info from the token if needed (assuming token has user data)
                    const decoded: { sub: string; name: string; email: string } | any = jwt.decode(storedToken) as JwtPayload | any;
                    if (decoded) {
                        // console.log(storedToken)
                        // console.log(decoded)
                        const storedUser = decoded?.user ? JSON.parse(decoded?.user) : null;
                        // storedUser = storedUser ? JSON.parse(storedUser) : null;
                        // console.log('storedUser', storedUser);
                        dispatch(setSession({
                            token: storedToken, user: {
                                id: storedUser.id, name: decoded.name, email: decoded.email,
                                profile: storedUser?.profile || { id: null, theme: 'light', avatar: null }
                            },
                            status: 'authenticated'
                        }));
                    } else {
                        // alert('Invalid token init');
                        dispatch(clearSession());
                        localStorage.removeItem('token');
                    }
                } catch (error) {
                    console.error('Failed to decode or fetch user data:', error);
                    dispatch(clearSession());
                    localStorage.removeItem('token');
                }
            }
        };

        initializeSession();
    }, [dispatch]);
};

export default useInitializeSession;
