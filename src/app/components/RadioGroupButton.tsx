import { FormControl, RadioGroup, FormControlLabel, Radio } from "@mui/material";

interface Option {
    value: string;
    label: string;
}

interface Props {
    options: Option[];
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    selectedValue: string;
}

export default function RadioButtonGroup({ options, onChange, selectedValue }: Props) {
    return (
        <FormControl component="fieldset">
            <RadioGroup onChange={onChange} value={selectedValue}>
                {options.map(({ value, label }) => (
                    <FormControlLabel
                        value={value}
                        control={<Radio />}
                        label={label} 
                        key={value}
                    />
                ))}
            </RadioGroup>
        </FormControl>
    )
}