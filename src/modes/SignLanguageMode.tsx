import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Webcam from 'react-webcam';
import { ChevronLeft, Hand, Waves, MousePointer2, Camera } from 'lucide-react';

interface SignLanguageModeProps {
    onBack: () => void;
}

export default function SignLanguageMode({ onBack }: SignLanguageModeProps) {
    const [detectedGesture, setDetectedGesture] = useState('Waiting for gesture...');
    const [avatarMessage, setAvatarMessage] = useState('Hello! I am learning your signs.');
    const [lastAction, setLastAction] = useState('');

    useEffect(() => {
        // Simulate gesture detection
        const interval = setInterval(() => {
            const gestures = ['Wave', 'Pointing', 'Thumbs Up', 'Wait', 'Hello'];
            const random = gestures[Math.floor(Math.random() * gestures.length)];
            setDetectedGesture(random);

            // Map gestures to actions
            if (random === 'Wave') setAvatarMessage("Hello! How can I help today?");
            if (random === 'Thumbs Up') setAvatarMessage("Great! I understand.");
            if (random === 'Pointing') setLastAction("Opening menu...");
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <button
                    onClick={onBack}
                    className="flex items-center gap-2 px-6 py-3 glass-panel rounded-2xl hover:bg-white/10 transition-colors"
                >
                    <ChevronLeft className="w-5 h-5" />
                    <span>Back to Home</span>
                </button>
                <div className="flex items-center gap-3 bg-blue-500/20 px-4 py-2 rounded-full border border-blue-500/30">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" />
                    <span className="text-sm font-medium">Gesture Recognition Active</span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-[600px]">
                {/* Sign Language Avatar */}
                <div className="flex flex-col gap-6">
                    <div className="flex-1 glass-panel rounded-[2.5rem] p-8 flex flex-col items-center justify-center relative overflow-hidden">
                        {/* Background Animation */}
                        <div className="absolute inset-0 opacity-10">
                            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-500/20 via-transparent to-transparent animate-pulse" />
                        </div>

                        <div className="relative w-64 h-64 mb-8">
                            {/* AI Avatar Body */}
                            <motion.svg viewBox="0 0 200 200" className="w-full h-full">
                                <defs>
                                    <linearGradient id="avatarGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                        <stop offset="0%" stopColor="#3b82f6" />
                                        <stop offset="100%" stopColor="#2dd4bf" />
                                    </linearGradient>
                                </defs>

                                {/* Head */}
                                <circle cx="100" cy="60" r="40" fill="url(#avatarGradient)" />
                                <circle cx="85" cy="55" r="4" fill="white" />
                                <circle cx="115" cy="55" r="4" fill="white" />
                                <path d="M85 75 Q100 85 115 75" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round" />

                                {/* Animated Hands (Signing) */}
                                <motion.circle
                                    cx="50" cy="120" r="15" fill="url(#avatarGradient)"
                                    animate={{
                                        x: [0, 20, 0, -10, 0],
                                        y: [0, -30, -10, -40, 0],
                                        scale: [1, 1.2, 0.9, 1.1, 1]
                                    }}
                                    transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                                />
                                <motion.circle
                                    cx="150" cy="120" r="15" fill="url(#avatarGradient)"
                                    animate={{
                                        x: [0, -20, 0, 10, 0],
                                        y: [0, -40, -20, -10, 0],
                                        scale: [1, 0.9, 1.2, 0.8, 1]
                                    }}
                                    transition={{ repeat: Infinity, duration: 4, ease: "easeInOut", delay: 0.5 }}
                                />

                                {/* Torso */}
                                <path d="M60 110 Q100 90 140 110 L150 180 Q100 195 50 180 Z" fill="url(#avatarGradient)" opacity="0.8" />
                            </motion.svg>
                        </div>

                        <div className="text-center max-w-sm">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={avatarMessage}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    className="bg-white/10 p-6 rounded-3xl border border-white/5 shadow-xl"
                                >
                                    <p className="text-2xl font-medium leading-relaxed italic">"{avatarMessage}"</p>
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="glass-panel rounded-3xl p-6 flex items-center gap-4">
                            <div className="p-3 bg-blue-500/10 rounded-xl">
                                <MousePointer2 className="w-6 h-6 text-blue-400" />
                            </div>
                            <div>
                                <p className="text-xs text-white/50 uppercase tracking-widest font-bold">Latest Action</p>
                                <p className="font-bold">{lastAction || 'Scanning...'}</p>
                            </div>
                        </div>
                        <div className="glass-panel rounded-3xl p-6 flex items-center gap-4">
                            <div className="p-3 bg-teal-500/10 rounded-xl">
                                <Waves className="w-6 h-6 text-teal-400" />
                            </div>
                            <div>
                                <p className="text-xs text-white/50 uppercase tracking-widest font-bold">Detected Sign</p>
                                <p className="font-bold">{detectedGesture}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Interaction/Gesture Area */}
                <div className="flex flex-col gap-6">
                    <div className="flex-1 glass-panel rounded-[2.5rem] overflow-hidden relative border-white/10">
                        <Webcam
                            className="w-full h-full object-cover grayscale opacity-40"
                            audio={false}
                        />

                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                            <motion.div
                                animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.6, 0.3] }}
                                transition={{ repeat: Infinity, duration: 3 }}
                                className="w-48 h-48 border-4 border-blue-500/30 rounded-full flex items-center justify-center"
                            >
                                <Hand className="w-20 h-20 text-blue-400/50" />
                            </motion.div>
                            <p className="mt-8 text-xl font-bold text-blue-400/80 uppercase tracking-widest">Position your hands</p>
                        </div>

                        <div className="absolute top-6 right-6">
                            <div className="flex items-center gap-2 bg-black/40 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
                                <Camera className="w-4 h-4" />
                                <span className="text-xs font-bold">FHD 60FPS</span>
                            </div>
                        </div>
                    </div>

                    <div className="glass-panel rounded-[2rem] p-8">
                        <h4 className="font-bold mb-4 opacity-70">Gesture Dictionary</h4>
                        <div className="flex flex-wrap gap-3">
                            {['Hello', 'Menu', 'Settings', 'Back', 'Yes', 'No', 'Help'].map(sign => (
                                <span key={sign} className="px-4 py-2 bg-white/5 rounded-full text-sm hover:bg-white/10 transition-colors cursor-crosshair">
                                    {sign}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
