import { useEffect, useState } from "react";
import Button from "./Button";
import Input from "./Input";
import Select from "./Select";
import TextArea from "./TextArea";



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
        emailpassword: '',
        phone: '',
        pts: '',
        nickname: '',
        type: 'other',
        note: ''
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                login: initialData.login || '',
                password: '',  // Пароль не показываем для безопасности
                email: initialData.email || '',
                emailpassword: initialData.emailPassword || '',
                phone: initialData.phone || '',
                pts: initialData.pts || '',
                nickname: initialData.nickname || '',
                type: initialData.type || 'other',
                note: initialData.note || ''
            });
        }
    }, [initialData]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        let value = e.target.value;
        if (e.target.name === "pts") {
            value = value.replace(/[^0-9]/g, ""); // только цифры, если нужно
        }
        setFormData(prevState => ({
            ...prevState,
            [e.target.name]: value
        }));
    };

    const handleSubmit = () => {
        if (type === 'add' && onCreateAccount) {
            onCreateAccount(formData);
        } else if (type === 'edit' && onUpdateAccount) {
            onUpdateAccount(formData);
        }
    };

  

    const FormItems = [
        {
            label: "Логин",
            name: "Login",
            type: "text"
        },
        {
            label: "Пароль",
            name: "Password",
            type: "password"
        },
        {
            label: "Почта",
            name: "Email",
            type: "email"
        },
        {
            label: "Пароль почты",
            name: "emailPassword",
            type: "text"
        },
        {
            label: "Номер телефона",
            name: "Phone",
            type: "tel"

        },
        {
            label: "Pts",
            name: "Pts",
            type: "number"
        },
        {
            label: "Nickname",
            name: "Nickname",
            type: "text"
        },
    ]

    const accountTypes = [
        { value: 'steam', label: 'Steam' },
        { value: 'epic games', label: 'Epic Games' },
        { value: 'faceit', label: 'Faceit' },
        { value: 'hoyoplay', label: 'HoYoPlay' },
        { value: 'yostar', label: 'Yostar' },
        { value: 'other', label: 'Other' }
    ];

    const Type = type === 'add' ? 'Добавить' : type === 'edit' ? 'Изменить' : ''
    
    return(
        <>
        <div className="flex flex-col gap-3">
            <div className={`${className} flex flex-col gap-2 overflow-y-auto max-h-64`}>
                <div>
                {FormItems.map((item, index) => (
                        <div key={index} className="grid grid-cols-2 mt-2">
                            <label className="text-sm">{item.label}</label>
                            <Input onChange={handleChange} 
                           value={
                                formData[item.name.toLocaleLowerCase() as keyof typeof formData] !== null &&
                                formData[item.name.toLocaleLowerCase() as keyof typeof formData] !== undefined
                                    ? String(formData[item.name.toLocaleLowerCase() as keyof typeof formData])
                                    : ""
                                }
                            placeholder={item.name} 
                            type={item.type} 
                            name={item.name.toLocaleLowerCase()}/>
                        </div>
                ))}
                </div>
                <div className="grid grid-cols-2 ">
                    <label className="text-sm">Тип аккаунта</label>
                    <Select 
                        name="type" 
                        value={formData.type} 
                        onChange={handleChange}
                        options={accountTypes}
                    />
                </div>
                <div className="grid grid-cols-2 items-start gap-2">
                    <label className="text-sm">Заметка</label>
                    <TextArea 
                        name="note" 
                        value={formData.note} 
                        onChange={handleChange}
                        placeholder="Заметка"
                    />
                </div>
            </div>
            <Button onClick={handleSubmit} className="w-fit m-auto text-sm">{`${Type} аккаунт`}</Button>
        </div>
        </>
    )
}