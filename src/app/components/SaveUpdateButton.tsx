import React, { useState } from "react";
import { Button } from "@mui/material";
import { SxProps, Theme } from "@mui/system";
import { useSnackbar } from "notistack";

interface SaveUpdateButtonProps<T = any> {
    onClick: (event: React.MouseEvent<HTMLButtonElement>, params?: T) => Promise<void> | void;
    label: string; // Button text
    size?: "small" | "medium" | "large"; // Button size
    variant?: "text" | "outlined" | "contained"; // Material UI button variant
    color?: "primary" | "secondary" | "error" | "success" | "info"; // Button color
    sx?: SxProps<Theme>; // Additional styles
    disabled?: boolean; // Disable button externally
    params?: T; // Parameters to pass to the onClick handler
}

const SaveUpdateButton = <T,>({
    onClick,
    label,
    size = "small",
    variant = "outlined",
    color = "primary",
    sx,
    disabled = false,
    params,
}: SaveUpdateButtonProps<T>) => {
    const [isLoading, setIsLoading] = useState(false);
    const { enqueueSnackbar } = useSnackbar();
    const handleClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
        if (isLoading || disabled) return; // Prevent multiple clicks
        setIsLoading(true);
        try {
            await onClick(event, params); // Pass the event and params to the onClick handler
            enqueueSnackbar(`Success!`, { variant: 'success' });
        } catch (error) {
            enqueueSnackbar(`Failed`, { variant: 'error' });
            console.error("Error during button action:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Button
            size={size}
            variant={variant}
            color={color}
            sx={{
                float: "right",
                position: "relative",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                ...sx,
            }}
            onClick={handleClick}
            disabled={disabled || isLoading}
            loading={isLoading}
        >
            {label}
        </Button>
    );
};

export default SaveUpdateButton;
