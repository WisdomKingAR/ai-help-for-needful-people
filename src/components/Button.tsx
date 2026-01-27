import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

interface ButtonProps {
    children: ReactNode;
    onClick?: () => void;
    variant?: 'primary' | 'secondary' | 'outline';
    className?: string;
    ariaLabel?: string;
}

export const Button = ({ children, onClick, variant = 'primary', className = '', ariaLabel }: ButtonProps) => {
    const baseStyles = "px-8 py-4 rounded-full font-bold text-lg transition-all duration-300 focus:ring-4 focus:ring-primary/50 outline-none";
    const variants = {
        primary: "bg-primary text-white hover:bg-primary/80 hover:shadow-[0_0_20px_rgba(59,130,246,0.6)]",
        secondary: "bg-secondary text-white hover:bg-secondary/80 hover:shadow-[0_0_20px_rgba(139,92,246,0.6)]",
        outline: "border-2 border-white/20 text-white hover:bg-white/10 hover:border-white/40",
    };

    return (
        <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClick}
            className={`${baseStyles} ${variants[variant]} ${className}`}
            aria-label={ariaLabel}
        >
            {children}
        </motion.button>
    );
};
