import { useState, useEffect } from 'react';
import { TextField, Button, Card, Typography, Tooltip, CircularProgress, Box, Skeleton, InputAdornment } from '@mui/material';
import { addExternalKey, deleteExternalKey, findAllByAddonId, updateExternalKey } from '@/app/services/externalKeyService';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import ClearIcon from '@mui/icons-material/Clear';
import { RootState } from '@/redux/store';
import { useSnackbar } from 'notistack';
import { useSelector } from 'react-redux';
// import LoadingIconButton from '@/app/components/LoadingIconButton';
import DeleteIcon from '@mui/icons-material/Delete';
// import CopyIconButton from '@/app/components/CopyIconButton';
import dynamic from 'next/dynamic';
const CopyIconButton = dynamic(() => import('@/app/components/CopyIconButton'), { ssr: false });
const LoadingIconButton = dynamic(() => import('@/app/components/LoadingIconButton'), { ssr: false });
// const DeleteConfirmDialog = dynamic(() => import('@/app/(pages)/setup/components/DeleteConfirmDialog'), { ssr: false });

const ExternalKeyManager = ({ addonId }: any) => {
    const [externalKey, setExternalKey] = useState<{ id: number | undefined, key: string }>({ id: undefined, key: '' });
    const [externalKeys, setExternalKeys] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [errors, setErrors] = useState('');
    const { token } = useSelector((state: RootState) => state.session);
    const { enqueueSnackbar } = useSnackbar();

    const handleExternalKeyChange = (e: any) => {
        setExternalKey((prev) => { return { ...prev, key: e.target.value } });
        setErrors('');
    };

    const handleCreateExternalKey = async () => {
        if (!externalKey.key || externalKey.key.trim() === '') {
            setErrors('External Key is required.');
            return;
        }

        setErrors('');
        setIsSaving(true);

        try {
            const response = externalKey.id ? await updateExternalKey(externalKey.id, { addon_id: addonId, key_value: externalKey.key }, token) :
                await addExternalKey(addonId, externalKey.key, token);
            if (response.status == 201 || response.status == 200) {
                enqueueSnackbar(`External Key created: ${externalKey.key}`, { variant: 'success' });
                setExternalKey({ id: undefined, key: '' });
                setExternalKeys((prev: any) => [...prev, response.data]);
            }
        } catch (error) {
            console.error('Error creating external key:', error);
            enqueueSnackbar(`Failed to create External Key`, { variant: 'error' });
        } finally {
            setIsSaving(false);
        }
    };

    // const handleCopyKey = (key: string) => {
    //     navigator.clipboard.writeText(key);
    //     enqueueSnackbar(`External Key copied: ${key}`, { variant: 'success' });
    // };

    // const handleCopyKey = (key: string) => {
    //     if (!key) return; // Prevent copying empty keys

    //     if (navigator.clipboard && typeof navigator.clipboard?.writeText === 'function') {
    //         // Use Clipboard API if available
    //         navigator.clipboard.writeText(key)
    //             .then(() => {
    //                 enqueueSnackbar(`External Key copied: ${key}`, { variant: 'success' });
    //             })
    //             .catch((err) => {
    //                 console.error('Clipboard API failed, using fallback:', err);
    //                 fallbackCopyToClipboard(key);
    //             });
    //     } else {
    //         // Use fallback if Clipboard API is unavailable
    //         fallbackCopyToClipboard(key);
    //     }
    // };

    // // Fallback for copying text using a hidden textarea
    // const fallbackCopyToClipboard = (text: string) => {
    //     const textArea = document.createElement('textarea');
    //     textArea.value = text;
    //     textArea.style.position = 'fixed'; // Prevents scrolling to the end of the page
    //     textArea.style.opacity = '0'; // Keeps it invisible
    //     textArea.style.left = '-9999px';
    //     document.body.appendChild(textArea);
    //     textArea.focus();
    //     textArea.select();

    //     try {
    //         const successful = document.execCommand('copy');
    //         if (successful) {
    //             enqueueSnackbar(`External Key copied (fallback): ${text}`, { variant: 'success' });
    //         } else {
    //             enqueueSnackbar('Failed to copy the key (fallback).', { variant: 'error' });
    //         }
    //     } catch (err) {
    //         console.error('Fallback copy failed:', err);
    //         enqueueSnackbar('Failed to copy the key (fallback).', { variant: 'error' });
    //     }

    //     document.body.removeChild(textArea);
    // };


    const handleDeleteKey = async (e: any, id: number) => {
        if (!id) return;

        // const confirmDelete = window.confirm("Are you sure you want to delete this key?");
        // if (!confirmDelete) return;

        try {
            await deleteExternalKey(id, token);
            enqueueSnackbar("Key deleted successfully.", { variant: 'success' });
            // Refresh the external keys list after deletion
            fetchExternalKeys();
        } catch (error) {
            console.error("Error deleting key:", error);
            enqueueSnackbar("Failed to delete the key. Please try again.", { variant: 'error' });
        }
    };

    const fetchExternalKeys = async () => {
        setIsLoading(true);
        setExternalKeys([]);
        try {
            const response = await findAllByAddonId(addonId, token);
            if (response.status == 200) setExternalKeys(response.data);
        } catch (error) {
            console.error('Error fetching external keys:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        // Fetch existing external keys for the given addon

        if (addonId) fetchExternalKeys();
    }, [addonId]);

    return (
        <div className="space-y-6">
            <Box className="pt-4">
                <TextField
                    label="Create External Key"
                    variant="outlined"
                    value={externalKey.key}
                    onChange={handleExternalKeyChange}
                    fullWidth
                    size='small'
                    error={Boolean(errors)}
                    helperText={errors}
                    disabled={isSaving}
                    slotProps={{
                        input: {
                            endAdornment: (
                                <InputAdornment position="end">
                                    {externalKey?.key && <ClearIcon fontSize="small" sx={{ cursor: 'pointer' }} onClick={() => setExternalKey({ id: undefined, key: '' })} />}
                                    <Tooltip
                                        title="Type/Status refers to the identifier used by external systems to categorize templates (e.g., invoice, report). This helps external systems recognize and interact with the template uniquely."
                                        arrow
                                    ><HelpOutlineIcon fontSize="small" sx={{ cursor: 'pointer' }} />
                                    </Tooltip>
                                </InputAdornment>
                            ),
                        }
                    }}
                />
                <div className="flex justify-end mt-3">
                    <Button
                        variant="outlined"
                        color="primary"
                        onClick={handleCreateExternalKey}
                        disabled={isSaving}
                        size='small'
                    >
                        {isSaving ? <CircularProgress size={24} color="inherit" /> : externalKey.id ? 'Update Key' : 'Create Key'}
                    </Button>
                </div>
            </Box>

            {isLoading ? (
                <Skeleton variant="text" width="100%" height={40} />
            ) : (
                externalKeys?.length > 0 && (
                    <Card className="p-4">
                        <Typography variant="h6" className="mb-2">Existing External Keys</Typography>
                        <div>
                            {externalKeys?.map((key, index) => (
                                <div key={index} className="flex justify-between items-center py-2">
                                    <Typography sx={{ cursor: 'pointer' }} onClick={() => setExternalKey({ id: key.id, key: key.key_value })}>{key.key_value}</Typography>
                                    <Box>
                                        {/* <Tooltip title="Copy Key">
                                            <IconButton onClick={() => handleCopyKey(key.key_value)}>
                                                <CopyAll />
                                            </IconButton>
                                        </Tooltip> */}
                                        <CopyIconButton
                                            textToCopy={key?.key_value || ''}
                                            tooltipCopy="Copy"
                                            tooltipCopied="Text copied!"
                                            size="small"
                                            color="info"
                                        />
                                        <Tooltip title="Delete Key">
                                            <LoadingIconButton
                                                onClick={handleDeleteKey}
                                                params={key.id} // Passing ID as a parameter
                                                icon={<DeleteIcon sx={{ fontSize: 16 }} />}
                                                size="small"
                                                variant="error"
                                                isNeedToConfirm={true}
                                                key={key.id}
                                            />
                                            {/* <DeleteConfirmDialog
                                                id={key.id}
                                                onDelete={(id: any) => handleDeleteKey(id)}
                                                variant="icon"
                                                buttonProps={{ size: "small", color: "error" }} // IconButton props
                                            /> */}
                                        </Tooltip>
                                    </Box>
                                </div>
                            ))}
                        </div>
                    </Card>
                )
            )}
        </div>
    );
};

export default ExternalKeyManager;
