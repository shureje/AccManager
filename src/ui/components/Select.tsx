interface SelectOption {
    value: string;
    label: string;
}

interface SelectProps {
    name?: string;
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    options: SelectOption[];
}

export default function Select({name, value, onChange, options}: SelectProps) {
    return (
        <select 
            name={name}
            value={value}
            onChange={onChange}
            className="text-sm pl-2 py-[2px] bg-primary rounded-md border-[1px] border-border/25"
        >
            {options.map(option => (
                <option key={option.value} value={option.value}>
                    {option.label}
                </option>
            ))}
        </select>
    );
}