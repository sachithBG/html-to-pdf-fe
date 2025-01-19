import React from 'react';
import { Grid2, Box, Typography, Stack, Button, IconButton, Tooltip } from '@mui/material';
import { ContentCopy } from '@mui/icons-material';
import Image from 'next/image';
import DeleteConfirmDialog from './DeleteConfirmDialog';

interface ImageItem {
    file_key: string;
    url: string;
    addon_ids: string[];
    updated_at: string;
}

interface ImageListProps {
    imageList: ImageItem[];
    addons: any[];
    handleDelete: (fileKey: string) => void;
    handleCopy: (url: string) => void;
    tooltipImg: string;
    copiedToken: boolean
}

const ImageList: React.FC<ImageListProps> = ({
    imageList,
    addons,
    handleDelete,
    handleCopy,
    tooltipImg,
    copiedToken
}) => (
    <>
        {imageList.map((image, index) => (
            <Grid2 size={{xs:6, md:4}}  key={index + image.file_key}>
                <Box
                    sx={{
                        border: '1px solid #ccc',
                        padding: 2,
                        borderRadius: 2,
                        position: 'relative',
                        backgroundColor: '#f9f9f9',
                    }}
                >
                    {/* Image */}
                    <Image
                        src={image.url}
                        width={200}
                        height={200}
                        alt={`image-${index}`}
                        className="w-full h-auto"
                    />

                    {/* Metadata */}
                    <Typography variant="body2" mt={1}>
                        Created At: {new Date(image.updated_at).toLocaleDateString()}
                    </Typography>

                    {/* Addons */}
                    <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                        {addons
                            ?.filter((addon) => image.addon_ids?.includes(addon.id))
                            ?.map((addon) => (
                                <Button
                                    key={addon.id}
                                    size="small"
                                    sx={{ fontSize: 8 }}
                                    variant="outlined"
                                >
                                    {addon.name}
                                </Button>
                            ))}
                    </Stack>

                    {/* Action Icons */}
                    <Stack
                        direction="row"
                        spacing={1}
                        sx={{
                            position: 'absolute',
                            top: 8,
                            right: 8,
                        }}
                    >
                        

                        {/* Delete */}
                        <DeleteConfirmDialog
                            id={image.file_key}
                            onDelete={(id: any) => handleDelete(id)}
                            variant="icon"
                            buttonProps={{ size: "small", color: "error" }} // IconButton props
                        />
                    </Stack>
                    {/* Copy URL */}
                    <Tooltip title={tooltipImg}>
                        <IconButton
                            size="small"
                            color="success"
                            onClick={() => handleCopy(image.url)}
                            title="Copy URL"
                            sx={{ float: 'right', mt: -2, mr: -2 }}
                            disabled={!copiedToken}
                        >
                            <ContentCopy />
                        </IconButton>
                    </Tooltip>
                </Box>
            </Grid2>
        ))}
    </>
);

export default ImageList;
