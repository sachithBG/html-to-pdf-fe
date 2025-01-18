import React from "react";
import {
    Box,
    TextField,
    MenuItem,
    Chip,
    Select,
    OutlinedInput,
    Typography,
    Divider,
    FormControl,
    InputLabel,
    Grid2,
    ListItemText,
} from "@mui/material";

const SectionEditor = ({ section, onChange, subcategories }: any) => {
    const handleNameChange = (event: any) => {
        onChange({ name: event.target.value });
    };

    const handleSubCategoriesChange = (event: any) => {
        const { value } = event.target;
        onChange({ subcategories: typeof value === "string" ? value.split(",") : value });
    };

    const handleHtmlContentChange = (event: any) => {
        onChange({ htmlContent: event.target.value });
    };

    return (
        <Box sx={{ mb: 2 }}>
            <Typography variant="h6">Section - {section.name}</Typography>
            <Divider sx={{ my: 2 }} />
            <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
                <TextField
                    label="Section Name"
                    value={section.name}
                    onChange={handleNameChange}
                    fullWidth
                    size="small"
                />
                <Grid2 sx={{ width: '100%' }}>
                    <FormControl fullWidth size="small">
                        <InputLabel>Subcategories</InputLabel>
                        <Select
                            multiple
                            value={section.subcategories}
                            onChange={handleSubCategoriesChange}
                            label='Subcategories'
                            renderValue={(selected) => {
                                return selected.join(', ');
                            }}
                            // input={<OutlinedInput label="Subcategories" />}
                            // renderValue={(selected) => (
                            //     <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                            //         {selected.map((value: any) => (
                            //             <Chip key={value} label={value} />
                            //         ))}
                            //     </Box>
                            // )}
                            fullWidth
                        // size="small"

                        >
                            {subcategories?.map((category: string) => (
                                <MenuItem key={category} value={category}>
                                    <ListItemText primary={category} />
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid2>
            </Box>
            <Box display="flex" gap={4}>
                <Box flex={1}>
                    <TextField
                        label="HTML Content"
                        value={section.htmlContent}
                        onChange={handleHtmlContentChange}
                        multiline
                        rows={6}
                        fullWidth
                        size="small"
                    />
                </Box>
                {/* Preview Section */}
                <Box flex={1} p={2} border="1px solid var(--foreground)">
                    <Typography variant="h6">Preview</Typography>
                    <Box
                        dangerouslySetInnerHTML={{
                            __html: section.htmlContent
                        }}
                    />
                </Box>
            </Box>

        </Box>
    );
};

export default SectionEditor;
