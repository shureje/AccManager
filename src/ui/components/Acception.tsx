import Button from './Button'


interface AcceptionProps {
  onConfirm: (() => void) | undefined ;
  onCancel: () => void; 
}


export default function Acception({onConfirm, onCancel}: AcceptionProps) {
  return (
      <div className='flex m-auto gap-2 w-full justify-center'>
        <Button onClick={onConfirm} className='w-full'>Да</Button>
        <Button  onClick={onCancel} className='w-full'>Нет</Button>
      </div>
  )
}


