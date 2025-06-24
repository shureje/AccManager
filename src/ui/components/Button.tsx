interface ButtonProps {
    children?: React.ReactNode;
    className?: string;
}

export default function Button({children, className}: ButtonProps) {
    return(
        <>
        <button className={`${className} `}>
            <div className="font-semibold bg-background flex items-center border-[1px] border-border rounded-md p-1 hover:scale-[101%] transition-all">
                {children}
            </div>    
        </button>
        </>
    )
}