import React, {useEffect, useRef, useState } from "react";
import Container from "./Contaiter";
import { Minus, Square, X } from "lucide-react";


interface MenuProps {
    className?: string;
}

export default function Menu({className}: MenuProps) {

    const menuItems = [
        {label: "Файл", submenu: [
            {label: "In progress"},
            ]},
        {label: "Настройки",  submenu: [
            {label: "In progress"}
        ]},
         {label: "Справка",  submenu: [
            {label: "In progress"}
        ]},
    ]

    const windowButtons = [
        {button: <Minus/>, size: 20, onClick: () => window.electronAPI.minimize()},
        {button: <Square/>, size: 14, onClick: () => window.electronAPI.maximize()},
        {button: <X/>, size: 20, onClick: () => window.electronAPI.close()}
    ]

    const [activeMenuIndex, setActiveMenuIndex] = useState<number | null>(null);
    const [subMenuPosition, setSubMenuPosition] = useState({left: 0});
    const menuRefs = useRef<(HTMLLIElement | null)[]>([]);
    const containerRef = useRef<HTMLDivElement>(null);


    const handleMenuClick = (index: number) => {
        if (activeMenuIndex === index) {
            setActiveMenuIndex(null);
        } else {
            const menuElement = menuRefs.current[index];
            if (menuElement) {
                const rect = menuElement.getBoundingClientRect();
                const containerRect = menuElement.closest('.relative')?.getBoundingClientRect();
                if (containerRect) {
                    setSubMenuPosition({left: rect.left - containerRect.left});
                }
            }
            setActiveMenuIndex(index);
        }
    }

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setActiveMenuIndex(null);
            }
        };

        if (activeMenuIndex !== null) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        }
    },[activeMenuIndex]);

    const iconPath = import.meta.env.PROD 
        ?  '../dist-electron/x.ico'
        : './x.ico';

return(
    <>
    <Container ref={containerRef} 
    className={`${className} bg-background flex items-center relative  h-8 text-gray-300 z-40`}
    style={{
        WebkitAppRegion: 'drag',
    } as React.CSSProperties}
    >

    <img src={iconPath} alt="icon" className="mx-2 my-2 items-center w-5 h-5"/>

    <ul className="flex h-full">
        {menuItems.map((item, index) => (
            <li 
                ref={(el) => { menuRefs.current[index] = el; }}
                onClick={() => handleMenuClick(index)} 
                key={index} 
                className="select-none flex items-center text-xs px-2 hover:bg-muted-background hover:cursor-default"
                style={{
                    WebkitAppRegion: 'no-drag'
                } as React.CSSProperties}
            >
                {item.label}
            </li>
        ))}
     </ul>

     <div className="text-xs ml-auto flex items-center"
     style={{WebkitAppRegion: 'no-drag'} as React.CSSProperties}>
        {windowButtons.map((win, index) => (
            <button key={index} onClick={win.onClick} className={`${index == 2 ? "hover:bg-red-700 hover:text-white" : "hover:bg-muted-background"} h-8 w-8 flex items-center justify-center`}>
               {React.cloneElement(win.button, {size: win.size})}
            </button>
        ))}
     </div>
     
    {activeMenuIndex !== null && (
        <ul 
            className="absolute bg-primary shadow-sm shadow-muted-background rounded-sm p-1 z-[100]"
            style={{
                left: `${subMenuPosition.left}px`,
                top: '100%'
            }}
        >
            {menuItems[activeMenuIndex].submenu.map((subItem, index) => (
                <li key={index} className="select-none text-xs px-2 py-1 hover:bg-muted-background hover:cursor-default whitespace-nowrap">
                    {subItem.label}
                </li>
            ))}
        </ul>
    )}
    </Container>
    </>
)
}