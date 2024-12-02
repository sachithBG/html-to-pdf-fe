"use client";
import {
    Box,
    Typography,
    Button,
    Collapse,
    TextField,
} from "@mui/material";
import { useEffect, useState } from "react";
import axios from "axios";
import { Save as SaveIcon } from "@mui/icons-material";
import dynamic from "next/dynamic";
import PdfPreviewButton from "../components/PdfPreviewButton";
import DownloadButton from "../components/DownloadButton";
// const PdfViewerWrapper = dynamic(() => import('../components/PdfViewerWrapper'), { ssr: false });



const HtmlEditor = () => {
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

    useEffect(() => {
        setIsClient(true); // Ensures PDF rendering runs on the client side
        setHeaderContent(hdr);
        setBodyContent(bdy);
        setFooterContent(ftr);
    }, []);

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
            const response = await axios.post("http://localhost:4000/api/htmlToPdf", {
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
        <div className="container mx-auto p-4">
            <Typography variant="h4" component="h1" gutterBottom>
                HTML Editor
            </Typography>

            {["header", "body", "footer"].map((section) => (
                <Box key={section} mb={4}>
                    <Button onClick={() => handleCollapse(section as "header" | "body" | "footer")}>
                        {section.charAt(0).toUpperCase() + section.slice(1)} Editor{" "}
                        {collapsed[section as "header" | "body" | "footer"] ? "▲" : "▼"}
                    </Button>
                    <Collapse in={collapsed[section as "header" | "body" | "footer"]} aria-expanded>
                        <Box display="flex" gap={4}>
                            {/* Editor Section */}
                            <Box flex={1}>
                                <TextField
                                    fullWidth
                                    label={`${section.charAt(0).toUpperCase() + section.slice(1)} Content`}
                                    value={
                                        section === "header"
                                            ? headerContent
                                            : section === "body"
                                                ? bodyContent
                                                : footerContent
                                    }
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        if (section === "header") setHeaderContent(value);
                                        if (section === "body") setBodyContent(value);
                                        if (section === "footer") setFooterContent(value);
                                    }}
                                    multiline
                                    // rows={section === "body" ? 5 : 3}
                                    sx={{
                                        height: "100%", // Full height of the container
                                        display: "flex", // Ensures the text field stretches
                                        flexDirection: "column", // Align content vertically
                                        backgroundColor: "var(--background)",
                                        color: "var(--foreground)",
                                        "& .MuiOutlinedInput-root": {
                                            flex: 1, // Make the input stretch within its container
                                            "& textarea": {
                                                resize: "none", // Disable resizing
                                                height: "100%", // Full height of the parent
                                            },
                                            "& fieldset": {
                                                borderColor: "var(--foreground)",
                                            },
                                            "&:hover fieldset": {
                                                borderColor: "var(--foreground)",
                                            },
                                            "&.Mui-focused fieldset": {
                                                borderColor: "var(--foreground)",
                                            },
                                        },
                                        "& .MuiInputLabel-root": {
                                            color: "var(--foreground)",
                                        },
                                        "& .MuiInputBase-input": {
                                            color: "var(--foreground)",
                                        },
                                    }}
                                />
                            </Box>

                            {/* Preview Section */}
                            <Box flex={1} p={2} border="1px solid var(--foreground)">
                                <Typography variant="h6">Preview</Typography>
                                <div
                                    dangerouslySetInnerHTML={{
                                        __html:
                                            section === "header"
                                                ? `<h1>${headerContent}</h1>`
                                                : section === "body"
                                                    ? bodyContent
                                                    : `<footer>${footerContent}</footer>`,
                                    }}
                                />
                            </Box>
                        </Box>
                    </Collapse>
                </Box>
            ))}

            <Box mb={4}>
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<SaveIcon />}
                    onClick={handleGeneratePdf}
                >
                    Save & Generate PDF
                </Button>
            </Box>



            {isClient && pdfData && (
                <>
                    <Box mb={4}>
                        <Button
                            variant="contained"
                            color="primary"
                            startIcon={<SaveIcon />}
                            onClick={openPdfInNewTab}
                        >
                            Open In New Tab
                        </Button>
                    </Box>
                    <PdfPreviewButton pdfData={pdfData} />
                    <DownloadButton pdfData={pdfData} /></>

            )}
        </div>
    );
};

export default HtmlEditor;

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