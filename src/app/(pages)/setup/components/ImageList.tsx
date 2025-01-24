import React from 'react';
import { Grid2, Stack, Button, IconButton, Tooltip, ImageListItemBar, ImageListItem } from '@mui/material';
import { ContentCopy } from '@mui/icons-material';
// import Image from 'next/image';
import DeleteConfirmDialog from './DeleteConfirmDialog';
// import InfoIcon from '@mui/icons-material/Info';
// @next/next/no - img - element

interface ImageItem {
    id: number;
    name: string;
    file_key: string;
    url: string;
    addon_ids: string[];
    updated_at: string;
}

interface ImageListProps {
    imageList: ImageItem[];
    addons: any[];
    handleDelete: (fileKey: string) => void;
    handleCopy: (url: string, id: number) => void;
    tooltipImg: Map<number, string>;
    copiedToken: Map<number, boolean>;
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
            <Grid2 size={{ xs: 6, md: 4 }} key={index + image.file_key}>
                
                <ImageListItem key={image.url}>
                    <Stack
                        direction="row"
                        spacing={1}
                        sx={{
                            // position: 'absolute',
                            float: 'right',
                            marginBottom: -5,
                            right: 0,
                        }}
                    >
                        {/* Delete */}
                        <DeleteConfirmDialog
                            id={image.file_key}
                            onDelete={(id: any) => handleDelete(id)}
                            variant="icon"
                            
                            buttonProps={{ size: "small", style: { color: 'rgba(255, 255, 255, 0.54)', background: 'rgba(0, 0, 0, 0.2)' } }} // IconButton props
                        />
                    </Stack>
                    {/* eslint-disable-next-line */}
                    <img
                        srcSet={`${image.url}?w=248&fit=crop&auto=format&dpr=2 2x`}
                        src={`${image.url}?w=248&fit=crop&auto=format`}
                        alt={image.name}
                        loading="lazy"
                    />
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
                    <ImageListItemBar
                        title={image.name}
                        subtitle={`Created At: ${new Date(image.updated_at).toLocaleDateString()}`}
                        actionIcon={
                            <Tooltip title={tooltipImg.get(image.id)}>
                                <IconButton
                                    sx={{ color: copiedToken.get(image.id)? 'rgba(102, 187, 106, 1)': 'rgba(255, 255, 255, 0.54)' }}
                                    aria-label={`info about ${image.name}`}
                                    onClick={() => handleCopy(image.url, image.id)}
                                    // disabled={copiedToken.get(image.id)}
                                    // color={copiedToken.get(image.id) ? "success" : 'success'}
                                >
                                    <ContentCopy />
                                </IconButton>
                            </Tooltip>
                        }
                    />
                </ImageListItem>
            </Grid2>
        ))}
    </>
);

export default ImageList;
