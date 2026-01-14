import { createContext, useContext, useState, useCallback } from "react";
import ConfirmDialog from "../components/shared/ConfirmDialog";

const ConfirmContext = createContext();

export const useConfirm = () => useContext(ConfirmContext);

export const ConfirmProvider = ({ children }) => {
    const [dialog, setDialog] = useState({
        isOpen: false,
        title: "",
        message: "",
        confirmText: "Confirm",
        cancelText: "Cancel",
        type: "danger",
        resolve: null
    });

    const confirm = useCallback((message, title = "Are you sure?", options = {}) => {
        return new Promise((resolve) => {
            setDialog({
                isOpen: true,
                title,
                message,
                confirmText: options.confirmText || "Confirm",
                cancelText: options.cancelText || "Cancel",
                type: options.type || "danger",
                resolve
            });
        });
    }, []);

    const handleConfirm = () => {
        if (dialog.resolve) dialog.resolve(true);
        setDialog(prev => ({ ...prev, isOpen: false }));
    };

    const handleCancel = () => {
        if (dialog.resolve) dialog.resolve(false);
        setDialog(prev => ({ ...prev, isOpen: false }));
    };

    return (
        <ConfirmContext.Provider value={{ confirm }}>
            {children}
            <ConfirmDialog
                isOpen={dialog.isOpen}
                title={dialog.title}
                message={dialog.message}
                confirmText={dialog.confirmText}
                cancelText={dialog.cancelText}
                type={dialog.type}
                onConfirm={handleConfirm}
                onCancel={handleCancel}
            />
        </ConfirmContext.Provider>
    );
};
