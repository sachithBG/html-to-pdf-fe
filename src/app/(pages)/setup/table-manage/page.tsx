"use client";
import { SyntheticEvent, useCallback, useState } from 'react';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import TableManagePage from '../components/tableManagePage';
import HorizontalNonLinearStepperTblCreation from '../components/horizontalNonLinearStepperTblCreation';
import { Stack } from '@mui/system';
import { Chip, Typography } from '@mui/material';


const addons_ = [
    { id: 1, name: 'TEXT!' },
    { id: 2, name: 'TEXT2!' },
    { id: 3, name: 'TEXT3!' },
    { id: 4, name: 'TEXT4!' },
];

export default function LabTabs() {
    const [value, setValue] = useState('1');
    const [selectedAddons, setSelectedAddons] = useState<string[]>([]);
    const [selectedAddonsV2, setSelectedAddonsV2] = useState<any[]>([]);
    const [addons, setAddons] = useState<any[]>(addons_);
    const [tagKey, setTagKey] = useState('');
    const [completed, setCompleted] = useState<{ [k: number]: boolean }>({});
    const [activeStep, setActiveStep] = useState(0);
    const [tag, setTag] = useState();

    const handleChange = (event: SyntheticEvent, newValue: string) => {
        setValue(newValue);
    };


    // Memoizing the function to handle addon selection change
    const handleAddonChange = useCallback((event: any) => {
        let val = event.target.value as string[];
        console.log(val);
        setSelectedAddons(() => val);
        setSelectedAddonsV2((pr) => addons.filter((addon: any) => val.includes(addon.id)));
    }, []);

    // Memoizing the function to handle key input change
    const handleKeyChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        // console.log(event.target.value);
        setTagKey(() => event.target.value);
    }, []);

    // Memoizing the function to handle step completion
    const handleCompleteStep = useCallback(async () => {
        const response = await fetch(process.env.NEXT_PUBLIC_BASE_URL + 'v1/tag', {
            method: 'POST',
            body: JSON.stringify({ addons: selectedAddonsV2, key: tagKey }),
            headers: { 'Content-Type': 'application/json' },
        });

        if (response.ok) {
            const data = await response.json();
            console.log(data.data);
            setTag(() => data.data);
            setCompleted({
                ...completed,
                [activeStep]: true,
            });
            // Proceed to the next step after successful completion
            setActiveStep((prevStep) => prevStep + 1);
        } else {
            console.error('Failed to complete');
            setCompleted({
                ...completed,
                [activeStep]: true,
            });
            setActiveStep((prevStep) => prevStep + 1);
        }
    }, [selectedAddons, tagKey, activeStep, completed]);

    // Memoizing the function to handle moving to the next step
    const handleNext = useCallback(() => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }, []);

    // Memoizing the function to handle going back to the previous step
    const handleBack = useCallback(() => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    }, []);



    return (
        <Box sx={{ width: '100%', typography: 'body1' }}>
            <TabContext value={value}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <TabList onChange={handleChange} aria-label="lab API tabs example">
                        <Tab label="All Tables" value="1" />
                        <Tab label="New Table" value="2" />
                        {/* <Tab label="Item Three" value="3" /> */}
                    </TabList>
                </Box>
                <TabPanel value="1">table of image list</TabPanel>
                <TabPanel value="2">
                    {
                        completed[1] ?
                            <>
                                {/* Main container */}
                                <Box className="flex flex-col md:flex-row md:space-x-8 p-4">
                                    {/* Left Column: Selected Addons */}
                                    <Box className="mb-4 md:mb-0 flex-1">

                                        <Stack direction="row" spacing={1} flexWrap="wrap">
                                            <Typography className="font-bold text-lg mb-2">Selected Addons : </Typography>
                                            {selectedAddonsV2.map((dd: any) => (
                                                <Typography key={dd.id} variant='inherit' >{dd.name} , </Typography>
                                            ))}
                                        </Stack>
                                    </Box>

                                    {/* Right Column: Key */}
                                    <Box className="flex-1">
                                        {/* <h3 className="font-bold text-lg mb-2">Key</h3> */}
                                        <Stack direction="row" spacing={1}>
                                            <Typography className="font-bold text-lg mb-2">Key : </Typography>
                                            <Typography variant='inherit' > {' {{' + tagKey + '}}'}</Typography>
                                        </Stack>
                                    </Box>
                                </Box>

                                {/* Table Component */}
                                <TableManagePage id={null} tag={tag} />
                            </>

                            :
                            <HorizontalNonLinearStepperTblCreation
                                addons={addons}
                                selectedAddons={selectedAddons}
                                tag={tagKey}
                                activeStep={activeStep}
                                completed={completed}
                                handleAddonChange={handleAddonChange}
                                handleKeyChange={handleKeyChange}
                                handleCompleteStep={handleCompleteStep}
                                handleNext={handleNext}
                                handleBack={handleBack}
                            />
                    }

                </TabPanel>
                {/* <TabPanel value="3">Item Three</TabPanel> */}
            </TabContext>
        </Box>
    );
}