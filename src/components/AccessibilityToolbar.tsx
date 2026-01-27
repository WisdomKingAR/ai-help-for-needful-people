import { motion } from 'framer-motion';
import { Settings, Contrast, Type } from 'lucide-react';
import { useState, useEffect } from 'react';

export const AccessibilityToolbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [highContrast, setHighContrast] = useState(false);
    const [fontSize, setFontSize] = useState(1);

    useEffect(() => {
        if (highContrast) {
            document.documentElement.classList.add('high-contrast');
        } else {
            document.documentElement.classList.remove('high-contrast');
        }
    }, [highContrast]);

    useEffect(() => {
        document.documentElement.style.fontSize = `${fontSize * 100}%`;
    }, [fontSize]);

    return (
        <div className="fixed bottom-8 right-8 z-[100]">
            <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsOpen(!isOpen)}
                className="w-16 h-16 bg-primary rounded-full shadow-[0_0_20px_rgba(59,130,246,0.6)] flex items-center justify-center text-white relative"
                aria-label="Accessibility Settings"
            >
                <Settings className={isOpen ? 'rotate-90 transition-transform' : ''} size={28} />
            </motion.button>

            {isOpen && (
                <motion.div
                    initial={{ opacity: 0, y: 20, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    className="absolute bottom-20 right-0 w-64 glass p-6 border-white/20 shadow-2xl"
                >
                    <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                        <Settings size={20} className="text-primary" /> Settings
                    </h3>

                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Contrast size={18} />
                                <span className="font-medium">Contrast</span>
                            </div>
                            <button
                                onClick={() => setHighContrast(!highContrast)}
                                className={`w-12 h-6 rounded-full transition-colors ${highContrast ? 'bg-primary' : 'bg-white/10'}`}
                            >
                                <div className={`w-4 h-4 rounded-full bg-white transition-transform ${highContrast ? 'translate-x-7' : 'translate-x-1'}`} />
                            </button>
                        </div>

                        <div className="space-y-3">
                            <div className="flex items-center gap-3 mb-2">
                                <Type size={18} />
                                <span className="font-medium">Text Size</span>
                            </div>
                            <div className="flex gap-2">
                                {[0.8, 1, 1.2, 1.5].map((s) => (
                                    <button
                                        key={s}
                                        onClick={() => setFontSize(s)}
                                        className={`flex-1 py-2 rounded-lg text-sm font-bold border ${fontSize === s ? 'bg-primary border-primary' : 'bg-white/5 border-white/10'}`}
                                    >
                                        {s === 1 ? 'Default' : `${Math.round(s * 100)}%`}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <button
                            onClick={() => {
                                setHighContrast(false);
                                setFontSize(1);
                            }}
                            className="w-full py-3 bg-white/5 hover:bg-white/10 rounded-xl text-sm font-bold transition-colors mt-4"
                        >
                            Reset to Default
                        </button>
                    </div>
                </motion.div>
            )}
        </div>
    );
};
