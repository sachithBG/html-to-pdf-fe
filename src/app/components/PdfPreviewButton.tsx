"use client";
import React, { useEffect, useRef, useState } from 'react';
import { Box, Button, Typography, Modal, CircularProgress } from '@mui/material';
import OpenWithIcon from '@mui/icons-material/OpenWith';
import { readPdfTemplate } from '../services/pdfService';
import { useSession } from 'next-auth/react';
import AspectRatioIcon from '@mui/icons-material/AspectRatio';
import LaunchIcon from '@mui/icons-material/Launch';

const PdfPreviewButton = ({ htmlContent, isIconButton, id }: { htmlContent: string | null, isIconButton: boolean, id: number | null }) => {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);  // Loading state
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const [htmlCntnt, setHtmlCntnt] = useState(htmlContent);

    const { data: session }: any = useSession();
    // Open and close modal handlers
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const handleOpenWithData = () => {
        if (id) {
            setLoading(true)
            const fetchData = async () => {
                try {
                    let response = await readPdfTemplate(id, session?.user?.token);
                    if (response.status == 200) {
                        response = response.data;
                        setHtmlCntnt(`<html>
                                        <div>${response.data.headerContent}</div>
                                        <body>
                                        <div>${response.data.bodyContent}</div>
                                        </body>
                                        <footer>${response.data.footerContent}</footer>
                                    </html>
                                    `);
                        setOpen(true)
                    }

                } catch (error) {
                    console.error("Error fetching data for edit mode:", error);
                } finally {
                    setLoading(false);
                }
            };
            fetchData();
        }
    };

    useEffect(() => {
        if (iframeRef.current && htmlCntnt) {
            const doc = iframeRef.current.contentDocument;
            if (doc) {
                doc.open();
                doc.write(htmlCntnt); // Write HTML content to iframe
                doc.close();
            }
        }
    }, [htmlCntnt]); // Re-render iframe when htmlContent changes

    // Handle loading state based on iframe content
    useEffect(() => {
        if (iframeRef.current && htmlCntnt) {
            setLoading(true);
            const iframe = iframeRef.current;
            iframe.onload = () => setLoading(false); // Set loading to false once iframe content is loaded
        }
    }, [htmlCntnt]);

    return (
        <Box>
            {/* Button to open the modal */}
            {isIconButton ? <LaunchIcon onClick={handleOpenWithData} sx={{ cursor: 'pointer' }} /> : <Button
                variant="outlined"
                color="primary"
                onClick={handleOpen}
                disabled={!htmlCntnt} // Disable button if no HTML content
            >
                Preview HTML
            </Button>}

            {/* Modal for preview */}
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="pdf-preview-title"
                aria-describedby="pdf-preview-description"
            >
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: '80%',
                        height: '80%',
                        bgcolor: 'background.paper',
                        border: '2px solid #000',
                        boxShadow: 24,
                        p: 4,
                        pb: 20,
                        overflow: 'hidden',
                    }}
                >
                    <Typography
                        id="pdf-preview-title"
                        variant="h5"
                        component="h2"
                        gutterBottom
                    >
                        HTML Preview
                    </Typography>

                    {/* Show loading state while iframe is loading */}
                    {loading && (
                        <Box display="flex" justifyContent="center" alignItems="center" height="100%">
                            <CircularProgress />
                        </Box>
                    )}

                    {/* PDF iframe */}
                    {htmlCntnt ? (
                        <iframe
                            ref={iframeRef}
                            width="100%"
                            height="100%"
                            title="HTML Preview"
                            style={{ border: 'none' }}
                            srcDoc={htmlCntnt}
                        // src=''
                        />
                    ) : (
                        <Typography
                            id="pdf-preview-description"
                            color="error"
                            align="center"
                            variant="h6"
                        >
                            No HTML content available.
                        </Typography>
                    )}

                    {/* Close button */}
                    <Button
                        variant="contained"
                        color="secondary"
                        onClick={handleClose}
                        sx={{ mt: 2 }}
                    >
                        Close
                    </Button>
                </Box>
            </Modal>
        </Box>
    );
};

export default PdfPreviewButton;
