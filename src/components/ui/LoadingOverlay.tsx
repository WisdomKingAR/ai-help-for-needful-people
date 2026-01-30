import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

interface LoadingOverlayProps {
    message?: string;
    subMessage?: string;
}

export const LoadingOverlay = ({ message = "Loading...", subMessage }: LoadingOverlayProps) => {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/60 backdrop-blur-md rounded-[2.5rem]"
        >
            <div className="relative">
                <div className="absolute inset-0 bg-brand-primary/20 blur-xl rounded-full animate-pulse" />
                <Loader2 className="w-16 h-16 text-brand-primary animate-spin relative z-10" />
            </div>

            <motion.h3
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-2xl font-bold mt-6 text-white"
            >
                {message}
            </motion.h3>

            {subMessage && (
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.7 }}
                    transition={{ delay: 0.2 }}
                    className="text-white/60 mt-2 text-center max-w-xs"
                >
                    {subMessage}
                </motion.p>
            )}
        </motion.div>
    );
};
