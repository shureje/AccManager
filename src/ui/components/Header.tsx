import { Plus, Search} from "lucide-react";
import Button from "./Button";
import Container from "./Contaiter";



interface HeaderProps {
    className?: string;
}

export default function Header({className}: HeaderProps) {
    return(
        <>
        <Container className={`${className}`}>
            <div className="flex items-center bg-header border-b-[1px] border-border p-2 top-0">
                <div className="flex items-center gap-2">
                    <Search size={16}/>
                    <input placeholder="Search" className="text-sm pl-2 py-[2px] bg-primary rounded-md border-[1px] border-border"/>
                </div>
               
                <Button className="ml-auto text-xs"><Plus size="16"/>ДОБАВИТЬ АККАУНТ</Button>
            </div>
        </Container>
        </>
    )
}