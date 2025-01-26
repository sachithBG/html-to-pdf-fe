import { API } from './api';

export const sendOtp = async (email: string) => {
    return API.post('/reset-password/send-otp', { email });
}

export const verifyOtp = async (email: string, otp: any) => {
    return API.post('/reset-password/verify-otp', { email, otp });
}


export const resetPassword = async (email: string, newPassword: string) => {
    return API.post('/reset-password/reset-password', { email, newPassword });
}