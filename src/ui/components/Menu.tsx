'use client'
import {useEffect, useRef, useState } from "react";
import Container from "./Contaiter";

interface MenuProps {
    className?: string;
}

export default function Header({className}: MenuProps) {

    const menuItems = [
        {label: "Файл", submenu: [
            {label: "Экспорт"},
            ]},
        {label: "Настройки",  submenu: [
            {label: "Параметры"}
        ]},
         {label: "Справка",  submenu: [
            {label: "Руководство"}
        ]},
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
    
return(
    <>
    <Container ref={containerRef} className={`${className} flex items-center relative`}>
     <ul className="flex bg-background">
        {menuItems.map((item, index) => (
            <li 
                ref={(el) => { menuRefs.current[index] = el; }}
                onClick={() => handleMenuClick(index)} 
                key={index} 
                className="select-none text-xs px-2 py-1 hover:bg-muted-background hover:cursor-default"
            >
                {item.label}
            </li>
        ))}
     </ul>

     <div className="text-xs ml-auto bg-background p-2">Меню не рабочее(альфа версия)</div>
     
    {activeMenuIndex !== null && (
        <ul 
            className="absolute bg-background border-[1px] border-border rounded-sm p-1 z-10"
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