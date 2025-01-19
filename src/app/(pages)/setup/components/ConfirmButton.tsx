import React, { useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';

interface ConfirmButtonProps {
    title?: string;
    description?: string;
    onConfirm: (data: any) => void;
    buttonText: string;
    buttonProps?: React.ComponentProps<typeof Button>;
    confirmData?: any; // Data to parse and pass to the confirm handler
}

/*usage 
    < ConfirmButton
title = "Delete Item"
description = "Are you sure you want to delete this item? This action cannot be undone."
onConfirm = { generateToken }
buttonText = "Delete"
confirmData = {{ }}
buttonProps = {{ variant: 'contained', color: 'error' }}
            />
*/

const ConfirmButton: React.FC<ConfirmButtonProps> = ({
    title = "Confirm Action",
    description = "Are you sure you want to proceed?",
    onConfirm,
    buttonText,
    buttonProps,
    confirmData,
}) => {
    const [open, setOpen] = useState(false);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const handleConfirm = () => {
        onConfirm(confirmData); // Pass parsed data to the confirm handler
        handleClose();
    };

    return (
        <>
            <Button variant="outlined" size='small' color="primary" onClick={handleOpen} {...buttonProps}>
                {buttonText }
            </Button>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>{title}</DialogTitle>
                <DialogContent>
                    <DialogContentText>{description}</DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="secondary">
                        Cancel
                    </Button>
                    <Button onClick={handleConfirm} color="primary">
                        Confirm
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default ConfirmButton;
