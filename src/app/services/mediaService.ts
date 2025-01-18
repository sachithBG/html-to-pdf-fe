import { API } from "./api";

export const uploadAvator = async (userId: number, image: File, token: string) => {
    const formData = new FormData();
    formData.append('avatar', image);

    try {
        const response = await API.put(`/profiles/${userId}/avatar`, formData, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error uploading image:', error);
        throw error;
    }
};

export const uploadOrgLogo = async (currentOrgId: number, image: File, token: string) => {
    const formData = new FormData();
    formData.append('logo', image);

    try {
        const response = await API.post('/s3/upload/org/logo', formData, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'multipart/form-data',
            },
            params: {
                organizationId: currentOrgId
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error uploading image:', error);
        throw error;
    }
};

export const uploadMedea = async (currentOrgId: number, image: File, token: string) => {
    const formData = new FormData();
    formData.append('medea', image);

    try {
        const response = await API.post('/media/upload', formData, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'multipart/form-data',
            },
            params: {
                organizationId: currentOrgId
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error uploading image:', error);
        throw error;
    }
};