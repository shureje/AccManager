

import Container from './components/Contaiter'
import { DataTable } from './components/DataTable'
import Footer from './components/Footer'
import Header from './components/Header'
import Menu from './components/Menu'

function App() {
 

  return (
    <>
      <Container className='font-sans min-h-screen  flex flex-col'>
        <Menu className='sticky top-0 z-20 h-6'/>
        <Header className='sticky top-6 z-10'/>
        <Container className='p-6 flex-1 mb-6'>
           <DataTable/>
        </Container>
        <Footer className='mt-auto'/>
      </Container>
    </>
  )
}

export default App
