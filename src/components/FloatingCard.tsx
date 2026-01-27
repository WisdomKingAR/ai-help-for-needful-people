import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

interface FloatingCardProps {
    children: ReactNode;
    className?: string;
    delay?: number;
    onClick?: () => void;
}

export const FloatingCard = ({ children, className = '', delay = 0, onClick }: FloatingCardProps) => {
    return (
        <motion.div
            onClick={onClick}
            initial={{ y: 0 }}
            animate={{ y: [-10, 10, -10] }}
            transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut",
                delay: delay
            }}
            whileHover={{
                scale: 1.05,
                rotateY: 5,
                rotateX: 5,
                boxShadow: "0 0 40px rgba(59, 130, 246, 0.4)"
            }}
            className={`glass p-8 float-shadow transition-all duration-500 overflow-hidden relative group ${className}`}
        >
            {/* Holographic Sweep */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:animate-sweep pointer-events-none" />

            <div className="relative z-10">
                {children}
            </div>
        </motion.div>
    );
};
