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
                boxShadow: "0 16px 48px rgba(74, 144, 226, 0.25)"
            }}
            className={`glass p-8 float-shadow transition-all duration-500 overflow-hidden relative group ${className}`}
        >
            {/* Subtle Sweep Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-black/[0.02] to-transparent -translate-x-full group-hover:animate-sweep pointer-events-none" />

            <div className="relative z-10">
                {children}
            </div>
        </motion.div>
    );
};
