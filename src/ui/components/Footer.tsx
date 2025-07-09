interface FooterProps {
    className?: string;
}

export default function Footer({className}: FooterProps) {
    return(
        <>
        <footer className={`${className} fixed bottom-0 border-t-[1px] border-border w-full  bg-primary flex items-center text-xs justify-between`}>
            <div className="pl-2 select-none">
                FiatLocker alpha v.0.0.2
            </div>
            <div className="p-1 flex">
               <text className="pr-2 select-none">GGFiat</text>
            </div>
        </footer>
        </>
    )
}