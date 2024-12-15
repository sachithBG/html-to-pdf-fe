import React, { useState } from 'react';
import { Box, Button, TextField, FormControl, InputLabel, Select, MenuItem, Chip, CircularProgress, Grid2 } from '@mui/material';
import { Checkbox, ListItemText } from '@mui/material';
import Image from 'next/image';

const addons = [
    { id: 1, name: 'Addon 1' },
    { id: 2, name: 'Addon 2' },
    { id: 3, name: 'Addon 3' },
    { id: 4, name: 'Addon 4' },
];

const ImageManage = ({ onImageUpload }: { onImageUpload: (image: any) => void }) => {
    const [selectedAddons, setSelectedAddons] = useState<string[]>([]);
    const [key, setKey] = useState('');
    const [image, setImage] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);

    // Handle Addon Change
    const handleAddonChange = (event: any) => {
        setSelectedAddons(event.target.value as string[]);
    };

    // Handle Key Change
    const handleKeyChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setKey(event.target.value);
    };

    // Handle Image Selection
    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            const file = event.target.files[0];
            setImage(file);
            const reader = new FileReader();
            reader.onloadend = () => setPreview(reader.result as string);
            reader.readAsDataURL(file);
        }
    };

    // Validate Form before Upload
    const isValidForm = () => {
        return selectedAddons.length > 0 && key.trim() !== '' && image !== null;
    };

    // Handle Image Upload
    const handleUploadImage = async () => {
        if (!isValidForm()) {
            alert('Please complete all fields.');
            return;
        }

        setIsUploading(true);

        // Create image object to be passed to the parent
        const newImage = {
            key,
            addons: selectedAddons,
            preview: preview,
        };

        // Simulate API call
        setTimeout(() => {
            setIsUploading(false);
            onImageUpload(newImage); // Pass image to parent component
            alert('Image uploaded successfully!');
            resetForm();
        }, 1000);
    };

    const resetForm = () => {
        setSelectedAddons([]);
        setKey('');
        setImage(null);
        setPreview(null);
    };

    return (
        <Box sx={{ width: '100%', padding: 4 }}>
            <Grid2 container spacing={2}>
                {/* Addons select input */}
                <Grid2 size={{ sm: 6 }}>
                    <FormControl fullWidth>
                        <InputLabel>Addons</InputLabel>
                        <Select
                            multiple
                            value={selectedAddons}
                            onChange={handleAddonChange}
                            label="Addons"
                            required
                            renderValue={(selected) => selected.join(', ')}
                        >
                            {addons.map((addon) => (
                                <MenuItem key={addon.id} value={addon.name}>
                                    <Checkbox checked={selectedAddons.includes(addon.name)} />
                                    <ListItemText primary={addon.name} />
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid2>

                <Grid2 size={{ sm: 6 }}>
                    <TextField
                        label="Key"
                        variant="outlined"
                        fullWidth
                        value={key}
                        onChange={handleKeyChange}
                        required
                    />
                </Grid2>
            </Grid2>
            <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="block  mt-2"
            />

            {preview && <div className="mb-4">
                <h3 className="text-xl mb-2">Image Preview</h3>
                <img src={preview} alt="Preview" className="w-60 h-auto" />
            </div>}

            <Box sx={{ marginTop: 2 }}>
                <Button
                    onClick={handleUploadImage}
                    variant="contained"
                    color="primary"
                    disabled={!isValidForm() || isUploading}
                >
                    {isUploading ? <CircularProgress size={24} /> : 'Upload Image'}
                </Button>
            </Box>
        </Box>
    );
};

export default ImageManage;
