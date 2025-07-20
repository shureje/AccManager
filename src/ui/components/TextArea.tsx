interface TextAreaProps {
    placeholder?: string;
    name?: string;
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    rows?: number;
}

export default function TextArea({placeholder, name, value, onChange, rows = 3}: TextAreaProps) {
    return (
        <textarea 
            placeholder={placeholder}
            name={name}
            value={value}
            onChange={onChange}
            rows={rows}
            className="text-sm pl-2 py-[2px] bg-primary rounded-md border-[1px] border-border/25 resize-none"
        />
    );
}