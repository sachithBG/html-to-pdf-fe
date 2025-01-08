import { API } from "./api";


export const chartMonthlyData = async (organization_id: number, token: string) => {
    return API.get(`/logs/chart-data/monthly?organizationId=${organization_id}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
}