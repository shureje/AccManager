interface FooterProps {
    className?: string;
}

export default function Footer({className}: FooterProps) {
    return(
        <>
        <footer className={`${className} fixed bottom-0 border-t-[1px] w-full  bg-primary`}>
            <div className="">
               GGFiat
            </div>
        </footer>
        </>
    )
}