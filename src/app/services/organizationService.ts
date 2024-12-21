import { Organization } from "@/redux/slice/organizationSlice";
import { API } from "./api";

export const findOrganizationsByUserId = async (userId: number, token: string) => {
    return API.get('/organizations/' + userId, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
};

export const createOrganization = async (organization: Organization | any, token: string | any) => {
    return API.post('/organizations', organization, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
}

export const updateOrg = async (data: any, token: string) => {
    return API.put('/organizations/' + data.id, data, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
}

export const setDefaultOrganization = async (id: number, token: string) => {
    return API.put('/organizations/' + id + '/default', {}, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
}

export const findOrganizationById = async (id: any, token: string) => {
    return API.get('/organizations/' + id, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
}

export const deleteOrganization = async (id: any, token: string) => {
    return API.delete('/organizations/' + id, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
}