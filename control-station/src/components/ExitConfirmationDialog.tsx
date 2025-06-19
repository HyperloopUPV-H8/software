import { useEffect } from 'react';
import { MdWarning } from 'react-icons/md';
import { Button } from 'common';
import styles from './ExitConfirmationDialog.module.scss';

interface ExitConfirmationDialogProps {
    open: boolean;
    onConfirm: () => void;
    onCancel: () => void;
}

export function ExitConfirmationDialog({ open, onConfirm, onCancel }: ExitConfirmationDialogProps) {
    // Handle escape key
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && open) {
                onCancel();
            }
        };

        if (open) {
            document.addEventListener('keydown', handleEscape);
            document.body.style.overflow = 'hidden'; // Prevent background scroll
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'unset';
        };
    }, [open, onCancel]);

    if (!open) return null;

    const handleBackdropClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            onCancel();
        }
    };

    return (
        <div className={styles.backdrop} onClick={handleBackdropClick}>
            <div className={styles.modal}>
                <div className={styles.header}>
                    <MdWarning className={styles.icon} />
                    <h2 className={styles.title}>Exit Control Station</h2>
                </div>
                
                <div className={styles.content}>
                    <p className={styles.message}>
                        Are you sure you want to exit the Control Station?
                    </p>
                    <p className={styles.submessage}>
                        This will shut down the backend server and close all connections to the pod.
                        Any ongoing operations will be terminated.
                    </p>
                </div>
                
                <div className={styles.actions}>
                    <Button 
                        label="Cancel" 
                        onClick={onCancel}
                        className={styles.cancelButton}
                    />
                    <Button 
                        label="Exit Control Station"
                        onClick={onConfirm}
                        className={styles.confirmButton}
                    />
                </div>
            </div>
        </div>
    );
}