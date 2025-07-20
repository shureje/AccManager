import { useState } from 'react'
import Modal from './ModalWindow';
import Button from './Button';
import Acception from './Acception';
import AccountForm from './AccountForm';
import { Edit, Trash2 } from 'lucide-react';



interface ToolbarProps {
    selectedRows?: number[];
    className?: string;
    data?: any[];
    refreshAccounts?: (() => Promise<void>) | null;
    onSelectedAccountUpdated?: (account: number) => void;
}

export default function Toolbar({selectedRows, className, data, refreshAccounts, onSelectedAccountUpdated}: ToolbarProps) {
    
        const [isModalOpen, setIsModalOpen] = useState(false);
        const [selectedAccount, setSelectedAccount] = useState<any>(null);
        const [isAcceptionModalOpen, setIsAcceptionModalOpen] = useState(false);
    
        const openChangeModal = () => {
            if (!selectedRows || selectedRows.length === 0 || selectedRows.length > 1) return;
            if (!data) return;
    
            const account = data.find(acc => acc.id === selectedRows[0]);
            setSelectedAccount(account);
            setIsModalOpen(true);
        }
    
        const OpenAcceptionModal = () => {
            if (!selectedRows || selectedRows.length === 0) {
                //Здесь надо сделать диалоговое окно
                return;
            }
            setIsAcceptionModalOpen(true);
        }
    
        const handleUpdateAccount = (updates: any) => {
            console.log('handleUpdateAccount called!', updates);
            if (!selectedRows || selectedRows.length === 0) return;

            
            const filteredUpdates = Object.fromEntries(
                Object.entries(updates).filter(([key, value]) => 
                    key !== 'password' || (value !== undefined && value !== null && value !== '')
                )
            );
            
            window.electronAPI.updateAccount(selectedRows[0], filteredUpdates).then((result) => {
                if (result.success) {
                    setIsModalOpen(false);
                    if (refreshAccounts) {
                        refreshAccounts();
                    };
                    if (onSelectedAccountUpdated && selectedRows[0]) {
                        onSelectedAccountUpdated(selectedRows[0]);
                    }
                } else {
                    console.error('Update failed:', result.error);
                }
            }).catch(error => console.error('Error updating account:', error));
        }

        const handleDeleteAccounts = () => {
            if (!selectedRows || selectedRows.length === 0) return;
            
            window.electronAPI.deleteAccountsById(selectedRows).then((result) => {
                if (result.success) {
                    if (refreshAccounts) {
                        setIsAcceptionModalOpen(false);
                        refreshAccounts();
                    }
                }
            }).catch(error => console.error('Error deleting accounts:', error));
        }
    



  return (
     <>
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title='Изменить аккаунт'>
                <AccountForm initialData={selectedAccount} onUpdateAccount={handleUpdateAccount} type='edit' setIsOpen={()=> setIsModalOpen} />
            </Modal>

            <Modal isOpen={isAcceptionModalOpen} onClose={() => setIsAcceptionModalOpen(false)} title="Вы уверены?">
                <Acception onConfirm={handleDeleteAccounts} onCancel={() => setIsAcceptionModalOpen(false)}/>
            </Modal>

            <div className={`${className} top-0 `}>
                <div className="space-y-1 p-2 bg-black/75 border-border/25 border-r-[1px] flex flex-col h-full">
                    <Button className="text-xs " onClick={openChangeModal}><Edit className="scale-[75%]"/></Button>
                    <Button onClick={OpenAcceptionModal}  className="text-xs"><Trash2 className="scale-[75%]"/></Button>
                </div>
            </div>
        </>
  )
}
