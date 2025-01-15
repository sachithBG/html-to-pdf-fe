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
    Snackbar,
    Alert,
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
import { useSession } from "next-auth/react";
import { findAllAddons } from "@/app/services/addonService";
import { useSelector } from "react-redux";
import { findAllTags } from "@/app/services/tagService";
import { bdy, ftr, hdr, TAG_TYPES } from "@/app/utils/constant";
import { getDefaultOrganization, Organization, OrganizationState } from "@/redux/slice/organizationSlice";
import { createPdfTemplate, generatePdfBuffer, readPdfTemplate, updatePdfTemplate } from "@/app/services/pdfService";
import { findAllByAddonId } from "@/app/services/externalKeyService";
// const EditableTextField = dynamic(() => import('@/app/components/EditableTextField'), { ssr: false });
const PdfPreviewButton = dynamic(() => import('@/app/components/PdfPreviewButton'), { ssr: false });
const DownloadButton = dynamic(() => import('@/app/components/DownloadButton'), { ssr: false });

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
    const [selectedAddons, setSelectedAddons] = useState<number[]>([]);
    const [tags, setTags] = useState<any[]>([]);
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [tagFlter, setTagFlter] = useState<string>('');

    const [isLoding, setIsLoding] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const [isEditMode, setIsEditMode] = useState(id ? true : false);

    const { data: session }: any = useSession();

    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [copiedText, setCopiedText] = useState('');

    const [pdfName, setPdfName] = useState<string>('');
    const [pdfKey, setPdfKey] = useState<string>('');
    const [errors, setErrors] = useState<{ pdfName?: string, pdfKey?: string, addons?: string, externalKey?: string }>({});

    const [margin, setMargin] = useState({ l: 20, t: 200, r: 20, b: 150 });
    const [displayHeaderFooter, setDisplayHeaderFooter] = useState(true);
    const [defVal, setDefVal] = useState('-');
    const [selectedType, setSelectedType] = useState<number | null>(null);
    const [externalKeys, setExternalKeys] = useState<any[]>([]);

    const handleMarginChange = (side: 'l' | 't' | 'r' | 'b', value: string) => {
        setMargin((prev) => ({ ...prev, [side]: value }));
    };

    const currentOrg: Organization | any = useSelector((state: { organization: OrganizationState }) =>
        getDefaultOrganization(state.organization)
    );
    const theme = useTheme();

    const fetchTags = async () => {
        try {
            const response = await findAllTags(addons.filter(a => selectedAddons.includes(a.id)).map(a => a.id), session?.user?.token);
            if (response.status == 200) {
                setTags((prev) => response.data);
            }
        } catch (error) {
            console.error("Error fetching tags:", error);
        }
    };

    const fetchExternalKeys = async () => {
        try {
            const response = await findAllByAddonId(addons.filter(a => selectedAddons.includes(a.id))[0]?.id, session?.user?.token);
            if (response.status == 200) {
                setExternalKeys((prev) => response.data);
            }
        } catch (error) {
            console.error("Error fetching tags:", error);
        }
    };

    const fetchAddons = async () => {
        try {
            const response = await findAllAddons(currentOrg?.id, session?.user?.token);
            console.log(response.data)
            if (response.status == 200) {
                setAddons(response.data);
                setSelectedAddons([]);
            }
        } catch (error) {
            console.error("Error fetching addons:", error);
        }
    };

    // Fetch Addons
    useEffect(() => {
        if (session?.user?.token) fetchAddons();
    }, [currentOrg?.id]);

    // Fetch Tags based on selected Addons
    useEffect(() => {
        if (selectedAddons.length > 0) {
            fetchTags();
            fetchExternalKeys();
        } else {
            setTags([]);
            setSelectedTags([]);
        }
    }, [selectedAddons]);

    // Handle Addon Change
    const handleAddonChange = (event: any) => {
        setErrors((prev) => ({ ...prev, addons: undefined }));
        setSelectedAddons([event.target.value]);
    };

    // Handle Tag Change
    const handleTagChange = (event: any) => {
        setSelectedTags(event.target.value);
    };

    // Handle Copy Tag
    const handleCopyTag = (tag: string) => {
        console.log(tag)
        if (!tag) return;
        navigator.clipboard.writeText(`{{${tag}}}`).then(() => {
            setCopiedText(`{{${tag}}}`);
            setSnackbarOpen(true); // Show snackbar when copied
            setTimeout(() => setSnackbarOpen(false), 3000); // Hide snackbar after 3 seconds
        }).catch(err => {
            console.error('Failed to copy: ', err);
        });
    };

    useEffect(() => {
        setIsClient(true); // Ensures PDF rendering runs on the client side
        setTimeout(() => {
            setHeaderContent(hdr);
            setBodyContent(bdy);
            setFooterContent(ftr);
        }, 100)

    }, []);

    // Fetch Initial Data for Edit Mode
    useEffect(() => {
        if (id) {
            setIsEditMode((prev) => true);
            setIsLoding(true);
            const fetchData = async () => {
                try {
                    let response = await readPdfTemplate(id, session?.user?.token);
                    if (response.status == 200) {
                        response = response.data;
                        setPdfName(() => response.data.name);
                        setHeaderContent(() => response.data.headerContent);
                        setBodyContent(() => response.data.bodyContent);
                        setFooterContent(() => response.data.footerContent);
                        setSelectedAddons(() => response.data.addons?.map((a: any) => a.id));
                        setDefVal(() => response.data.defVal);
                        setPdfKey(() => response.data.key);
                        setDisplayHeaderFooter(() => response.data.displayHeaderFooter);
                        setMargin(() => response.data.margin);
                        setSelectedType(() => response.data.external_key);
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


    const handleCollapse = (section: "setting" | "header" | "body" | "footer") => {
        setCollapsed((prevState) => ({
            ...prevState,
            [section]: !prevState[section],
        }));
    };

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
        if (!selectedAddons.length) newErrors.addons = 'Addon must be selected';
        if (!selectedType) newErrors.externalKey = 'Type/Status must be selected';

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
                addon_ids: addons.filter(a => selectedAddons.includes(a.id)).map(a => a.id),
                name: pdfName,
                key: pdfKey,
                margin: margin,
                displayHeaderFooter: displayHeaderFooter,
                defVal: defVal,
                organization_id: currentOrg.id,
                external_key: selectedType
            };
            if (isGenerate) {
                const response = await generatePdfBuffer(payload, session?.user?.token);
                const { pdf } = response.data;
                setPdfData((pr: any) => pdf); // Base64 PDF data
            } else {
                const response = !isEditMode ? await createPdfTemplate(payload, session?.user?.token) :
                    await updatePdfTemplate(id, { ...payload, id: id }, session?.user?.token);
                if (response.status == 201) {
                    handleBack(true);
                }
            }

        } catch (error) {
            console.error("Error generating PDF:", error);
        } finally {
            if (isGenerate) setIsGenerating(false);
            else setIsUploading(false)
        }
    }

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

    const handleTypeStatusChange = (event: any) => {
        const value = event.target.value;
        setSelectedType(value);
        setErrors((prev) => ({ ...prev, externalKey: undefined }));
    };



    return (
        <Box className="container mx-auto p-4">
            <Box mb={4}>
                <Grid
                    container
                    spacing={2} // Spacing between the buttons
                    direction={isMobile ? 'column' : 'row'} // Stack vertically on mobile, horizontally on larger screens
                    alignItems="right" // Align items to the center
                    justifyContent="right" // Center the items horizontally
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
                            `} isIconButton={false} id={null} />
                    </Grid>
                    <Grid >
                        <Button
                            variant="outlined"
                            color="primary"
                            disabled={isGenerating}
                            onClick={handleGeneratePdf}
                        >
                            Generate PDF
                            {isGenerating && <CircularProgress size={24} />}
                        </Button>
                    </Grid>

                    {pdfData && <> <Grid >
                        <Button
                            variant="outlined"
                            color="primary"
                            // startIcon={<SaveIcon />}
                            onClick={openPdfInNewTab}
                        >
                            Open In New Tab
                        </Button>
                    </Grid>
                        <Grid >
                            <DownloadButton pdfData={pdfData} />
                        </Grid></>
                    }

                    {/* Save Button 1 */}
                    <Grid >
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={savePdfTmpl}
                            startIcon={<SaveIcon />}
                            disabled={selectedAddons.length === 0 || isUploading}
                            sx={{ float: 'right' }}
                        >
                            {isEditMode ? "Update" : "Save"}
                            {isUploading && <CircularProgress size={24} />}
                        </Button>
                    </Grid>
                </Grid>
            </Box>

            <Box key={'setting'} mb={4}>
                <Button onClick={() => handleCollapse('setting')}>
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

                            />
                        </Grid2>
                        {/* Addon Selector */}
                        <Grid2 size={4}>
                            <FormControl fullWidth sx={{ mt: 2 }} error={errors.addons ? true : false}>
                                <InputLabel>Addons</InputLabel>
                                {/* {addons?.filter(a => a.id == selectedAddons[0])[0]?.name} */}
                                {!isLoding && <Select
                                    // multiple
                                    value={selectedAddons[0]}
                                    onChange={handleAddonChange}
                                    label="Addons"
                                    required
                                    renderValue={(selected) => addons?.filter(a => a.id == selected)[0]?.name}//selected.join(", ")
                                    error={Boolean(errors.addons)}

                                >
                                    {addons?.map((addon) => (
                                        <MenuItem key={addon.id} value={addon.id}>
                                            <Checkbox checked={selectedAddons.indexOf(addon.id) > -1} />
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
                            <FormControl fullWidth sx={{ mt: 1 }} error={Boolean(errors.externalKey)}>
                                <InputLabel>Type/Status</InputLabel>
                                <Select
                                    // multiple
                                    value={selectedType + ''}
                                    onChange={handleTypeStatusChange}
                                    label="Type/Status"
                                    renderValue={(selected) => externalKeys.filter(k => k.id == selected)[0]?.key_value} // Display selected addons or "None"
                                    required
                                >
                                    {externalKeys?.map((keys) => (
                                        <MenuItem key={keys.id} value={keys.id}>
                                            <Checkbox checked={selectedType == keys.id} />
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
                                value={margin.l}
                                onChange={(e) => handleMarginChange('l', e.target.value)}
                                fullWidth
                                type="number"
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
                                value={margin.t}
                                onChange={(e) => handleMarginChange('t', e.target.value)}
                                fullWidth
                                type="number"
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
                                value={margin.r}
                                onChange={(e) => handleMarginChange('r', e.target.value)}
                                fullWidth
                                type="number"
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
                                value={margin.b}
                                onChange={(e) => handleMarginChange('b', e.target.value)}
                                fullWidth
                                type="number"
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
                                        disabled={selectedAddons.length < 1}
                                        multiple
                                        disableCloseOnSelect
                                        autoHighlight
                                        options={tags.filter((tag) => TAG_TYPES.includes(tag.tag_type + ''))
                                            .filter((tag) => tagFlter && tagFlter != '' ? tagFlter == tag.tag_type : true)
                                            .sort((a, b) => -b.tag_type.localeCompare(a.tag_type))
                                        }
                                        getOptionLabel={(option) => option.name} // How to display tag names
                                        groupBy={(option) => option.tag_type}
                                        value={selectedTags}
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
                                                                    handleCopyTag(tag_?.field_path); // Copy the tag key on click
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
                                            slotProps={{
                                                input: {
                                                    ...params.InputProps,
                                                    style: { cursor: 'pointer' },
                                                    onClick: (e: any) => {
                                                        const tagName = e.target.innerText;
                                                        const tag_ = tags.find((t) => t.name === tagName);
                                                        handleCopyTag(tag_?.field_path); // Handle copy action when clicking the tag
                                                    },
                                                    endAdornment: (
                                                        <InputAdornment position="end" sx={{ display: 'flex', alignItems: 'center', mr: -4 }}>
                                                            <FormControl size="small" variant="standard" sx={{ minWidth: 100 }} >
                                                                {/* <InputLabel>Type</InputLabel> */}
                                                                <Select
                                                                    value={tagFlter}
                                                                    onChange={(event) => {
                                                                        setTagFlter(event.target.value);
                                                                    }}
                                                                    required
                                                                    // label="Filter"
                                                                    size="small"
                                                                    variant="standard"
                                                                    disabled={selectedAddons.length < 1}
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
                                                        onClick={() => handleCopyTag(option.field_path)} // Copy the tag field_path
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

                    </Grid2>


                </Collapse>
            </Box>
            <Grid2 size={12}><Divider /></Grid2>
            <Grid2 size={12}><Divider /></Grid2>
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

            {/* Save Button */}
            <Box mb={4} mt={5}>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={savePdfTmpl}
                    startIcon={<SaveIcon />}
                    disabled={selectedAddons.length === 0 || isUploading}
                    sx={{ float: 'right' }}
                >
                    {isEditMode ? "Update" : "Save"}
                    {isUploading && <CircularProgress size={24} />}
                </Button>
            </Box>
            {/* Snackbar to show copied text */}
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={3000}
                onClose={() => setSnackbarOpen(false)}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                sx={{ marginTop: 8 }}
            >
                <Alert onClose={() => setSnackbarOpen(false)} severity="success" sx={{ width: '100%' }}>
                    Tag key copied: {copiedText}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default HtmlToPdfEditor;

