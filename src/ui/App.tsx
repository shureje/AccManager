

import { useEffect, useState } from 'react'
import Container from './components/Contaiter'
import { DataTable } from './components/DataTable'
import Footer from './components/Footer'
import Header from './components/Header'
import Menu from './components/Menu'
import Modal from './components/ModalWindow'
import AccountForm from './components/AccountForm'

function App() {
 
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState('');
  const [refreshTableFunction, setRefreshTableFunction] = useState<(() => Promise<void>) | null>(null)
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
      if (error) {
        const timer = setTimeout(() => {
          setError('');
        }, 5000); // 10 секунд

        return () => clearTimeout(timer); // Очистка таймера при размонтировании
      }
    }, [error]);

  const handleTableRefresh = async (refreshFunc: () => Promise<void>) => {
    setRefreshTableFunction(() => refreshFunc);
  };

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

  return (
    <>
    <Container>
        <Container className='font-sans min-h-screen  flex flex-col'>
          <Menu className='sticky top-0 z-[1000] h-6'/>
          <Header onAddAccount={() => setIsModalOpen(true)} onSearch={handleSearch}
            className='sticky top-6 z-10'/>
          <Container>
            <DataTable onRefresh={handleTableRefresh} searchQuery={searchQuery}/>
          </Container>
          <Footer className='mt-auto'/>
        </Container>

        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Добавить аккаунт">
          {error && <div className='text-xs text-center mb-1'>{error}</div>}
          <AccountForm type='add' setIsOpen={()=> setIsModalOpen}  onCreateAccount={handleCreateAccount}/>
        </Modal>

        
      </Container>
    </>
  )
}

export default App
