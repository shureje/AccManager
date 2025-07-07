import type { Ref, RefObject } from "react";



interface ContainerProps {
    children?: React.ReactNode;
    className?: string;
    ref?: Ref<HTMLDivElement>;
}

export default function Container({children, className, ref}: ContainerProps) {
    return(
        <>
        <div ref={ref} className={`${className} `}>
            {children}
        </div>
        </>
    )
}