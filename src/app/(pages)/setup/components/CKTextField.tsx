import React, { useEffect, useRef, useState } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import { Box, LinearProgress, Skeleton, useTheme } from '@mui/material';
import { defaultConfig } from '@/app/utils/editor.utils';
import { ClassicEditor } from 'ckeditor5';
import 'ckeditor5/ckeditor5.css';
// import { UploadAdapter } from '@/app/utils/UploadAdapter';
import { useSnackbar } from 'notistack';
import ImageNameDialog from './ImageNameDialog';
import { MyUploadAdapter } from '@/app/utils/UploadAdapter';
export const baseURL = process.env.NEXT_PUBLIC_BASE_URL;

interface CKTextFieldProps {
    value: string;
    onChange: (data: string) => void;
    placeholder?: string;
    isLoading?: boolean;
    config?: Record<string, any>; // Optional additional configuration
    token?: string,
    orgId?: number,
    addon_ids?: number[],
    isTestingMode?: boolean
}

const CKTextField: React.FC<CKTextFieldProps> = ({
    value,
    onChange,
    placeholder = 'Type your content here...',
    isLoading = false,
    config = {},
    token,
    orgId,
    addon_ids,
    isTestingMode = false,
}) => {
    const [editorInstance, setEditorInstance] = useState<any>(null);
    const [isEditorReady, setIsEditorReady] = useState(false);
    const editorRef = useRef<any>(null);
    const theme = useTheme();
    const [imageName, setImageName] = useState<string>('');
    const [dialogOpen, setDialogOpen] = useState<boolean>(false); 
    // eslint-disable-next-line
    const [uploadProgress, setUploadProgress] = useState<number>(0);
    const [imgUploading, setImgUploading] = useState<boolean>(false);
    // eslint-disable-next-line
    const [uploadAdapter, setUploadAdapter] = useState<MyUploadAdapter>(new MyUploadAdapter());
    const { enqueueSnackbar } = useSnackbar();

    
    const handleEditorUnmount = () => {
        // Cleanup when the editor is unmounted
        if (editorInstance) {
            editorInstance.destroy().catch((error: any) => {
                console.error('Error while destroying the editor:', error);
            });
        }
    };

    const handleImageNameDialogClose = (name: string) => {
        setDialogOpen(false);
        if (name) {
            setImageName(name);
            // enqueueSnackbar(`Image name "${name}" selected.`, { variant: 'info' });
        } else {
            uploadAdapter.setCrash(true);
            setImageName('');
        }
    };

    function uploadAdapterPlugin(editor: { plugins: { get: (arg0: string) => { (): any; new(): any; createUploadAdapter: (loader: any) => MyUploadAdapter } } }) {
        uploadAdapter.setDialogOpen_(setDialogOpen)
            .setUploadProgress_(setUploadProgress).setUploading_(setImgUploading);
        editor.plugins.get("FileRepository").createUploadAdapter = (loader: any) =>
            uploadAdapter.setLoader(loader).setNotification(enqueueSnackbar);
    }



    useEffect(() => {
        return () => {
            handleEditorUnmount();  // Ensure cleanup when the component unmounts
            // console.log(token)
            // console.log(orgId)
        };
    }, [editorInstance]);

    useEffect(() => {
        uploadAdapter.setOther(token, orgId || 0, addon_ids || []);
        uploadAdapter.setImgName(imageName);
    }, [token, orgId, addon_ids, imageName]);
    return (
        <Box>
            
            {imgUploading && <Box sx={{ width: '100%' }}>
                <LinearProgress sx={{width: 100, float:'right', mt: -3}}/>
            </Box>}
            {isLoading || !isEditorReady ? (
                <Skeleton
                    variant="rectangular"
                    width="100%"
                    height={200}
                    sx={{ borderRadius: 2, marginBottom: 2 }}
                />
            ) : null}
            <Box
                sx={{
                    ml: !isLoading ? 0 : -5000, position: !isLoading ? 'relative' : 'absolute',
                    '& .ck-content, .ck-source-editing-area textarea': {
                        color: 'black !important',// theme.palette.mode === 'dark' ? '#ffffff !important' : 'black !important',
                        backgroundColor: 'white !important',// theme.palette.mode === 'dark' ? '#28292a !important' : 'inherit',
                        fontSize: '14px',
                        lineHeight: '1.5',
                        padding: '16px',
                        minHeight: '150px',
                        fontFamily: 'Roboto, sans-serif',
                    },
                    '& .ck-toolbar': {
                        // color: theme.palette.mode === 'dark' ? '#ffffff !important' : 'inherit',
                        backgroundColor: theme.palette.mode === 'dark' ? '#dde1ea !important' : 'inherit',
                    }
                }}
            >
                <CKEditor
                    editor={ClassicEditor}
                    config={{
                        ...defaultConfig, initialData: value, placeholder: placeholder
                        , ...config,
                        // extraPlugins: [CustomUploadAdapterPlugin],
                        // extraPlugins: [(editor: any) => new CustomUploadAdapterPlugin(editor, 'uploadUrl')],
                        // extraPlugins: [(editor: any) => uploadAdapterPlugin(editor, token, orgId)],
                    }}
                    data={value}
                    onReady={(editor) => {
                        setIsEditorReady(true);
                        setEditorInstance(editor);
                        editorRef.current = editor;
                        // alert(token)
                        if (!isTestingMode) uploadAdapterPlugin(editor);
                    }}
                    onChange={(event: any, editor: any) => {
                        const data = editor.getData();
                        onChange(data);
                    }}
                />
                <ImageNameDialog open={dialogOpen} onClose={handleImageNameDialogClose} />
            </Box>
        </Box>
    );
};


export default CKTextField;
