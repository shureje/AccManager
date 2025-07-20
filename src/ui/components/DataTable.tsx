import { flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table"
import { useCallback, useEffect,  useMemo,  useState } from "react";



interface DataTableProps {
    className?: string;
    onRefresh?: (func: () => Promise<void>) => void;
    searchQuery?: string;

    onAccountSelect?: (id: number) => void;

    onSelectionChange?: (selectedRows: number[], data: any[]) => void;
}

export function DataTable({className, onRefresh, searchQuery, 
    onSelectionChange, onAccountSelect} : DataTableProps) {
    
   
    const [filtredData, setFiltredData] = useState<any[]>([]);
    const [selectedRows, setSelectedRows] = useState<number[]>([]);
    const [data, setData] = useState<any[]>([]);
    

    const handleRowSelect = useCallback((id: number, checked: boolean) => {
        setSelectedRows(prev => {  // <-- используй prev вместо selectedRows
            if (checked) {
                return [...prev, id];
            } else {
                return prev.filter(rowId => rowId !== id);
            }
        });
    }, []);

    const handleHeaderClick = useCallback(() => {
        if (selectedRows.length > 0) {
            // Если что-то выбрано - сбрасываем все
            setSelectedRows([]);
        } else {
            // Если ничего не выбрано - выбираем все
            setSelectedRows(filtredData.map(row => row.id));
        }
    }, [selectedRows, filtredData]);



    const columns = useMemo(() => [
    {
        id: 'select',
        header: () => (
            <div className="flex items-center justify-center">
                <input 
                    type="checkbox" 
                    checked={selectedRows.length > 0} 
                    onChange={handleHeaderClick}
                    className="scale-[125%] "
                />
            </div>
        ),
        cell: ({ row }: {row: any}) => (
            <div className="flex items-center justify-center">
                <input
                    type="checkbox"
                    checked={!!selectedRows.includes(row.original.id)}
                    onChange={(e) => {
                        handleRowSelect(row.original.id, e.target.checked);
                    }}
                    className="scale-[110%]"
                />
            </div>
        ),
    },
    {accessorKey: 'id', header: 'ID'},
    {accessorKey: 'login', 
    header: 'ЛОГИН',
    cell: ({row}: {row:any}) => {
        return(
        <div className="cursor-pointer hover:text-blue-400 select-none"
            onClick={() => onAccountSelect?.(row.original.id)}>
                {row.original.login}
            </div>
        )
    }},
    {accessorKey: 'nickname', header: 'НИК'},
    {accessorKey: 'pts', header: 'PTS'},
    {accessorKey: 'type', header: 'ТИП'}
    ], [selectedRows, onAccountSelect, handleHeaderClick, handleRowSelect]);


    useEffect(() => {
        setSelectedRows(prev => prev.filter(id => filtredData.some(row => row.id === id)));
    }, [filtredData]);
  

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

    
    const loadData = useCallback(async () => {
        try {
            const accounts = await window.electronAPI.getAccounts();
            setData(accounts);
        } catch (error) {
            console.error('Error fetching accounts:', error);
        }
    },[]);

    useEffect(() => {
        loadData();
    }, [loadData]);

   useEffect(() => {    
        if (onRefresh) {
            onRefresh(() => loadData());
        }
    }, [onRefresh, loadData]);

    useEffect(() => {
        if (onSelectionChange) {
            onSelectionChange(selectedRows, data);
        }
    }, [selectedRows, data, onSelectionChange]);

    const table = useReactTable({
        data: filtredData,
        columns,
        getCoreRowModel: getCoreRowModel(),
    })

    return (

        <>      
            <div className={`${className}  w-full overflow-y-auto`} >
                <table className={`w-full`}>
                <thead className="bg-table-first-color sticky top-0 z-[15] sm:text-sm lg:text-lg ">
                    {table.getHeaderGroups().map(headerGroup => (
                        <tr key={headerGroup.id}>
                            {headerGroup.headers.map(header => (
                                <th key={header.id} className="outline outline-1 outline-border/25 bg-table-first-color">
                                    {flexRender(header.column.columnDef.header, header.getContext())}
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody className="text-secondary text-center text-sm">
                    {table.getRowModel().rows.map((row, index) => (
                    <tr key={row.id}
                    className={`${index % 2 === 0 ? "bg-primary" : "bg-table-seccond-color"} items-center`}>
                        {row.getVisibleCells().map(cell => (
                        <td key={cell.id}
                        className=" border-r-[1px] border-b-[1px] border-table-border/20">
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


