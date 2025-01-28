import React, { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    IconButton
} from '@mui/material';
import { Close } from '@mui/icons-material';
import { useSnackbar } from 'notistack';

interface ImageNameDialogProps {
    open: boolean;
    onClose: (name: string | any) => void;
}

const ImageNameDialog: React.FC<ImageNameDialogProps> = ({ open, onClose }) => {
    const [imageName, setImageName] = useState<string>('');
    const { enqueueSnackbar } = useSnackbar();

    const handleSave = () => {
        if (imageName.trim()) {
            onClose(imageName);
        } else {
            enqueueSnackbar(`Please enter a valid image name.`, { variant: 'warning' });
        }
        setImageName('');
    };

    const handleClose = () => {
        onClose(null);
        setImageName('');
    };

    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>
                Enter Image Name
                <IconButton
                    aria-label="close"
                    onClick={handleClose}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: (theme) => theme.palette.grey[500],
                    }}
                    size='small'
                >
                    <Close />
                </IconButton>
            </DialogTitle>
            <DialogContent>
                <TextField
                    autoFocus
                    margin="dense"
                    label="Image Name"
                    size="small"
                    type="text"
                    fullWidth
                    value={imageName}
                    onChange={(e) => setImageName(e.target.value)}
                />
            </DialogContent>
            <DialogActions>
                <Button size="small" variant="outlined" onClick={handleSave}>
                    Proceed
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ImageNameDialog;
