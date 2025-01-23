import * as React from 'react';
import {
    MenuItem,
    MenuList,
    Button,
    Divider,
    ListItemIcon,
    ListItemText,
    Typography,
    Avatar,
    Stack,
} from '@mui/material';
import {
    AccountPreview,
    SignOutButton,
    AccountPopoverFooter,
} from '@toolpad/core/Account';
import AddIcon from '@mui/icons-material/Add';
import { useDispatch, useSelector } from 'react-redux';
import { addOrganizationAll, clearOrganizationState, Organization } from '@/redux/slice/organizationSlice';
import { setDefaultOrganization } from '@/app/services/organizationService';
import { useRouter } from 'next/navigation';
import { RootState } from '@/redux/store';

export default function CustomMenu() {
    const { organizations } = useSelector((state: any) => state.organization);
    const dispatch = useDispatch();
    const router = useRouter();
    const { token } = useSelector((state: RootState) => state.session);
    const setDefault = (orgId: number) => {
        // Implement the setDefault API call here
        // This function should update the default organization
        setDefaultOrganization(orgId, token).then((res: any) => {
            if (res?.status == 200) {
                dispatch(clearOrganizationState());
                dispatch(addOrganizationAll(organizations.map((org: any) => ({ ...org, is_default: org.id === orgId }))));
            }
        }).catch((err: any) => {
            console.error(err);
        });
    };
    return (
        <Stack direction="column">
            <AccountPreview variant="expanded" />
            <Divider />
            <Typography variant="body2" mx={2} mt={1}>
                Organizations
            </Typography>
            <MenuList>
                {organizations?.map((organization: Organization) => (
                    <MenuItem
                        key={organization.id}
                        component="button"
                        sx={{
                            justifyContent: 'flex-start',
                            width: '100%',
                            columnGap: 2,
                        }}
                        onClick={() => setDefault(organization.id)}
                    >
                        <ListItemIcon>
                            <Avatar
                                sx={{
                                    width: 32,
                                    height: 32,
                                    fontSize: '0.95rem',
                                    bgcolor: '#8B4513',
                                }}
                                src={organization.logo ?? ''}
                                alt={organization.name ?? ''}
                            >
                                {organization.name[0]}
                            </Avatar>
                        </ListItemIcon>
                        <ListItemText
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'flex-start',
                                width: '100%',
                            }}
                            primary={organization.name}
                            secondary={organization.is_default ? 'Active' : ''}
                            slotProps={{ 'primary': { variant: 'body2' }, 'secondary': { variant: 'caption' } }}
                        />
                    </MenuItem>
                ))}
                <Divider />
                <Button
                    variant="text"
                    sx={{ textTransform: 'capitalize', display: 'flex', mx: 'auto' }}
                    size="small"
                    startIcon={<AddIcon />}
                    disableElevation
                    onClick={() => router.push('/organization')}
                >
                    Add new
                </Button>
            </MenuList>
            <Divider />
            <AccountPopoverFooter>
                <SignOutButton />
            </AccountPopoverFooter>
        </Stack>
    );
}
