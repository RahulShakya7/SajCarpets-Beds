
import { createContext, useContext, useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, Warning, Info, X } from '@phosphor-icons/react';

const ToastContext = createContext();

export const useToast = () => useContext(ToastContext);

const Toast = ({ message, type, onClose }) => {
    const icons = {
        success: <CheckCircle weight="fill" className="text-green-500" size={24} />,
        error: <Warning weight="fill" className="text-red-500" size={24} />,
        info: <Info weight="fill" className="text-blue-500" size={24} />,
        loading: <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
    };

    const bgColors = {
        success: 'bg-white dark:bg-gray-800 border-green-500',
        error: 'bg-white dark:bg-gray-800 border-red-500',
        info: 'bg-white dark:bg-gray-800 border-blue-500',
        loading: 'bg-white dark:bg-gray-800 border-blue-500',
    };

    return (
        <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            className={`fixed top-4 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-3 px-6 py-4 rounded-lg shadow-lg border-l-4 min-w-[300px] max-w-md ${bgColors[type] || bgColors.info}`}
        >
            {icons[type]}
            <p className="flex-1 text-gray-800 dark:text-gray-100 font-medium text-sm">{message}</p>
            {type !== 'loading' && (
                <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                    <X size={18} />
                </button>
            )}
        </motion.div>
    );
};

export function ToastProvider({ children }) {
    const [toasts, setToasts] = useState([]);

    const addToast = (message, type = 'info', duration = 3000) => {
        const id = Date.now();
        setToasts((prev) => [...prev, { id, message, type }]);

        if (duration && type !== 'loading') {
            setTimeout(() => {
                removeToast(id);
            }, duration);
        }
        return id; // Return ID so loading toasts can be dismissed manually
    };

    const removeToast = (id) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    };

    return (
        <ToastContext.Provider value={{ addToast, removeToast }}>
            {children}
            {createPortal(
                <div className="fixed top-0 left-0 w-full z-[100] pointer-events-none">
                    <div className="relative w-full h-full pointer-events-auto">
                        <AnimatePresence>
                            {toasts.map((toast) => (
                                <Toast
                                    key={toast.id}
                                    {...toast}
                                    onClose={() => removeToast(toast.id)}
                                />
                            ))}
                        </AnimatePresence>
                    </div>
                </div>,
                document.body
            )}
        </ToastContext.Provider>
    );
}
