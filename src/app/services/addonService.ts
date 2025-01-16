import { API } from "./api";


export const createAddon = async (name: string, organization_id: number, token: string) => {
    return API.post('/addons', { name, organization_id }, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
}

export const updateAddon = async (data: any, token: string) => {
    return API.put('/addons/' + data.id, data, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
}

export const findAddonById = async (id: any, token: string) => {
    return API.get('/addons/' + id, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
}

export const findAllAddonsByUser = async (token: string) => {
    return API.get('/addons', {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
}

export const findAllAddons = async (organization_id: number, token: string) => {
    return API.get('/addons/' + organization_id + '/organization', {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
}

export const findAddonPage = async (
    page: number,
    pageSize: number,
    field: string,
    sort: string,
    quickFilterValues: string,
    active: boolean,
    token: string
) => {
    return API.get('/addons/page', {
        headers: {
            Authorization: `Bearer ${token}`
        },
        params: {
            page,
            pageSize,
            field,
            sort,
            quickFilterValues,
            active
        }
    });
}

export const deleteAddon = async (id: any, token: string) => {
    return API.delete('/addons/' + id, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
}