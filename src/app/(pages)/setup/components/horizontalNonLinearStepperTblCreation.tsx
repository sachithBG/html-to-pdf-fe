'use client'
import * as React from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepButton from '@mui/material/StepButton';
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import Typography from '@mui/material/Typography';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import { Checkbox, ListItemText } from '@mui/material';

const steps = ['Select Addons', 'Enter Key']; // Only two steps now

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};

interface Props {
    addons: any[];
    selectedAddons: string[];
    tag: string;
    activeStep: number;
    completed: { [k: number]: boolean };
    handleAddonChange: (event: any) => void;
    handleKeyChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    handleCompleteStep: () => void;
    handleNext: () => void;
    handleBack: () => void;
}

export default function HorizontalNonLinearStepperTblCreation({
    addons,
    selectedAddons,
    tag,
    activeStep,
    completed,
    handleAddonChange,
    handleKeyChange,
    handleCompleteStep,
    handleNext,
    handleBack,
}: Props) {
    const [error, setError] = React.useState(false);
    const [helperText, setHelperText] = React.useState('');

    const validateKey = (inputValue: string) => {
        const regex = /^[a-zA-Z].*/;
        if (!regex.test(inputValue)) {
            setError(true);
            setHelperText('Key should start with a letter');
        } else {
            setError(false);
            setHelperText('');
        }
    };

    const handleKeyChangeWithValidation = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = event.target.value;
        handleKeyChange(event); // Update the key in the parent
        validateKey(newValue); // Validate the key
    };

    const allStepsCompleted = () => Object.keys(completed).length === steps.length;

    return (
        <Box sx={{ width: '100%' }}>
            <Stepper nonLinear activeStep={activeStep}>
                {steps.map((label, index) => (
                    <Step key={label} completed={completed[index]}>
                        <StepButton color="inherit" onClick={() => handleNext()}>
                            {label}
                        </StepButton>
                    </Step>
                ))}
            </Stepper>
            <div>
                {allStepsCompleted() ? (
                    <React.Fragment>
                        <Typography sx={{ mt: 2, mb: 1 }}>
                            All steps completed - you&#39;re finished
                        </Typography>
                    </React.Fragment>
                ) : (
                    <React.Fragment>
                        <Typography sx={{ mt: 2, mb: 1, py: 1 }}>
                            Step {activeStep + 1}
                        </Typography>

                        {/* Step 1: Addon multi-select */}
                        {activeStep === 0 && (
                            <FormControl sx={{ m: 1, width: 300 }}>
                                <InputLabel>Addons</InputLabel>
                                <Select
                                    multiple
                                    value={selectedAddons}
                                    onChange={handleAddonChange}
                                    label="Addons"
                                    required
                                    MenuProps={MenuProps}
                                    renderValue={() => addons.filter((addon) => selectedAddons.includes(addon.id)).map((addon) => addon.name).join(', ')}
                                >
                                    {addons.map((ad) => (
                                        <MenuItem key={ad.id} value={ad.id} >
                                            <Checkbox checked={selectedAddons.includes(ad.id)} />
                                            <ListItemText primary={ad.name} />
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        )}

                        {/* Step 2: Key text field */}
                        {activeStep === 1 && (
                            <TextField
                                label="Key"
                                variant="outlined"
                                fullWidth
                                value={tag}
                                onChange={handleKeyChangeWithValidation}
                                required
                                helperText={helperText}
                                error={error}
                            />
                        )}

                        <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                            <Button
                                color="inherit"
                                disabled={activeStep === 0}
                                onClick={handleBack}
                                sx={{ mr: 1 }}
                                variant='outlined'
                                size='small'
                            >
                                Back
                            </Button>
                            <Box sx={{ flex: '1 1 auto' }} />
                            {activeStep === 1 && (
                                <Button
                                    onClick={handleCompleteStep}
                                    sx={{ mr: 1 }}
                                    disabled={tag?.match(/^[a-zA-Z].*/) === null || completed[activeStep]}
                                    variant='outlined'
                                    size='small'
                                >
                                    Complete
                                </Button>
                            )}
                            {activeStep !== steps.length - 1 && !completed[activeStep] && (
                                <Button variant='outlined' size='small' onClick={handleNext} disabled={error}>
                                    {completed[activeStep] ? 'Completed' : 'Next'}
                                </Button>
                            )}

                        </Box>
                    </React.Fragment>
                )}
            </div>
        </Box>
    );
};

