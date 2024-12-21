import { API } from './api';


export const signInUser = async (email: string, password: string, rememberMe: boolean) => {
    return API.post('/users/login', { email, password, rememberMe });
};

export const signUpUser = async (name: string, email: string, password: string) => {
    try {
        const response = await API.post('/users/register', { name, email, password });
        return response.data; // Assuming the response has the data like { id, name, email }
    } catch (error: any) {
        if (error.response) {
            // If the backend responded with a status code outside the 2xx range
            throw new Error(error.response.data.error || 'An error occurred during registration.');
        } else if (error.request) {
            // If the request was made but no response was received
            throw new Error('No response from the server. Please try again later.');
        } else {
            // Something happened in setting up the request
            throw new Error('Error in setting up the request. Please try again.');
        }
    }
};
