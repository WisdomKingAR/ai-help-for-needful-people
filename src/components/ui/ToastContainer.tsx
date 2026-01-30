import { motion, AnimatePresence } from 'framer-motion';
import { useToast, type ToastType } from '../../context/ToastContext';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

const icons: Record<ToastType, JSX.Element> = {
    success: <CheckCircle2 className="w-5 h-5 text-green-400" />,
    error: <AlertCircle className="w-5 h-5 text-red-400" />,
    info: <Info className="w-5 h-5 text-blue-400" />,
    warning: <AlertTriangle className="w-5 h-5 text-yellow-400" />,
};

const bgColors: Record<ToastType, string> = {
    success: 'bg-green-500/10 border-green-500/20',
    error: 'bg-red-500/10 border-red-500/20',
    info: 'bg-blue-500/10 border-blue-500/20',
    warning: 'bg-yellow-500/10 border-yellow-500/20',
};

export const ToastContainer = () => {
    const { toasts, removeToast } = useToast();

    return (
        <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3 pointer-events-none">
            <AnimatePresence mode="popLayout">
                {toasts.map((toast) => (
                    <motion.div
                        key={toast.id}
                        layout
                        initial={{ opacity: 0, y: 50, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, x: 20, scale: 0.95 }}
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                        className={`pointer-events-auto min-w-[300px] max-w-sm w-full p-4 rounded-xl border backdrop-blur-xl shadow-lg flex items-start gap-3 ${bgColors[toast.type]}`}
                    >
                        <div className="mt-0.5 shrink-0">{icons[toast.type]}</div>
                        <div className="flex-1">
                            <div className="text-sm text-white/90 font-medium leading-relaxed">
                                {toast.message}
                            </div>
                            {toast.description && (
                                <div className="text-xs text-white/60 mt-1 leading-relaxed">
                                    {toast.description}
                                </div>
                            )}
                        </div>
                        <button
                            onClick={() => removeToast(toast.id)}
                            className="shrink-0 p-1 hover:bg-white/10 rounded-lg transition-colors text-white/50 hover:text-white"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
};
