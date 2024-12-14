"use client";
import React, { useEffect, useRef, useState } from 'react';
import { Box, Button, Typography, Modal, CircularProgress } from '@mui/material';

const PdfPreviewButton = ({ htmlContent }: { htmlContent: string | null }) => {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);  // Loading state
    const iframeRef = useRef<HTMLIFrameElement>(null);

    // Open and close modal handlers
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    useEffect(() => {
        if (iframeRef.current && htmlContent) {
            const doc = iframeRef.current.contentDocument;
            if (doc) {
                doc.open();
                doc.write(htmlContent); // Write HTML content to iframe
                doc.close();
            }
        }
    }, [htmlContent]); // Re-render iframe when htmlContent changes

    // Handle loading state based on iframe content
    useEffect(() => {
        if (iframeRef.current && htmlContent) {
            setLoading(true);
            const iframe = iframeRef.current;
            iframe.onload = () => setLoading(false); // Set loading to false once iframe content is loaded
        }
    }, [htmlContent]);

    return (
        <Box>
            {/* Button to open the modal */}
            <Button
                variant="outlined"
                color="primary"
                onClick={handleOpen}
                disabled={!htmlContent} // Disable button if no HTML content
            >
                Preview HTML
            </Button>

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
                    {htmlContent ? (
                        <iframe
                            ref={iframeRef}
                            width="100%"
                            height="100%"
                            title="HTML Preview"
                            style={{ border: 'none' }}
                            srcDoc={htmlContent}
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
