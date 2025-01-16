"use client";
import React, { useEffect, useRef, useState } from 'react';
import { Box, Button, Typography, Modal, ToggleButton, ToggleButtonGroup, Skeleton } from '@mui/material';
import { generatePdfBufferById, readPdfTemplate } from '../services/pdfService';
import { useSession } from 'next-auth/react';
import LaunchIcon from '@mui/icons-material/Launch';

const PdfPreviewButton = ({ htmlContent, isIconButton, id, organization_id }:
    { htmlContent: string | null, isIconButton: boolean, id: number | null, organization_id: number }) => {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);  // Loading state
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const [htmlCntnt, setHtmlCntnt] = useState(htmlContent);
    const [pdfUrl, setPdfUrl] = useState("");
    const [previewMode, setPreviewMode] = useState("withoutData");
    const [dataLoaded, setDataLoaded] = useState(false);
    const [dataError, setDataError] = useState('');


    const { data: session }: any = useSession();
    // Open and close modal handlers
    const handleOpen = () => setOpen(true);
    const handleClose = () => {
        setOpen(false);
        setTimeout(() => URL.revokeObjectURL(pdfUrl), 0);
        setDataLoaded(false);
        setPreviewMode('withoutData');
        setDataError('')
        setLoading(false)
    };

    const handleToggle = (event: any, newMode: any) => {
        setPreviewMode((prev) => newMode !== prev ? newMode : prev);
        if (!id) setHtmlCntnt(htmlContent);
        // console.log(htmlContent)
    };

    const handleOpenById = async () => {
        if (id) {
            setLoading(true)
            try {
                const response = await generatePdfBufferById(id, organization_id, session?.user?.token);
                if (response.status == 200) {
                    const { pdf } = response.data;
                    const blobUrl = await openPdfInDialog(pdf);
                    if (blobUrl) {
                        setPdfUrl(blobUrl);
                        if (!open) setOpen(true);
                    }
                }
                setLoading(false)
            } catch (e) {
                console.log(e);
                setDataError('PDF generation failed. Please try again later.')
                setLoading(false)
            }
        }
    }

    const openPdfInDialog = (pdfData: any) => {
        try {
            const binaryPdf = atob(pdfData);
            // Convert the binary string into an ArrayBuffer
            const len = binaryPdf.length;
            const buffer = new Uint8Array(len);
            for (let i = 0; i < len; i++) {
                buffer[i] = binaryPdf.charCodeAt(i);
            }
            const blob = new Blob([buffer], { type: "application/pdf" });
            const blobUrl = URL.createObjectURL(blob);
            return blobUrl; // Return blob URL to render in Dialog
        } catch (error) {
            console.error("Error preparing PDF for preview:", error);
            return null;
        }
    };


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
            // setLoading(true);
            const iframe = iframeRef.current;
            iframe.onload = () => setLoading(false); // Set loading to false once iframe content is loaded
        }
    }, [htmlCntnt, previewMode]);

    useEffect(() => {
        if (previewMode != 'withoutData' && !dataLoaded) {
            handleOpenById();
            setDataLoaded(true);
        }

    }, [previewMode]);
    // useEffect(() => {
    //     return () => {
    //         setDataLoaded(false);
    //         setPreviewMode('withoutData');
    //         setDataError('')
    //     }
    // }, []);
    return (
        <Box>
            {/* Button to open the modal */}
            {isIconButton ? <LaunchIcon onClick={handleOpenWithData} sx={{ cursor: 'pointer' }} /> : <Button
                variant="outlined"
                color="primary"
                onClick={handleOpen}
                disabled={!htmlCntnt} // Disable button if no HTML content
                size='small'
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
                        pb: 15,
                        overflow: 'hidden',
                    }}
                >
                    <Box sx={{ display: 'flex' }}>
                        <Typography
                            id="pdf-preview-title"
                            variant="h5"
                            component="h2"
                            gutterBottom
                        >
                            HTML Preview
                        </Typography>
                        {id && <ToggleButtonGroup
                            value={previewMode}
                            exclusive
                            onChange={handleToggle}
                            aria-label="preview mode"
                            sx={{
                                ml: 2, mt: .6,
                                "& .MuiToggleButton-root": {
                                    borderRadius: "2px",
                                    width: 125,
                                    height: 25,
                                },
                            }}
                        >
                            <ToggleButton size='small' id='withoutData' value="withoutData" aria-label="Preview without Data">
                                Without Data
                            </ToggleButton>
                            <ToggleButton size='small' id='withData' value="withData" aria-label="Preview with Data">
                                With Data
                            </ToggleButton>
                        </ToggleButtonGroup>}
                    </Box>
                    {/* Show loading state while iframe is loading */}
                    {loading && (
                        <Box
                            display="flex"
                            justifyContent="center"
                            alignItems="center"
                            height="100%"
                            // position="absolute"
                            top={0}
                            left={0}
                            width="100%"
                            zIndex={1}
                        // bgcolor="white"
                        >
                            <Skeleton variant="rectangular" width="90%" height="90%" />
                        </Box>
                    )}
                    {previewMode != 'withoutData' && !loading && pdfUrl && (
                        <iframe
                            src={pdfUrl}
                            title="PDF Preview"
                            width="100%"
                            height="100%"
                            style={{ border: 'none' }}
                        // frameBorder="0"
                        />
                    )}
                    {previewMode != 'withoutData' && dataError && !loading && <Typography
                        id="pdf-preview-description"
                        color="error"
                        align="center"
                        variant="h6"
                    >
                        {dataError}
                    </Typography>

                    }
                    {/* {htmlContent} */}
                    {/* PDF iframe */}
                    {htmlCntnt ? (
                        <Box sx={{
                            opacity: previewMode == 'withoutData' ? 1 : 0, height: '100%', width: '100%',
                            position: previewMode == 'withoutData' ? 'relative' : 'absolute', mt: previewMode == 'withoutData' ? 0 : 1500
                        }}>
                            <iframe
                                ref={iframeRef}
                                width="100%"
                                height="100%"
                                title="HTML Preview"
                                style={{ border: 'none' }}
                                srcDoc={htmlCntnt}
                            // src=''
                            />
                        </Box>
                    ) : (
                        <Typography
                            id="pdf-preview-description"
                            color="error"
                            align="center"
                            variant="h6"
                        >
                            {previewMode == 'withoutData' && !loading ? 'No HTML content available.' : ''}
                        </Typography>
                    )}

                    {/* Close button */}
                    <Button
                        variant="outlined"
                        color="info"
                        onClick={handleClose}
                        sx={{ mt: 2, float: 'right' }}
                        size='small'
                    >
                        Close
                    </Button>
                </Box>
            </Modal>
        </Box>
    );
};

export default PdfPreviewButton;
