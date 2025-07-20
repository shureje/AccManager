

interface AccountDetailsProps {
  account: any | null;
}


export default function AccountDetails({account}:AccountDetailsProps) {


    const accountProperties = [
        { label: 'Логин', value: account?.login },
        { label: 'Пароль', value: account?.password },
        { label: 'Никнейм', value: account?.nickname || '-'},
        { label: 'Email', value: account?.email || '-'},
        { label: 'Пароль email', value: account?.emailPassword || '-'},
        { label: 'Номер телефона', value: account?.phone || '-'}, 
        { label : 'Тип', value: account?.type},
        { label: 'Pts', value: account?.pts || '-'},
        
       

    ]

  if (!account) {
    return (
      <div className="flex-shrink-0 w-[320px] p-4 text-center border-l-[1px] border-border/25">
        <div className="text-sm text-gray-500">Выберите аккаунт</div>
      </div>
    );
  }

   return (
    <div className="flex-shrink-0 w-[320px]  lg:w-[560px] p-4 border-l-[1px] border-border/25 overflow-auto">
      <div className="text-sm font-medium mb-4">Детали аккаунта</div>
      <div className="space-y-2  text-sm lg:text-[14px]">
        {accountProperties.map((prop, index) => (
            <div key={index} className='flex justify-between'>
                <span className="font-medium">{prop.label.toLocaleLowerCase()}:</span> 
                {prop.value}
            </div>
        ))}  

        <span className="font-medium flex">{'Описание:'.toLocaleLowerCase()}</span> 
        {account?.note || '-'}
       
      </div>
    </div>
  );
}

