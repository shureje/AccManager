interface ButtonProps {
    children?: React.ReactNode;
    className?: string;
    onClick?: () => void;
    type?: "button" | "submit" | "reset" | undefined
}

export default function Button({children, className, type="button" , onClick}: ButtonProps) {
    return(
        <>
        <button onClick={onClick}  className={`${className} `} type={type}>
            <div className="font-semibold bg-primary flex items-center border-[1px] border-border rounded-md py-1 px-1 hover:scale-[101%] transition-all gap-1">
                {children}
            </div>    
        </button>
        </>
    )
}