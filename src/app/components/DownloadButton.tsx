"use client";
import { Button } from '@mui/material';
import React from 'react';

interface DownloadButtonProps {
    pdfData: string | null; // Base64 string of the PDF data
}

const DownloadButton: React.FC<DownloadButtonProps> = ({ pdfData }) => {
    const handleDownload = () => {
        try {

            if (!pdfData) {
                alert('No PDF data available to download.');
                return;
            }

            // Convert Base64 to a Blob
            const byteCharacters = atob(pdfData);
            const byteNumbers = Array.from(byteCharacters, (char) => char.charCodeAt(0));
            const byteArray = new Uint8Array(byteNumbers);
            const blob = new Blob([byteArray], { type: 'application/pdf' });

            // Create a link element for downloading
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = 'downloaded-file.pdf';
            document.body.appendChild(link);
            link.click();

            // Clean up
            document.body.removeChild(link);
            URL.revokeObjectURL(link.href);
        } catch (e) {
            console.error(e)
        }
    };

    return (
        <Button type='button' variant="outlined" onClick={handleDownload} disabled={!pdfData}>
            Download PDF
        </Button>
    );
};

export default DownloadButton;
