'use client'
import React, { useState, useEffect, useCallback } from 'react';
import { Container, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Paper, Pagination, Box, CircularProgress, FormControl, InputLabel, Select, MenuItem, Skeleton } from '@mui/material';
import { AddBox as AddBoxIcon, Edit as EditIcon, Delete as DeleteIcon, FastRewind as FastRewindIcon } from '@mui/icons-material';
import { useSelector } from 'react-redux';
import { useSession } from 'next-auth/react';
import { getDefaultOrganization, Organization, OrganizationState } from '@/redux/slice/organizationSlice';
import HtmlToPdfEditor from '../editor/page';
import { deletePdfTemplate, readAllPdfTemplatePage } from '@/app/services/pdfService';
import { findAllAddons } from '@/app/services/addonService';

const PdfTemplatePage: React.FC = () => {
    const [templates, setTemplates] = useState<any[]>([]);
    const [editMode, setEditMode] = useState(false);
    const [selectedTemplate, setSelectedTemplate] = useState<any>(null);
    const [currentPage, setCurrentPage] = useState(1); // Track the current page
    const [totalPages, setTotalPages] = useState(1); // Track the total number of pages
    const [pageSize, setPageSize] = useState(5); // Define the number of items per page
    const [total, setTotal] = useState<number>(1);
    const [loading, setLoading] = useState(false);
    const [pageToggle, setPageToggle] = useState(false);
    const [addons_, setAddons_] = useState<any[]>();

    const currentOrg: Organization | any = useSelector((state: { organization: OrganizationState }) =>
        getDefaultOrganization(state.organization)
    );
    const { data: session }: any = useSession();

    const fetchTemplates = async (page: number) => {
        try {
            setLoading(true);
            setTemplates(() => []);

            const response = await readAllPdfTemplatePage(currentOrg?.id, session?.user?.token, {
                sortOrder: 'desc',
                startFrom: (page - 1) * pageSize,
                to: pageSize,
                search: '',
                sortBy: 'name'
            });

            if (response.status === 200) {
                if (response.data?.data) {
                    let d = response.data?.data;
                    setTemplates(d.data); // Assuming response.data contains the templates for the current page
                    setTotalPages((pre) => Math.ceil(d.total / pageSize)); // Calculate total pages
                    setTotal((pre) => d.total);
                }
            }
        } catch (error) {
            console.error("Error fetching templates:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (template: any) => {
        setSelectedTemplate(template);
        setEditMode(true);
    };

    const handleDelete = async (id: number) => {
        try {
            const res = await deletePdfTemplate(id, session?.user?.token);
            if (res.status == 200) {
                setTemplates(templates.filter((template) => template.id !== id));
            }
        } catch (error) {
            console.error(error);
        }

    };

    const handleBack = useCallback((isTrigger: boolean) => {
        // if (isTrigger) {
        setEditMode(false);
        setSelectedTemplate(null);
        // }

        if (currentPage !== undefined && isTrigger) {
            fetchTemplates(currentPage);
        } else {
            console.warn('currentPage is undefined');
        }
    }, [currentPage]);

    // const handleBack2 = useCallback(() => {
    //     setEditMode(false);
    //     setSelectedTemplate(null);
    //     if (currentPage !== undefined) {
    //         fetchTemplates(currentPage);
    //     } else {
    //         console.warn('currentPage is undefined');
    //     }
    // }, [currentPage]);

    // const handleBack_ = useCallback(() => {
    //     setEditMode(false);
    //     setSelectedTemplate(null);
    // }, [currentPage]);

    const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {

        setCurrentPage(value);
        fetchTemplates(value); // Fetch new data based on selected page
    };

    const handlePageSizeChange = (event: any) => {
        setPageSize(() => event.target.value);
        setCurrentPage(() => 1); // Reset to page 1 when page size changes
        setPageToggle(!pageToggle);
    };

    const fetchAddons = async () => {
        try {
            const response = await findAllAddons(currentOrg?.id, session?.user?.token);
            console.log(response.data)
            if (response.status == 200) {
                setAddons_(response.data);
            }
        } catch (error) {
            console.error("Error fetching addons:", error);
        }
    };

    useEffect(() => {
        if (session?.user?.token && currentOrg?.id) {
            fetchTemplates(currentPage);
            fetchAddons()
        }
    }, [pageToggle]);

    useEffect(() => {
        if (session?.user?.token && currentOrg?.id) {
            fetchTemplates(currentPage);
        }
    }, [session?.user?.token, currentOrg?.id]);

    return (
        <Container>
            {/* <Typography variant="h4" gutterBottom>
                PDF Templates
            </Typography> */}
            {!editMode && (
                <>
                    <Button variant="outlined" size="large" sx={{ float: 'right', mb: 2 }} color="primary" onClick={() => setEditMode(true)}>
                        New &nbsp;<AddBoxIcon fontSize="inherit" />
                    </Button>
                    <TableContainer component={Paper} style={{ marginTop: '20px', minHeight: 500 }}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Name</TableCell>
                                    <TableCell>Addons</TableCell>
                                    <TableCell>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {loading ? (
                                    Array.from({ length: 5 }).map((_, index) => (
                                        <TableRow key={index}>
                                            <TableCell colSpan={3}>
                                                <Skeleton variant="rectangular" height={30} />
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : templates.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={3} align="center">
                                            No templates available.
                                        </TableCell>
                                    </TableRow>
                                ) : templates?.map((template, i) => (
                                    <TableRow hover key={`${template.id}-${template.name}-${template.addons}`}>
                                        <TableCell>{template.name}</TableCell>
                                        <TableCell>{template?.addons?.join(', ')}</TableCell>
                                        <TableCell>
                                            <IconButton color="primary" onClick={() => handleEdit(template)}>
                                                <EditIcon />
                                            </IconButton>
                                            <IconButton color="secondary" onClick={() => handleDelete(template.id)}>
                                                <DeleteIcon />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <Box sx={{ mt: 2, display: 'flex', justifyContent: 'end', alignItems: 'center' }}>
                        {/* Page Size Selection */}
                        <FormControl sx={{ minWidth: 120 }}>
                            <InputLabel>Page Size</InputLabel>
                            <Select
                                value={pageSize}
                                label="Page Size"
                                onChange={handlePageSizeChange}
                                size='small'
                            >
                                <MenuItem value={5}>5</MenuItem>
                                <MenuItem value={10}>10</MenuItem>
                                <MenuItem value={25}>25</MenuItem>
                            </Select>
                        </FormControl>
                        <Pagination
                            count={totalPages}
                            page={currentPage}
                            onChange={handlePageChange}
                            sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}

                        />
                        {/* Display total records */}
                        <Typography variant="body1" sx={{ mt: 2 }}>
                            &nbsp;  Total: {total}
                        </Typography>
                    </Box>
                </>
            )}
            {editMode && (
                <>
                    <Button variant="outlined" size="large" color="primary" onClick={() => handleBack(false)}>
                        <FastRewindIcon fontSize="inherit" />&nbsp;Back
                    </Button>
                    <HtmlToPdfEditor addons_={addons_} handleBack={handleBack} id={selectedTemplate ? selectedTemplate?.id : undefined} />
                </>
            )}
        </Container>
    );
};

export default PdfTemplatePage;
