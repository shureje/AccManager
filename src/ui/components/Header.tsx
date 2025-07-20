import { Plus, Search} from "lucide-react";
import Button from "./Button";
import Container from "./Contaiter";
import { useState } from "react";



interface HeaderProps {
    className?: string;
    onAddAccount?: () => void;
    onSearch?: (query: string) => void;
}

export default function Header({className, onAddAccount, onSearch}: HeaderProps) {

    const [searchQuery, setSearchQuery] = useState('');

    const handleSeacrhChange = (e: React.ChangeEvent<HTMLInputElement>) => {

        const query = e.target.value;
        setSearchQuery(query);

        if (onSearch) {
            onSearch(query);
        }
}

    return(
        <>
        <Container className={`${className}`}>
            <div className="flex items-center bg-header border-b-[1px] border-border/25 p-2 top-0 backdrop-blur-[2px]">
                <div className="flex items-center gap-2">
                    <Search size={16}/>
                    <input onChange={handleSeacrhChange} value={searchQuery} placeholder="Search" className="text-sm pl-2 py-[2px] bg-primary rounded-md border-[1px] border-border/25"/>
                </div>
               
                <Button onClick={onAddAccount} className="ml-auto text-xs"><Plus size="16"/>ДОБАВИТЬ АККАУНТ</Button>
            </div>
        </Container>
        </>
    )
}