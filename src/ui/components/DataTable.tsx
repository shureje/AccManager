import { flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table"
import { useEffect, useState } from "react";
import Button from "./Button";
import { Edit, Trash2 } from "lucide-react";
import Modal from "./ModalWindow";
import AccountForm from "./AccountForm";
import Acception from "./Acception";



interface DataTableProps {
    className?: string;
    onRefresh?: (func: () => Promise<void>) => void;
    searchQuery?: string;
    onDelete?: (ids: number[]) => Promise<void>;
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

    const handleDeleteAccounts = () => {
        window.electronAPI.deleteAccounts(selectedRows).then((result) => {
            if (result.success) {
                setSelectedRows([]);
                refreshAccounts();
            }
        }).catch(error => console.error('Error deleting accounts:', error));
    }

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
    {accessorKey: 'password', header: 'Пароль'},
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
        const interval = setInterval(refreshAccounts, 5000);
        return () => clearInterval(interval);
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
        <div className="flex gap-4 m-3 items-start">
            <div className={`${className}  w-full rounded-lg overflow-hidden border-[1px] border-border `}>
                <table className={`w-full border-[1px] border-border m-auto`}>
                <thead className="border-b-[1px] border-border">
                    {table.getHeaderGroups().map(headerGroup => (
                    <tr key={headerGroup.id} >
                        {headerGroup.headers.map(header => (
                        <th key={header.id} className={``}>
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
            {selectedRows.length > 0 && <ActionPanel data={data} refreshAccounts={refreshAccounts} onDelete={handleDeleteAccounts} selectedRows={selectedRows}
            className={`sticky top-20`}/>}
            </div>  
        </>
    )
}


interface ActionPanelProps {
    selectedRows?: any[];
    className?: string;
    onDelete?: () => void;
    data?: any[];
    refreshAccounts?: () => Promise<void>;
}

function ActionPanel({selectedRows, className, onDelete, data, refreshAccounts}: ActionPanelProps) {
    

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedAccount, setSelectedAccount] = useState<any>(null);
    const [isAcceptionModalOpen, setIsAcceptionModalOpen] = useState(false);

    const openChangeModal = () => {
        if (!selectedRows || selectedRows.length === 0) return;
        if (!data) return;

        const account = data.find(acc => acc.id === selectedRows[0]);
        setSelectedAccount(account);
        setIsModalOpen(true);
    }

    const OpenAcceptionModal = () => {
        setIsAcceptionModalOpen(true);
    }

    const handleUpdateAccount = (updates: any) => {
        if (!selectedRows || selectedRows.length === 0) return;

        const filteredUpdates = Object.fromEntries(
        Object.entries(updates).filter(([_, value]) => 
            value !== undefined && value !== null && value !== ''
        )
        );
    
        if (Object.keys(filteredUpdates).length === 0) {
            console.log('No fields to update');
            return;
        }

        window.electronAPI.updateAccount(selectedRows[0], filteredUpdates).then((result) => {
            if (result.success) {
                setIsModalOpen(false);
                if (refreshAccounts) {
                    refreshAccounts();
                };
            }
        }).catch(error => console.error('Error updating account:', error));
    }

    return (
        <>
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title='Изменить аккаунт'>
                <AccountForm initialData={selectedAccount} onUpdateAccount={handleUpdateAccount} type='edit' setIsOpen={()=> setIsModalOpen} />
            </Modal>

            <Modal isOpen={isAcceptionModalOpen} onClose={() => setIsAcceptionModalOpen(false)} title="Вы уверены?">
                <Acception onConfirm={onDelete} onCancel={() => setIsAcceptionModalOpen(false)}/>
            </Modal>

            <div className={`${className} `}>
                <div className="ml-auto space-y-1 p-2 bg-black/75 border-border border-[1px] rounded-md flex flex-col ">
                    {selectedRows?.length === 1 && <Button className="text-xs " onClick={openChangeModal}><Edit className="scale-[75%]"/></Button>}
                    <Button onClick={OpenAcceptionModal} className="text-xs"><Trash2 className="scale-[75%]"/></Button>
                </div>
            </div>
        </>
    )
}
