"use client";
import {
    Box,
    Typography,
    Button,
    Collapse,
    TextField,
    Grid2 as Grid,
    useMediaQuery,
} from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Save as SaveIcon } from "@mui/icons-material";
import dynamic from "next/dynamic";
// const EditableTextField = dynamic(() => import('@/app/components/EditableTextField'), { ssr: false });
const PdfPreviewButton = dynamic(() => import('@/app/components/PdfPreviewButton'), { ssr: false });
const DownloadButton = dynamic(() => import('@/app/components/DownloadButton'), { ssr: false });

const imageUrl = 'https://media.istockphoto.com/id/1967543722/photo/the-city-of-london-skyline-at-night-united-kingdom.jpg?s=2048x2048&w=is&k=20&c=ZMquw-lP_vrSVoUlSWjuWIZHdVma7z4ju9pD1EkRPvs='


const hdr = ` <div style="font-family: Arial, sans-serif; line-height: 1.5; margin: 0; padding: 0; text-align: center;text-align: center; width: 100%; border-top: 1px solid #ccc;">
<div style="background-color: #f4f4f4; padding: 20px; ">
      <img
        src="${imageUrl}"
        alt="Logo"
        style="display: block; margin: 0 auto; max-width: 100px;"
      />
      <h1 style="margin: 10px 0;font-size: 20px; color: #555;">Company Name</h1>
      <p style="margin: 0; font-size: 14px; color: #555;">Your tagline or slogan here</p>
    </div> </div>`

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
    const [headerContent, setHeaderContent] = useState<string>("");
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
    useEffect(() => {
        setIsClient(true); // Ensures PDF rendering runs on the client side
        setTimeout(() => {
            setHeaderContent(hdr);
            setBodyContent(bdy);
            setFooterContent(ftr);
        }, 100)

    }, []);


    if (!isClient) {
        return null; // Or render a loading state
    }


    const handleCollapse = (section: "header" | "body" | "footer") => {
        setCollapsed((prevState) => ({
            ...prevState,
            [section]: !prevState[section],
        }));
    };

    const handleGeneratePdf = async () => {
        const htmlContent = `
      <html>
        <body>
          <div>${headerContent}</div>
          <div>${bodyContent}</div>
          <footer>${footerContent}</footer>
        </body>
      </html>
    `;

        try {
            const response = await axios.post("http://localhost:4000/api/v1/pdf-templates/test", {
                headerContent, bodyContent, footerContent
            });
            const { pdf } = response.data;
            setPdfData((pr: any) => pdf); // Base64 PDF data
        } catch (error) {
            console.error("Error generating PDF:", error);
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
            <Typography variant="h4" component="h1" gutterBottom>
                HTML Editor
            </Typography>
            <Box mb={4}>
                <Grid
                    container
                    spacing={2} // Spacing between the buttons
                    direction={isMobile ? 'column' : 'row'} // Stack vertically on mobile, horizontally on larger screens
                    alignItems="center" // Align items to the center
                    justifyContent="center" // Center the items horizontally
                >
                    <Grid >
                        <PdfPreviewButton htmlContent={
                            `<html>
                                <div>${headerContent}</div>
                                <body>
                                <div>${bodyContent}</div>
                                </body>
                                <footer>${footerContent}</footer>
                            </html>
                            `} id={null} isIconButton={false} />
                    </Grid>
                    <Grid >
                        <Button
                            variant="contained"
                            color="primary"
                            startIcon={<SaveIcon />}
                            onClick={handleGeneratePdf}
                        >
                            Generate PDF
                        </Button>
                    </Grid>

                    {pdfData && <> <Grid >
                        <Button
                            variant="contained"
                            color="primary"
                            startIcon={<SaveIcon />}
                            onClick={openPdfInNewTab}
                        >
                            Open In New Tab
                        </Button>
                    </Grid>
                        <Grid >
                            <DownloadButton pdfData={pdfData} />
                        </Grid></>}
                </Grid>
            </Box>

            <Box key={'header'} mb={4}>
                <Button onClick={() => handleCollapse('header')}>
                    {'header'.charAt(0).toUpperCase() + 'header'.slice(1)} Editor{" "}
                    {collapsed['header'] ? "▲" : "▼"}
                </Button>
                <Collapse in={collapsed['header']} aria-expanded>
                    <Box display="flex" gap={4}>
                        {/* Editor Section */}
                        <Box flex={1}>
                            <TextField
                                fullWidth
                                label={`${'header'.charAt(0).toUpperCase() + 'header'.slice(1)} Content`}
                                defaultValue={headerContent}
                                onChange={(e) => setHeaderContent(e.target.value)}
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
                            />
                        </Box>

                        {/* Preview Section */}
                        <Box flex={1} p={2} border="1px solid var(--foreground)">
                            <Typography variant="h6">Preview</Typography>
                            <div
                                dangerouslySetInnerHTML={{
                                    __html: `<h1>${headerContent}</h1>`
                                }}
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
                            <TextField
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
                            />
                        </Box>

                        {/* Preview Section */}
                        <Box flex={1} p={2} border="1px solid var(--foreground)">
                            <Typography variant="h6">Preview</Typography>
                            <div
                                dangerouslySetInnerHTML={{
                                    __html: `<h1>${bodyContent}</h1>`
                                }}
                            />
                        </Box>
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
                            <TextField
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
                            />
                        </Box>

                        {/* Preview Section */}
                        <Box flex={1} p={2} border="1px solid var(--foreground)">
                            <Typography variant="h6">Preview</Typography>
                            <div
                                dangerouslySetInnerHTML={{
                                    __html: `<h1>${footerContent}</h1>`
                                }}
                            />
                        </Box>
                    </Box>
                </Collapse>
            </Box>
        </Box>
    );
};

export default HtmlTestEditor;

