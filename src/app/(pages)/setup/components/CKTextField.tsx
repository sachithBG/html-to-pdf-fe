import React, { useState } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import { Box, Skeleton, useTheme } from '@mui/material';
import { defaultConfig } from '@/app/utils/editor.utils';
import { ClassicEditor } from 'ckeditor5';
import 'ckeditor5/ckeditor5.css';

interface CKTextFieldProps {
    value: string;
    onChange: (data: string) => void;
    placeholder?: string;
    isLoading?: boolean;
    config?: Record<string, any>; // Optional additional configuration
}
 
const CKTextField: React.FC<CKTextFieldProps> = ({
    value,
    onChange,
    placeholder = 'Type your content here...',
    isLoading = false,
    config = {},
}) => {
    const [isEditorReady, setIsEditorReady] = useState(false);
    const theme = useTheme();
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
                        , ...config
                    }}
                    data={value}
                    onReady={() => {
                        setIsEditorReady(true);
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

const conf: any = {
    toolbar: {
        items: [
            'heading',
            '|',
            'undo',
            'redo',
            '|',
            'bold',
            'italic',
            'underline',
            'horizontalLine',
            'link',
            'bulletedList',
            'numberedList',
            '|',
            'outdent',
            'indent',
            'alignment',
            'todoList',
            '|',
            'code',
            'codeBlock',
            '|',
            'fontBackgroundColor',
            'fontColor',
            'fontFamily',
            'fontSize',
            'highlight',
            'removeFormat',
            '|',
            'imageUpload',
            'imageInsert',
            'mediaEmbed',
            '|',
            'insertTable',
            'pageBreak',
            'blockQuote',
            '|',
            'strikethrough',
            'specialCharacters',
            '|',
            'textPartLanguage',
            '|',
            'htmlEmbed',
            'restrictedEditingException',
        ],
        shouldNotGroupWhenFull: true,
        baseFloatZIndex: 100001,
    },
    language: 'en',
    image: {
        toolbar: [
            'imageTextAlternative',
            'toggleImageCaption',
            'imageStyle:inline',
            'imageStyle:block',
            'imageStyle:side',
            'linkImage',
        ],
        upload: {
            types: ['jpeg', 'png', 'gif', 'bmp', 'webp', 'tiff'],
        },
        resizeUnit: '%',
        resizeOptions: [
            {
                name: 'resizeImage:original',
                value: null,
                icon: 'original',
            },
            {
                name: 'resizeImage:25',
                value: '25',
                icon: 'small',
            },
            {
                name: 'resizeImage:50',
                value: '50',
                icon: 'medium',
            },
            {
                name: 'resizeImage:75',
                value: '75',
                icon: 'large',
            },
        ],
        styles: {
            options: [
                'inline',
                'alignLeft',
                'alignRight',
                'alignCenter',
                'alignBlockLeft',
                'alignBlockRight',
                'block',
                'side',
            ],
        },
    },
    table: {
        contentToolbar: [
            'tableColumn',
            'tableRow',
            'mergeTableCells',
            'tableCellProperties',
            'tableProperties',
        ],
        tableCellProperties: {
            borderColors: [
                {
                    color: 'hsl(0, 0%, 0%)',
                    label: 'Black',
                },
                {
                    color: 'hsl(0, 0%, 30%)',
                    label: 'Dim grey',
                },
                {
                    color: 'hsl(0, 0%, 60%)',
                    label: 'Grey',
                },
                {
                    color: 'hsl(0, 0%, 90%)',
                    label: 'Light grey',
                },
                {
                    color: 'hsl(0, 0%, 100%)',
                    label: 'White',
                    hasBorder: true,
                },
                {
                    color: 'hsl(0, 75%, 60%)',
                    label: 'Red',
                },
                {
                    color: 'hsl(30, 75%, 60%)',
                    label: 'Orange',
                },
                {
                    color: 'hsl(60, 75%, 60%)',
                    label: 'Yellow',
                },
                {
                    color: 'hsl(90, 75%, 60%)',
                    label: 'Light green',
                },
                {
                    color: 'hsl(120, 75%, 60%)',
                    label: 'Green',
                },
                {
                    color: 'hsl(150, 75%, 60%)',
                    label: 'Aquamarine',
                },
                {
                    color: 'hsl(180, 75%, 60%)',
                    label: 'Turquoise',
                },
                {
                    color: 'hsl(210, 75%, 60%)',
                    label: 'Light blue',
                },
                {
                    color: 'hsl(240, 75%, 60%)',
                    label: 'Blue',
                },
                {
                    color: 'hsl(270, 75%, 60%)',
                    label: 'Purple',
                },
            ],
            backgroundColors: [
                {
                    color: 'hsl(0, 0%, 0%)',
                    label: 'Black',
                },
                {
                    color: 'hsl(0, 0%, 30%)',
                    label: 'Dim grey',
                },
                {
                    color: 'hsl(0, 0%, 60%)',
                    label: 'Grey',
                },
                {
                    color: 'hsl(0, 0%, 90%)',
                    label: 'Light grey',
                },
                {
                    color: 'hsl(0, 0%, 100%)',
                    label: 'White',
                    hasBorder: true,
                },
                {
                    color: 'hsl(0, 75%, 60%)',
                    label: 'Red',
                },
                {
                    color: 'hsl(30, 75%, 60%)',
                    label: 'Orange',
                },
                {
                    color: 'hsl(60, 75%, 60%)',
                    label: 'Yellow',
                },
                {
                    color: 'hsl(90, 75%, 60%)',
                    label: 'Light green',
                },
                {
                    color: 'hsl(120, 75%, 60%)',
                    label: 'Green',
                },
                {
                    color: 'hsl(150, 75%, 60%)',
                    label: 'Aquamarine',
                },
                {
                    color: 'hsl(180, 75%, 60%)',
                    label: 'Turquoise',
                },
                {
                    color: 'hsl(210, 75%, 60%)',
                    label: 'Light blue',
                },
                {
                    color: 'hsl(240, 75%, 60%)',
                    label: 'Blue',
                },
                {
                    color: 'hsl(270, 75%, 60%)',
                    label: 'Purple',
                },
            ],
            defaultProperties: {},
        },
        tableProperties: {
            borderColors: [
                {
                    color: 'hsl(0, 0%, 0%)',
                    label: 'Black',
                },
                {
                    color: 'hsl(0, 0%, 30%)',
                    label: 'Dim grey',
                },
                {
                    color: 'hsl(0, 0%, 60%)',
                    label: 'Grey',
                },
                {
                    color: 'hsl(0, 0%, 90%)',
                    label: 'Light grey',
                },
                {
                    color: 'hsl(0, 0%, 100%)',
                    label: 'White',
                    hasBorder: true,
                },
                {
                    color: 'hsl(0, 75%, 60%)',
                    label: 'Red',
                },
                {
                    color: 'hsl(30, 75%, 60%)',
                    label: 'Orange',
                },
                {
                    color: 'hsl(60, 75%, 60%)',
                    label: 'Yellow',
                },
                {
                    color: 'hsl(90, 75%, 60%)',
                    label: 'Light green',
                },
                {
                    color: 'hsl(120, 75%, 60%)',
                    label: 'Green',
                },
                {
                    color: 'hsl(150, 75%, 60%)',
                    label: 'Aquamarine',
                },
                {
                    color: 'hsl(180, 75%, 60%)',
                    label: 'Turquoise',
                },
                {
                    color: 'hsl(210, 75%, 60%)',
                    label: 'Light blue',
                },
                {
                    color: 'hsl(240, 75%, 60%)',
                    label: 'Blue',
                },
                {
                    color: 'hsl(270, 75%, 60%)',
                    label: 'Purple',
                },
            ],
            backgroundColors: [
                {
                    color: 'hsl(0, 0%, 0%)',
                    label: 'Black',
                },
                {
                    color: 'hsl(0, 0%, 30%)',
                    label: 'Dim grey',
                },
                {
                    color: 'hsl(0, 0%, 60%)',
                    label: 'Grey',
                },
                {
                    color: 'hsl(0, 0%, 90%)',
                    label: 'Light grey',
                },
                {
                    color: 'hsl(0, 0%, 100%)',
                    label: 'White',
                    hasBorder: true,
                },
                {
                    color: 'hsl(0, 75%, 60%)',
                    label: 'Red',
                },
                {
                    color: 'hsl(30, 75%, 60%)',
                    label: 'Orange',
                },
                {
                    color: 'hsl(60, 75%, 60%)',
                    label: 'Yellow',
                },
                {
                    color: 'hsl(90, 75%, 60%)',
                    label: 'Light green',
                },
                {
                    color: 'hsl(120, 75%, 60%)',
                    label: 'Green',
                },
                {
                    color: 'hsl(150, 75%, 60%)',
                    label: 'Aquamarine',
                },
                {
                    color: 'hsl(180, 75%, 60%)',
                    label: 'Turquoise',
                },
                {
                    color: 'hsl(210, 75%, 60%)',
                    label: 'Light blue',
                },
                {
                    color: 'hsl(240, 75%, 60%)',
                    label: 'Blue',
                },
                {
                    color: 'hsl(270, 75%, 60%)',
                    label: 'Purple',
                },
            ],
            defaultProperties: {},
        },
        defaultHeadings: {
            rows: 0,
            columns: 0,
        },
    },
    TextTransformation: false,
    fullPage: true,
    removePlugins: ['SourceEditing', 'TextPartLanguage'],
    initialData: '<p>Hello from CKEditor 5!</p>',
    alignment: {
        options: [
            {
                name: 'left',
            },
            {
                name: 'right',
            },
            {
                name: 'center',
            },
            {
                name: 'justify',
            },
        ],
    },
    codeBlock: {
        languages: [
            {
                language: 'plaintext',
                label: 'Plain text',
            },
            {
                language: 'c',
                label: 'C',
            },
            {
                language: 'cs',
                label: 'C#',
            },
            {
                language: 'cpp',
                label: 'C++',
            },
            {
                language: 'css',
                label: 'CSS',
            },
            {
                language: 'diff',
                label: 'Diff',
            },
            {
                language: 'html',
                label: 'HTML',
            },
            {
                language: 'java',
                label: 'Java',
            },
            {
                language: 'javascript',
                label: 'JavaScript',
            },
            {
                language: 'php',
                label: 'PHP',
            },
            {
                language: 'python',
                label: 'Python',
            },
            {
                language: 'ruby',
                label: 'Ruby',
            },
            {
                language: 'typescript',
                label: 'TypeScript',
            },
            {
                language: 'xml',
                label: 'XML',
            },
        ],
        indentSequence: '\t',
    },
    fontBackgroundColor: {
        colors: [
            {
                color: 'hsl(0, 0%, 0%)',
                label: 'Black',
            },
            {
                color: 'hsl(0, 0%, 30%)',
                label: 'Dim grey',
            },
            {
                color: 'hsl(0, 0%, 60%)',
                label: 'Grey',
            },
            {
                color: 'hsl(0, 0%, 90%)',
                label: 'Light grey',
            },
            {
                color: 'hsl(0, 0%, 100%)',
                label: 'White',
                hasBorder: true,
            },
            {
                color: 'hsl(0, 75%, 60%)',
                label: 'Red',
            },
            {
                color: 'hsl(30, 75%, 60%)',
                label: 'Orange',
            },
            {
                color: 'hsl(60, 75%, 60%)',
                label: 'Yellow',
            },
            {
                color: 'hsl(90, 75%, 60%)',
                label: 'Light green',
            },
            {
                color: 'hsl(120, 75%, 60%)',
                label: 'Green',
            },
            {
                color: 'hsl(150, 75%, 60%)',
                label: 'Aquamarine',
            },
            {
                color: 'hsl(180, 75%, 60%)',
                label: 'Turquoise',
            },
            {
                color: 'hsl(210, 75%, 60%)',
                label: 'Light blue',
            },
            {
                color: 'hsl(240, 75%, 60%)',
                label: 'Blue',
            },
            {
                color: 'hsl(270, 75%, 60%)',
                label: 'Purple',
            },
        ],
        columns: 5,
    },
    fontColor: {
        colors: [
            {
                color: 'hsl(0, 0%, 0%)',
                label: 'Black',
            },
            {
                color: 'hsl(0, 0%, 30%)',
                label: 'Dim grey',
            },
            {
                color: 'hsl(0, 0%, 60%)',
                label: 'Grey',
            },
            {
                color: 'hsl(0, 0%, 90%)',
                label: 'Light grey',
            },
            {
                color: 'hsl(0, 0%, 100%)',
                label: 'White',
                hasBorder: true,
            },
            {
                color: 'hsl(0, 75%, 60%)',
                label: 'Red',
            },
            {
                color: 'hsl(30, 75%, 60%)',
                label: 'Orange',
            },
            {
                color: 'hsl(60, 75%, 60%)',
                label: 'Yellow',
            },
            {
                color: 'hsl(90, 75%, 60%)',
                label: 'Light green',
            },
            {
                color: 'hsl(120, 75%, 60%)',
                label: 'Green',
            },
            {
                color: 'hsl(150, 75%, 60%)',
                label: 'Aquamarine',
            },
            {
                color: 'hsl(180, 75%, 60%)',
                label: 'Turquoise',
            },
            {
                color: 'hsl(210, 75%, 60%)',
                label: 'Light blue',
            },
            {
                color: 'hsl(240, 75%, 60%)',
                label: 'Blue',
            },
            {
                color: 'hsl(270, 75%, 60%)',
                label: 'Purple',
            },
        ],
        columns: 5,
    },
    fontFamily: {
        options: [
            'default',
            'Arial, Helvetica, sans-serif',
            'Courier New, Courier, monospace',
            'Georgia, serif',
            'Lucida Sans Unicode, Lucida Grande, sans-serif',
            'Tahoma, Geneva, sans-serif',
            'Times New Roman, Times, serif',
            'Trebuchet MS, Helvetica, sans-serif',
            'Verdana, Geneva, sans-serif',
        ],
        supportAllValues: false,
    },
    fontSize: {
        options: ['tiny', 'small', 'default', 'big', 'huge'],
        supportAllValues: false,
    },
    heading: {
        options: [
            {
                model: 'paragraph',
                title: 'Paragraph',
                class: 'ck-heading_paragraph',
            },
            {
                model: 'heading1',
                view: 'h2',
                title: 'Heading 1',
                class: 'ck-heading_heading1',
            },
            {
                model: 'heading2',
                view: 'h3',
                title: 'Heading 2',
                class: 'ck-heading_heading2',
            },
            {
                model: 'heading3',
                view: 'h4',
                title: 'Heading 3',
                class: 'ck-heading_heading3',
            },
        ],
    },
    highlight: {
        options: [
            {
                model: 'yellowMarker',
                class: 'marker-yellow',
                title: 'Yellow marker',
                color: 'var(--ck-highlight-marker-yellow)',
                type: 'marker',
            },
            {
                model: 'greenMarker',
                class: 'marker-green',
                title: 'Green marker',
                color: 'var(--ck-highlight-marker-green)',
                type: 'marker',
            },
            {
                model: 'pinkMarker',
                class: 'marker-pink',
                title: 'Pink marker',
                color: 'var(--ck-highlight-marker-pink)',
                type: 'marker',
            },
            {
                model: 'blueMarker',
                class: 'marker-blue',
                title: 'Blue marker',
                color: 'var(--ck-highlight-marker-blue)',
                type: 'marker',
            },
            {
                model: 'redPen',
                class: 'pen-red',
                title: 'Red pen',
                color: 'var(--ck-highlight-pen-red)',
                type: 'pen',
            },
            {
                model: 'greenPen',
                class: 'pen-green',
                title: 'Green pen',
                color: 'var(--ck-highlight-pen-green)',
                type: 'pen',
            },
        ],
    },
    htmlEmbed: {
        showPreviews: false,
    },
    indentBlock: {
        offset: 40,
        unit: 'px',
    },
    link: {
        addTargetToExternalLinks: false,
    },
    list: {
        properties: {
            styles: true,
            startIndex: false,
            reversed: false,
        },
    },
    mediaEmbed: {
        elementName: 'oembed',
        providers: [
            {
                name: 'dailymotion',
                url: {},
            },
            {
                name: 'spotify',
                url: [{}, {}, {}],
            },
            {
                name: 'youtube',
                url: [{}, {}, {}, {}],
            },
            {
                name: 'vimeo',
                url: [{}, {}, {}, {}, {}, {}, {}],
            },
            {
                name: 'instagram',
                url: {},
            },
            {
                name: 'twitter',
                url: {},
            },
            {
                name: 'googleMaps',
                url: [{}, {}, {}, {}],
            },
            {
                name: 'flickr',
                url: {},
            },
            {
                name: 'facebook',
                url: {},
            },
        ],
    },
    typing: {
        transformations: {
            include: ['symbols', 'mathematical', 'typography', 'quotes'],
        },
    },
};;
export default CKTextField;
