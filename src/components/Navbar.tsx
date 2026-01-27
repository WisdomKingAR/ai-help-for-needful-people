import { motion } from 'framer-motion';
import { Accessibility, Menu, X, LogOut, LayoutDashboard, Home } from 'lucide-react';
import { useState, useEffect } from 'react';

interface NavbarProps {
    onJoinClick: () => void;
    isLoggedIn?: boolean;
    onLogout?: () => void;
    onDashboardClick?: () => void;
    onHomeClick?: () => void;
}

export const Navbar = ({ onJoinClick, isLoggedIn, onLogout, onDashboardClick, onHomeClick }: NavbarProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navItems = [
        { name: 'About', href: '#about' },
        { name: 'Features', href: '#features' },
        { name: 'Impact', href: '#impact' },
        { name: 'Principles', href: '#principles' },
    ];

    return (
        <nav className={`fixed top-0 w-full z-50 px-6 py-4 glass mt-4 mx-auto max-w-7xl left-1/2 -translate-x-1/2 flex items-center justify-between border-white/10 transition-all ${isScrolled ? 'bg-background/80 py-3 mt-2' : ''}`}>
            <div
                className="flex items-center gap-2 cursor-pointer group"
                onClick={onHomeClick}
            >
                <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(59,130,246,0.5)] group-hover:rotate-6 transition-transform">
                    <Accessibility className="text-white" size={24} />
                </div>
                <span className="text-xl font-bold tracking-tight">AccessAI</span>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-8">
                {!isLoggedIn && navItems.map((item) => (
                    <a
                        key={item.name}
                        href={item.href}
                        className="nav-link text-white/70 hover:text-white font-medium"
                    >
                        {item.name}
                    </a>
                ))}

                {isLoggedIn ? (
                    <div className="flex items-center gap-6">
                        <button
                            onClick={onHomeClick}
                            className="flex items-center gap-2 text-white/60 hover:text-white transition-colors font-medium"
                        >
                            <Home size={18} />
                            <span>Home</span>
                        </button>
                        <button
                            onClick={onDashboardClick}
                            className="flex items-center gap-2 text-white/60 hover:text-white transition-colors font-medium"
                        >
                            <LayoutDashboard size={18} />
                            <span>Dashboard</span>
                        </button>
                        <button
                            onClick={onLogout}
                            className="flex items-center gap-2 bg-red-500/10 text-red-500 px-5 py-2 rounded-full font-bold hover:bg-red-500/20 transition-all"
                        >
                            <LogOut size={18} />
                            Logout
                        </button>
                    </div>
                ) : (
                    <button
                        onClick={onJoinClick}
                        className="bg-primary text-white px-8 py-2.5 rounded-full font-bold hover:bg-primary/80 transition-all shadow-[0_0_20px_rgba(59,130,246,0.3)]"
                    >
                        Join Us
                    </button>
                )}
            </div>

            {/* Mobile Menu Button */}
            <button
                className="md:hidden text-white"
                onClick={() => setIsOpen(!isOpen)}
                aria-expanded={isOpen}
                aria-label="Toggle navigation menu"
            >
                {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>

            {/* Mobile Menu */}
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute top-full left-0 w-full glass mt-2 p-6 flex flex-col gap-4 md:hidden border-white/10"
                >
                    {!isLoggedIn ? (
                        <>
                            {navItems.map((item) => (
                                <a
                                    key={item.name}
                                    href={item.href}
                                    className="text-lg font-medium py-2 border-b border-white/5"
                                    onClick={() => setIsOpen(false)}
                                >
                                    {item.name}
                                </a>
                            ))}
                            <button
                                onClick={() => { onJoinClick(); setIsOpen(false); }}
                                className="bg-primary text-white py-4 rounded-xl font-bold mt-2"
                            >
                                Join the Movement
                            </button>
                        </>
                    ) : (
                        <>
                            <button onClick={() => { onHomeClick?.(); setIsOpen(false); }} className="text-left text-lg font-medium py-3 border-b border-white/5 flex items-center gap-3"><Home size={20} /> Home</button>
                            <button onClick={() => { onDashboardClick?.(); setIsOpen(false); }} className="text-left text-lg font-medium py-3 border-b border-white/5 flex items-center gap-3"><LayoutDashboard size={20} /> Dashboard</button>
                            <button onClick={() => { onLogout?.(); setIsOpen(false); }} className="text-left text-lg font-medium py-3 text-red-500 flex items-center gap-3"><LogOut size={20} /> Logout</button>
                        </>
                    )}
                </motion.div>
            )}
        </nav>
    );
};
