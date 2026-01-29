import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Volume2, X, ChevronUp } from 'lucide-react';
import type { Mode } from '../App';

interface AssistantProps {
    activeMode: Mode;
    isExpanded: boolean;
    setIsExpanded: (val: boolean) => void;
}

export default function Assistant({ activeMode, isExpanded, setIsExpanded }: AssistantProps) {
    const getAvatarColor = () => {
        switch (activeMode) {
            case 'blind': return '#8b5cf6'; // Purple
            case 'deaf': return '#ec4899'; // Pink
            case 'sign': return '#3b82f6'; // Blue
            default: return '#10b981'; // Green
        }
    };

    const getStatusMessage = () => {
        switch (activeMode) {
            case 'blind': return "I'm narrating your surroundings. You can ask me to read anything.";
            case 'deaf': return "I'm listening for sounds around you. I'll alert you visually.";
            case 'sign': return "I'm watching your gestures. Move your hands naturally.";
            default: return "Hello! I'm your AI companion. How can I help you today?";
        }
    };

    return (
        <div className="fixed bottom-24 right-6 z-[60]">
            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, y: 20, x: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
                        exit={{ opacity: 0, scale: 0.8, y: 20, x: 20 }}
                        className="absolute bottom-20 right-0 w-80 glass-panel rounded-3xl p-6 mb-4"
                    >
                        <div className="flex justify-between items-start mb-4">
                            <h3 className="font-bold text-xl">AI Assistant</h3>
                            <button
                                onClick={() => setIsExpanded(false)}
                                className="p-1 hover:bg-white/10 rounded-full transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <p className="text-white/80 leading-relaxed mb-6">
                            {getStatusMessage()}
                        </p>

                        <div className="space-y-3">
                            <button className="w-full py-3 px-4 bg-white/10 hover:bg-white/20 rounded-2xl flex items-center gap-3 transition-colors text-left">
                                <Volume2 className="w-5 h-5 text-brand-primary" />
                                <span className="text-sm">Change Voice Settings</span>
                            </button>
                            <button className="w-full py-3 px-4 bg-white/10 hover:bg-white/20 rounded-2xl flex items-center gap-3 transition-colors text-left">
                                <MessageSquare className="w-5 h-5 text-brand-secondary" />
                                <span className="text-sm">Type a Command</span>
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsExpanded(!isExpanded)}
                className="relative w-16 h-16 rounded-full glass-panel flex items-center justify-center overflow-hidden glow-focus"
            >
                <motion.div
                    className="absolute inset-0 opacity-40"
                    animate={{
                        backgroundColor: getAvatarColor(),
                        boxShadow: `0 0 40px ${getAvatarColor()}`
                    }}
                />

                {/* Animated Avatar Face */}
                <div className="relative w-10 h-10">
                    <motion.svg viewBox="0 0 100 100" className="w-full h-full">
                        {/* Eyes */}
                        <motion.circle
                            cx="30" cy="40" r="8" fill="white"
                            animate={{ scaleY: [1, 0.1, 1], transition: { repeat: Infinity, duration: 3, times: [0, 0.1, 0.2] } }}
                        />
                        <motion.circle
                            cx="70" cy="40" r="8" fill="white"
                            animate={{ scaleY: [1, 0.1, 1], transition: { repeat: Infinity, duration: 3, times: [0, 0.1, 0.2] } }}
                        />
                        {/* Mouth */}
                        <motion.path
                            d="M30 70 Q50 80 70 70"
                            fill="transparent"
                            stroke="white"
                            strokeWidth="6"
                            strokeLinecap="round"
                            animate={{
                                d: activeMode !== 'none' ? "M30 75 Q50 65 70 75" : "M30 70 Q50 80 70 70"
                            }}
                        />
                    </motion.svg>
                </div>

                {/* Floating Indicator */}
                {!isExpanded && (
                    <motion.div
                        className="absolute -top-1 -right-1 p-1 bg-white rounded-full shadow-lg"
                        animate={{ y: [0, -3, 0] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                    >
                        <ChevronUp className="w-3 h-3 text-black" />
                    </motion.div>
                )}
            </motion.button>
        </div>
    );
}
