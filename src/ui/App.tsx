

import { useCallback, useEffect, useState } from 'react'
import Container from './components/Contaiter'
import { DataTable } from './components/DataTable'
import Footer from './components/Footer'
import Header from './components/Header'
import Menu from './components/Menu'
import Modal from './components/ModalWindow'
import AccountForm from './components/AccountForm'
import Toolbar from './components/Toolbar'
import AccountDetails from './components/AccountDetails'

function App() {
 
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState('');
  const [refreshTableFunction, setRefreshTableFunction] = useState<(() => Promise<void>) | null>(null)
  const [searchQuery, setSearchQuery] = useState('');

  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [data, setData] = useState<any[]>([]);

  const [selectedAccount, setSelectedAccount] = useState(null);


  const handleSelectionChange = useCallback((selectedRows: number[], data: any[]) => {
    setSelectedRows(selectedRows);
    setData(data);
  }, []);

  const handleAccountSelect = useCallback(async (accountId: number) => {
    console.log('Selected account ID:', accountId);
    try {
      const account = await window.electronAPI.getOne(accountId);
      console.log('Fetched account:', account);
      setSelectedAccount(account);
    } catch (error) {
      console.log('Error fetching account:', error);
      return;
    }
  }, []);


  const handleTableRefresh = useCallback(async (refreshFunc: () => Promise<void>) => {
    setRefreshTableFunction(() => refreshFunc);
  }, []);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleCreateAccount = async (accountData: any) => {
    try {
      const result = await window.electronAPI.createAccount(accountData);
      if (result.success) {
        console.log('Account created successfully');
        setIsModalOpen(false);
        setError('');
        if (refreshTableFunction) {
          await refreshTableFunction();
        }
      } else {
        console.log('Ошибка: ' + `${result.error}`);
        const cleanError = String(result.error).replace(/^Error:\s*/, '');
        setError(cleanError);
        
      }
    } catch (error) {
      console.error('Error creating account:', error);
      setError('Ошибка создания аккаунта');
    }
  }  


  useEffect(() => {
      if (error) {
        const timer = setTimeout(() => {
          setError('');
        }, 5000); // 10 секунд

        return () => clearTimeout(timer); // Очистка таймера при размонтировании
      }
    }, [error]);

  return (
    <>
    <Container>
        <Container className='font-sans h-screen flex flex-col'>
          <Menu className='top-0 h-6'/>
          <Header onAddAccount={() => setIsModalOpen(true)} onSearch={handleSearch}
            className='top-6 z-[31]'/>
          <Container className='flex flex-1  overflow-hidden'>
            <Toolbar 
              data={data} 
              selectedRows={selectedRows} 
              className='flex-none w-14'
              refreshAccounts={refreshTableFunction || undefined}
              onSelectedAccountUpdated={handleAccountSelect}
            />
            <DataTable
              className='flex-grow' 
              onRefresh={handleTableRefresh} 
              searchQuery={searchQuery}   
              onSelectionChange={handleSelectionChange}
              onAccountSelect={handleAccountSelect}
            />
            <AccountDetails 
              account={selectedAccount}
            />
          </Container>
          <Footer className='flex-shrink-0'/>
        </Container>
      </Container>

        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Добавить аккаунт">
          {error && <div className='text-xs text-center mb-1'>{error}</div>}
          <AccountForm type='add' setIsOpen={()=> setIsModalOpen}  onCreateAccount={handleCreateAccount}/>
        </Modal>
    </>
  )
}

export default App
