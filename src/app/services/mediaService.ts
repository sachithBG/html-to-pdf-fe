import { API } from "./api";

export const uploadImage = async (image: File, token: string) => {
    const formData = new FormData();
    formData.append('avatar', image);

    try {
        const response = await API.post('/media/upload', formData, {
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