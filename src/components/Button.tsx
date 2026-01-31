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
    const baseStyles = "px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 focus:ring-4 focus:ring-brand-primary/40 outline-none";
    const variants = {
        primary: "bg-brand-primary text-white hover:bg-brand-primary/90 shadow-lg shadow-brand-primary/25 hover:shadow-xl hover:shadow-brand-primary/30",
        secondary: "bg-brand-secondary text-white hover:bg-brand-secondary/90 shadow-lg shadow-brand-secondary/25 hover:shadow-xl hover:shadow-brand-secondary/30",
        outline: "border-2 border-gray-200 text-[#1A2847] hover:bg-gray-50 hover:border-gray-300",
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
