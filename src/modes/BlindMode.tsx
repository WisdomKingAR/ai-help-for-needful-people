import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Webcam from 'react-webcam';
import { ChevronLeft, Volume2, Mic, Eye, Box, Type } from 'lucide-react';

interface BlindModeProps {
    onBack: () => void;
}

export default function BlindMode({ onBack }: BlindModeProps) {
    const [lastAnnouncement, setLastAnnouncement] = useState('Welcome to Blind Mode. I am ready to assist.');
    const [isScanning, setIsScanning] = useState(true);
    // const recognitionRef = useRef<any>(null); // Removed unused ref

    useEffect(() => {
        announce(lastAnnouncement);

        // Simulate periodic object detection
        const interval = setInterval(() => {
            if (!isScanning) return;
            const objects = ['Doorway detected 2 meters ahead', 'Reading: "Welcome Home" sign', 'Person identified: Sarah', 'Obstacle: Chair nearby'];
            const random = objects[Math.floor(Math.random() * objects.length)];
            setLastAnnouncement(random);
            announce(random);
        }, 8000);

        return () => clearInterval(interval);
    }, [isScanning]);

    const announce = (text: string) => {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.9;
        window.speechSynthesis.speak(utterance);
    };

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
                <div className="flex items-center gap-3 bg-brand-primary/20 px-4 py-2 rounded-full border border-brand-primary/30">
                    <div className="w-2 h-2 bg-brand-primary rounded-full animate-pulse" />
                    <span className="text-sm font-medium">Assistant Active</span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-[600px]">
                {/* Camera Feed */}
                <div className="relative rounded-[2.5rem] overflow-hidden glass-panel border-white/10 aspect-video lg:aspect-auto">
                    <Webcam
                        className="w-full h-full object-cover"
                        audio={false}
                    />

                    {/* Overlay for Object Recognition Simulation */}
                    <div className="absolute inset-0 p-8 pointer-events-none">
                        <motion.div
                            animate={{ opacity: [0.2, 0.5, 0.2] }}
                            transition={{ repeat: Infinity, duration: 2 }}
                            className="w-full h-full border-2 border-brand-primary/30 rounded-2xl border-dashed"
                        />

                        {/* Detected Objects Mocks */}
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute top-1/4 left-1/3 bg-brand-primary/80 backdrop-blur-md px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2"
                        >
                            <Box className="w-4 h-4" /> DOORWAY [CONFIDENCE: 94%]
                        </motion.div>

                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 1 }}
                            className="absolute bottom-1/3 right-1/4 bg-brand-secondary/80 backdrop-blur-md px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2"
                        >
                            <Type className="w-4 h-4" /> TEXT: "PUSH"
                        </motion.div>
                    </div>

                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-4">
                        <button
                            onClick={() => setIsScanning(!isScanning)}
                            className={`p-4 rounded-full ${isScanning ? 'bg-brand-primary' : 'bg-white/20'} transition-all`}
                        >
                            <Eye className="w-6 h-6" />
                        </button>
                    </div>
                </div>

                {/* Interaction Panel */}
                <div className="flex flex-col gap-6">
                    <div className="flex-1 glass-panel rounded-[2.5rem] p-8 flex flex-col justify-center items-center text-center">
                        <div className="w-24 h-24 rounded-full bg-brand-primary/10 flex items-center justify-center mb-6 animate-float">
                            <Volume2 className="w-12 h-12 text-brand-primary" />
                        </div>
                        <h3 className="text-3xl font-bold mb-4">Voice Guide</h3>
                        <p className="text-xl text-white/80 leading-relaxed italic">
                            "{lastAnnouncement}"
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <button
                            onClick={() => announce("I am reading current text on screen.")}
                            className="h-32 glass-panel rounded-3xl flex flex-col items-center justify-center gap-3 hover:bg-white/5 transition-colors group"
                        >
                            <Type className="w-8 h-8 text-brand-primary group-hover:scale-110 transition-transform" />
                            <span className="font-medium text-lg">Read Text</span>
                        </button>
                        <button
                            onClick={() => announce("Scanning for nearby objects.")}
                            className="h-32 glass-panel rounded-3xl flex flex-col items-center justify-center gap-3 hover:bg-white/5 transition-colors group"
                        >
                            <Box className="w-8 h-8 text-brand-secondary group-hover:scale-110 transition-transform" />
                            <span className="font-medium text-lg">Identify Objects</span>
                        </button>
                    </div>

                    <button className="w-full py-6 glass-panel rounded-[2rem] bg-brand-primary/10 border-brand-primary/30 flex items-center justify-center gap-4 hover:bg-brand-primary/20 transition-all font-bold text-2xl animate-pulse">
                        <Mic className="w-8 h-8" />
                        Hold for Voice Command
                    </button>
                </div>
            </div>
        </div>
    );
}
