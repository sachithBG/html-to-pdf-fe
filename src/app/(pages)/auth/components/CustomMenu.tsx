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
import { OrganizationVM } from '@/app/utils/vm/Organization';
import { setDefaultOrganization } from '@/app/services/organizationService';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

// const accounts = [
//     {
//         id: 1,
//         name: 'Bharat Kashyap',
//         email: 'bharatkashyap@outlook.com',
//         image: 'https://avatars.githubusercontent.com/u/19550456',
//     },
//     {
//         id: 2,
//         name: 'Bharat MUI',
//         email: 'bharat@mui.com',
//         color: '#8B4513', // Brown color
//     },
// ];

export default function CustomMenu() {
    const { organizations } = useSelector((state: any) => state.organization);
    const dispatch = useDispatch();
    const router = useRouter();
    const { data: session }: any = useSession();
    const setDefault = (orgId: number) => {
        // Implement the setDefault API call here
        // This function should update the default organization
        setDefaultOrganization(orgId, session?.user?.token).then((res: any) => {
            if (res?.status == 200) {
                let updatedOrgs = organizations.map((org: any) => ({ ...org, is_default: org.id === orgId }));

                dispatch(clearOrganizationState());
                dispatch(addOrganizationAll(updatedOrgs));
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
