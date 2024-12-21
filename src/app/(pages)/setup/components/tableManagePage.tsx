"use client";
import React, { useState, useEffect } from "react";
import { TextField, Button, Typography, Box, InputAdornment, Grid2 } from "@mui/material";

const initialData = {
    initialColumns: 3,
    initialRows: [
        { col1: "Data 1", col2: "Data 2", col3: "Data 3" }, // Default row data
    ],
    initialStyles: Array.from({ length: 3 }, () => ({
        backgroundColor: "#f4f4f4", // Default background color
        fontSize: "14", // Default font size
        padding: "8px", // Default padding
        color: "#000", // Default text color
    })),
    customHtml: `<table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
                        <thead>
                            <tr style="background-color: #007bff; color: #ffffff;">
                                <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Header 1</th>
                                <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Header 2</th>
                                <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Header 3</th>
                            </tr>
                        </thead><tbody></tbody></table>`
}

const TableManagePage = ({ id, tag }: any) => {
    const initialColumns = initialData.initialColumns; // Initial number of columns
    const initialRows = initialData.initialRows;
    const initialStyles: any[] = initialData.initialStyles;

    const [rows, setRows] = useState<any>(initialRows); // Row data
    const [numColumns, setNumColumns] = useState(initialColumns); // Number of columns
    const [customHtml, setCustomHtml] = useState(initialData.customHtml); // Custom HTML table
    const [previewHtml, setPreviewHtml] = useState(""); // Preview HTML table
    const [cellStyles, setCellStyles] = useState(initialStyles); // Cell styles
    const [isEdit, setIsEdit] = useState(id && Number(id) > 0); // Flag to check if editing existing table

    // Handle changes to form inputs for dynamic rows
    const handleRowChange = (e: React.ChangeEvent<HTMLInputElement> | any, index: number) => {
        const { name, value } = e.target;
        setRows((prevRows: any) => {
            const updatedRows = [...prevRows];
            updatedRows[index][name] = value;
            generatePreview(updatedRows); // Regenerate preview when data changes
            return updatedRows;
        });
    };

    // Add a new row to the table
    const addRow = () => {
        setRows((prevRows: any) => [...prevRows, { [`col${numColumns}`]: "" }]);
    };

    // Remove a row from the table
    const removeRow = (index: number) => {
        setRows((prevRows: any) => {
            const updatedRows = prevRows.filter((_: any, i: number) => i !== index);
            generatePreview(updatedRows); // Regenerate preview when a row is removed
            return updatedRows;
        });
    };

    // Handle number of columns change
    const handleNumColumnsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(e.target.value, 10);
        if (!isNaN(value) && value > 0 && value <= 6) {  // Max number of columns is 6
            setNumColumns(value);
            setCellStyles(
                Array.from({ length: value }, () => ({
                    backgroundColor: "#f4f4f4", // Default background color
                    fontSize: "14", // Default font size
                    padding: "8px", // Default padding
                    color: "#000", // Default text color
                }))
            );
            generatePreview(rows); // Regenerate preview when the number of columns changes
        }
    };

    // Handle changes to individual cell styles (background, font size, padding, text color)
    const handleCellStyleChange = (index: number, style: string, value: string) => {
        setCellStyles((prevStyles) => {
            const updatedStyles = [...prevStyles];
            updatedStyles[index] = { ...updatedStyles[index], [style]: value };
            generatePreview(rows); // Regenerate preview when styles are updated
            return updatedStyles;
        });
    };

    // Generate the HTML for the table preview with styles and custom HTML content
    const generatePreview = (rowsData: any[]) => {
        const tableBody = rowsData
            .map((row, rowIndex) => {
                return `
      <tr style="background-color: ${cellStyles[rowIndex]?.backgroundColor};">
        ${Array.from({ length: numColumns }).map((_, colIndex) => {
                    return `
            <td style="background-color: ${cellStyles[colIndex].backgroundColor}; font-size: ${cellStyles[colIndex].fontSize}; padding: ${cellStyles[colIndex].padding}; color: ${cellStyles[colIndex].color}; border: 1px solid #ddd; text-align: left;">
              ${row[`col${colIndex + 1}`]}
            </td>`;
                }).join("")}
      </tr>`;
            })
            .join("");

        const tableTemplate = customHtml.replace("<tbody></tbody>", `<tbody>${tableBody}</tbody>`);
        setPreviewHtml(tableTemplate); // Update the preview with generated table body
    };

    // Handle changes to the custom HTML table structure (for table, thead, tbody, etc.)
    const handleCustomHtmlChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        let textV = e.target.value;
        if (textV) textV = textV.replace(/<\/thead>.*<\/table>/s, "</thead><tbody></tbody></table>")
        setCustomHtml(textV);
        generatePreview(rows); // Regenerate the preview based on the new custom HTML structure
    };

    // Function to save table data (called when the user clicks save)
    const saveTableData = async () => {
        const tableData = {
            customHtml,
            rows,
            cellStyles,
            numColumns,
            tag
        };
        try {
            // Make API call to save table data
            const response = await fetch(process.env.NEXT_PUBLIC_BASE_URL + "v1/dynamic-html-table", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(tableData),
            });
            const result = await response.json();
            alert(result.message);
        } catch (error) {
            console.error("Error saving table data:", error);
        }
    };

    useEffect(() => {
        generatePreview(rows);
    }, [rows, customHtml]);

    useEffect(() => {
        if (id) {
            // Make API call to save table data
            fetch(process.env.NEXT_PUBLIC_BASE_URL + "dynamic-html-table/" + id, {
                method: "GET",
                headers: { "Content-Type": "application/json" }
            }).then(response => {
                return response.json()
            }).then(res => {
                alert(res.message);
            }).catch(error => {
                console.error("Error saving table data:", error);
            });
        }
    }, []);

    return (
        <Box sx={{ padding: 4, maxWidth: '1200px', margin: '0 auto' }} className="space-y-6">
            {/* <Typography variant="h4" className="text-center font-bold mb-6">
                {isEdit ? "Edit Table" : "Create Table"}
            </Typography> */}
            <Box>
                <Typography variant="h6" className="mb-5">Table Design</Typography>

                {/* Number of Columns Input */}
                <TextField
                    label="Number of Columns"
                    type="number"
                    value={numColumns}
                    onChange={handleNumColumnsChange}
                    variant="outlined"
                    fullWidth
                    sx={{ marginBottom: 2, mt: 4 }}
                    inputProps={{ min: 1, max: 6 }}
                />

                {/* Custom HTML Textarea */}
                <Typography variant="body1" className="mb-2">Custom HTML Table</Typography>
                <TextField
                    value={customHtml}
                    onChange={handleCustomHtmlChange}
                    multiline
                    sx={{
                        padding: 2,
                        width: '100%',
                        border: '1px solid #ddd',
                        borderRadius: '8px',
                        marginBottom: 3,
                        fontFamily: 'monospace',
                        fontSize: '14px',
                    }}
                    placeholder="Enter your custom HTML table here"
                />
            </Box>

            <Box>
                <Typography variant="h6" className="mb-2">Table Data</Typography>

                {/* Dynamic Table Data Input */}
                {rows.map((row: any, index: number) => (
                    <Box key={index} className="flex items-center space-x-2 mb-3 mt-3">
                        {Array.from({ length: numColumns }).map((_, colIndex) => (
                            <TextField
                                key={colIndex}
                                label={`Column ${colIndex + 1}`}
                                name={`col${colIndex + 1}`}
                                value={row[`col${colIndex + 1}`] || ""}
                                onChange={(e) => handleRowChange(e, index)}
                                variant="outlined"
                                fullWidth
                                className="flex-1"
                                size="small"
                            />
                        ))}
                        <Button
                            variant="contained"
                            color="error"
                            onClick={() => removeRow(index)}
                            size="small"
                        >
                            Remove
                        </Button>
                    </Box>
                ))}

                {/* Add Row Button */}
                <Button
                    variant="contained"
                    color="primary"
                    onClick={addRow}
                    size="small"
                    className="mb-3"
                >
                    Add Row
                </Button>
            </Box>

            {/* Cell Styles */}
            <Box>
                <Typography variant="h6" sx={{ mb: 2 }}>Cell Styles</Typography>
                {Array.from({ length: numColumns }).map((_, colIndex) => (
                    <Box key={colIndex} className="mb-6">
                        <Typography variant="body1" className="mb-2">Column {colIndex + 1} Styles</Typography>
                        <Grid2 container spacing={2} className="mt-4">
                            <Grid2 size={3}>
                                <TextField
                                    label="Background Color"
                                    value={cellStyles[colIndex].backgroundColor}
                                    onChange={(e) => handleCellStyleChange(colIndex, "backgroundColor", e.target.value)}
                                    fullWidth
                                    variant="outlined"
                                    size="small"
                                />
                            </Grid2>
                            <Grid2 size={3}>
                                <TextField
                                    label="Font Size"
                                    value={cellStyles[colIndex].fontSize}
                                    onChange={(e) => handleCellStyleChange(colIndex, "fontSize", e.target.value)}
                                    fullWidth
                                    variant="outlined"
                                    size="small"
                                    slotProps={{
                                        input: {
                                            endAdornment: (
                                                <InputAdornment position="end">px</InputAdornment>
                                            ),
                                        },
                                    }}
                                // InputProps={{
                                //     endAdornment: <InputAdornment position="end">px</InputAdornment>,
                                // }}
                                />
                            </Grid2>
                            <Grid2 size={3}>
                                <TextField
                                    label="Padding"
                                    value={cellStyles[colIndex].padding}
                                    onChange={(e) => handleCellStyleChange(colIndex, "padding", e.target.value)}
                                    fullWidth
                                    variant="outlined"
                                    size="small"
                                />
                            </Grid2>
                            <Grid2 size={3}>
                                <TextField
                                    label="Text Color"
                                    value={cellStyles[colIndex].color}
                                    onChange={(e) => handleCellStyleChange(colIndex, "color", e.target.value)}
                                    fullWidth
                                    variant="outlined"
                                    size="small"
                                />
                            </Grid2>
                        </Grid2>
                    </Box>
                ))}
            </Box>

            {/* Table Preview */}
            <Typography variant="h6" className="mb-2">Table Preview</Typography>
            <Box className="p-4 border rounded-lg border-gray-300" dangerouslySetInnerHTML={{ __html: previewHtml }} />

            {/* Save or Update Button */}
            <Button
                variant="contained"
                color="primary"
                onClick={saveTableData}
                size="large"
                className="mt-6"
            >
                {isEdit ? "Update Table" : "Create Table"}
            </Button>
        </Box>
    );
};

export default TableManagePage;
