import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Organization {
    id: number;
    user_id: number;
    name: string;
    refresh_token?: string;
    is_default: boolean;
    logo?: string;
    created_at: string;
    updated_at: string;
}

export interface OrganizationState {
    organizations: Organization[];
}

const initialState: OrganizationState = {
    organizations: [],
};

const organizationSlice = createSlice({
    name: 'organization',
    initialState,
    reducers: {
        addOrganizationAll(state, action: PayloadAction<Organization[]>) {
            state.organizations = [...state.organizations, ...action.payload];
        },
        addOrganization(state, action: PayloadAction<Organization>) {
            state.organizations.push(action.payload);
        },
        updateOrganization(state, action: PayloadAction<Organization>) {
            const index = state.organizations.findIndex(org => org.id === action.payload.id);
            if (index !== -1) {
                state.organizations[index] = action.payload;
            }
        },
        removeOrganization(state, action: PayloadAction<number>) {
            state.organizations = state.organizations.filter(org => org.id !== action.payload);
        },
        clearOrganizationState(state) {
            state.organizations = [];
        }
    },
});

export const { addOrganization, updateOrganization, removeOrganization, addOrganizationAll, clearOrganizationState } = organizationSlice.actions;

export default organizationSlice.reducer;

// Selector to get the default organization
export const getDefaultOrganization = (state: OrganizationState): Organization | null => {
    return state.organizations.find(org => org.is_default) || null;
};