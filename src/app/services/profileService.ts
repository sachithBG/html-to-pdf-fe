import { API } from "./api";

export const updateNameByUserId = async (userId: number, name: string, token: string) => {
    return API.put(`/profiles/${userId}/name`,
        { name: name },
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
};

export const updateThemeByUserId = async (userId: number, theme: string, token: string) => {
    return API.put(`/profiles/${userId}/theme`,
        { theme: theme },
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
};

//Deprecated
export const updateImageByUserId = async (userId: number, image: string, token: string) => {
    return API.put(`/profiles/${userId}/image`,
        { image: image },
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
};