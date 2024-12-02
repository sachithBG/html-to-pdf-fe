import React, { useState } from 'react';
import { Box, Button, Typography, Modal } from '@mui/material';

const PdfPreviewButton = ({ pdfData }: { pdfData: Buffer | null }) => {
    const [open, setOpen] = useState(false);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    return (
        <Box>
            {/* Button to open the modal */}
            <Button
                variant="outlined"
                color="primary"
                onClick={handleOpen}
                disabled={!pdfData} // Disable button if no PDF data
            >
                Preview PDF
            </Button>

            {/* Modal for PDF preview */}
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
                        PDF Preview
                    </Typography>

                    {/* PDF iframe */}
                    {pdfData ? (
                        <iframe
                            src={`data:application/pdf;base64,${pdfData}`}
                            width="100%"
                            height="100%"
                            title="PDF Preview"
                            style={{ border: 'none' }}
                        />
                    ) : (
                        <Typography
                            id="pdf-preview-description"
                            color="error"
                        >
                            No PDF data available.
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
