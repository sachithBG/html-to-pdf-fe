"use client";
import {
    Box,
    Typography,
    Button,
    Collapse,
    TextField,
    Grid2 as Grid,
    useMediaQuery,
    FormControl,
    Select,
    InputLabel,
    MenuItem,
    Checkbox,
    ListItemText,
    CircularProgress,
    Autocomplete,
    IconButton,
    Tooltip,
    InputAdornment,
    Chip,
    useTheme,
    Paper,
    Grid2,
    Divider,
    FormControlLabel,
    FormHelperText,
} from "@mui/material";
import { useEffect, useState } from "react";
import { Save as SaveIcon } from "@mui/icons-material";
import FileCopyIcon from '@mui/icons-material/FileCopy';
import FilterListIcon from '@mui/icons-material/FilterList';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

import dynamic from "next/dynamic";
import { findAllAddons } from "@/app/services/addonService";
import { useSelector } from "react-redux";
import { findAllTags } from "@/app/services/tagService";
import { TAG_TYPES } from "@/app/utils/constant";
import { getDefaultOrganization, Organization, OrganizationState } from "@/redux/slice/organizationSlice";
import { createPdfTemplate, generatePdfBuffer, generatePdfBufferById, readPdfTemplate, updatePdfTemplate } from "@/app/services/pdfService";
import { findAllByAddonId } from "@/app/services/externalKeyService";
import { useSnackbar } from "notistack";
import { RootState } from "@/redux/store";
const CKTextField = dynamic(() => import('@/app/(pages)/setup/components/CKTextField'), { ssr: false });
const PdfPreviewButton = dynamic(() => import('@/app/components/PdfPreviewButton'), { ssr: false });
const SectionEditor = dynamic(() => import('@/app/(pages)/setup/components/SectionEditor'), { ssr: false });
const SubcategoryEditor = dynamic(() => import('@/app/(pages)/setup/components/SubcategoryEditor'), { ssr: false });
const DeleteConfirmDialog = dynamic(() => import('@/app/(pages)/setup/components/DeleteConfirmDialog'), { ssr: false });

const HtmlToPdfEditor = ({ id, handleBack, addons_ = [] }: any) => {
    const [headerContent, setHeaderContent] = useState<string>("");
    const [bodyContent, setBodyContent] = useState<string>("");
    const [footerContent, setFooterContent] = useState<string>("");
    const [collapsed, setCollapsed] = useState<{
        setting: boolean;
        header: boolean;
        body: boolean;
        footer: boolean;
    }>({
        setting: true,
        header: true,
        body: true,
        footer: true,
    });
    const [pdfData, setPdfData] = useState<Buffer | null | any>(null);
    const [isClient, setIsClient] = useState(false);
    const isMobile = useMediaQuery((theme) => theme.breakpoints.down('sm'));

    const [addons, setAddons] = useState<any[]>(addons_ || []);
    const [selectedAddons, setSelectedAddons] = useState<number>();
    const [tags, setTags] = useState<any[]>([]);
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [tagFlter, setTagFlter] = useState<string>('');

    const [isLoding, setIsLoding] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    // eslint-disable-next-line
    const [isGenerating, setIsGenerating] = useState(false);
    const [isEditMode, setIsEditMode] = useState(id ? true : false);

    const { token } = useSelector((state: RootState) => state.session);

    const [pdfName, setPdfName] = useState<string>('');
    const [pdfKey, setPdfKey] = useState<string>('');
    const [errors, setErrors] = useState<{ pdfName?: string, pdfKey?: string, addons?: string, externalKey?: string }>({});

    const [margin, setMargin] = useState({ l: 20, t: 200, r: 20, b: 150 });
    const [displayHeaderFooter, setDisplayHeaderFooter] = useState(true);
    const [defVal, setDefVal] = useState('-');
    const [selectedKey, setSelectedKey] = useState<number | null>(null);
    const [externalKeys, setExternalKeys] = useState<any[]>([]);
    // eslint-disable-next-line
    const [pdfPrevButton, setPdfPrevButton] = useState(true);
    const [sections, setSections] = useState<any[]>([]);
    const [pdfSubcategories, setPdfSubcategories] = useState<any[]>([]);
    const { enqueueSnackbar } = useSnackbar();
    const [isEditorLoading, setIsEditorLoading] = useState<boolean>(true);
    const [isCloneLoading, setIsCloneLoading] = useState<boolean>(false);

    const handleMarginChange = (side: 'l' | 't' | 'r' | 'b', value: string) => {
        setMargin((prev) => ({ ...prev, [side]: value }));
    };

    const currentOrg: Organization | any = useSelector((state: { organization: OrganizationState }) =>
        getDefaultOrganization(state.organization)
    );
    const theme = useTheme();

    const fetchTags = async () => {
        try {
            if (selectedAddons) {
                const response = await findAllTags([selectedAddons], currentOrg.id, token);
                if (response.status == 200) {
                    setTags(() => response.data);
                }
            }
        } catch (error) {
            console.error("Error fetching tags:", error);
        }
    };

    const fetchExternalKeys = async () => {
        try {
            if (selectedAddons){
            const response = await findAllByAddonId(selectedAddons, token);
            if (response.status == 200) {
                setExternalKeys(() => response.data);
            }}
        } catch (error) {
            console.error("Error fetching tags:", error);
        }
    };

    const fetchAddons = async () => {
        try {
            const response = await findAllAddons(currentOrg?.id, token);
            // console.log(response.data)
            if (response.status == 200) {
                setAddons(response.data);
                setSelectedAddons(undefined);
            }
        } catch (error) {
            console.error("Error fetching addons:", error);
        }
    };

    // Fetch Addons
    useEffect(() => {
        if (token) fetchAddons();
    }, [currentOrg?.id]);

    // Fetch Tags based on selected Addons
    useEffect(() => {
        // console.log(session)
        if (selectedAddons && selectedAddons > 0) {
            fetchTags();
            fetchExternalKeys();
        } else {
            setTags([]);
            setSelectedTags([]);
        }
    }, [selectedAddons]);

    useEffect(() => {
        setIsCloneLoading(false);
        const timeout = setTimeout(() => setIsEditorLoading(false), 2000); // Simulate loading
        return () => clearTimeout(timeout);
    }, []);

    useEffect(() => {
        setIsClient(true); // Ensures PDF rendering runs on the client side
        if (!id) {
            setPdfPrevButton(false);
            const tt = setTimeout(() => {
                // setHeaderContent(hdr);
                // setBodyContent(bdy);
                // setFooterContent(ftr);
                setPdfPrevButton(true);
                clearTimeout(tt);
            }, 100);
        }
    }, []);

    useEffect(() => {
        setPdfPrevButton(false);
        const tt = setTimeout(() => {
            setPdfPrevButton(true);
            clearTimeout(tt);
        }, 2000);
    }, [headerContent, bodyContent, footerContent]);
    // Fetch Initial Data for Edit Mode
    useEffect(() => {
        if (id) {
            setIsEditMode(() => true);
            setIsLoding(true);
            const fetchData = async () => {
                try {
                    let response = await readPdfTemplate(id, token);
                    if (response.status == 200) {
                        response = response.data;
                        setPdfName(() => response.data.name);
                        setHeaderContent(() => response.data.headerContent);
                        setBodyContent(() => response.data.bodyContent);
                        setFooterContent(() => response.data.footerContent);
                        setSelectedAddons(() => response.data.addon_id);
                        setDefVal(() => response.data.defVal);
                        setPdfKey(() => response.data.key);
                        setDisplayHeaderFooter(() => response.data.displayHeaderFooter);
                        setMargin(() => response.data.margin);
                        setSelectedKey(() => response.data.external_key_id);
                        setSections(() => response.data.sections || []);
                        setPdfSubcategories(() => response.data.subcategories || []);
                    }

                } catch (error) {
                    console.error("Error fetching data for edit mode:", error);
                } finally {
                    setIsLoding(false);
                }
            };
            fetchData();
        }
    }, [id]);


    if (!isClient) {
        return null; // Or render a loading state
    }

    // Handle Addon Change
    const handleAddonChange = (event: any) => {
        setErrors((prev) => ({ ...prev, addons: undefined }));
        // alert(event.target.value)
        setSelectedAddons(event.target.value);
    };

    // Handle Copy Tag
    // const handleCopyTag = (tag: string) => {
    //     // console.log(tag)
    //     if (!tag) return;
    //     navigator.clipboard.writeText(`{{${tag}}}`).then(() => {
    //         enqueueSnackbar(`Tag key copied: {{${tag}}}`, { variant: 'success' });
    //     }).catch(err => {
    //         console.error('Failed to copy: ', err);
    //     });
    // };

    const handleCopyTag = (tag: any) => {
        if (!tag?.id) return;
        
        const textToCopy = tag?.tag_type == 'IMAGE' ? tag?.field_path : `{{${tag?.field_path}}}`;;// `{{${tag}}}`;

        if (navigator.clipboard && typeof navigator.clipboard?.writeText === 'function') {
            // Use Clipboard API if available
            navigator.clipboard.writeText(textToCopy)
                .then(() => {
                    // enqueueSnackbar(`Tag key copied: ${textToCopy}`, { variant: 'success' });
                })
                .catch((err) => {
                    console.error('Clipboard API failed, using fallback:', err);
                    fallbackCopyToClipboard(textToCopy);
                });
        } else {
            // Use fallback if Clipboard API is unavailable
            fallbackCopyToClipboard(textToCopy);
        }
    };

    // Fallback for copying to clipboard
    const fallbackCopyToClipboard = (text: string) => {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed'; // Prevent scrolling
        textArea.style.opacity = '0'; // Keep it hidden
        textArea.style.left = '-9999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();

        try {
            const successful = document.execCommand('copy');
            if (successful) {
                // enqueueSnackbar(`Tag key copied : ${text}`, { variant: 'success' });
            } else {
                // enqueueSnackbar('Failed to copy tag key .', { variant: 'error' });
            }
        } catch (err) {
            console.error('Fallback copy error:', err);
            // enqueueSnackbar('Failed to copy tag key .', { variant: 'error' });
        }

        document.body.removeChild(textArea);
    };



    const handleCollapse = (section: "setting" | "header" | "body" | "footer") => {
        setCollapsed((prevState) => ({
            ...prevState,
            [section]: !prevState[section],
        }));
    };
    // eslint-disable-next-line
    const handleGeneratePdf = async () => {
        pdfTmplSave(true);
    }

    const savePdfTmpl = async () => {
        pdfTmplSave(false);
    };

    const pdfTmplSave = async (isGenerate: boolean) => {
        // Clear previous errors
        setErrors({});

        // Validation
        const newErrors: { pdfName?: string; field_path?: string; tag_type?: string, addons?: string, externalKey?: string } = {};
        if (!pdfName) newErrors.pdfName = 'Name is required';
        // if (!tagKey) newErrors.field_path = 'Tag key is required';
        if (!selectedAddons) newErrors.addons = 'Addon must be selected';
        if (!selectedKey) newErrors.externalKey = 'Key must be selected';

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return; // Exit if there are validation errors
        }

        if (isGenerate) setIsGenerating(true);
        else setIsUploading(true)

        try {
            const payload = {
                headerContent,
                bodyContent,
                footerContent,
                addon_ids: selectedAddons,
                name: pdfName,
                key: pdfKey,
                margin: margin,
                displayHeaderFooter: displayHeaderFooter,
                defVal: defVal,
                organization_id: currentOrg.id,
                external_key_id: selectedKey,
                sections: sections,
                subcategories: pdfSubcategories
            };
            if (isGenerate) {
                const response = !isEditMode ? await generatePdfBuffer(payload, token) :
                    await generatePdfBufferById(id, currentOrg?.id, token);
                const { pdf } = response.data;
                setPdfData(() => pdf); // Base64 PDF data
            } else {
                const response = !isEditMode ? await createPdfTemplate(payload, token) :
                    await updatePdfTemplate(id, { ...payload, id: id }, token);
                if (response.status == 201) {
                    handleBack(true);
                    setPdfPrevButton(false)
                }
                enqueueSnackbar(`Template Saved successfully.`, { variant: 'success' });
            }

        } catch (error: any) {
            if (error.response) {
                const errorMessage = error.response.data?.error || 'Something went wrong.';
                console.error('Error:', errorMessage);
                enqueueSnackbar(errorMessage, { variant: 'error' });
            } else if (error.request) {
                // The request was made, but no response was received
                console.error('No response received:', error.request);
                enqueueSnackbar('No response from server. Please try again later.', { variant: 'error' });
            } else {
                // Something happened in setting up the request
                console.error('Error setting up request:', error.message);
                enqueueSnackbar('Failed to make the request.', { variant: 'error' });
            }
        } finally {
            if (isGenerate) setIsGenerating(false);
            else setIsUploading(false)
        }
    }
    // eslint-disable-next-line
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

    // Function to convert string to camelCase
    const toCamelCase = (str: string) => {
        return str
            .replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, (match, index) =>
                index === 0 ? match.toLowerCase() : match.toUpperCase()
            )
            .replace(/\s+/g, ''); // Remove spaces after converting to camelCase
    };

    // Validation function for pdfName
    const validatePdfName = (value: string) => {
        const regex = /^[a-zA-Z][a-zA-Z0-9\s]*$/; // Must start with a letter and allow letters, numbers, and spaces
        if (!regex.test(value)) {
            return 'Name must start with a letter and contain only letters, numbers, and spaces';
        }
        return '';
    };

    const handlePdfNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setPdfName(value);

        // Validate the name
        const errorMessage = validatePdfName(value);
        if (errorMessage) {
            setErrors((prev) => ({ ...prev, pdfName: errorMessage }));
        } else {
            setErrors((prev) => ({ ...prev, pdfName: undefined }));
        }

        // Convert to camelCase and update the key
        if (!errorMessage) {
            const camelCaseKey = toCamelCase(value);
            setPdfKey(camelCaseKey);
        }
    };

    const handleKeyChange = (event: any) => {
        const value = event.target.value;
        setSelectedKey(value);
        setErrors((prev) => ({ ...prev, externalKey: undefined }));
    };

    const handleAddSection = () => {
        setSections([
            ...sections,
            { id: Date.now(), name: "", subcategories: [], htmlContent: "" },
        ]);
    };

    const handleSectionChange = (id: number, updatedSection: any) => {
        setSections((prevSections) =>
            prevSections.map((section) =>
                section.id === id ? { ...section, ...updatedSection } : section
            )
        );
    };

    const handleRemoveSection = (id: number) => {
        setSections((prev) => prev.filter(s => s.id != id));
    };

    return (
        <Box className="container mx-auto p-4">
            {/* <div>
                <h1>CKEditor</h1>
                <CKTextField
                    value={headerContent}
                    onChange={setHeaderContent}
                    isLoading={isEditorLoading}
                    placeholder="Start typing your content..."
                    config={{}}
                />
                <div style={{ marginTop: '20px' }} className="ck ck-editor__main">
                    <h3>Preview:</h3>
                    <div dangerouslySetInnerHTML={{
                        __html: '<div class=" ck ck-content ">' +
                            headerContent +
                            '</div>' }} />
                </div>
            </div> 
            <div>
                <h1>CKEditor 2</h1>
                <CKTextField
                    value={bodyContent}
                    onChange={setBodyContent}
                    isLoading={isEditorLoading}
                    placeholder="Start typing your content..."
                    config={{}}
                />
                <div style={{ marginTop: '20px' }} className="ck ck-editor__main">
                    <h3>Preview:</h3>
                    <div dangerouslySetInnerHTML={{
                        __html: '<div class=" ck ck-content ">' +
                            bodyContent +
                            '</div>' }} />
                </div>
            </div> */}
            <Box mb={4}>
                <Grid
                    container
                    spacing={2} // Spacing between the buttons
                    direction={isMobile ? 'column' : 'row'} // Stack vertically on mobile, horizontally on larger screens
                    alignItems="right" // Align items to the center
                    justifyContent="right" // Center the items horizontally
                    sx={{ mt: -5 }}
                >
                    


                    {/* {pdfData && <> <Grid >
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
                        </Grid></>
                    } */}
                    {/* <Grid >
                        <Button
                            variant="outlined"
                            color="primary"
                            disabled={isGenerating}
                            onClick={handleGeneratePdf}
                            size="small"
                        >
                            Generate PDF
                            {isGenerating && <CircularProgress size={24} />}
                        </Button>
                    </Grid> */}

                </Grid>
                <Grid
                    container
                    spacing={2} // Spacing between the buttons
                    direction={isMobile ? 'column' : 'row'} // Stack vertically on mobile, horizontally on larger screens
                    alignItems="right" // Align items to the center
                    justifyContent="right" // Center the items horizontally
                >
                    {/* Save Button 1 */}
                    <Grid mt={2} mb={-3}>
                        <Button
                            variant="outlined"
                            color="primary"
                            onClick={savePdfTmpl}
                            endIcon={<SaveIcon />}
                            disabled={selectedAddons && selectedAddons < 0 || isUploading}
                            sx={{ float: 'right' }}
                            size="small"
                        >
                            {isEditMode ? "Update" : "Save"}
                            {isUploading && <CircularProgress size={24} />}
                        </Button>
                        <Button
                            variant="outlined"
                            color="primary"
                            onClick={savePdfTmpl}
                            endIcon={<SaveIcon />}
                            disabled={true}
                            sx={{ float: 'right', mx: 2 }}
                            size="small"
                        >
                            Clone
                            {isCloneLoading && <CircularProgress size={24} />}
                        </Button>
                        
                        <Grid sx={{mr: 30}}>
                            {!isLoding && <PdfPreviewButton htmlContent={
                                `<div className="ck ck-editor__main" style="height: max-content; width: 100%;">
                                    <div class="ck ck-content" style="position: absolute;height: max-content; width: 100%;">
                                        <!-- Header -->
                                        <div style="position: absolute; top: 0; left: 0; right: 0; margin-left: ${margin.l}px; margin-right: ${margin.r}px;">
                                        ${headerContent?.replace(/^<h1>&nbsp;<\/h1>/, '')}
                                        </div>

                                        <!-- Body Content -->
                                        <div style="position: relative; margin: ${margin.t}px ${margin.r}px ${margin.b}px ${margin.l}px;">
                                        ${bodyContent?.replace(/^<h1>&nbsp;<\/h1>/, '')}
                                        ${sections ? sections.map((se: any) => se.htmlContent?.replace(/^<h1>&nbsp;<\/h1>/, '')).join('') : ''}
                                        </div>

                                        <!-- Footer -->
                                        <footer style="position: absolute; bottom: 0; left: 0; right: 0;margin-bottom:10px; margin-left: ${margin.l}px; margin-right: ${margin.r}px;">
                                        ${footerContent?.replace(/^<h1>&nbsp;<\/h1>/, '')}
                                        </footer>
                                    </div>
                                </div>
                            `} isIconButton={false} id={isEditMode ? id : null} isNew={!isEditMode}
                                organization_id={currentOrg?.id} subcategories={pdfSubcategories?.map(sc => sc.name) || []} />}
                        </Grid>
                    </Grid>
                </Grid>
            </Box>

            <Box key={'setting'} mb={4}>
                <Button size="small" onClick={() => handleCollapse('setting')}>
                    {'setting'.charAt(0).toUpperCase() + 'setting'.slice(1)} Editor{" "}
                    {collapsed['setting'] ? "▲" : "▼"}
                </Button>
                <Collapse in={collapsed['setting']} aria-expanded>
                    <Grid2 container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
                        <Grid2 size={{ xs: 2, sm: 4, md: 4 }}>
                            <TextField
                                label="Pdf Name"
                                fullWidth
                                value={pdfName}
                                onChange={handlePdfNameChange}
                                margin="normal"
                                error={Boolean(errors.pdfName)}
                                helperText={errors.pdfName}
                                required
                                size="small"
                            />
                            <Box sx={{ display: 'none' }}>{/* flex */}
                                Key: &nbsp;
                                {/* Wrap pdfKey in a Paper component */}
                                {pdfKey && <Paper sx={{ padding: '8px' }}>
                                    <Box sx={{ maxWidth: 300, wordWrap: 'break-word', overflowWrap: 'break-word' }}>
                                        <Typography>{pdfKey}</Typography>
                                    </Box>
                                </Paper>}
                            </Box>


                        </Grid2>
                        <Grid2 sx={{ display: 'none' }}>
                            <TextField
                                label="Pdf key"
                                fullWidth
                                value={pdfKey}
                                onChange={(event) => {
                                    setPdfKey(event.target.value);
                                    setErrors((prev) => { return { ...prev, pdfKey: undefined } });
                                }}
                                margin="normal"
                                error={Boolean(errors.pdfKey)}
                                helperText={errors.pdfKey}
                                disabled
                                size="small"
                            />
                        </Grid2>
                        {/* Addon Selector */}
                        <Grid2 size={4}>
                            <FormControl fullWidth sx={{ mt: 2 }} error={errors.addons ? true : false} size="small">
                                <InputLabel>Addons</InputLabel>
                                {/* {addons?.filter(a => a.id == selectedAddons[0])[0]?.name} */}
                                {!isLoding && <Select
                                    // multiple
                                    value={selectedAddons  ? Number(selectedAddons) : ''}
                                    onChange={handleAddonChange}
                                    label="Addons"
                                    required
                                    renderValue={(selected) => addons?.filter(a => a.id == selected)[0]?.name}//selected.join(", ")
                                    error={Boolean(errors.addons)}
                                    size="small"
                                >
                                    {addons?.map((addon) => (
                                        <MenuItem key={addon.id} value={addon.id + ''}>
                                            {/* <Checkbox checked={selectedAddons.indexOf(addon.id) > -1} /> */}
                                            <ListItemText primary={addon.name} />
                                        </MenuItem>
                                    ))}
                                </Select>}
                                {errors.addons && <FormHelperText>{errors.addons}</FormHelperText>}
                            </FormControl>
                        </Grid2>
                        {/* Type Selector */}
                        <Grid2 size={4} display="flex" alignItems="center">
                            {/* Type/Status Dropdown */}
                            <FormControl size="small" fullWidth sx={{ mt: 1 }} error={Boolean(errors.externalKey)}>
                                <InputLabel>Type/Status</InputLabel>
                                <Select
                                    // multiple
                                    value={selectedKey ? Number(selectedKey)  : ''}
                                    onChange={handleKeyChange}
                                    label="Type/Status"
                                    renderValue={(selected) => externalKeys.filter(k => k.id == selected)[0]?.key_value} // Display selected addons or "None"
                                    required
                                    size="small"
                                >
                                    {externalKeys?.map((keys) => (
                                        <MenuItem key={keys.id} value={keys.id +''}>
                                            {/* <Checkbox checked={selectedType == keys.id} /> */}
                                            <ListItemText primary={keys.key_value} />
                                        </MenuItem>
                                    ))}
                                </Select>
                                {errors.externalKey && <FormHelperText>{errors.externalKey}</FormHelperText>}
                            </FormControl>

                            {/* Tooltip Icon */}
                            <Tooltip
                                title="Type/Status refers to the identifier used by external systems to categorize templates (e.g., invoice, report). This helps external systems recognize and interact with the template uniquely."
                                arrow
                            >
                                <HelpOutlineIcon fontSize="small" sx={{ m: 1, cursor: 'pointer' }} />
                            </Tooltip>
                        </Grid2>
                        {/* <Grid2 size={{ xs: 2, sm: 4, md: 4 }}>
                            <FormControl fullWidth>
                                <InputLabel>Type</InputLabel>
                                <Select
                                    value={tagFlter}
                                    onChange={(event) => {
                                        setTagFlter(event.target.value);
                                    }}
                                    required
                                    label="Type"
                                >
                                    {["CONTENT", "TABLE", "IMAGE"].map((t) => (
                                        <MenuItem key={t} value={t}>
                                            {t}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid2> */}

                        {/* Margin Inputs */}
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

                        {/* Default Value Input */}
                        <Grid2 size={{ xs: 2, sm: 2, md: 2 }}>
                            <TextField
                                label="Default Value"
                                variant="outlined"
                                value={defVal}
                                onChange={(e) => setDefVal(e.target.value)}
                                fullWidth
                                size="small"
                            // InputProps={{
                            //     startAdornment: <InputAdornment position="start">{"'"}</InputAdornment>,
                            //     endAdornment: <InputAdornment position="end">{"'"}</InputAdornment>,
                            // }}
                            />
                        </Grid2>

                        {/* Display Header/Footer Checkbox */}
                        <Grid2 size={{ xs: 2, sm: 2, md: 2 }}>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={displayHeaderFooter}
                                        onChange={(e) => setDisplayHeaderFooter(e.target.checked)}
                                    />
                                }
                                label="Display Header/Footer"
                            />
                        </Grid2>

                        <Grid2 size={12}><Divider /></Grid2>
                        <Grid2 size={12}>
                            {/* Tag Selector */}

                            <Box mb={4}>
                                <FormControl fullWidth>

                                    {/* <InputLabel>Tags</InputLabel> */}
                                    <Autocomplete
                                        disabled={selectedAddons && selectedAddons < 1 ? true : false}
                                        multiple
                                        disableCloseOnSelect
                                        autoHighlight
                                        size="small"
                                        options={tags.filter((tag) => TAG_TYPES.includes(tag.tag_type + ''))
                                            .filter((tag) => tagFlter && tagFlter != '' ? tagFlter == tag.tag_type : true)
                                            .sort((a, b) => -b.tag_type.localeCompare(a.tag_type))
                                        }
                                        getOptionLabel={(option) => option.name} // How to display tag names
                                        groupBy={(option) => option.tag_type}
                                        value={selectedTags || []}
                                        onChange={(_, newValue) => setSelectedTags(newValue)} // Update the selected tags
                                        renderTags={(tagValue, getTagProps) =>
                                            tagValue.map((option, index) => {
                                                const { key, ...tagProps } = getTagProps({ index });
                                                return (
                                                    <Paper
                                                        elevation={3}
                                                        sx={{
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            // p: 1,
                                                            mr: .5,
                                                            borderRadius: '8px',
                                                            boxShadow: 3,
                                                            bgcolor: theme.palette.background.paper,
                                                            ':hover': { boxShadow: 6 },
                                                        }} key={key} style={{ display: 'flex', alignItems: 'center' }}>
                                                        <Tooltip title={option?.field_path}>
                                                            <Chip
                                                                label={option.name} // Display the tag name here
                                                                {...tagProps}
                                                                sx={{ mr: 1, mb: 1 }}
                                                            />
                                                        </Tooltip>
                                                        {/* Copy Icon */}
                                                        <Tooltip title="Copy tag key">
                                                            <IconButton
                                                                onClick={() => {
                                                                    const tag_ = tags.find((t) => t.name === option.name);
                                                                    handleCopyTag(tag_); // Copy the tag key on click
                                                                }}
                                                                size="small"
                                                                sx={{
                                                                    padding: '6px',
                                                                    '&:hover': {
                                                                        backgroundColor: 'rgba(0, 0, 0, 0.08)', // Hover effect
                                                                    },
                                                                }}
                                                            >
                                                                <FileCopyIcon sx={{ fontSize: 20 }} />
                                                            </IconButton>
                                                        </Tooltip>
                                                    </Paper>
                                                );
                                            })
                                        }
                                        renderInput={(params: any) => <TextField
                                            {...params}
                                            label="Tags"
                                            size="small"
                                            slotProps={{
                                                input: {
                                                    ...params.InputProps,
                                                    style: { cursor: 'pointer' },
                                                    // onClick: (e: any) => {
                                                    //     const tagName = e.target.innerText;
                                                    //     const tag_ = tags.find((t) => t.name === tagName);
                                                    //     handleCopyTag(tag_); // Handle copy action when clicking the tag
                                                    // },
                                                    endAdornment: (
                                                        <>
                                                            <InputAdornment position="end" sx={{ display: 'flex', alignItems: 'center', mr: -4 }}>
                                                                <FormControl size="small" variant="standard" sx={{ minWidth: 100 }} >
                                                                    {/* <InputLabel>Type</InputLabel> */}
                                                                    <Select
                                                                        value={tagFlter || ''}
                                                                        onChange={(event: any) => {
                                                                            setTagFlter(event.target.value);
                                                                        }}
                                                                        required
                                                                        // label="Filter"
                                                                        size="small"
                                                                        variant="standard"
                                                                        disabled={selectedAddons && selectedAddons < 1 ? true : false}
                                                                        endAdornment={<InputAdornment position="end" ><FilterListIcon /></InputAdornment>}

                                                                    >
                                                                        <MenuItem value="">
                                                                            <em>None</em>
                                                                        </MenuItem>
                                                                        {["CONTENT", "TABLE", "IMAGE"].map((t) => (
                                                                            <MenuItem key={t} value={t}>
                                                                                {t}
                                                                            </MenuItem>
                                                                        ))}
                                                                    </Select>
                                                                </FormControl>
                                                            </InputAdornment>
                                                            <Box ml={5}>{params.InputProps.endAdornment}</Box>

                                                        </>
                                                    ),
                                                },
                                            }}
                                        />}


                                        renderOption={(props, option, { selected }) => (
                                            <li {...props} key={option.id}>
                                                <Checkbox checked={selected} key={option.id + 'c'} />
                                                <ListItemText primary={option.name} key={option.id + 'l'} />
                                                {/* Copy Icon and Tooltip */}
                                                <Tooltip title={`Copy ${option.field_path}`} key={option.id + 't'}>
                                                    <IconButton
                                                        onClick={() => handleCopyTag(option)} // Copy the tag field_path
                                                        size="small"
                                                        sx={{
                                                            marginLeft: 1,
                                                            padding: 1,
                                                            '&:hover': {
                                                                backgroundColor: 'rgba(0, 0, 0, 0.08)', // MUI hover effect for better UI
                                                            },
                                                        }}
                                                    >
                                                        <FileCopyIcon sx={{ fontSize: 20 }} />
                                                    </IconButton>
                                                </Tooltip>
                                            </li>
                                        )}
                                    />
                                </FormControl>
                            </Box>

                        </Grid2>
                        <Grid2 size={12}>
                            <SubcategoryEditor
                                subcategories={pdfSubcategories}
                                onAddSubcategory={(name) => {
                                    setPdfSubcategories((prev) => [...prev, { id: Date.now(), name }]
                                        .sort((a, b) => a.name.localeCompare(b.name)));
                                }}
                                onDeleteSubcategory={(id) => {
                                    setPdfSubcategories((prev) => prev.filter((s) => s.id !== id)
                                        .sort((a, b) => a.name.localeCompare(b.name)));
                                }}
                                onEditSubcategory={async (id, name) => {
                                    setPdfSubcategories((prev) => prev.map((s) => s.id === id ? { ...s, name } : s)
                                        .sort((a, b) => a.name.localeCompare(b.name)));
                                }}
                                loading={isLoding}
                            />

                        </Grid2>

                    </Grid2>


                </Collapse>
            </Box>
            <Grid2 size={12}><Divider /></Grid2>
            <Grid2 size={12} mb={2}><Divider /></Grid2>
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
                                onChange={setHeaderContent}
                                isLoading={isEditorLoading}
                                placeholder="Start typing your content..."
                                config={{}}
                                token={token}
                                orgId={currentOrg?.id}
                                addon_ids={selectedAddons ? [selectedAddons] : []}
                            />
                            {/* <TextField
                                fullWidth
                                label={`${'header'.charAt(0).toUpperCase() + 'header'.slice(1)} Content`}
                                defaultValue={headerContent}
                                onChange={(e) => setHeaderContent(e.target.value)}
                                multiline
                                focused={true}
                                size="small"
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
                        </Box>

                        {/* Preview Section */}
                        {/* <Box flex={1} p={2} border="1px solid var(--foreground)">
                            <Typography variant="h6">Preview</Typography>
                            <Box
                                dangerouslySetInnerHTML={{
                                    __html: `${headerContent}`
                                }}
                            />
                        </Box> */}
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
                            <CKTextField
                                value={bodyContent}
                                onChange={setBodyContent}
                                isLoading={isEditorLoading}
                                placeholder="Start typing your content..."
                                config={{}}
                                token={token}
                                orgId={currentOrg?.id}
                                addon_ids={selectedAddons ? [selectedAddons] : []}
                            />
                            {/* <TextField
                                fullWidth
                                label={`${'body'.charAt(0).toUpperCase() + 'body'.slice(1)} Content`}
                                defaultValue={bodyContent}
                                onChange={(e) => setBodyContent(e.target.value)}
                                multiline
                                focused={true}
                                size="small"
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
                        </Box>

                        {/* Preview Section */}
                        {/* <Box flex={1} p={2} border="1px solid var(--foreground)">
                            <Typography variant="h6">Preview</Typography>
                            <Box
                                dangerouslySetInnerHTML={{
                                    __html: `${bodyContent}`
                                }}
                            />
                        </Box> */}
                    </Box>

                    <Box display="flex" flexDirection={'column'} gap={4} mt={3}>
                        {sections.map((section: any) => (
                            < >
                                <Box key={section.id + 'btn'} sx={{ display: 'flex', justifyContent: 'flex-end', width: '100%', mb: -8, mr: 0 }}>
                                    <DeleteConfirmDialog
                                        id={section.id}
                                        onDelete={(id: any) => handleRemoveSection(id)}
                                        variant="icon"
                                        buttonProps={{ size: "small", color: "error" }}
                                        iconType="remove"
                                    />
                                </Box>
                                <SectionEditor
                                    key={section.id}
                                    section={section}
                                    onChange={(updatedSection: any) =>
                                        handleSectionChange(section.id, updatedSection)
                                    }
                                    subcategories={pdfSubcategories?.map(c => c.name)}
                                    selectedAddons={selectedAddons}
                                    token={token } orgId={currentOrg?.id}
                                />
                                <Divider key={section.id + 'div'} sx={{ width: '100%' }} />
                            </>
                        ))}
                    </Box>
                    <Box>
                        <Divider sx={{ my: 2 }} />
                        <Divider sx={{ my: 2 }} />
                        <Typography variant="h6" align="center">
                            Dynamic Sections
                        </Typography>
                        <Box display="flex" justifyContent="center" sx={{ mb: 2 }}>
                            <Button
                                variant="contained"
                                size="small"
                                color="primary"
                                onClick={handleAddSection}
                            >
                                Add New Section
                            </Button>
                        </Box>
                        <Divider sx={{ my: 2 }} />
                    </Box>
                    <Divider sx={{ width: '100%' }} />
                    {/* <Box display="flex" gap={4} justifyContent={'center'}>
                        <Button variant="outlined" size="small" onClick={handleAddSection} sx={{ my: 2, float: 'right' }}>
                            Add New Section
                        </Button>
                    </Box> */}
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
                            <CKTextField
                                value={footerContent}
                                onChange={setFooterContent}
                                isLoading={isEditorLoading}
                                placeholder="Start typing your content..."
                                config={{}}
                                token={token}
                                orgId={currentOrg?.id}
                                addon_ids={selectedAddons ? [selectedAddons]: []}
                            />
                            {/* <TextField
                                fullWidth
                                label={`${'footer'.charAt(0).toUpperCase() + 'footer'.slice(1)} Content`}
                                defaultValue={footerContent}
                                onChange={(e) => setFooterContent(e.target.value)}
                                multiline
                                focused={true}
                                size="small"
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
                        </Box>

                        {/* Preview Section */}
                        {/* <Box flex={1} p={2} border="1px solid var(--foreground)">
                            <Typography variant="h6">Preview</Typography>
                            <Box
                                dangerouslySetInnerHTML={{
                                    __html: `${footerContent}`
                                }}
                            />
                        </Box> */}
                    </Box>
                </Collapse>
            </Box>

            {/* Save Button */}
            <Box mb={4} mt={5}>
                <Button
                    variant="outlined"
                    color="primary"
                    onClick={savePdfTmpl}
                    endIcon={<SaveIcon />}
                    disabled={selectedAddons && selectedAddons === 0 || isUploading}
                    sx={{ float: 'right' }}
                    size="small"
                >
                    {isEditMode ? "Update" : "Save"}
                    {isUploading && <CircularProgress size={24} />}
                </Button>
            </Box>
        </Box>
    );
};

export default HtmlToPdfEditor;

