import { flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table"


const columns = [
    {accessorKey: 'id', header: 'ID'},
    {accessorKey: 'login', header: 'Логин'},
    {accessorKey: 'pts', header: 'Pts'},
    {accessorKey: 'date', header: 'Дата добавления'},
]

const data = [
    {id: 1, login: 'test', pts: 100, date: '01.01.2024'},
    {id: 2, login: 'test2', pts: 200, date: '02.01.2024'},
    {id: 3, login: 'test3', pts: 300, date: '03.01.2024'},
    {id: 4, login: 'test4', pts: 400, date: '04.01.2024'},
    {id: 5, login: 'test5', pts: 500, date: '05.01.2024'},
    {id: 6, login: 'test6', pts: 600, date: '06.01.2024'},
    {id: 7, login: 'test7', pts: 700, date: '07.01.2024'},
    {id: 8, login: 'test8', pts: 800, date: '08.01.2024'},
    {id: 9, login: 'test9', pts: 900, date: '09.01.2024'},
    {id: 10, login: 'test10', pts: 1000, date: '10.01.2024'},
    {id: 11, login: 'test11', pts: 1100, date: '11.01.2024'},
    {id: 12, login: 'test12', pts: 1200, date: '12.01.2024'},
    {id: 13, login: 'test13', pts: 1300, date: '13.01.2024'},
    {id: 14, login: 'test14', pts: 1400, date: '14.01.2024'},
    {id: 15, login: 'test15', pts: 1500, date: '15.01.2024'},
]

interface DataTableProps {
    className?: string;
}

export function DataTable({className} : DataTableProps) {
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