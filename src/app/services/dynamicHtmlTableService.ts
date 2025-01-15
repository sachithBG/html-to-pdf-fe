import { API } from "./api";

export const createPdfTable = async (data: any, token: string) => {
    return API.post(`/dynamic-html-table`, data, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
};

export const getPdfTable = async (id: number, token: string) => {
    return API.get(`/dynamic-html-table/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
};

export const readAllPdfTablePage = async (
    orgId: number,
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
    return API.get(`/dynamic-html-table/page`, {
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

export const updatePdfTable = async (id: string, data: any, token: string) => {
    return API.put(`/dynamic-html-table/${id}`, data, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
};

export const deletePdfTable = async (id: string, token: string) => {
    return API.delete(`/dynamic-html-table/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
};