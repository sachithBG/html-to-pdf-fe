import React, { useState } from 'react';
import { IconButton, Tooltip } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { useSnackbar } from 'notistack';

interface CopyIconButtonProps {
    textToCopy: string | any; // The text to copy to the clipboard
    tooltipCopy?: string; // Tooltip text when ready to copy
    tooltipCopied?: string; // Tooltip text when copied
    size?: 'small' | 'medium' | 'large'; // IconButton size
    color?: 'default' | 'error' | 'info'; // Icon color type
}

const CopyIconButton: React.FC<CopyIconButtonProps> = ({
    textToCopy,
    tooltipCopy = 'Copy',
    tooltipCopied = 'Copied!',
    size = 'small',
    color = 'info',
}) => {
    const { enqueueSnackbar } = useSnackbar();
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        if (!textToCopy) return; // Prevent copying empty text

        // Use Clipboard API
        if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
            navigator.clipboard.writeText(textToCopy)
                .then(() => {
                    enqueueSnackbar(`Copied: ${textToCopy}`, { variant: 'success' });
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000); // Reset copied state after 2 seconds
                })
                .catch((err) => {
                    console.error('Clipboard API failed:', err);
                    fallbackCopyToClipboard(textToCopy);
                });
        } else {
            // Fallback for older browsers
            fallbackCopyToClipboard(textToCopy);
        }
    };

    const fallbackCopyToClipboard = (text: string) => {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.opacity = '0';
        textArea.style.left = '-9999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();

        try {
            const successful = document.execCommand('copy');
            if (successful) {
                enqueueSnackbar(`Copied (fallback): ${text}`, { variant: 'success' });
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
            } else {
                enqueueSnackbar('Failed to copy (fallback).', { variant: 'error' });
            }
        } catch (err) {
            console.error('Fallback copy failed:', err);
            enqueueSnackbar('Failed to copy (fallback).', { variant: 'error' });
        }

        document.body.removeChild(textArea);
    };

    return (
        <Tooltip title={copied ? tooltipCopied : tooltipCopy}>
            <IconButton
                onClick={handleCopy}
                size={size}
                sx={{
                    // color: (theme:any) => theme.palette[color].main,
                    '&:hover': {
                        backgroundColor: (theme: any) => theme.palette[color].light,
                        color: (theme) => theme.palette.common.white,
                    },
                    mx: 0.5,
                }}
            >
                <ContentCopyIcon sx={{fontSize:'20px'}}/>
            </IconButton>
        </Tooltip>
    );
};

export default CopyIconButton;
