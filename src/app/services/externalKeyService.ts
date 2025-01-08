import { API } from './api';

export const addExternalKey = async (addon_id: number, key: string, token: string) => {
    return API.post(`/external-keys`, { addon_id: addon_id, key_value: key }, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
}

export const getExternalKey = async (id: number, token: string) => {
    return API.get(`/external-keys/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
}

export const updateExternalKey = async (id: number, data: any, token: string) => {
    return API.put(`/external-keys/${id}`, data, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
}

export const deleteExternalKey = async (id: number, token: string) => {
    return API.delete(`/external-keys/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
}

export const findAllByAddonId = async (addon_id: number, token: string) => {
    return API.get(`/external-keys/by-addon/${addon_id}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
}