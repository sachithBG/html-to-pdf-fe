"use client";
import {
    Box,
    Button,
    Collapse,
    Divider,
    Grid2 as Grid,
    Grid2,
    InputAdornment,
    TextField,
    useMediaQuery,
} from "@mui/material";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { generatePdfBufferTest } from "@/app/services/pdfService";
import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";
// const EditableTextField = dynamic(() => import('@/app/components/EditableTextField'), { ssr: false });
const PdfPreviewButton = dynamic(() => import('@/app/components/PdfPreviewButton'), { ssr: false });
const DownloadButton = dynamic(() => import('@/app/components/DownloadButton'), { ssr: false });
const CKTextField = dynamic(() => import('@/app/(pages)/setup/components/CKTextField'), { ssr: false });

const imageUrl = 'https://media.istockphoto.com/id/1967543722/photo/the-city-of-london-skyline-at-night-united-kingdom.jpg?s=2048x2048&w=is&k=20&c=ZMquw-lP_vrSVoUlSWjuWIZHdVma7z4ju9pD1EkRPvs='

// eslint-disable-next-line
const hdr = ` <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Empty Content</title>
    <style>
        /* General styles for the wrapper */
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            color: #333;
            font-size: 14px; /* Default font size */
            line-height: 1.38;
        }
        .pdf-wrapper {
            width: 100%; /* Full width of the PDF */
            margin: 0 auto; /* Center the content horizontally */
            padding: 2px; /* Add padding inside the content */
            box-sizing: border-box; /* Ensure padding is included in width */
            background-color: #ffffff; /* White background for the PDF */
        }
    </style>
</head>
<body>
    <div class="pdf-wrapper">
        <div class="default-text">
            <!-- Type your content here...-->
            Type your content here...
        </div>
    </div>
</body>
</html>

`
// eslint-disable-next-line
const ftr = `<div style="font-size: 10px; text-align: center; width: 100%;">
<div
      style="background-color: #f4f4f4; padding: 20px; text-align: center; font-size: 12px; color: #555;"
    >
      <p style="margin: 0;">123 Business Street, Business City, BC 12345</p>
      <p style="margin: 0;">
        Contact us: <a href="mailto:info@company.com" style="color: #007BFF;">info@company.com</a>
      </p>
      <p style="margin: 0;">&copy; 2024 Company Name. All rights reserved.</p>
    </div></div>`;
// eslint-disable-next-line
const bdy = `<div style="padding: 20px;">
      <h2 style="color: #333;">Welcome to Our Report</h2>
      <p style="margin: 0 0 10px; color: #555;">
        Below is a summary of our performance and goals. Feel free to review the details and let us know your thoughts.
      </p>

      <!-- Image Example -->
      <div style="text-align: center; margin: 20px 0;">
        <img
          src="${imageUrl}"
          alt="Sample Chart"
          style="max-width: 100%; height: auto;"
        />
      </div>

      <!-- Table Example -->
      <h3 style="color: #333;">Performance Overview</h3>
      <table
        style="width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 14px;"
      >
        <thead>
          <tr style="background-color: #f4f4f4;">
            <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Metric</th>
            <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Target</th>
            <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Achieved</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style="border: 1px solid #ddd; padding: 8px;">Revenue</td>
            <td style="border: 1px solid #ddd; padding: 8px;">$1,000,000</td>
            <td style="border: 1px solid #ddd; padding: 8px;">$950,000</td>
          </tr>
          <tr style="background-color: #f9f9f9;">
            <td style="border: 1px solid #ddd; padding: 8px;">Customer Growth</td>
            <td style="border: 1px solid #ddd; padding: 8px;">20%</td>
            <td style="border: 1px solid #ddd; padding: 8px;">18%</td>
          </tr>
          <tr>
            <td style="border: 1px solid #ddd; padding: 8px;">Satisfaction Score</td>
            <td style="border: 1px solid #ddd; padding: 8px;">90%</td>
            <td style="border: 1px solid #ddd; padding: 8px;">88%</td>
          </tr>
        </tbody>
      </table>
    </div>
`

const HtmlTestEditor = () => {
    const [headerContent, setHeaderContent] = useState<string>('');
    const [bodyContent, setBodyContent] = useState<string>("");
    const [footerContent, setFooterContent] = useState<string>("");
    const [collapsed, setCollapsed] = useState<{
        header: boolean;
        body: boolean;
        footer: boolean;
    }>({
        header: true,
        body: true,
        footer: true,
    });
    const [pdfData, setPdfData] = useState<Buffer | null | any>(null);
    const [isClient, setIsClient] = useState(false);
    const isMobile = useMediaQuery((theme) => theme.breakpoints.down('sm'));
    const [isEditorLoading, setIsEditorLoading] = useState<boolean>(true);
    const [isGenerating, setIsGenerating] = useState<boolean>(false);
    const [margin, setMargin] = useState({ l: 20, t: 200, r: 20, b: 150 });
    const { status, token } = useSelector((state: RootState) => state.session);
    // @typescript-eslint / no - unused - vars
    // const [pdfPrevButton, setPdfPrevButton] = useState(true);

    useEffect(() => {
        setIsClient(true);
        const timeout = setTimeout(() => setIsEditorLoading(false), 2000); // Simulate loading
        return () => clearTimeout(timeout);
    }, []);

    if (!isClient) {
        return null; // Or render a loading state
    }

    const handleMarginChange = (side: 'l' | 't' | 'r' | 'b', value: string) => {
        setMargin((prev) => ({ ...prev, [side]: value }));
    };


    const handleCollapse = (section: "header" | "body" | "footer") => {
        setCollapsed((prevState) => ({
            ...prevState,
            [section]: !prevState[section],
        }));
    };
    // eslint-disable-next-line
    const handleGeneratePdf = async () => {
        try {
            setIsGenerating(true);
            const response = await generatePdfBufferTest({
                headerContent, bodyContent, footerContent, margin: {
                    top: "200px",
                    bottom: "150px",
                    left: "20px",
                    right: "20px",
                }
            });
            const { pdf } = response.data;
            setPdfData(() => pdf); // Base64 PDF data
        } catch (error) {
            console.error("Error generating PDF:", error);
        } finally {
            setIsGenerating(false);
        }
    };

    const openPdfInNewTab = () => {
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
            window.open(blobUrl, "_blank");
            setTimeout(() => URL.revokeObjectURL(blobUrl), 60000);
        } catch (error) {
            console.error("Error generating PDF:", error);
        }
    }

    return (
        <Box className="container mx-auto p-4">
            {/* <Typography variant="h4" component="h1" gutterBottom>
                HTML Editor
            </Typography> */}
            <Box mb={4}>
                <Grid
                    container
                    spacing={2} // Spacing between the buttons
                    direction={isMobile ? 'column' : 'row'} // Stack vertically on mobile, horizontally on larger screens
                    alignItems="right" // Align items to the center
                    justifyContent="end" // Center the items horizontally
                >
                    <Grid >
                        <PdfPreviewButton htmlContent={
                            `<div className="ck ck-editor__main" style="height: max-content; width: 100%;">
                                <div class="ck ck-content" style="position: absolute;height: max-content; width: 100%;">
                                    <!-- Header -->
                                    <div style="position: absolute; top: 0; left: 0; right: 0; margin-left: ${margin.l}px; margin-right: ${margin.r}px;">
                                    ${headerContent?.replace(/^<h1>&nbsp;<\/h1>/, '')}
                                    </div>

                                    <!-- Body Content -->
                                    <div style="position: relative; margin: ${margin.t}px ${margin.r}px ${margin.b}px ${margin.l}px;">
                                    ${bodyContent?.replace(/^<h1>&nbsp;<\/h1>/, '')}
                                    </div>

                                    <!-- Footer -->
                                    <footer style="position: absolute; bottom: 0; left: 0; right: 0;margin-bottom:10px; margin-left: ${margin.l}px; margin-right: ${margin.r}px;">
                                    ${footerContent?.replace(/^<h1>&nbsp;<\/h1>/, '')}
                                    </footer>
                                </div>
                            </div>
                            `} id={null} isIconButton={false} organization_id={0} subcategories={[]} isNew={true} />
                    </Grid>
                    <Grid >
                        <Button
                            variant="outlined"
                            color="primary"
                            // startIcon={<SaveIcon />}
                            onClick={handleGeneratePdf}
                            size="small"
                            loading={isGenerating}
                        >
                            Generate PDF
                        </Button>
                    </Grid>
                    <Grid sx={{ display: 'flex', gap: 2, width: '100%', justifyContent: 'flex-end' }}>
                        {pdfData && <> <Grid >
                            <Button
                                variant="outlined"
                                color="primary"
                                // startIcon={<SaveIcon />}
                                onClick={openPdfInNewTab}
                                size="small"
                            >
                                Open In New Tab
                            </Button>
                        </Grid>
                            <Grid >
                                <DownloadButton pdfData={pdfData} />
                            </Grid></>}
                    </Grid>
                </Grid>
            </Box>
            <Grid2 container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
                <Grid2 size={{ xs: 2, sm: 2, md: 2 }}>
                    <TextField
                        label="Left Margin"
                        variant="outlined"
                        value={margin.l ? Number(margin.l) : 0}
                        onChange={(e) => handleMarginChange('l', e.target.value)}
                        fullWidth
                        type="number"
                        size="small"
                        slotProps={{
                            input: {
                                endAdornment: (
                                    <InputAdornment position="end">{"px"}</InputAdornment>
                                ),
                            },
                        }}
                    />
                </Grid2>
                <Grid2 size={{ xs: 2, sm: 2, md: 2 }}>
                    <TextField
                        label="Top Margin"
                        variant="outlined"
                        value={margin.t ? Number(margin.t) : 0}
                        onChange={(e) => handleMarginChange('t', e.target.value)}
                        fullWidth
                        type="number"
                        size="small"
                        slotProps={{
                            input: {
                                endAdornment: (
                                    <InputAdornment position="end">{"px"}</InputAdornment>
                                ),
                            },
                        }}
                    />
                </Grid2>
                <Grid2 size={{ xs: 2, sm: 2, md: 2 }}>
                    <TextField
                        label="Right Margin"
                        variant="outlined"
                        value={margin.r ? Number(margin.r) : 0}
                        onChange={(e) => handleMarginChange('r', e.target.value)}
                        fullWidth
                        type="number"
                        size="small"
                        slotProps={{
                            input: {
                                endAdornment: (
                                    <InputAdornment position="end">{"px"}</InputAdornment>
                                ),
                            },
                        }}
                    />
                </Grid2>
                <Grid2 size={{ xs: 2, sm: 2, md: 2 }}>
                    <TextField
                        label="Bottom Margin"
                        variant="outlined"
                        value={margin.b ? Number(margin.b) : 0}
                        onChange={(e) => handleMarginChange('b', e.target.value)}
                        fullWidth
                        type="number"
                        size="small"
                        slotProps={{
                            input: {
                                endAdornment: (
                                    <InputAdornment position="end">{"px"}</InputAdornment>
                                ),
                            },
                        }}
                    />
                </Grid2>
            </Grid2>
            <Divider sx={{my: 2}}/>
            <Box key={'header'} mb={4}>
                <Button onClick={() => handleCollapse('header')}>
                    {'header'.charAt(0).toUpperCase() + 'header'.slice(1)} Editor{" "}
                    {collapsed['header'] ? "▲" : "▼"}
                </Button>
                <Collapse in={collapsed['header']} aria-expanded>
                    <Box display="flex" gap={4}>
                        {/* Editor Section */}
                        <Box flex={1}>
                            <CKTextField
                                value={headerContent}
                                onChange={(c) => { setHeaderContent(c); setPdfData(null); }}
                                isLoading={isEditorLoading}
                                placeholder="Start typing your content..."
                                isTestingMode={status === 'unauthenticated' || !token}
                            />
                        </Box>
                    </Box>
                </Collapse>
            </Box>

            <Box key={'body'} mb={4}>
                <Button onClick={() => handleCollapse('body')}>
                    {'body'.charAt(0).toUpperCase() + 'body'.slice(1)} Editor{" "}
                    {collapsed['body'] ? "▲" : "▼"}
                </Button>
                <Collapse in={collapsed['body']} aria-expanded>
                    <Box display="flex" gap={4}>
                        {/* Editor Section */}
                        <Box flex={1}>
                            {/* <TextField
                                fullWidth
                                label={`${'body'.charAt(0).toUpperCase() + 'body'.slice(1)} Content`}
                                defaultValue={bodyContent}
                                onChange={(e) => setBodyContent(e.target.value)}
                                multiline
                                focused={true}
                                sx={{
                                    height: "100%", // Full height of the container
                                    "& .MuiOutlinedInput-root": {
                                        flex: 1, // Make the input stretch within its container
                                        "& textarea": {
                                            resize: "none", // Disable resizing
                                            height: "100%", // Full height of the parent
                                        },
                                    },
                                }}
                            /> */}
                            <CKTextField
                                value={bodyContent}
                                onChange={(c) => { setBodyContent(c); setPdfData(null); }}
                                isLoading={isEditorLoading}
                                placeholder="Start typing your content..."
                                isTestingMode={status === 'unauthenticated' || !token}
                            />
                        </Box>

                        {/* Preview Section */}
                        {/* <Box flex={1} p={2} border="1px solid var(--foreground)">
                            <Typography variant="h6">Preview</Typography>
                            <div
                                dangerouslySetInnerHTML={{
                                    __html: `<h1>${bodyContent}</h1>`
                                }}
                            />
                        </Box> */}
                    </Box>
                </Collapse>
            </Box>

            <Box key={'footer'} mb={4}>
                <Button onClick={() => handleCollapse('footer')}>
                    {'footer'.charAt(0).toUpperCase() + 'footer'.slice(1)} Editor{" "}
                    {collapsed['footer'] ? "▲" : "▼"}
                </Button>
                <Collapse in={collapsed['footer']} aria-expanded>
                    <Box display="flex" gap={4}>
                        {/* Editor Section */}
                        <Box flex={1}>
                            {/*<TextField
                                fullWidth
                                label={`${'footer'.charAt(0).toUpperCase() + 'footer'.slice(1)} Content`}
                                defaultValue={footerContent}
                                onChange={(e) => setFooterContent(e.target.value)}
                                multiline
                                focused={true}
                                sx={{
                                    height: "100%", // Full height of the container
                                    "& .MuiOutlinedInput-root": {
                                        flex: 1, // Make the input stretch within its container
                                        "& textarea": {
                                            resize: "none", // Disable resizing
                                            height: "100%", // Full height of the parent
                                        },
                                    },
                                }}
                            /> */}
                            <CKTextField
                                value={footerContent}
                                onChange={(c) => { setFooterContent(c); setPdfData(null); }}
                                isLoading={isEditorLoading}
                                placeholder="Start typing your content..."
                                isTestingMode={status === 'unauthenticated' || !token}
                            />
                        </Box>

                        {/* Preview Section */}
                        {/* <Box flex={1} p={2} border="1px solid var(--foreground)">
                            <Typography variant="h6">Preview</Typography>
                            <div
                                dangerouslySetInnerHTML={{
                                    __html: `<h1>${footerContent}</h1>`
                                }}
                            />
                        </Box> */}
                    </Box>
                </Collapse>
            </Box>
        </Box>
    );
};

export default HtmlTestEditor;

