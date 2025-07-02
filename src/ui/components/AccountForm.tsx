import { useEffect, useState } from "react";
import Button from "./Button";
import Input from "./Input";



interface AddAccoutFormProps {
    className?: string;
    onCreateAccount?: (accountData: any) => void;
    onUpdateAccount?: (accountData: any) => void;
    setIsOpen?: () => void;
    type?: string;
    initialData?: any;
}

export default function AccountForm({className, onCreateAccount, onUpdateAccount, type, initialData}: AddAccoutFormProps) {

    const [formData, setFormData] = useState({
        login: '',
        password: '',
        email: '',
        phone: '',
        pts: 0,
        nickname: ''
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                login: initialData.login || '',
                password: '',  // Пароль не показываем для безопасности
                email: initialData.email || '',
                phone: initialData.phone || '',
                pts: initialData.pts || 0,
                nickname: initialData.nickname || ''
            });
        }
    }, [initialData]);

    const handleChange = () => (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prevState => ({
            ...prevState,
            [e.target.name]: e.target.value
        }));
    };

    const handleSubmit = () => {
        if (onCreateAccount) {
            onCreateAccount(formData)
        };

        if (onUpdateAccount) {
            onUpdateAccount(formData)
        }
    };

  

    const FormItems = [
        {
            label: "Логин",
            placeholder: "Login",
            type: "text"
        },
        {
            label: "Пароль",
            placeholder: "Password",
            type: "password"
        },
        {
            label: "Почта",
            placeholder: "Email",
            type: "email"
        },
        {
            label: "Номер телефона",
            placeholder: "Phone",
            type: "tel"

        },
        {
            label: "Pts",
            placeholder: "Pts",
            type: "number"
        },
        {
            label: "Nickname",
            placeholder: "Nickname",
            type: "text"
        }
    ]

    const Type = type === 'add' ? 'Добавить' : type === 'edit' ? 'Изменить' : ''
    
    return(
        <>
        <div className={`${className} flex flex-col gap-4`}>
            <div>
               {FormItems.map((item, index) => (
                    <div key={index} className="grid grid-cols-2 space-y-2">
                        <label className="text-sm">{item.label}</label>
                        <Input onChange={handleChange()} value={formData[item.placeholder.toLocaleLowerCase() as keyof typeof formData] as string} placeholder={item.placeholder} type={item.type} name={item.placeholder.toLocaleLowerCase()}/>
                    </div>
               ))}
            </div>
            <Button onClick={handleSubmit} className="w-fit m-auto text-sm">{`${Type} аккаунт`}</Button>
        </div>
        </>
    )
}