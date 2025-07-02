import { X } from "lucide-react";
import React, { useEffect } from "react";




interface ModalProps {
    children?: React.ReactNode;
    className?: string;
    title?: string;
    onClose?: () => void;
    isOpen?: boolean;
}

export default function Modal({ isOpen, onClose, children, title, className }: ModalProps) {
    if (!isOpen) return null;

    const handleBackdropClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            if (onClose) {
                onClose();
            };
        }
    };
    
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && onClose) onClose();
        }; 
        document.addEventListener('keydown', handleEscape);
        return () => {
            document.removeEventListener('keydown', handleEscape);
        };
    }, []);

     return (
        <div className={`${className} fixed inset-0 backdrop-blur-[1px] bg-black bg-opacity-50 flex items-center justify-center z-50`} onClick={handleBackdropClick}>
            <div className="bg-primary border border-border rounded-lg shadow-lg max-w-md w-full mx-4">
                {/* Заголовок */}
                {title && (
                    <div className="flex justify-between items-center p-4 border-b border-border">
                        <div className="text-secondary">{title}</div>
                        <button onClick={onClose}  className="text-secondary hover:text-border text-2xl leading-none">
                            <X/>
                        </button>
                    </div>
                )}
                
                {/* Контент */}
                <div className="p-4">
                    {children}
                </div>
            </div>
        </div>
    );
}