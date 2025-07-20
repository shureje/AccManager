import type { Ref } from "react";



interface ContainerProps {
    children?: React.ReactNode;
    className?: string;
    ref?: Ref<HTMLDivElement>;
    style?: React.CSSProperties;
}

export default function Container({children, className, ref, style}: ContainerProps) {
    return(
        <>
        <div style={style} ref={ref} className={`${className} `}>
            {children}
        </div>
        </>
    )
}