import React, { useEffect } from 'react';
import { X, AlertCircle, CheckCircle } from 'lucide-react';
import { clsx } from 'clsx';

export type ToastType = 'success' | 'error' | 'info';

interface ToastProps {
    message: string;
    type: ToastType;
    onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, type, onClose }) => {
    useEffect(() => {
        const timer = setTimeout(onClose, 5000);
        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <div className={clsx(
            "fixed top-4 right-4 z-[60] flex items-center gap-3 px-4 py-3 rounded shadow-lg border animate-in slide-in-from-right-full",
            type === 'error' ? "bg-white border-red-200 text-red-800" : "bg-white border-green-200 text-green-800"
        )}>
            {type === 'error' ? <AlertCircle size={20} className="text-red-500" /> : <CheckCircle size={20} className="text-green-500" />}
            <span className="text-sm font-medium">{message}</span>
            <button onClick={onClose} className="ml-2 text-slate-400 hover:text-slate-600">
                <X size={16} />
            </button>
        </div>
    );
};
