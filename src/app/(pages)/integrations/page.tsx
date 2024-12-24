'use client'

import { Button, TextField, Typography, Box, IconButton, Tooltip } from '@mui/material';
import { useState } from 'react';
import { ContentCopy as ContentCopyIcon, CheckCircle as CheckCircleIcon } from '@mui/icons-material';

export default function Page() {
    const [token, setToken] = useState('');
    const [curlCommand, setCurlCommand] = useState('');
    const [copiedToken, setCopiedToken] = useState(false); // Track if token was copied
    const [copiedCurl, setCopiedCurl] = useState(false); // Track if cURL command was copied
    const [tooltipToken, setTooltipToken] = useState('Copy'); // Tooltip text for Token
    const [tooltipCurl, setTooltipCurl] = useState('Copy'); // Tooltip text for cURL Command

    const generateToken = () => {
        // Simulate token generation
        const newToken = 'newly_generated_token';
        setToken(newToken);
        setCurlCommand(`curl -X POST https://api.example.com/access -H "Authorization: Bearer ${newToken}"`);
    };

    const handleCopy = (text: any, type: any) => {
        // Copy the text to the clipboard
        navigator.clipboard.writeText(text)
            .then(() => {
                if (type === 'token') {
                    setCopiedToken(true);
                    setTooltipToken('Copied');
                    setTimeout(() => {
                        setCopiedToken(false);
                        setTooltipToken('Copy');
                    }, 2000); // Reset tooltip after 2 seconds
                } else if (type === 'curl') {
                    setCopiedCurl(true);
                    setTooltipCurl('Copied');
                    setTimeout(() => {
                        setCopiedCurl(false);
                        setTooltipCurl('Copy');
                    }, 2000); // Reset tooltip after 2 seconds
                }
            })
            .catch((err) => {
                console.error('Error copying text: ', err);
            });
    };

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h6">Integration Page</Typography>
            <Button variant="contained" color="primary" onClick={generateToken} sx={{ mt: 2 }}>
                Generate Refresh Token
            </Button>
            {token && (
                <Box sx={{ mt: 2 }}>
                    <Typography variant="h6">Generated Token:</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <TextField
                            fullWidth
                            variant="outlined"
                            value={token}
                            InputProps={{
                                readOnly: true,
                                ...{
                                    // Applying slotProps.input for the token input
                                    endAdornment: (
                                        <Tooltip title={tooltipToken}>
                                            <IconButton onClick={() => handleCopy(token, 'token')}>
                                                {copiedToken ? <CheckCircleIcon color="success" /> : <ContentCopyIcon />}
                                            </IconButton>
                                        </Tooltip>
                                    ),
                                }
                            }}
                            sx={{ mt: 1 }}
                        />
                    </Box>

                    <Typography variant="h6" sx={{ mt: 2 }}>cURL Command:</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <TextField
                            fullWidth
                            variant="outlined"
                            value={curlCommand}
                            InputProps={{
                                readOnly: true,
                                ...{
                                    // Applying slotProps.input for the cURL command input
                                    endAdornment: (
                                        <Tooltip title={tooltipCurl}>
                                            <IconButton onClick={() => handleCopy(curlCommand, 'curl')}>
                                                {copiedCurl ? <CheckCircleIcon color="success" /> : <ContentCopyIcon />}
                                            </IconButton>
                                        </Tooltip>
                                    ),
                                }
                            }}
                            sx={{ mt: 1 }}
                        />
                    </Box>
                </Box>
            )}
        </Box>
    );
}
