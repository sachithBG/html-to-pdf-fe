import { API } from "./api";

export const generateTokens = async (organizationId: string, token: string) => {
    return API.post(
        `/tokens/generate`,
        {},  // Empty body, no data is being sent
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            params: {
                organizationId: organizationId,  // Pass organizationId as a query parameter
            }
        }
    );
}
