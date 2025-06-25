
interface InputProps {
    placeholder?: string;
    type?: string;
    name?: string;
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => any;
}


export default function Input({placeholder, type, name, value, onChange} : InputProps) {
  return (
    <input placeholder={placeholder}  
    type={type}
    name={name}
    value={value}
    onChange={onChange}
    className="text-sm pl-2 py-[2px] bg-primary rounded-md border-[1px] border-border"/>
  )
}
