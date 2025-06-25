

import { useEffect, useState } from 'react'
import Container from './components/Contaiter'
import { DataTable } from './components/DataTable'
import Footer from './components/Footer'
import Header from './components/Header'
import Menu from './components/Menu'
import Modal from './components/ModalWindow'
import AddAccoutForm from './components/AddAccountForm'

function App() {
 
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
      if (error) {
        const timer = setTimeout(() => {
          setError('');
        }, 5000); // 10 секунд

        return () => clearTimeout(timer); // Очистка таймера при размонтировании
      }
    }, [error]);

  const handleCreateAccount = async (accountData: any) => {
    try {
      const result = await window.electronAPI.createAccount(accountData);
      if (result.success) {
        console.log('Account created successfully');
        setIsModalOpen(false);
        setError('');
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
          <Header onAddAccount={() => setIsModalOpen(true)} className='sticky top-6 z-10'/>
          <Container className='p-6 flex-1 mb-6'>
            <DataTable/>
          </Container>
          <Footer className='mt-auto'/>
        </Container>
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Добавить аккаунт">
          {error && <div className='text-xs text-center mb-1'>{error}</div>}
          <AddAccoutForm setIsOpen={()=> setIsModalOpen}  onCreateAccount={handleCreateAccount}/>
        </Modal>
      </Container>
    </>
  )
}

export default App
