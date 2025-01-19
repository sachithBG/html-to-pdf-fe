import React, { useEffect, useState } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import { Box, Skeleton, useTheme } from '@mui/material';
import { defaultConfig, MyUploadAdapter } from '@/app/utils/editor.utils';
import { ClassicEditor } from 'ckeditor5';
import 'ckeditor5/ckeditor5.css';

interface CKTextFieldProps {
    value: string;
    onChange: (data: string) => void;
    placeholder?: string;
    isLoading?: boolean;
    config?: Record<string, any>; // Optional additional configuration
    token?: string,
    orgId?: number
}

const CKTextField: React.FC<CKTextFieldProps> = ({
    value,
    onChange,
    placeholder = 'Type your content here...',
    isLoading = false,
    config = {},
    token,
    orgId
}) => {
    const [editorInstance, setEditorInstance] = useState<any>(null);
    const [isEditorReady, setIsEditorReady] = useState(false);
    const theme = useTheme();
    const handleEditorUnmount = () => {
        // Cleanup when the editor is unmounted
        if (editorInstance) {
            editorInstance.destroy().catch((error: any) => {
                console.error('Error while destroying the editor:', error);
            });
        }
    };
    // eslint-disable-next-line
    const uploadAdapterPlugin = (editor: any, token: string, orgId: number) => {
        // Custom plugin logic for handling uploads, using the token and orgId
        // This will likely use the token and orgId to make authenticated requests for uploading images/files
        // Example plugin implementation:
        editor.plugins.get('FileRepository').createUploadAdapter = (loader: any) => {
            return new MyUploadAdapter(loader, token, orgId);
        };
    };
    useEffect(() => {
        return () => {
            handleEditorUnmount();  // Ensure cleanup when the component unmounts
            console.log(token)
            console.log(orgId)
        };
    }, [editorInstance]);
    return (
        <Box>
            {isLoading || !isEditorReady ? (
                <Skeleton
                    variant="rectangular"
                    width="100%"
                    height={200}
                    sx={{ borderRadius: 2, marginBottom: 2 }}
                />
            ) : null}
            <Box sx={{
                ml: !isLoading ? 0 : -5000, position: !isLoading ? 'relative' : 'absolute',
                '& .ck-content, .ck-source-editing-area textarea ': {
                    color: theme.palette.mode === 'dark' ? '#ffffff !important' : 'inherit',
                    backgroundColor: theme.palette.mode === 'dark' ? '#28292a !important' : 'inherit',
                    fontSize: '16px',
                    lineHeight: '1.5',
                    padding: '16px',
                    minHeight: '150px'
                },
                '& .ck-toolbar':{
                    // color: theme.palette.mode === 'dark' ? '#ffffff !important' : 'inherit',
                    backgroundColor: theme.palette.mode === 'dark' ? '#dde1ea !important' : 'inherit',
                }
             }}>
                <CKEditor
                    editor={ClassicEditor}
                    config={{
                        ...defaultConfig, initialData: value, placeholder: placeholder
                        , ...config,
                        // extraPlugins: [(editor: any) => uploadAdapterPlugin(editor, token, orgId)],
                    }}
                    data={value}
                    onReady={(editor) => {
                        setIsEditorReady(true);
                        setEditorInstance(editor);
                    }}
                    onChange={(event: any, editor: any) => {
                        const data = editor.getData();
                        onChange(data);
                    }}
                />
            </Box>
        </Box>
    );
};


export default CKTextField;
