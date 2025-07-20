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

      useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && onClose) onClose();
        }; 
        document.addEventListener('keydown', handleEscape);
        return () => {
            document.removeEventListener('keydown', handleEscape);
        };
    }, [onClose]);  

    const handleBackdropClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            if (onClose) {
                onClose();
            };
        }
    };
    
     if (!isOpen) return null;
  

     return (
        <div className={`${className} pt-12 fixed flex inset-0 backdrop-blur-[1px] bg-black bg-opacity-50 items-center justify-center z-30`} onClick={handleBackdropClick}>
            <div className="bg-primary border border-border/25  shadow-lg max-w-md w-full mx-4">
                {/* Заголовок */}
                {title && (
                    <div className="flex justify-between items-center p-4 border-b border-border/25">
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