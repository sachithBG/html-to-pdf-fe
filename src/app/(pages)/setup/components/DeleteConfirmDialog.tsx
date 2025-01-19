import React, { FC, useState } from "react";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    IconButton,
    ButtonProps,
    IconButtonProps,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import IndeterminateCheckBoxIcon from '@mui/icons-material/IndeterminateCheckBox';

interface DeleteConfirmDialogProps {
    id: string | number; // The ID of the item to delete
    onDelete: (id: string | number) => void; // Callback with the ID of the item
    title?: string; // Optional title for the dialog
    description?: string; // Optional description for the dialog
    variant?: "icon" | "normal"; // Button type: icon or normal
    buttonProps?: ButtonProps | IconButtonProps; // Props for the button
    iconType?: 'delete' | 'remove' 
}

/* usege --------------------------------------------
<DeleteConfirmDialog
    id={template.id}
    onDelete={(id:any) => handleDelete(id)}
    variant="icon"
    buttonProps={{ size: "small", color: "error" }} // IconButton props
/>
<DeleteConfirmDialog
  id={102}
  onDelete={(id) => console.log("Deleted:", id)}
  variant="normal"
  buttonProps={{ size: "medium", variant: "outlined", color: "primary" }} // Button props
/>

*/

const DeleteConfirmDialog: FC<DeleteConfirmDialogProps> = ({
    id,
    onDelete,
    title = "Confirm Deletion",
    description = "Are you sure you want to delete this item? This action cannot be undone.",
    variant = "normal",
    buttonProps,
    iconType = 'delete'
}) => {
    const [open, setOpen] = useState(false);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const handleConfirmDelete = () => {
        onDelete(id); // Pass the ID to the delete action
        handleClose(); // Close the dialog
    };

    return (
        <>
            {/* Trigger Button */}
            {variant === "icon" ? (
                <IconButton onClick={handleOpen} {...(buttonProps as IconButtonProps)}>
                    {iconType == 'delete' ? <DeleteIcon /> : <IndeterminateCheckBoxIcon />}
                </IconButton>
            ) : (
                <Button onClick={handleOpen} {...(buttonProps as ButtonProps)}>
                    Delete
                </Button>
            )}

            {/* Confirmation Dialog */}
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="delete-dialog-title"
                aria-describedby="delete-dialog-description"
            >
                <DialogTitle id="delete-dialog-title">{title}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="delete-dialog-description">
                        {description}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleConfirmDelete} color="error" autoFocus>
                        Confirm
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default DeleteConfirmDialog;
