'use client'
import React, { useState, useEffect, useCallback, SyntheticEvent } from 'react';
import {
    Box,
    Tab,
    Tabs,
    Typography,
    Paper,
    Skeleton,
    TextField,
    MenuItem,
    Select,
    FormControl,
    InputLabel,
    Alert,
    IconButton,
    Tooltip,
    Pagination,
    Button
} from '@mui/material';
import { TabContext, TabPanel } from '@mui/lab';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import EditIcon from '@mui/icons-material/Edit';
import { useSelector } from 'react-redux';
import { useSession } from 'next-auth/react';
import { findAllAddons } from '@/app/services/addonService';
import { getDefaultOrganization, Organization, OrganizationState } from '@/redux/slice/organizationSlice';
import { createPdfTable, deletePdfTable, getPdfTable, readAllPdfTablePage, updatePdfTable } from '@/app/services/dynamicHtmlTableService';
import { initialTableData } from '@/app/utils/constant';
import { AddBox as AddBoxIcon } from '@mui/icons-material';
import { useSnackbar } from 'notistack';
import dynamic from 'next/dynamic';
import DeleteConfirmDialog from '../components/DeleteConfirmDialog';
const TableManagePage = dynamic(() => import('../components/TableManagePage'), { ssr: false });

const PdfTableManager = () => {
    const [tabValue, setTabValue] = useState('1');
    const [isLoading, setIsLoading] = useState(false);
    const [addons, setAddons] = useState([]);
    const [tag, setTag] = useState<any>({ id: null, name: '', field_path: '' });
    const [tables, setTables] = useState([]);
    // const [pdfTable, setPdfTable] = useState({});
    const [selectedAddon, setSelectedAddon] = useState<any[]>([]);
    const [name, setName] = useState('');
    // const [tableTag, setTableTag] = useState('');
    const [error, setError] = useState('');
    // const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [currentTable, setCurrentTable] = useState<any>({
        custom_html: initialTableData.customHtml, table_rows: initialTableData.initialRows,
        cell_styles: initialTableData.initialStyles, num_columns: initialTableData.initialColumns
    });
    const [totalPages, setTotalPages] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 10; // Adjust the page size as needed
    const { enqueueSnackbar } = useSnackbar();

    const currentOrg: Organization | any = useSelector((state: { organization: OrganizationState }) =>
        getDefaultOrganization(state.organization)
    );
    const { data: session }: any = useSession();

    // Fetch tables with pagination
    const fetchTables = useCallback(async (orgId: number, page: number, token: string) => {
        if (!orgId) return;
        setIsLoading(true);
        try {
            // Replace with your API call to fetch tables for the page
            const response = await readAllPdfTablePage(orgId, token, {
                sortOrder: 'desc',
                startFrom: (page - 1) * pageSize,
                to: pageSize,
                search: '',
                sortBy: 'name'
            });
            const data = response.data?.data;
            setTables(data?.data); // Assuming response contains paginated table data
            setTotalPages(Math.ceil(data?.total / pageSize)); // Calculate total pages for pagination
        } catch (error) {
            console.error('Error fetching tables:', error);
        } finally {
            setIsLoading(false);
        }
    }, [currentPage, currentOrg?.id]);

    const fetchTable = useCallback(async (id: number) => {
        setIsLoading(true);
        try {
            // Replace with your API call to fetch tables for the page
            const response = await getPdfTable(id, session?.user?.token);
            if (response.status == 200) {
                setCurrentTable(() => response.data);
                let tg = response.data?.tag;
                if (tg) tg = { ...tg, field_path: tg.field_path.replace('._table_', '') }
                setTag(() => tg || { id: null, name: '', field_path: '' });
                setSelectedAddon(response.data?.addon_ids || []);
                setName(response.data?.name)
            }
        } catch (error) {
            console.error('Error fetching tables:', error);
        } finally {
            setIsLoading(false);
        }
    }, [session?.user?.token]);

    const fetchAddons = useCallback(async (orgId: number, token: string) => {
        // alert(token)
        if (orgId) {
            try {
                const response = await findAllAddons(orgId, token);
                // console.log(response.data)
                if (response.status == 200) {
                    setAddons(() => response.data);
                    setSelectedAddon([]);
                }
            } catch (error) {
                console.error("Error fetching addons:", error);
            }
        }
    }, [currentOrg?.id]);

    useEffect(() => {
        setIsLoading(true);
        const tout = setTimeout(() => {
            if (currentOrg?.id) {
                fetchAddons(currentOrg.id, session?.user?.token);
                fetchTables(currentOrg.id, currentPage, session?.user?.token);
            } else {
                setIsLoading(false);
            }
        }, 1000);
        return () => {
            clearTimeout(tout)
        }
    }, [currentOrg?.id]);

    // Handle tab change
    const handleTabChange = (event: SyntheticEvent, newValue: string) => {
        setTabValue(newValue);
    };

    // Handle edit
    const handleEdit = (table: any) => {
        fetchTable(table.id);
        setTabValue("2");
        // setCurrentTable(table);
        // setSelectedAddon(table.addonId);
        // setTableKey(table.key);
        // setIsEditDialogOpen(true);
    };

    // Handle new
    const handleNew = () => {
        console.log('e')
        setCurrentTable(() => {
            return {
                custom_html: initialTableData.customHtml, table_rows: initialTableData.initialRows,
                cell_styles: initialTableData.initialStyles, num_columns: initialTableData.initialColumns
            }
        });
        setTag(() => { return { id: null, name: '', field_path: '' } });
        setSelectedAddon([]);
        setName('')
        setTabValue("2");
        // setCurrentTable(table);
        // setSelectedAddon(table.addonId);
        // setTableKey(table.key);
        // setIsEditDialogOpen(true);
    };

    // Handle delete
    const handleDelete = async (id: string) => {
        try {
            await deletePdfTable(id, session?.user?.token);
            fetchTables(currentOrg.id, currentPage, session?.user?.token); // Refresh the table list after deletion
            enqueueSnackbar('Table deleted successfully.', { variant: 'success' });
            // setSnackbarOpen(true);
        } catch (error) {
            console.error('Error deleting table:', error);
            enqueueSnackbar('Error deleting table', { variant: 'error' });
        }
    };

    // Handle form submission
    const handleSubmit = useCallback(async (tableData: any) => {
        console.log(name)
        if (!selectedAddon || !name || !tag.field_path) {
            setError('All fields are required.');
            enqueueSnackbar('All fields are required.', { variant: 'error' })
            return;
        }
        try {
            const payload = {
                ...tableData, name: name, organization_id: currentOrg?.id, addon_ids: selectedAddon,
                tag_id: tag.id, tag: tag
            };
            if (currentTable.id) {
                // Update table
                const res = await updatePdfTable(currentTable.id, payload, session?.user?.token);
                if (res.status == 200) {
                    setCurrentTable(res.data);
                    setTag(res.data?.tag || { id: null, name: '', field_path: '' })
                }
            } else {
                // Create table
                const res = await createPdfTable(payload, session?.user?.token);
                if (res.status == 201) {
                    setCurrentTable(res.data);
                    setTag(res.data?.tag || { id: null, name: '', field_path: '' })
                }
            }

            // setIsEditDialogOpen(false);
            fetchTables(currentOrg.id, currentPage, session?.user?.token);
            enqueueSnackbar(currentTable ? 'Table updated successfully.' : 'Table created successfully.', { variant: 'success' });
        } catch (error: any) {
            setError('Error saving table: ' + error?.response?.data?.error || error);
            enqueueSnackbar('Error saving table: ' + error?.response?.data?.error || error, { variant: 'error' });
            console.error('Error saving table:', error?.response?.data?.error || error);
        } finally {
        }
    }, [name, selectedAddon, tag.field_path, tag.id, currentTable.id]);

    // Handle page change
    const handlePageChange = (event: any, newPage: number) => {
        setCurrentPage(newPage);
    };

    // Cleanup when the component unmounts
    useEffect(() => {
        return () => {
            setTables([]); // Reset tables on component unmount
            setAddons([]);
            setTag({ id: null, name: '', field_path: '' });
            setSelectedAddon([]);
            // setTableKey('');
            setError('');
        };
    }, []);

    return (
        <Box sx={{ width: '100%' }}>
            <TabContext value={tabValue}>
                {tabValue =='1'  && <Button sx={{ mx: 3, mt: 1, float: 'right' }} size='small' variant="outlined" onClick={handleNew}>
                    New &nbsp;<AddBoxIcon fontSize="inherit" />
                </Button>}
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs value={tabValue} onChange={handleTabChange}>
                        <Tab label="List PDF Tables" value="1" />
                        <Tab label="New / Edit Table" value="2" />
                    </Tabs>
                </Box>
                <TabPanel value="1">
                    {isLoading ? (
                        <Skeleton variant="rectangular" width="100%" height={200} />
                    ) : (
                        <Paper>
                            {tables.map((table: any) => (
                                <Box key={table.id} sx={{ display: 'flex', justifyContent: 'space-between', p: 2 }}>
                                    <Typography>{table.name}</Typography>
                                    <Box>
                                        <Tooltip title="Copy Key">
                                            <IconButton onClick={() => navigator.clipboard.writeText('{{' + table.field_path + '}}')}>
                                                <ContentCopyIcon />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Edit">
                                            <IconButton onClick={() => handleEdit(table)}>
                                                <EditIcon />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Delete">
                                            <DeleteConfirmDialog
                                                id={table.id}
                                                onDelete={(id: any) => handleDelete(id)}
                                                variant="icon"
                                                buttonProps={{ size: "small", color: "error" }}
                                                iconType="delete"
                                            />
                                            {/* <IconButton onClick={() => handleDelete(table.id)}>
                                                <DeleteIcon />
                                            </IconButton> */}
                                        </Tooltip>
                                    </Box>
                                </Box>
                            ))}
                        </Paper>
                    )}
                    <Pagination
                        count={totalPages}
                        page={currentPage}
                        onChange={handlePageChange}
                        sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}
                    />
                </TabPanel>
                <TabPanel value="2">
                    {/* <Button sx={{ my: 5, float: 'right' }} size='small' variant="contained" onClick={()=> handleSubmit()}>
                        {currentTable ? 'Update Table' : 'Create Table'}
                    </Button> */}
                    <TextField
                        label="Name"
                        value={name}
                        onChange={(e) => { setName(() => e.target.value); setError(''); }}
                        fullWidth
                        sx={{ mb: 2 }}
                        size="small"
                    />
                    <FormControl fullWidth sx={{ my: 2 }} size='small'>
                        <InputLabel id="select-label-addon">Addon</InputLabel>
                        <Select
                            value={selectedAddon}
                            multiple
                            onChange={(e: any) => { setSelectedAddon(() => e.target.value); setError(''); }}
                            // displayEmpty
                            label="Addon"
                            labelId="select-label-addon"
                            id="demo-simple-select"
                            size="small"
                        >
                            {addons.map((addon: any) => (
                                <MenuItem key={addon.id} value={addon.id}>
                                    {addon.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    {/* <FormControl fullWidth sx={{ mb: 2 }}>
                        <InputLabel>Type/Status</InputLabel>
                        <Select
                            value={typeStatus}
                            onChange={(e) => setTypeStatus(e.target.value)}
                            // displayEmpty
                            disabled={!selectedAddon}
                            label="Type/Status"
                        >
                            {types.map((type: any) => (
                                <MenuItem key={type.id} value={type.id}>
                                    {type.key_value}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl> */}

                    <TextField
                        label="Key | json path"
                        value={tag.field_path?.split('._table_')[0] || ''}
                        onChange={(e) => setTag((prev: any) => { setError(''); return { ...prev, field_path: e.target.value } })}
                        fullWidth
                        sx={{ mb: 2 }}
                        size="small"
                    />
                    {error && <Alert severity="error">{error}</Alert>}
                    <TableManagePage id={currentTable?.id} fetchTable={fetchTable}
                        handleSubmit={handleSubmit} currentTable={currentTable} />

                </TabPanel>
            </TabContext>
        </Box>
    );
};

export default PdfTableManager;
