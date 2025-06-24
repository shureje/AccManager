import { flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table"
import { useEffect, useState } from "react";


const columns = [
    {accessorKey: 'id', header: 'ID'},
    {accessorKey: 'login', header: 'Логин'},
    {accessorKey: 'nickname', header: 'Ник'},
    {accessorKey: 'pts', header: 'Pts'},
    {accessorKey: 'created_at', header: 'Дата добавления'},
]

interface DataTableProps {
    className?: string;
}

export function DataTable({className} : DataTableProps) {

    const [data, setData] = useState<any[]>([]);

    useEffect(()=> {
        loadAccounts();
    }, []);

    const loadAccounts = async() => {
        try {
            const accounts = await window.electronAPI.getAccounts();
            setData(accounts);
        } catch (error) {
            console.error('Error fetching accounts:', error);
        }  
    }

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
    })

    return (
        <div className={`${className} m-auto w-full rounded-lg overflow-hidden border-[1px] border-border`}>
            <table className={`m-auto w-full border-[1px] border-border `}>
            <thead className="border-b-[1px] border-border">
                {table.getHeaderGroups().map(headerGroup => (
                <tr key={headerGroup.id}>
                    {headerGroup.headers.map(header => (
                    <th key={header.id} className={header.column.id === 'login' ? 'w-40' : header.column.id === 'date' ? 'w-48' : 'w-auto'}>
                        {flexRender(header.column.columnDef.header, header.getContext())}
                    </th>
                    ))}
                </tr>
                ))}
            </thead>
            <tbody className="text-secondary text-center text-sm">
                {table.getRowModel().rows.map((row, index) => (
                <tr key={row.id}
                className={`${index % 2 === 0 ? "bg-primary" : "bg-muted-background"} items-center`}>
                    {row.getVisibleCells().map(cell => (
                    <td key={cell.id}
                    className=" border-r-[1px] border-border">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                    ))}
                </tr>
                ))}
            </tbody>
            </table>
        </div>
    )
}