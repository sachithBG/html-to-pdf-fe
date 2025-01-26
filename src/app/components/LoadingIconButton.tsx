import React, { useState } from 'react';
import { IconButton, CircularProgress, Popover, Button, Typography, Box } from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';

interface LoadingIconButtonProps {
    onClick: (event: React.MouseEvent<HTMLButtonElement>, params?: any) => Promise<void> | any;
    icon: React.ReactNode;
    size?: "small" | "medium" | "large";
    sx?: any;
    disabled?: boolean;
    params?: any;
    variant?: "default" | "error" | "info";
    isNeedToConfirm?: boolean;
    confirmMessage?: string;
    key: string;
}

const LoadingIconButton: React.FC<LoadingIconButtonProps> = ({
    onClick,
    icon,
    size = "medium",
    sx = {},
    disabled = false,
    params,
    variant = "default",
    isNeedToConfirm = false,
    confirmMessage = "Are you sure?",
    key
}) => {
    const [isLoading, setIsLoading] = useState(false);
    const [openPopover, setOpenPopover] = useState(false);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [event_, setEvent_] = useState<null | any>(null);

    // Handle button click, open popover if confirmation is needed
    const handleClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        setEvent_(event);
        if (isNeedToConfirm) {
            setAnchorEl(event.currentTarget); // Set button as anchor
            setOpenPopover(true);
        } else {
            setIsLoading(true);
            await onClick(event, params);
            setIsLoading(false);
        }
    };

    // Handle confirm action after user confirms
    const handleConfirm = async () => {
        setIsLoading(true);
        await onClick(event_, params); // Call the onClick function with event and params
        setIsLoading(false);
        setOpenPopover(false);
    };

    // Close popover without doing anything
    const handleCancel = () => {
        setOpenPopover(false);
        setEvent_(null);
    };

    return (
        <>
            <IconButton
                onClick={handleClick}
                size={size}
                sx={{
                    position: "relative",
                    padding: "6px",
                    "&:hover": {
                        backgroundColor: (theme) =>
                            variant === "error"
                                ? theme.palette.error.main
                                : variant === "info"
                                    ? theme.palette.info.main
                                    : theme.palette.action.hover,
                        color: (theme) => theme.palette.common.white,
                    },
                    ...sx,
                }}
                disabled={disabled || isLoading}
                key={key}
            >
                {isLoading ? (
                    <CircularProgress
                        size={20}
                        sx={{
                            color: (theme) =>
                                variant === "error"
                                    ? theme.palette.error.main
                                    : variant === "info"
                                        ? theme.palette.info.main
                                        : theme.palette.text.primary,
                            position: "absolute",
                        }}
                    />
                ) : (
                    icon
                )}
            </IconButton>

            {/* Popover Confirmation Dialog */}
            <Popover
                open={openPopover}
                onClose={handleCancel}
                anchorEl={anchorEl} // The anchor element (button)
                transformOrigin={{ vertical: 'top', horizontal: 'center' }}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <div style={{ padding: 20, width: 250, position: 'relative' }}>
                    {/* Close Icon */}
                    <IconButton
                        size='small'
                        onClick={handleCancel}
                        style={{
                            position: 'absolute',
                            top: 8,
                            right: 8,
                            padding: 4,
                            backgroundColor: 'rgba(0, 0, 0, 0.1)',
                        }}
                    >
                        <CloseIcon sx={{ fontSize: 16 }} />
                    </IconButton>

                    {/* Confirmation Message */}

                    {/* Confirm Button */}
                    <Box sx={{  display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <Typography>{confirmMessage}</Typography>
                        <Box sx={{ mt: 1, display: 'flex', justifyContent: 'center', width: '100%' }}>
                            <Button
                                variant="outlined"
                                color='info'//{variant === "error" ? "error" : "info"} // Use error color for delete
                                size='small'
                                onClick={handleConfirm}
                            >
                                OK
                            </Button>
                        </Box>
                    </Box>
                </div>
            </Popover>
        </>
    );
};

export default LoadingIconButton;
