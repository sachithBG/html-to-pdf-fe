import React, { useEffect, useState } from 'react';
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
    Button,
    IconButton,
    Box,
    Skeleton,
} from '@mui/material';
import { CloudUpload, FormatAlignLeft } from '@mui/icons-material';
import Ajv from 'ajv';
import { readPdfTemplate, updateDummyDataPdfTemplate } from '@/app/services/pdfService';
import { RootState } from '@/redux/store';
import { useSelector } from 'react-redux';
import SaveUpdateButton from '@/app/components/SaveUpdateButton';

interface DataUploadButtonProps {
    onSave: (data: string) => void;
    id: number;
}

const DataUploadButton: React.FC<DataUploadButtonProps> = ({ onSave, id }) => {
    const [isDialogOpen, setDialogOpen] = useState(false);
    const [jsonText, setJsonText] = useState('');
    const [error, setError] = useState<string | null>(null);
    // eslint-disable-next-line
    const [isSaving, setSaving] = useState(false);
    const [isLoding, setIsLoding] = useState(false);

    // const currentOrg: Organization | any = useSelector((state: { organization: OrganizationState }) =>
    //     getDefaultOrganization(state.organization)
    // );
    const { token } = useSelector((state: RootState) => state.session);

    useEffect(() => {
        if (id && isDialogOpen) {
            setIsLoding(true);
            const fetchData = async () => {
                try {
                    const response = await readPdfTemplate(id, token);
                    if (response.status == 200) {
                        const { data } = response.data;
                        // console.log(response.data.json)
                        if (data?.json) {
                            const json = JSON.parse(data.json);
                            // json = JSON.parse(json);
                            // console.log(json)
                            setJsonText(JSON.stringify(json, null, 2)); // Format with 2-space indentation
                        }
                    }
                } catch (error) {
                    console.error("Error fetching data for edit mode:", error);
                } finally {
                    setIsLoding(false);
                }
            };
            fetchData();
        }
    }, [id, isDialogOpen]);

    const handleOpenDialog = () => setDialogOpen(true);
    const handleCloseDialog = () => {
        setDialogOpen(false);
        setJsonText('');
        setError(null);
    };

    const handleJsonChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setJsonText(e.target.value);
        setError(null);
    };

    const handleValidateJson = () => {
        try {
            const ajv = new Ajv();
            const parsed = JSON.parse(jsonText);
            const validate = ajv.compile({}); // Minimal validation schema
            if (!validate(parsed) || jsonText?.trim() == '') {
                throw new Error('Invalid JSON structure.');
            }
            setError(null);
            return true;
        } catch (err: any) {
            setError(err.message);
            return false;
        }
    };

    const handleFormatJson = () => {
        try {
            const formatted = JSON.stringify(JSON.parse(jsonText), null, 2);
            setJsonText(formatted);
            setError(null);
        } catch {
            setError('Invalid JSON. Please fix errors before formatting.');
        }
    };

    const handleSave = async () => {
        if (error || !handleValidateJson()) return;
        try {
            setSaving(true);
            await updateDummyDataPdfTemplate(id, jsonText, token);
            const tt = setTimeout(() => {
                onSave(jsonText);
                setSaving(false);
                handleCloseDialog();
                clearTimeout(tt);
            }, 1000); // Simulate async save
        } catch (e: any) {
            setError(e?.message);
            setSaving(false);
        }
    };

    return (
        <>
            <IconButton color="primary" onClick={handleOpenDialog} aria-label="upload">
                <CloudUpload />
            </IconButton>

            <Dialog open={isDialogOpen} onClose={handleCloseDialog} maxWidth="lg" fullWidth>
                <DialogTitle>Upload JSON Data</DialogTitle>

                <DialogContent>
                    {!isLoding ? <>
                        <Box sx={{ display: 'flex', float: 'right', justifyContent: 'space-between', mt: 2 }}>
                            <Button
                                startIcon={<FormatAlignLeft />}
                                onClick={handleFormatJson}
                                color="secondary"
                                variant="outlined"
                                size='small'
                            >
                                Format JSON
                            </Button>
                        </Box>
                        <TextField
                            label="JSON Data"
                            multiline
                            rows={20}
                            fullWidth
                            variant="outlined"
                            value={jsonText}
                            onChange={handleJsonChange}
                            error={!!error}
                            helperText={error || ''}
                            sx={{ mt: 2 }}
                        />
                    </> :
                        <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', mt: 2 }}>
                            <Skeleton variant="text" width="90%" height={30} />
                            <Skeleton variant="text" width="90%" height={30} />
                            <Skeleton variant="text" width="90%" height={30} />
                            <Skeleton variant="text" width="90%" height={30} />
                            <Skeleton variant="text" width="90%" height={30} />
                            <Skeleton variant="text" width="90%" height={30} />
                        </Box>
                    }
                </DialogContent>

                <DialogActions>
                    <Button onClick={handleCloseDialog} color="inherit" size='small'>
                        Cancel
                    </Button>
                    <SaveUpdateButton
                        label="Save"
                        size="small"
                        variant="outlined"
                        color="primary"
                        onClick={handleSave}
                        disabled={false} // Disable based on condition
                    />
                    {/* <Button
                        onClick={handleSave}
                        color="primary"
                        variant="outlined"
                        disabled={isSaving || !!error}
                        startIcon={isSaving ? <CircularProgress size={20} /> : <Save />}
                        size='small'
                    >
                        Save
                    </Button> */}
                </DialogActions>

            </Dialog>
        </>
    );
};

export default DataUploadButton;