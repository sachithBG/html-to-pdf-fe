import { API } from "./api";

export const createPdfTemplate = async (data: any, token: string) => {
    return API.post('/pdf-templates/resource', data, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
}

export const generatePdfBuffer = async (data: any, token: string) => {
    return API.post('/pdf-templates/convert', data, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
}

export const readPdfTemplate = async (id: number, token: string) => {
    return API.get(`/pdf-templates/resource/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
}

export const readAllPdfTemplatePage = async (
    orgId: string,
    token: string,
    {
        sortOrder = 'asc',   // Default value for sortOrder
        startFrom = 0,      // Default value for startFrom (pagination)
        to = 10,            // Default value for to (pagination)
        sortBy = 'name',    // Default value for sortBy
        addonsFilter = '',  // Default value for addonsFilter
        search = '',        // Default value for search filter
    } = {} // Default empty object if no parameters are passed
) => {
    return API.get(`/pdf-templates/template/page`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
        params: {
            sortOrder,   // sorting order, default is 'asc'
            startFrom,   // starting index, default is 0
            to,          // number of items to return, default is 10
            sortBy,      // field to sort by, default is 'name'
            addonsFilter, // any additional filter, default is empty string
            search,      // search filter, default is empty string
            organization_id: orgId
        },
    });
};


export const updatePdfTemplate = async (id: number, data: any, token: string) => {
    return API.put(`/pdf-templates/resource/${id}`, data, {
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
        }
    });
}

export const updateDummyDataPdfTemplate = async (id: number, data: any, token: string) => {
    return API.put(`/pdf-templates/resource/dummy-data/${id}`, { json: data }, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
}

export const deletePdfTemplate = async (id: number, token: string) => {
    return API.delete(`/pdf-templates/resource/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
}