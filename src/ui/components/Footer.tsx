interface FooterProps {
    className?: string;
}

export default function Footer({className}: FooterProps) {
    return(
        <>
        <footer className={`${className} fixed bottom-0 border-t-[1px] w-full  bg-primary`}>
            <div className="text-sm p-1 flex">
               <text className="ml-auto pr-2">GGFiat</text>
            </div>
        </footer>
        </>
    )
}