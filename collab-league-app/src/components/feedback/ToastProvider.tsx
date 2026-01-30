'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { Toast, ToastType } from './Toast';

interface ToastItem {
    id: string;
    type: ToastType;
    message: string;
}

interface ToastContextType {
    toast: (type: ToastType, message: string) => void;
    success: (message: string) => void;
    error: (message: string) => void;
    warning: (message: string) => void;
    info: (message: string) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
    const [toasts, setToasts] = useState<ToastItem[]>([]);

    const addToast = useCallback((type: ToastType, message: string) => {
        const id = Date.now().toString() + Math.random().toString();
        setToasts((prev) => [...prev, { id, type, message }]);
    }, []);

    const dismiss = useCallback((id: string) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }, []);

    const value = {
        toast: addToast,
        success: (msg: string) => addToast('success', msg),
        error: (msg: string) => addToast('error', msg),
        warning: (msg: string) => addToast('warning', msg),
        info: (msg: string) => addToast('info', msg),
    };

    return (
        <ToastContext.Provider value={value}>
            {children}
            <div className="fixed bottom-4 right-4 z-50 space-y-2 max-w-md w-full px-4 pointer-events-none">
                <div className="flex flex-col gap-2 items-end pointer-events-auto">
                    {toasts.map((t) => (
                        <Toast key={t.id} {...t} onDismiss={dismiss} />
                    ))}
                </div>
            </div>
        </ToastContext.Provider>
    );
}

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
};
