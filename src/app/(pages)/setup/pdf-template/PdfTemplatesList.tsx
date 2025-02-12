import { useState, useEffect, useMemo } from 'react';
import { Card, Typography, Pagination, TextField, Skeleton, Grid2, Box } from '@mui/material';
import { motion } from 'framer-motion';
import { debounce } from 'lodash'; // Lodash debounce for efficient search
import { fadeIn } from '@/app/utils/constant';
import dynamic from 'next/dynamic';
import CopyIconButton from '@/app/components/CopyIconButton';
const PdfPreviewButton = dynamic(() => import('@/app/components/PdfPreviewButton'), { ssr: false });

const PdfTemplatesList = ({ currentOrg, token, readAllPdfTemplatePage }: any) => {
    const [page, setPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [pdfTemplates, setPdfTemplates] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [totalPages, setTotalPages] = useState(0);

    const pageSize = 5;

    // Optimized search function with debouncing
    const debouncedSearch = useMemo(
        () =>
            debounce(async (search: any) => {
                setIsLoading(true);
                try {
                    const response = await readAllPdfTemplatePage(currentOrg?.id, token, {
                        sortOrder: 'desc',
                        startFrom: 0,  // Reset to first page for new search
                        to: pageSize,
                        search: search,
                        sortBy: 'name',
                    });

                    if (response.status === 200 && response.data?.data) {
                        const d = response.data?.data;
                        setPdfTemplates(d.data);
                        setTotalPages(Math.ceil(d.count / pageSize)); // Assuming 'totalCount' is in the response
                    }
                } catch (error) {
                    console.error('Error fetching PDF templates:', error);
                } finally {
                    setIsLoading(false);
                }
            }, 500), // debounce delay of 500ms
        [currentOrg?.id, token] // Recreate debounce function when org or session changes
    );

    // Handle page change
    const handleChangePage = (event: any, value: any) => {
        setPage(value);
    };

    // Handle search input change and trigger debounced search
    const handleSearch = (event: any) => {
        setSearchTerm(event.target.value);
        debouncedSearch(event.target.value);
    };

    // Fetch templates data when page or search term changes
    useEffect(() => {
        const fetchPdfTemplates = async () => {
            if (searchTerm) return;  // Don't fetch data if search term is applied
            setIsLoading(true);
            try {
                const response = await readAllPdfTemplatePage(currentOrg?.id, token, {
                    sortOrder: 'desc',
                    startFrom: (page - 1) * pageSize,
                    to: pageSize,
                    search: searchTerm,
                    sortBy: 'name',
                });

                if (response.status === 200 && response.data?.data) {
                    const d = response.data?.data;
                    setPdfTemplates(d.data);
                    setTotalPages(Math.ceil(d.count / pageSize));
                }
            } catch (error) {
                console.error('Error fetching PDF templates:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchPdfTemplates();
    }, [page, searchTerm, currentOrg?.id, token]);

    return (
        <Grid2 container spacing={3}>
            {/* PDF Templates Section */}
            <Grid2 size={{ xs: 12, sm: 12, md: 12 }}>
                <motion.div initial="hidden" animate="visible" variants={fadeIn} transition={{ duration: 0.5, delay: 0.3 }}>
                    <Card sx={{ p: 3 }}>
                        <Typography variant="h6">PDF Templates</Typography>

                        {/* Search Input */}
                        <TextField
                            label="Search Templates"
                            variant="outlined"
                            // placeholder='Search Templates'
                            fullWidth
                            value={searchTerm}
                            onChange={handleSearch}
                            sx={{ mb: 2, mt: 2 }}
                            size='small'
                        />

                        {/* Loading Skeleton */}
                        {isLoading ? (
                            [...Array(pageSize)].map((_, i) => (
                                <Skeleton key={i} height={40} sx={{ mb: 1 }} />
                            ))
                        ) : (
                            <>
                                {/* Table with Template List */}
                                <Box className="space-y-2">
                                    {pdfTemplates?.map((template: any, i) => (
                                        <Box key={i} className="flex justify-between items-center py-2">
                                            <Box className="flex-1" sx={{ display: 'flex' }}>{template.name}
                                                <Grid2 ml={2}>
                                                    <PdfPreviewButton htmlContent={
                                                        `<div className="ck ck-editor__main" style="height: max-content; width: 100%;">
                                                            <div class="ck ck-content" style="position: absolute;height: max-content; width: 100%;">
                                                                <!-- Header -->
                                                                <div style="position: absolute; top: 0; left: 0; right: 0; margin-left: ${template?.margin?.l}px; margin-right: ${template?.margin?.r}px;">
                                                                ${template.headerContent?.replace(/^<h1>&nbsp;<\/h1>/, '')}
                                                                </div>

                                                                <!-- Body Content -->
                                                                <div style="position: relative; margin: ${template?.margin?.t}px ${template?.margin?.r}px ${template?.margin?.b}px ${template?.margin?.l}px;">
                                                                ${template.bodyContent?.replace(/^<h1>&nbsp;<\/h1>/, '')}
                                                                ${template.sections ? template.sections.map((se: any) => se.htmlContent?.replace(/^<h1>&nbsp;<\/h1>/, '')).join('') : ''}
                                                                </div>

                                                                <!-- Footer -->
                                                                <footer style="position: absolute; bottom: 0; left: 0; right: 0;margin-bottom:10px; margin-left: ${template?.margin?.l}px; margin-right: ${template?.margin?.r}px;">
                                                                ${template.footerContent?.replace(/^<h1>&nbsp;<\/h1>/, '')}
                                                                </footer>
                                                            </div>
                                                        </div>
                                                        `} isIconButton={true}
                                                        id={template.id} organization_id={currentOrg?.id} subcategories={[template.subcategories]} />
                                                </Grid2>
                                                <Box mt={-.51} ml={1}>
                                                    <CopyIconButton
                                                        textToCopy={template?.external_key}
                                                        tooltipCopy={"Copy Key: " + template?.external_key}
                                                        tooltipCopied="Copied!"
                                                        size="small"
                                                        color="info"
                                                    />
                                                </Box>
                                            </Box>
                                            <Typography className="text-gray-500">{new Date(template.modified_at).toLocaleDateString()}</Typography>
                                            {/* <IconButton
                                                onClick={() => window.location.href = `/templates/${template.id}`} // Navigate to template view
                                                aria-label="view"
                                            >
                                                <ArrowForwardIcon />
                                            </IconButton> */}
                                        </Box>
                                    ))}
                                </Box>

                                {/* Pagination */}
                                <Pagination
                                    count={totalPages}
                                    page={page}
                                    onChange={handleChangePage}
                                    color="primary"
                                    sx={{ mt: 2 }}
                                />
                            </>
                        )}
                    </Card>
                </motion.div>
            </Grid2>
        </Grid2>
    );
};

export default PdfTemplatesList;
