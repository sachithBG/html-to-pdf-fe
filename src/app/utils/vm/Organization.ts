export class OrganizationVM {
    id: number;
    name: string;
    is_default: boolean;
    userId: number;
    created_at: string;
    updated_at: string;
    refresh_token: string;
    user_id: number;

    constructor(data: any) {
        this.id = data.id;
        this.name = data.name;
        this.is_default = data.is_default;
        this.userId = data.userId;
        this.created_at = data.created_at;
        this.updated_at = data.updated_at;
        this.refresh_token = data.refresh_token;
        this.user_id = data.user_id;
    }
}