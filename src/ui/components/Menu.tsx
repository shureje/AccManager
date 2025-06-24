'use client'
import {useState } from "react";
import Container from "./Contaiter";

interface MenuProps {
    className?: string;
}

export default function Header({className}: MenuProps) {

    const [activeMenuIndex, setActiveMenuIndex] = useState<number | null>(null);

    const menuItems = [
        {label: "Главная", submenu: [
            {label: "Открыть"},
            {label: "Экспорт"},
            {label: "Импорт"}     

            ]},
        {label: "Настройки",  submenu: [
            {label: "Параметры"}
        ]},
         {label: "Справка",  submenu: [
            {label: "Руководство"}
        ]},
    ]
return(
        <>
        <Container className={`${className}`}>
         <ul className="flex bg-background">
            {menuItems.map((item, index) => (
                <li 
                    onClick={() => setActiveMenuIndex(activeMenuIndex === index ? null : index)} 
                    key={index} 
                    className="select-none text-xs px-2 py-1 hover:bg-muted-background hover:cursor-default"
                >
                    {item.label}
                </li>
            ))}
         </ul>
         
        {activeMenuIndex !== null && (
            <ul className="absolute bg-background border-[1px] border-border rounded-sm p-1">
                {menuItems[activeMenuIndex].submenu.map((subItem, index) => (
                    <li key={index} className="select-none text-xs px-2 py-1 hover:bg-muted-background hover:cursor-default">
                        {subItem.label}
                    </li>
                ))}
            </ul>
        )}
        </Container>
        </>
    )
}