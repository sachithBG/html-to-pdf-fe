"use client";
import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  Button,
  Typography,
  Modal,
  ToggleButton,
  ToggleButtonGroup,
  Skeleton,
  FormControl,
  Select,
  ListItemText,
  MenuItem,
  SelectChangeEvent,
  InputLabel,
  Paper,
} from "@mui/material";
import { generatePdfBufferById, readPdfTemplate } from "../services/pdfService";
import LaunchIcon from "@mui/icons-material/Launch";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
// import DataUploadButton from "../(pages)/setup/components/DataUploadButton";
import dynamic from "next/dynamic";
const DataUploadButton = dynamic(() => import('../(pages)/setup/components/DataUploadButton'), { ssr: false });

const PdfPreviewButton = ({
  htmlContent,
  isIconButton,
  id,
  organization_id,
  subcategories,
  isNew = false
}: {
  htmlContent: string | null;
  isIconButton: boolean;
  id: number | null;
  organization_id: number;
  subcategories: string[];
  isNew?: boolean;
}) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false); // Loading state
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [htmlCntnt, setHtmlCntnt] = useState(htmlContent);
  const [pdfUrl, setPdfUrl] = useState("");
  const [previewMode, setPreviewMode] = useState("withoutData");
  const [dataLoaded, setDataLoaded] = useState(false);
  const [dataError, setDataError] = useState("");
  const [pdfSubcategories, setPdfSubcategories] = useState(subcategories || []);
  const [subcategoriesFilter, setSubcategoriesFilter] = useState([]);

  const { token } = useSelector((state: RootState) => state.session);
  // Open and close modal handlers
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setTimeout(() => URL.revokeObjectURL(pdfUrl), 0);
    setDataLoaded(false);
    setPreviewMode("withoutData");
    setDataError("");
    setLoading(false);
    setSubcategoriesFilter([]);
    // setHtmlCntnt("");
  };

  const handleToggle = (event: any, newMode: any) => {
    setPreviewMode((prev) => (newMode !== prev ? newMode : prev));
    if (!id) setHtmlCntnt(htmlContent);
    // console.log(htmlContent)
  };

  const handleOpenById = async () => {
    if (id && token) {
      setLoading(true);
      setDataError("");
      try {
        const response = await generatePdfBufferById(
          id,
          organization_id,
          token,
          subcategoriesFilter
        );
        if (response.status == 200) {
          const { pdf } = response.data;
          const blobUrl = await openPdfInDialog(pdf);
          if (blobUrl) {
            setPdfUrl(blobUrl);
            if (!open) setOpen(true);
          }
        }
        setLoading(false);
      } catch (e) {
        console.log(e);
        setDataError("PDF generation failed. Please try again later.");
        setLoading(false);
      }
    }
  };

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
    if (id && token) {
      setLoading(true);
      const fetchData = async () => {
        try {

          let response = await readPdfTemplate(id, token);
          if (response.status == 200) {
            response = response.data;
            // alert(response.data.headerContent)
            // console.log(response.data)
            setHtmlCntnt(() => `<div className="ck ck-editor__main">
                                    <div class="ck ck-content" style="margin: 20px;color: 'black'; font-size: 14px; line-height: 1.4;">
                                    <div>${response.data.headerContent?.replace(/^<h1>&nbsp;<\/h1>/, '') }</div>
                                    ${response.data.bodyContent?.replace(/^<h1>&nbsp;<\/h1>/, '') }
                                    ${response.data.sections ? response.data.sections.map((se: any) => se.htmlContent?.replace(/^<h1>&nbsp;<\/h1>/, '')) : ''}
                                    <footer>${response.data.footerContent?.replace(/^<h1>&nbsp;<\/h1>/, '') }</footer>
                                    </div>
                                    </div>
                            `);
            setPdfSubcategories(response.data.subcategories?.map((sc: any) => sc.name) || []);
            setOpen(true);
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

  //   useEffect(() => {
  //     if (iframeRef.current && htmlCntnt) {
  //       // const sanitizedHtmlContent = DOMPurify.sanitize(htmlCntnt, {
  //       //     ALLOWED_TAGS: ['img', 'div', 'p', 'span', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'li', 'br'],
  //       //     ALLOWED_ATTR: ['src', 'alt', 'title', 'class', 'style'],
  //       // });
  //       const doc = iframeRef.current.contentDocument;
  //       if (doc) {
  //         doc.open();
  //         doc.write(`
  //             <!DOCTYPE html>
  //             <html lang="en">
  //             <head>
  //                 <style>
  //                     /* Include CKEditor styles here or link to the external stylesheet */
  //                     @import url('https://cdn.ckeditor.com/ckeditor5/35.0.1/classic/theme.css');
  //                     body {
  //                         margin: 0;
  //                         padding: 0;
  //                     }
  //                     .image {
  //                                 text-align: center;
  //                             }
  //                             .image img {
  //                                 max-width: 100%;
  //                                 height: auto;
  //                                 display: block;
  //                                 margin: 0 auto;
  //                             }
  //                             .image_resized {
  //                                 display: block;
  //                                 margin: 0 auto;
  //                             }
  //                 </style>
  //             </head>
  //             <body>
  //             <div  className="ck ck-editor__main">
  //                 <div class="ck ck-content">${htmlCntnt}</div>
  //                 </div>
  //             </body>
  //             </html>
  //         `); // Write HTML content to iframe
  //         doc.close();
  //       }
  //     }
  //   }, [htmlCntnt]); // Re-render iframe when htmlContent changes

  // Handle loading state based on iframe content
  //   useEffect(() => {
  //     if (iframeRef.current && htmlCntnt) {
  //       // setLoading(true);
  //       const iframe = iframeRef.current;
  //       iframe.onload = () => setLoading(false); // Set loading to false once iframe content is loaded
  //     }
  //   }, [htmlCntnt, previewMode]);

  useEffect(() => {
    if (previewMode != "withoutData" && !dataLoaded && open) {
      handleOpenById();
      setDataLoaded(true);
    }
  }, [previewMode, subcategoriesFilter, open]);
  useEffect(() => {
    if (isNew)
      setHtmlCntnt(htmlContent || '');
    if (isNew)
      setPdfSubcategories(subcategories);
    //     return () => {
    //         setDataLoaded(false);
    //         setPreviewMode('withoutData');
    //         setDataError('')
    //     }
  }, [open]);

  useEffect(() => {
    if (!isNew) {
      setHtmlCntnt(htmlContent || '');
      setPdfSubcategories(subcategories);
    }
  }, [htmlContent]);

  const handleSaveData = (data: string) => {
    console.log('Uploaded JSON Data:', data);
    console.log('Uploaded JSON Data:', id);
    // Add logic to handle saved data
    // updateDummyDataPdfTemplate
  };

  return (
    <Box>
      {/* Button to open the modal */}
      {isIconButton ? (
        <LaunchIcon onClick={handleOpenWithData} sx={{ cursor: "pointer" }} />
      ) : (
        <Button
          variant="outlined"
          color="primary"
          onClick={handleOpen}
          disabled={!htmlCntnt} // Disable button if no HTML content
          size="small"
        >
          Preview
        </Button>
      )}

      {/* Modal for preview */}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="pdf-preview-title"
        aria-describedby="pdf-preview-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "80%",
            height: "80%",
            bgcolor: "background.paper",
            border: '2px solid #000',
            boxShadow: 24,
            p: 4,
            pb: 15,
            overflow: "hidden",
          }}
        >
          <Box sx={{ display: "flex", mb: 2 }}>
            <Typography
              id="pdf-preview-title"
              variant="h5"
              component="h2"
              gutterBottom
            >
              Preview
            </Typography>
            {id && (
              <ToggleButtonGroup
                value={previewMode}
                exclusive
                onChange={handleToggle}
                aria-label="preview mode"
                sx={{
                  ml: 2,
                  mt: 0.6,
                  "& .MuiToggleButton-root": {
                    // borderRadius: "2px",
                    width: 125,
                    height: 25,
                  },
                }}
              >
                <ToggleButton
                  size="small"
                  id="withoutData"
                  value="withoutData"
                  aria-label="Preview without Data"
                >
                  DRAFT
                </ToggleButton>
                <ToggleButton
                  size="small"
                  id="withData"
                  value="withData"
                  aria-label="Preview with Data"
                >
                  With Data
                </ToggleButton>

              </ToggleButtonGroup>
            )}
            {previewMode != "withoutData" && (
              <FormControl
                variant="standard"
                sx={{ ml: 1, width: 200, mt: -2 }}
                size="small"
              >
                <InputLabel id="demo-multiple-checkbox-label">Section Filter</InputLabel>
                <Select
                  labelId="demo-multiple-checkbox-label"
                  id="demo-multiple-checkbox"
                  multiple
                  value={subcategoriesFilter}
                  onChange={(event: SelectChangeEvent<any>) => {
                    const {
                      target: { value },
                    } = event;
                    setSubcategoriesFilter(() =>
                      // On autofill we get a stringified value.
                      typeof value === "string" ? value.split(",") : value
                    );
                    setDataLoaded(false);
                  }}
                  // input={<OutlinedInput label="Section Filter" />}
                  renderValue={(selected) => selected.join(", ")}
                  // MenuProps={MenuProps}
                  size="small"
                >
                  {pdfSubcategories?.map((name) => (
                    <MenuItem key={name} value={name}>
                      <ListItemText primary={name} />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}

          </Box>
          {id && <Box sx={{ float: 'right', marginTop: '-65px' }}>
            <DataUploadButton onSave={handleSaveData} id={Number(id)} />
          </Box>}
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
          <Paper elevation={3} sx={{ height: "100%", width: "100%", display: loading ? 'none' : 'block' }}>
            {previewMode != "withoutData" && !loading && pdfUrl && (
              <iframe
                src={pdfUrl}
                title="PDF Preview"
                width="100%"
                height="100%"
                style={{ border: "none" }}
              // frameBorder="0"
              />
            )}
            {previewMode != "withoutData" && dataError && !loading && (
              <Typography
                id="pdf-preview-description"
                color="error"
                align="center"
                variant="h6"
              >
                {dataError}
              </Typography>
            )}

            {/* PDF iframe */}
            {htmlCntnt ? (
              <Box
                sx={{
                  opacity: previewMode == "withoutData" ? 1 : 0,
                  height: "100%",
                  width: "100%",
                  position:
                    previewMode == "withoutData" ? "relative" : "absolute",
                  mt: previewMode == "withoutData" ? 0 : 1500,
                }}
              >
                <iframe
                  ref={iframeRef}
                  width="100%"
                  height="100%"
                  title="HTML Preview"
                  style={{ border: "none" }}
                  srcDoc={`
                        <!DOCTYPE html>
                        <html lang="en">
                        <head>
                        <link rel="stylesheet" href="https://cdn.ckeditor.com/ckeditor5/44.1.0/ckeditor5.css">
                            <style>
                                body {
                                    font-family: Arial, sans-serif;
                                    margin: 0;
                                    padding: 0;
                                    color: #333;
                                    font-size: 14px; /* Default font size */
                                    line-height: 1.38;
                                },
                                .ck-content {
                                      margin: 0 auto;
                                }
                            </style>
                        </head>
                        <body>
                        ${htmlCntnt}
                        </body>
                        </html>
                    `}
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
                {previewMode == "withoutData" && !loading
                  ? "No HTML content available."
                  : ""}
              </Typography>
            )}
          </Paper>
          {/* Close button */}
          <Button
            variant="outlined"
            color="info"
            onClick={handleClose}
            sx={{ mt: 2, float: "right" }}
            size="small"
          >
            Close
          </Button>
        </Box>
      </Modal>
    </Box>
  );
};

export default PdfPreviewButton;
