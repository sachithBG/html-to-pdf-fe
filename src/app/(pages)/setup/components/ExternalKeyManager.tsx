import { useState, useEffect, useMemo } from 'react';
import { TextField, Button, Card, Typography, IconButton, Tooltip, CircularProgress, Snackbar, Alert, Box, Skeleton, InputAdornment } from '@mui/material';
import { CopyAll, Delete } from '@mui/icons-material';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { addExternalKey, deleteExternalKey, findAllByAddonId, updateExternalKey } from '@/app/services/externalKeyService';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import ClearIcon from '@mui/icons-material/Clear';
import { useSession } from 'next-auth/react';

const ExternalKeyManager = ({ addonId }: any) => {
    const [externalKey, setExternalKey] = useState<{ id: number | undefined, key: string }>({ id: undefined, key: '' });
    const [externalKeys, setExternalKeys] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [errors, setErrors] = useState('');
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [copiedText, setCopiedText] = useState('');
    const router = useRouter();
    const { data: session }: any = useSession();
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarSeverity, setSnackbarSeverity] = useState("success"); // or "error"


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
            const response = externalKey.id ? await updateExternalKey(externalKey.id, { addon_id: addonId, key_value: externalKey.key }, session?.user?.token) :
                await addExternalKey(addonId, externalKey.key, session?.user?.token);
            if (response.status == 201 || response.status == 200) {
                setSnackbarOpen(true);
                setCopiedText(externalKey.key);
                setExternalKey({ id: undefined, key: '' });
                setExternalKeys((prev: any) => [...prev, response.data]);
            }
        } catch (error) {
            console.error('Error creating external key:', error);
            setSnackbarOpen(true);
            setCopiedText('Failed to create External Key');
        } finally {
            setIsSaving(false);
        }
    };

    const handleCopyKey = (key: string) => {
        navigator.clipboard.writeText(key);
        setSnackbarOpen(true);
        setCopiedText(`External Key copied: ${key}`);
    };

    const handleDeleteKey = async (id: number) => {
        if (!id) return;

        const confirmDelete = window.confirm("Are you sure you want to delete this key?");
        if (!confirmDelete) return;

        try {
            await deleteExternalKey(id, session?.user?.token);
            setSnackbarMessage("Key deleted successfully.");
            setSnackbarSeverity("success");
            setSnackbarOpen(true);
            // Refresh the external keys list after deletion
            fetchExternalKeys();
        } catch (error) {
            console.error("Error deleting key:", error);
            setSnackbarMessage("Failed to delete the key. Please try again.");
            setSnackbarSeverity("error");
            setSnackbarOpen(true);
        }
    };

    const fetchExternalKeys = async () => {
        setIsLoading(true);
        setExternalKeys([]);
        try {
            const response = await findAllByAddonId(addonId, session?.user?.token);
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

    const sortedKeys = useMemo(() => {
        if (externalKeys)
            return externalKeys?.slice().sort((a, b) => a.key_value.localeCompare(b.key_value));
        else[]
    }, [externalKeys]);

    return (
        <div className="space-y-6">
            <Box className="pt-4">
                <TextField
                    label="Create External Key"
                    variant="outlined"
                    value={externalKey.key}
                    onChange={handleExternalKeyChange}
                    fullWidth
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
                        variant="contained"
                        color="primary"
                        onClick={handleCreateExternalKey}
                        disabled={isSaving}
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
                                        <Tooltip title="Copy Key">
                                            <IconButton onClick={() => handleCopyKey(key.key_value)}>
                                                <CopyAll />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Delete Key">
                                            <IconButton onClick={() => handleDeleteKey(key.id)}>
                                                <Delete />
                                            </IconButton>
                                        </Tooltip>
                                    </Box>
                                </div>
                            ))}
                        </div>
                    </Card>
                )
            )}

            <Snackbar
                open={snackbarOpen}
                autoHideDuration={3000}
                onClose={() => setSnackbarOpen(false)}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                sx={{ marginTop: 8 }}
            >
                <Alert onClose={() => setSnackbarOpen(false)} severity={copiedText.includes('Failed') ? "error" : "success"} sx={{ width: '100%' }}>
                    {copiedText}
                </Alert>
            </Snackbar>
        </div>
    );
};

export default ExternalKeyManager;
