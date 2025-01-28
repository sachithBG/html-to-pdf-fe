import React, { useState } from 'react';
import { Box, Button, TextField, FormControl, InputLabel, Select, MenuItem, CircularProgress, Grid2 } from '@mui/material';
import { Checkbox, ListItemText } from '@mui/material';
import { isValidS3Url } from '@/app/utils/constant';
import Image from 'next/image';
// @next/next/no - img - element

interface ImageManageProps {
    onImageUpload: (image: any) => void;
    addons: any[];
    setImageName: (imageName: any) => void;
    imageName: string;
}

const ImageManage: React.FC<ImageManageProps> = ({ onImageUpload, addons, setImageName, imageName }) => {
    const [selectedAddons, setSelectedAddons] = useState<string[]>([]);
    const [key, setKey] = useState('');
    const [image, setImage] = useState<File | null>(null);
    // const [preview, setPreview] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);


    const imgUrl =
        typeof image === 'string' && isValidS3Url(image)
            ? image // Use the validated URL
            : image instanceof File
                ? URL.createObjectURL(image) // Use a blob URL for a File object
                : undefined;

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
            // const reader = new FileReader();
            // reader.onloadend = () => setPreview(reader.result as string);
            // reader.readAsDataURL(file);
        }
    };

    // Validate Form before Upload
    const isValidForm = () => {
        return selectedAddons.length > 0 && image !== null;//&& key.trim() !== ''
    };

    // Handle Image Upload
    const handleUploadImage = async () => {
        if (!isValidForm()) {
            // alert('Please complete all fields.');
            return;
        }

        setIsUploading(true);

        // Create image object to be passed to the parent
        const newImage = {
            key,
            addons: selectedAddons,
            preview: image,
        };
        try {
            await onImageUpload(newImage);
            resetForm();
            setIsUploading(false);
        } catch (error) {
            console.error(error);
            setIsUploading(false);
        }
    };

    const resetForm = () => {
        setSelectedAddons([]);
        setKey('');
        setImage(null);
        // setPreview(null);
    };



    return (
        <Box sx={{ width: '100%', padding: 4 }}>
            <Grid2 container spacing={2}>
                {/* Addons select input */}
                <Grid2 size={{ sm: 6 }}>
                    <FormControl fullWidth size='small'>
                        <InputLabel>Addons</InputLabel>
                        <Select
                            multiple
                            value={selectedAddons}
                            onChange={handleAddonChange}
                            label="Addons"
                            required
                            size='small'
                            renderValue={(selected) => selected.join(', ')}
                        >
                            {addons?.map((addon) => (
                                <MenuItem key={addon.id} value={addon.name}>
                                    <Checkbox checked={selectedAddons.includes(addon.name)} />
                                    <ListItemText primary={addon.name} />
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Image Name"
                        size="small"
                        type="text"
                        fullWidth
                        value={imageName}
                        sx={{mt:2}}
                        onChange={(e) => setImageName(e.target.value)}
                    />
                </Grid2>

                <Grid2 size={{ sm: 6 }} display={'none'}>
                    <TextField
                        label="Key"
                        variant="outlined"
                        fullWidth
                        value={key}
                        onChange={handleKeyChange}
                        required
                        size='small'
                    />
                </Grid2>
            </Grid2>
            <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="block  mt-5"
            />
            <Box sx={{ marginTop: 2, display: 'flex', justifyContent: 'center' }}>
                {imgUrl && <div className="mb-4">
                    {/* <h3 className="text-xl mb-2">Image Preview</h3> */}
                    {/*  @next/next/no-img-element */}
                    <Image unoptimized width={100} height={100} src={imgUrl} alt="Preview" className="w-60 h-auto" />
                </div>}
            </Box>
            <Box sx={{ marginTop: 2, display: 'flex', justifyContent: 'end' }}>
                <Button
                    onClick={handleUploadImage}
                    variant="outlined"
                    color="primary"
                    disabled={!isValidForm() || isUploading}
                    size='small'
                >
                    {isUploading ? <CircularProgress size={24} /> : 'Upload Image'}
                </Button>
            </Box>
        </Box>
    );
};

export default ImageManage;
