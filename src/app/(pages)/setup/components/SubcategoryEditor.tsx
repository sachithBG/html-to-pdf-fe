import React, { useState } from "react";
import {
    Box,
    Button,
    TextField,
    IconButton,
    Typography,
    CircularProgress,
    Skeleton,
    InputAdornment,
    Grid2,
    Paper,
} from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ClearIcon from "@mui/icons-material/Clear";

interface Subcategory {
    id: number;
    name: string;
}

interface SubcategoryEditorProps {
    subcategories: Subcategory[];
    onAddSubcategory: (name: string) => void;
    onDeleteSubcategory: (id: number) => void;
    onEditSubcategory: (id: number, name: string) => void;
    loading?: boolean;
}

const SubcategoryEditor: React.FC<SubcategoryEditorProps> = ({
    subcategories,
    onAddSubcategory,
    onDeleteSubcategory,
    onEditSubcategory,
    loading = false
}) => {
    const [newSubcategory, setNewSubcategory] = useState<string>("");
    const [editMode, setEditMode] = useState<{ id: number | null; name: string }>({
        id: null,
        name: "",
    });

    const handleAdd = () => {
        if (newSubcategory.trim()) {
            onAddSubcategory(newSubcategory.trim());
            setNewSubcategory("");
        }
    };

    const handleEdit = () => {
        if (editMode.id && editMode.name.trim()) {
            onEditSubcategory(editMode.id, editMode.name.trim());
            setEditMode({ id: null, name: "" });
        }
    };

    return (
        <Box sx={{ mb: 3 }}>
            <Typography variant="h6">Manage Subcategories</Typography>
            <Box sx={{ display: "flex", gap: 2, mt: 2, alignItems: "center", maxWidth: 350 }}>
                <TextField
                    label={editMode.id ? "Edit Subcategory" : "New Subcategory"}
                    value={editMode.id ? editMode.name : newSubcategory || ''}
                    onChange={(e) =>
                        editMode.id
                            ? setEditMode({ ...editMode, name: e.target.value })
                            : setNewSubcategory(e.target.value)
                    }
                    fullWidth
                    size="small"
                    slotProps={{
                        input: {
                            endAdornment: (
                                <InputAdornment position="end">
                                    {editMode.id && <ClearIcon fontSize="small" sx={{ cursor: 'pointer' }}
                                        onClick={() => setEditMode({ id: null, name: "" })} />}

                                </InputAdornment>
                            ),
                        }
                    }}
                />
                {editMode.id ? (
                    <Button variant="outlined" endIcon={<EditIcon />} onClick={handleEdit}>
                        Edit
                    </Button>
                ) : (
                    <Button variant="outlined" disabled={loading || !newSubcategory.trim()} endIcon={loading ? <CircularProgress size={24} /> : <AddCircleIcon />} onClick={handleAdd}>
                        Add
                    </Button>
                )}
            </Box>
            {/* <Button variant="outlined" sx={{ mt: 2 }} onClick={handleSort}>
                Sort Subcategories
            </Button> */}
            <Grid2 container spacing={2} mt={2}>
                {loading
                    ? Array.from({ length: 3 }).map((_, index) => (
                        <Grid2 key={index} size={{ xs: 12, sm: 6, md: 4 }}>
                            <Skeleton variant="rectangular" width="100%" height={60} />
                        </Grid2>
                    ))
                    : subcategories?.map((subcategory) => (
                        <Grid2 key={subcategory.id} size={{ xs: 12, sm: 6, md: 4 }}>
                            <Paper
                                sx={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    borderRadius: 2,
                                    pl: 1
                                }}
                                elevation={1}
                            >
                                <Typography noWrap>{subcategory.name}</Typography>
                                <Box>
                                    <IconButton
                                        color="primary"
                                        onClick={() => setEditMode({ id: subcategory.id, name: subcategory.name })}
                                    >
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton
                                        color="error"
                                        onClick={() => onDeleteSubcategory(subcategory.id)}
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                </Box>
                            </Paper>
                        </Grid2>
                    ))}
            </Grid2>
        </Box>
    );
};

export default SubcategoryEditor;
