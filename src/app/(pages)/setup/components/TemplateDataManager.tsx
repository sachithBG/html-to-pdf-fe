import React, { useState, useEffect } from 'react';
import {
    Box,
    List,
    ListItem,
    ListItemText,
    Skeleton,
    Pagination,
} from '@mui/material';
import { readAllPdfTemplatePage } from '@/app/services/pdfService';
import { getDefaultOrganization, Organization, OrganizationState } from '@/redux/slice/organizationSlice';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import dynamic from 'next/dynamic';
const DataUploadButton = dynamic(() => import('@/app/(pages)/setup/components/DataUploadButton'), { ssr: false });

interface Template {
    id: string;
    name: string;
    json: string;
}

const TemplateDataManager: React.FC = (id) => {
    const [templates, setTemplates] = useState<Template[]>([]);
    const [isLoading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const currentOrg: Organization | any = useSelector((state: { organization: OrganizationState }) =>
        getDefaultOrganization(state.organization)
    );
    const { token } = useSelector((state: RootState) => state.session);

    const pageSize = 10;

    const fetchTemplates = async (page: number) => {
        try {
            setLoading(true);
            setTemplates([]);

            const response = await readAllPdfTemplatePage(currentOrg?.id, token, {
                sortOrder: 'desc',
                startFrom: (page - 1) * pageSize,
                to: pageSize,
                search: '',
                sortBy: 'name'
            });
            if (response.status === 200) {
                if (response.data?.data) {
                    const d = response.data?.data;
                    setTemplates(d.data);
                    setTotalPages(Math.ceil(d.total / pageSize));
                }
            }
        } catch (error) {
            console.error('Error fetching templates:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTemplates(page);
    }, [page]);

    const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
        setPage(value);
    };

    const handleSaveData = (data: string) => {
        console.log('Uploaded JSON Data:', data);
        console.log('Uploaded JSON Data:', id);
        // Add logic to handle saved data
        // updateDummyDataPdfTemplate
    };

    return (
        <Box>
            {isLoading ? (
                <Skeleton variant="rectangular" width="100%" height={300} />
            ) : (
                <>
                    <List>
                        {templates.map((template) => (
                            <ListItem key={template.id} sx={{ borderBottom: '1px solid #e0e0e0' }}>
                                <ListItemText primary={template.name} />
                                <DataUploadButton onSave={handleSaveData} id={Number(template.id)} />
                            </ListItem>
                        ))}
                    </List>
                    <Pagination
                        count={totalPages}
                        page={page}
                        onChange={handlePageChange}
                        sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}
                    />
                </>
            )}
        </Box>
    );
};

export default TemplateDataManager;