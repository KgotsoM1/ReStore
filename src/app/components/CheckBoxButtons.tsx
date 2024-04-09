import { FormGroup, FormControlLabel, Checkbox } from "@mui/material";
import { useState } from "react";

interface Props {
    items: string[];
    checked?: string[];
    onChange: (items: string[]) => void;
}

export default function CheckboxButtons({ items, checked, onChange }: Props) {
    const [checkedItems, setCheckedItems] = useState(checked || []);

    function handleChecked(event: React.ChangeEvent<HTMLInputElement>) {
        const value = event.target.name;
        const currentIndex = checkedItems.findIndex(item => item === value);
        let newChecked: string[] = [];
        if (currentIndex === -1) newChecked = [...checkedItems, value];
        else newChecked = checkedItems.filter(i => i !== value);
        setCheckedItems(newChecked);
        onChange(newChecked);
    }

    return (
        <FormGroup>
            {items.map(item => (
                <FormControlLabel
                    control={<Checkbox
                        checked={checkedItems.indexOf(item) !== -1}
                        onChange={handleChecked}
                        name={item}
                    />}
                    label={item}
                    key={item} />
            ))}
        </FormGroup>
    )
}