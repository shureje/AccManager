import { flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table"
import { useEffect, useState } from "react";
import Button from "./Button";
import { Edit, Trash2 } from "lucide-react";



interface DataTableProps {
    className?: string;
    onRefresh?: (func: () => Promise<void>) => void;
    searchQuery?: string;
}

export function DataTable({className, onRefresh, searchQuery} : DataTableProps) {
    
    const [selectedRows, setSelectedRows] = useState<number[]>([]);
    const [data, setData] = useState<any[]>([]);
    const [filtredData, setFiltredData] = useState<any[]>([]);

    // Обработка выбора одной строки
    const handleRowSelect = (id: number, checked: boolean) => {
        if (checked) {
            setSelectedRows(prev => [...prev, id]);
        } else {
            setSelectedRows(prev => prev.filter(rowId => rowId !== id));
        }
    };

    // Выбрать все / снять все
    const handleSelectAll = (checked: boolean) => {
        if (checked) {
            setSelectedRows(filtredData.map(row => row.id));
        } else {
            setSelectedRows([]);
        }
    };


    const columns = [
    {
        id: 'select',
        header: () => (
            <input type="checkbox" checked={selectedRows.length === filtredData.length && filtredData.length > 0} 
            onChange={(e) => handleSelectAll(e.target.checked)} className="scale-[125%]"/>
        ),
        cell: ({ row }: {row: any}) => (
            <input
                type="checkbox"
                checked={selectedRows.includes(row.original.id)}
                onChange={(e) => handleRowSelect(row.original.id, e.target.checked)}
                className="scale-[110%]"
            />
        ),
    },
    {accessorKey: 'id', header: 'ID'},
    {accessorKey: 'login', header: 'Логин'},
    {accessorKey: 'nickname', header: 'Ник'},
    {accessorKey: 'pts', header: 'Pts'},
    {accessorKey: 'created_at', header: 'Дата добавления'},
    ];


    useEffect(()=> {
        refreshAccounts();
        
        if (onRefresh) {
            onRefresh(refreshAccounts);
        }
    }, []);

    useEffect(() => {
        if (!searchQuery) {
            setFiltredData(data);
        } else {
            const filtreadData = data.filter(account =>
                account.login.toLowerCase().includes(searchQuery.toLowerCase()) ||
                account.nickname.toLowerCase().includes(searchQuery.toLowerCase()) ||
                account.email.toString().includes(searchQuery)
            )
            setFiltredData(filtreadData);
        }
    }, [searchQuery, data])

    const refreshAccounts = async() => {
        try {
            const accounts = await window.electronAPI.getAccounts();
            setData(accounts);
        } catch (error) {
            console.error('Error fetching accounts:', error);
        }  
    }

    const table = useReactTable({
        data: filtredData,
        columns,
        getCoreRowModel: getCoreRowModel(),
    })

    return (

        <>
            {selectedRows.length > 0 && <ActionPanel selectedRows={selectedRows} className="sticky top-20 z-[12]"/>}
            <div className={`${className} m-auto w-full rounded-lg overflow-hidden border-[1px] border-border`}>
                <table className={`m-auto w-full border-[1px] border-border `}>
                <thead className="border-b-[1px] border-border">
                    {table.getHeaderGroups().map(headerGroup => (
                    <tr key={headerGroup.id} >
                        {headerGroup.headers.map(header => (
                        <th key={header.id} className={`${header.column.id === 'login' ? 'w-40' : header.column.id === 'date' ? 'w-48' : 'w-auto'}`}>
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
        </>
    )
}


interface ActionPanelProps {
    selectedRows?: any[];
    className?: string;
}

function ActionPanel({selectedRows, className}: ActionPanelProps) {
    return (
        <div className={`${className} flex items-center  mb-2`}>
            <div className="ml-auto mr-2 gap-2 space-x-2 p-2 bg-black/75 border-border border-[1px] rounded-md">
                {selectedRows?.length === 1 && <Button className="text-xs "><Edit className="scale-[75%]"/>Изменить</Button>}
                <Button className="text-xs"><Trash2 className="scale-[75%]"/>Удалить</Button>
            </div>
        </div>
    )
}
