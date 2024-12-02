import React from 'react';
// import PdfViewer from 'pdf-viewer-reactjs';

interface PdfViewerWrapperProps {
    pdfData: string;
}

const PdfViewerWrapper: React.FC<PdfViewerWrapperProps> = ({ pdfData }) => {
    return (
        <div>
            {/* <PdfViewer
                document={{
                    url: `data:application/pdf;base64,${pdfData}`,
                }}
            /> */}
        </div>
    );
};

export default PdfViewerWrapper;
