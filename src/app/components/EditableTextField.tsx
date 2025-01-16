"use client";
import React, { useEffect, useState } from "react";
import { TextField } from "@mui/material";

interface EditableTextFieldProps {
    section: string;
    headerContent: string;
    bodyContent: string;
    footerContent: string;
    setHeaderContent: React.Dispatch<React.SetStateAction<string>>;
    setBodyContent: React.Dispatch<React.SetStateAction<string>>;
    setFooterContent: React.Dispatch<React.SetStateAction<string>>;
}

const EditableTextField: React.FC<EditableTextFieldProps> = ({
    section,
    headerContent,
    bodyContent,
    footerContent,
    setHeaderContent,
    setBodyContent,
    setFooterContent,
}) => {

    const [isClient, setIsClient] = useState(false);
    const [htmlVal, setHtmlValue] = useState('');

    useEffect(() => {
        if (section === "header") setHtmlValue(headerContent);
        if (section === "body") setHtmlValue(bodyContent);
        if (section === "footer") setHtmlValue(footerContent);
        setTimeout(() => {

            setIsClient(true);
        }, 1000)

    }, []);


    if (!isClient) {
        return null; // Or render a loading state
    }
    // Handle content change for each section
    const handleChange = (e: any) => {
        try {
            const value = e.target.value;
            if (section === "header") setHeaderContent(value);
            if (section === "body") setBodyContent(value);
            if (section === "footer") setFooterContent(value);
        } catch (ee) {
            console.log(ee)
        }

    };

    // Determine the value based on section type
    // const getValue = useMemo(() => {
    //     if (section === "header") setHtmlValue(headerContent);
    //     if (section === "body") setHtmlValue(bodyContent);
    //     if (section === "footer") setHtmlValue(footerContent);
    //     return "";
    // }, [headerContent, bodyContent, footerContent]);



    return (
        <TextField
            fullWidth
            label={`${section.charAt(0).toUpperCase() + section.slice(1)} Content`}
            defaultValue={htmlVal}
            onChange={handleChange}
            multiline
            sx={{
                height: "100%", // Full height of the container
                "& .MuiOutlinedInput-root": {
                    flex: 1, // Make the input stretch within its container
                    "& textarea": {
                        resize: "none", // Disable resizing
                        height: "100%", // Full height of the parent
                    },
                },
            }}
        />
    );
};

export default EditableTextField;
