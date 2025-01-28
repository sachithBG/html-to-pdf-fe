import { API } from "./api";

export const uploadAvator = async (userId: number, organizationId: number,image: File, token: string) => {
    const formData = new FormData();
    formData.append('avatar', image);

    try {
        const response = await API.post(`/s3/upload/profile`, formData, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'multipart/form-data',
            },
            params: {
                userId: userId,
                organizationId: organizationId
            },
            timeout: 90000,
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
            },
            timeout: 90000,
        });
        return response.data;
    } catch (error) {
        console.error('Error uploading image:', error);
        throw error;
    }
};

export const uploadMedia = async (currentOrgId: number, image: File, addon_ids: number[] = [], token: string, imageName: string) => {
    const formData = new FormData();
    formData.append('media', image);

    return await API.post('/s3/media/upload', formData, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'multipart/form-data',
            },
            params: {
                organization_id: currentOrgId,
                addon_ids: addon_ids,
                name: imageName
        },
        timeout: 90000,
        });
};

export const findAllImages = async (currentOrgId: number, token: string, addon_ids: number[] = []) => {
    try {
        const response = await API.get('/media/organization/' + currentOrgId, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            params: {
                organizationId: currentOrgId,
                addon_ids: addon_ids
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error uploading image:', error);
        throw error;
    }
};

export const deleteImg = async (key: any, token: string) => {
    return API.delete('/s3/delete/img', {
        headers: {
            Authorization: `Bearer ${token}`
        },
        params: {
            fileKey: key
        }
    });
}