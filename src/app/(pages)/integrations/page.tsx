'use client'

import { Button, Typography, Box, IconButton, Tooltip, useTheme } from '@mui/material';
import { useEffect, useState } from 'react';
import { ContentCopy as ContentCopyIcon, CheckCircle as CheckCircleIcon } from '@mui/icons-material';
import { generateTokens } from '@/app/services/tokenService';
import { addOrganizationAll, clearOrganizationState, getDefaultOrganization, Organization, OrganizationState } from '@/redux/slice/organizationSlice';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import ConfirmButton from '../setup/components/ConfirmButton';

export default function Page() {
    const [token_, setToken] = useState('');
    const [curlCommand, setCurlCommand] = useState('');
    const [curlCommand2, setCurlCommand2] = useState('');
    const [copiedToken, setCopiedToken] = useState(false); // Track if token was copied
    const [copiedCurl, setCopiedCurl] = useState(false); // Track if cURL command was copied
    const [copiedCurl2, setCopiedCurl2] = useState(false); // Track if cURL command was copied
    const [tooltipToken, setTooltipToken] = useState('Copy'); // Tooltip text for Token
    const [tooltipCurl, setTooltipCurl] = useState('Copy'); // Tooltip text for cURL Command
    const [tooltipCurl2, setTooltipCurl2] = useState('Copy'); // Tooltip text for cURL Command

    const theme = useTheme();
    const { organizations } = useSelector((state: any) => state.organization);
    const currentOrg: Organization | any = useSelector((state: { organization: OrganizationState }) =>
        getDefaultOrganization(state.organization)
    );
    const dispatch = useDispatch();
    const { token } = useSelector((state: RootState) => state.session);

    // Define styles that adjust for dark and light modes
    const backgroundColor = theme.palette.mode === 'dark' ? '#333' : '#fff';
    const textColor = theme.palette.mode === 'dark' ? '#fff' : '#000';
    const borderColor = theme.palette.mode === 'dark' ? '#444' : '#ccc';

    useEffect(() => {
        if (currentOrg?.refresh_token) {
            setToken(currentOrg.refresh_token);
            setCurls(currentOrg.refresh_token);
        } else {
            setToken(''); setCurlCommand('');
        }
    }, [currentOrg?.id]);


    const generateToken = async () => {
        // Simulate token generation
        generateTokens(currentOrg?.id, token).then((res: any) => {
            if (res?.status == 200) {
                // console.log(res)
                const newToken = res.data?.refreshToken;
                setToken(newToken);
                setCurls(newToken)

                // Update the organizations state with the new token
                const updatedOrgs = organizations.map((org: any) =>
                    org.id === currentOrg.id ? { ...org, refresh_token: newToken } : org
                );
                dispatch(clearOrganizationState());
                dispatch(addOrganizationAll(updatedOrgs));
            }
        }).catch((err: any) => {
            console.error(err);
        });
    };

    const setCurls = (curlToken: string) => {
        setCurlCommand(`curl --location 'http://localhost:4000/api/v2/pdf/convert/${'{templateId}'}' \
                        --header 'Content-Type: application/json' \
                        --header 'Authorization: Bearer ${curlToken}' \
                        --data-raw '{
                            "subcategoriesFilter": [],
                            "allowAllSections": false,
                            "jsonData": {}
                        }'
                        `);
        setCurlCommand2(`curl --location 'http://localhost:4000/api/v2/pdf/convert/by-addon' \
                        --header 'Content-Type: application/json' \
                        --header 'Authorization: Bearer ${curlToken}' \
                        --data-raw '{
                            "addonName": "${'{addonName}'}",
                            "typeStatus": "${'{typeStatus}'}",
                            "subcategoriesFilter": [],
                            "allowAllSections": false,
                            "jsonData": {}
                        }'
                        `);
    }

    // const handleCopy = (text: any, type: any) => {
    //     // Copy the text to the clipboard
    //     navigator.clipboard.writeText(text)
    //         .then(() => {
    //             setCopyParams(type);
    //         })
    //         .catch((err) => {
    //             console.error('Error copying text: ', err);
    //         });
    // };

    const handleCopy = (text: any, type: any) => {
        const textToCopy = text;

        if (navigator.clipboard && typeof navigator.clipboard?.writeText === 'function') {
            // Modern approach using Clipboard API
            navigator.clipboard.writeText(textToCopy)
                .then(() => {
                    setCopyParams(type);
                })
                .catch((err) => {
                    console.error('Clipboard API failed, using fallback:', err);
                    fallbackCopyToClipboard(textToCopy, type); // Fallback if Clipboard API fails
                });
        } else {
            // Fallback for older browsers or restricted environments
            fallbackCopyToClipboard(textToCopy, type);
        }
    };

    const fallbackCopyToClipboard = (text: string, type: any) => {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed'; // Avoid scrolling to the bottom
        textArea.style.opacity = '0';
        textArea.style.left = '-9999px'; // Keep it hidden
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        try {
            const successful = document.execCommand('copy');
            if (successful) {
                setCopyParams(type);
            } else {
                console.error('Fallback copy failed');
            }
        } catch (err) {
            console.error('Fallback copy error:', err);
        }
        document.body.removeChild(textArea);
    };

    const setCopyParams = (type:string) => {
        if (type === 'token') {
            setCopiedToken(true);
            setTooltipToken('Copied');
            const tt = setTimeout(() => {
                setCopiedToken(false);
                setTooltipToken('Copy');
                clearTimeout(tt);
            }, 2000); // Reset tooltip after 2 seconds
        } else if (type === 'curl') {
            setCopiedCurl(true);
            setTooltipCurl('Copied');
            const tt = setTimeout(() => {
                setCopiedCurl(false);
                setTooltipCurl('Copy');
                clearTimeout(tt);
            }, 2000); // Reset tooltip after 2 seconds
        } else if (type === 'curl2') {
            setCopiedCurl2(true);
            setTooltipCurl2('Copied');
            const tt = setTimeout(() => {
                setCopiedCurl2(false);
                setTooltipCurl2('Copy');
                clearTimeout(tt);
            }, 2000); // Reset tooltip after 2 seconds
        }
    }

    return (
        <Box sx={{ p: 3 }}>
            {/* <Typography variant="h6">Integration Page</Typography> */}
            {!token_ ? <Button variant="outlined" size='small' color="primary" onClick={generateToken} sx={{ mt: 2 }} disabled={!currentOrg?.id}>
                Generate Refresh Token
            </Button> :
            <ConfirmButton
                title="Confirm Item"
                description="Are you sure you want to proceed ? This action cannot be undone."
                onConfirm={generateToken}
                buttonText="Renew Refresh Token"
                confirmData={{}}
                // buttonProps={{ variant: 'contained', color: 'error' }}
            />}
            {token_ && (
                <Box sx={{ mt: 2 }}>
                    <Box sx={{ width: '100%', mt: 2, borderRadius: '8px', border: `1px solid ${borderColor}` }}>
                        <Typography
                            variant="h6"
                            sx={{
                                padding: 2,
                                backgroundColor: theme.palette.mode === 'dark' ? '#444' : '#f5f5f5',
                                borderTopLeftRadius: '8px',
                                borderTopRightRadius: '8px',
                                fontWeight: 600,
                                color: theme.palette.mode === 'dark' ? '#fff' : '#000',
                            }}
                        >
                            Generated Token:
                        </Typography>
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                backgroundColor: theme.palette.mode === 'dark' ? '#444' : '#fafafa',
                                padding: 2,
                                borderBottom: `1px solid ${borderColor}`,
                            }}
                        >
                            <Box
                                sx={{
                                    flex: 1,
                                    backgroundColor: backgroundColor,
                                    fontFamily: 'monospace',
                                    fontSize: '14px',
                                    padding: '10px',
                                    borderRadius: '4px',
                                    overflowWrap: 'break-word',
                                    wordBreak: 'break-word',
                                    color: textColor,
                                }}
                            >
                                <code>{token_}</code>
                            </Box>
                            <Tooltip title={tooltipToken}>
                                <IconButton onClick={() => handleCopy(token_, 'token')}>
                                    {copiedToken ? <CheckCircleIcon color="success" /> : <ContentCopyIcon />}
                                </IconButton>
                            </Tooltip>
                        </Box>
                    </Box>

                    <Box sx={{ width: '100%', mt: 2, borderRadius: '8px', border: `1px solid ${borderColor}` }}>
                        <Typography
                            variant="h6"
                            sx={{
                                padding: 2,
                                backgroundColor: theme.palette.mode === 'dark' ? '#444' : '#f5f5f5',
                                borderTopLeftRadius: '8px',
                                borderTopRightRadius: '8px',
                                fontWeight: 600,
                                color: theme.palette.mode === 'dark' ? '#fff' : '#000',
                            }}
                        >
                            cURL Command: Using Id
                        </Typography>
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                backgroundColor: theme.palette.mode === 'dark' ? '#444' : '#fafafa',
                                padding: 2,
                                borderBottom: `1px solid ${borderColor}`,
                            }}
                        >
                            <Box
                                sx={{
                                    flex: 1,
                                    backgroundColor: backgroundColor,
                                    fontFamily: 'monospace',
                                    fontSize: '14px',
                                    padding: '10px',
                                    borderRadius: '4px',
                                    overflowWrap: 'break-word',
                                    wordBreak: 'break-word',
                                    color: textColor,
                                }}
                            >
                                <code>{curlCommand}</code>
                            </Box>
                            <Tooltip title={tooltipCurl}>
                                <IconButton onClick={() => handleCopy(curlCommand, 'curl')}>
                                    {copiedCurl ? <CheckCircleIcon color="success" /> : <ContentCopyIcon />}
                                </IconButton>
                            </Tooltip>
                        </Box>
                    </Box>

                    <Box sx={{ width: '100%', mt: 2, borderRadius: '8px', border: `1px solid ${borderColor}` }}>
                        <Typography
                            variant="h6"
                            sx={{
                                padding: 2,
                                backgroundColor: theme.palette.mode === 'dark' ? '#444' : '#f5f5f5',
                                borderTopLeftRadius: '8px',
                                borderTopRightRadius: '8px',
                                fontWeight: 600,
                                color: theme.palette.mode === 'dark' ? '#fff' : '#000',
                            }}
                        >
                            cURL Command: Using Addon & Type/Status
                        </Typography>
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                backgroundColor: theme.palette.mode === 'dark' ? '#444' : '#fafafa',
                                padding: 2,
                                borderBottom: `1px solid ${borderColor}`,
                            }}
                        >
                            <Box
                                sx={{
                                    flex: 1,
                                    backgroundColor: backgroundColor,
                                    fontFamily: 'monospace',
                                    fontSize: '14px',
                                    padding: '10px',
                                    borderRadius: '4px',
                                    overflowWrap: 'break-word',
                                    wordBreak: 'break-word',
                                    color: textColor,
                                }}
                            >
                                <code>{curlCommand2}</code>
                            </Box>
                            <Tooltip title={tooltipCurl2}>
                                <IconButton onClick={() => handleCopy(curlCommand2, 'curl2')}>
                                    {copiedCurl2 ? <CheckCircleIcon color="success" /> : <ContentCopyIcon />}
                                </IconButton>
                            </Tooltip>
                        </Box>
                    </Box>
                </Box>
            )}
        </Box>
    );
}
