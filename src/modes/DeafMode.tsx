import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Info, Mic, MicOff, VolumeX, BellRing, MessageSquareQuote } from 'lucide-react';

interface DeafModeProps {
    onBack: () => void;
}

export default function DeafMode({ onBack }: DeafModeProps) {
    const [isListening, setIsListening] = useState(false);
    const [transcription, setTranscription] = useState<string[]>(["Welcome! Start listening to see real-time captions here."]);
    const [visualAlerts, setVisualAlerts] = useState<{ id: number; type: string }[]>([]);
    const recognitionRef = useRef<any>(null);

    useEffect(() => {
        // Setup Speech Recognition
        if (typeof window !== 'undefined' && ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
            const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.continuous = true;
            recognitionRef.current.interimResults = true;

            recognitionRef.current.onresult = (event: any) => {
                let interimTranscript = '';
                for (let i = event.resultIndex; i < event.results.length; ++i) {
                    if (event.results[i].isFinal) {
                        setTranscription(prev => [event.results[i][0].transcript, ...prev.slice(0, 10)]);
                    } else {
                        interimTranscript += event.results[i][0].transcript;
                    }
                }
            };

            recognitionRef.current.onend = () => {
                if (isListening) recognitionRef.current.start();
            };
        }

        // Mock visual sound alerts
        const interval = setInterval(() => {
            if (isListening) {
                const types = ['Doorbell', 'Phone Ringing', 'Sudden Noise', 'Speech Detected'];
                const random = types[Math.floor(Math.random() * types.length)];
                const id = Date.now();
                setVisualAlerts(prev => [...prev, { id, type: random }]);
                setTimeout(() => {
                    setVisualAlerts(prev => prev.filter(alert => alert.id !== id));
                }, 3000);
            }
        }, 10000);

        return () => {
            if (recognitionRef.current) recognitionRef.current.stop();
            clearInterval(interval);
        };
    }, [isListening]);

    const toggleListening = () => {
        if (isListening) {
            recognitionRef.current?.stop();
        } else {
            recognitionRef.current?.start();
        }
        setIsListening(!isListening);
    };

    return (
        <div className="space-y-8 relative">
            <div className="flex justify-between items-center">
                <button
                    onClick={onBack}
                    className="flex items-center gap-2 px-6 py-3 glass-panel rounded-2xl hover:bg-white/10 transition-colors"
                >
                    <ChevronLeft className="w-5 h-5" />
                    <span>Back to Home</span>
                </button>
                <div className="flex items-center gap-3 bg-pink-500/20 px-4 py-2 rounded-full border border-pink-500/30">
                    <div className={`w-2 h-2 rounded-full ${isListening ? 'bg-pink-500 animate-ping' : 'bg-pink-500/50'}`} />
                    <span className="text-sm font-medium">{isListening ? 'Listening Ambient Sounds' : 'Microphone Paused'}</span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-[600px]">
                {/* Real-time Transcription Panel */}
                <div className="lg:col-span-2 flex flex-col gap-6 h-full">
                    <div className="flex-1 glass-panel rounded-[2.5rem] p-10 flex flex-col overflow-hidden relative">
                        <div className="flex items-center gap-4 mb-8">
                            <MessageSquareQuote className="w-8 h-8 text-pink-400" />
                            <h3 className="text-2xl font-bold">Live Captions</h3>
                        </div>

                        <div className="flex-1 overflow-y-auto space-y-6 scrollbar-hide">
                            {transcription.map((text, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className={`p-6 rounded-3xl ${i === 0 ? 'bg-white/10 text-3xl font-bold' : 'bg-white/5 text-xl opacity-40'}`}
                                >
                                    {text}
                                </motion.div>
                            ))}
                        </div>

                        {/* Bottom Gradient for text fade */}
                        <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-[#16213e] to-transparent pointer-events-none" />
                    </div>

                    <button
                        onClick={toggleListening}
                        className={`w-full py-8 rounded-[2rem] flex items-center justify-center gap-4 font-bold text-2xl transition-all duration-500 ${isListening ? 'bg-pink-500 shadow-lg shadow-pink-500/30' : 'bg-white/10 hover:bg-white/20'}`}
                    >
                        {isListening ? (
                            <>
                                <Mic className="w-8 h-8" /> Stop Listening
                            </>
                        ) : (
                            <>
                                <MicOff className="w-8 h-8" /> Tap to Start Listening
                            </>
                        )}
                    </button>
                </div>

                {/* Visual Alerts Panel */}
                <div className="hidden lg:flex flex-col gap-6 h-full">
                    <div className="flex-1 glass-panel rounded-[2.5rem] p-8 flex flex-col items-center">
                        <div className="flex items-center gap-3 mb-12 self-start">
                            <BellRing className="w-6 h-6 text-yellow-400" />
                            <h4 className="font-bold">Visual Sound Alerts</h4>
                        </div>

                        <div className="relative w-full flex-1 flex items-center justify-center">
                            <AnimatePresence>
                                {visualAlerts.map((alert) => (
                                    <motion.div
                                        key={alert.id}
                                        initial={{ scale: 0, opacity: 0 }}
                                        animate={{ scale: 2, opacity: 0 }}
                                        transition={{ duration: 2, ease: "easeOut" }}
                                        className="absolute w-32 h-32 rounded-full border-4 border-pink-400/50"
                                    />
                                ))}
                            </AnimatePresence>

                            <div className="relative text-center z-10">
                                <AnimatePresence mode="wait">
                                    {visualAlerts.length > 0 ? (
                                        <motion.div
                                            key={visualAlerts[visualAlerts.length - 1].type}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                        >
                                            <div className="w-20 h-20 rounded-full bg-pink-500/20 flex items-center justify-center mx-auto mb-4">
                                                <VolumeX className="w-10 h-10 text-pink-400" />
                                            </div>
                                            <p className="text-2xl font-bold text-pink-400">{visualAlerts[visualAlerts.length - 1].type}</p>
                                            <p className="text-white/50">Detected nearby</p>
                                        </motion.div>
                                    ) : (
                                        <motion.p
                                            key="idle"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 0.3 }}
                                            className="text-white"
                                        >
                                            Monitoring environment...
                                        </motion.p>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>

                        <div className="w-full p-4 bg-white/5 rounded-2xl flex items-center gap-3">
                            <Info className="w-5 h-5 text-blue-400" />
                            <span className="text-sm text-white/60">Phone vibrations are also active for alerts.</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
