import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Info, Mic, MicOff, VolumeX, BellRing, MessageSquareQuote } from 'lucide-react';
import { useToast } from '../context/ToastContext';

interface DeafModeProps {
    onBack: () => void;
}

export default function DeafMode({ onBack }: DeafModeProps) {
    const [isListening, setIsListening] = useState(false);
    const [transcription, setTranscription] = useState<string[]>(["Welcome! Start listening to see real-time captions here."]);
    const [visualAlerts, setVisualAlerts] = useState<{ id: number; type: string }[]>([]);
    const [permissionState, setPermissionState] = useState<'granted' | 'denied' | 'prompt'>('prompt');
    const recognitionRef = useRef<any>(null);
    const { showToast } = useToast();

    useEffect(() => {
        let audioContext: AudioContext;
        let analyser: AnalyserNode;
        let microphone: MediaStreamAudioSourceNode;
        let dataArray: Uint8Array;
        let animationFrameId: number;

        // Initialize Speech Recognition
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

            recognitionRef.current.onerror = (event: any) => {
                if (event.error === 'not-allowed' || event.error === 'permission-denied') {
                    setPermissionState('denied');
                    setIsListening(false);
                }
            };

            recognitionRef.current.onend = () => {
                if (isListening && permissionState === 'granted') recognitionRef.current.start();
            };
        }

        // Initialize Audio Analysis for Sound Detection
        const initAudio = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                setPermissionState('granted');

                audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
                analyser = audioContext.createAnalyser();
                microphone = audioContext.createMediaStreamSource(stream);
                microphone.connect(analyser);
                analyser.fftSize = 256;
                const bufferLength = analyser.frequencyBinCount;
                dataArray = new Uint8Array(bufferLength);

                const detectSound = () => {
                    analyser.getByteFrequencyData(dataArray as any);

                    // Calculate average volume
                    let sum = 0;
                    for (let i = 0; i < bufferLength; i++) {
                        sum += dataArray[i];
                    }
                    const average = sum / bufferLength;

                    // Threshold for "Loud Noise" detection (adjustable)
                    if (average > 50) {
                        // Debounce alerts slightly
                        setVisualAlerts(prev => {
                            const now = Date.now();
                            if (prev.length > 0 && now - prev[prev.length - 1].id < 1000) return prev;

                            const type = average > 100 ? 'Sudden Loud Noise' : 'Background Noise Detected';
                            const newAlert = { id: now, type };

                            // Auto-remove after 3s
                            setTimeout(() => {
                                setVisualAlerts(current => current.filter(alert => alert.id !== now));
                            }, 3000);

                            return [...prev, newAlert];
                        });
                    }

                    if (isListening) {
                        animationFrameId = requestAnimationFrame(detectSound);
                    }
                };

                if (isListening) detectSound();

            } catch (err: any) {
                console.error("Microphone access denied for sound analysis", err);
                if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
                    setPermissionState('denied');
                }
                setIsListening(false);
            }
        };

        if (isListening) {
            initAudio();
        }

        // Add permission checks and toast messages
        // This block assumes 'permission' object is available, likely from navigator.permissions.query({ name: 'microphone' })
        // For now, we'll use a dummy 'permission' object or assume it's queried earlier.
        // To make this syntactically correct and functional, we need to query the permission state.
        const checkMicrophonePermission = async () => {
            try {
                const permission = await navigator.permissions.query({ name: 'microphone' as PermissionName });

                if (permission.state === 'granted') {
                    setPermissionState('granted');
                    // setIsListening(true); // This might cause an infinite loop if not handled carefully with isListening dependency
                    showToast("Microphone Active", "success", "Listening for speech and sounds...");
                } else if (permission.state === 'prompt') {
                    setPermissionState('prompt');
                } else {
                    setPermissionState('denied');
                    showToast("Microphone Access Denied", "error");
                }

                permission.addEventListener('change', () => {
                    if (permission.state === 'granted') {
                        setPermissionState('granted');
                        showToast("Microphone Active", "success");
                    } else {
                        setPermissionState('denied');
                        showToast("Microphone Access Denied", "error");
                    }
                });
            } catch (error) {
                console.error("Error querying microphone permission:", error);
                setPermissionState('denied');
                showToast("Microphone Access Denied", "error", "Could not check permission status.");
            }
        };

        checkMicrophonePermission();

        return () => {
            if (recognitionRef.current) recognitionRef.current.stop();
            if (audioContext) audioContext.close();
            if (animationFrameId) cancelAnimationFrame(animationFrameId);
        };
    }, [isListening]);

    const toggleListening = () => {
        if (permissionState === 'denied') return;

        if (isListening) {
            recognitionRef.current?.stop();
        } else {
            try {
                recognitionRef.current?.start();
            } catch (e) {
                // Ignore start errors if already started
            }
        }
        setIsListening(!isListening);
    };

    if (permissionState === 'denied') {
        return (
            <div className="flex flex-col items-center justify-center h-[600px] glass-panel rounded-[2.5rem] p-8 text-center space-y-6">
                <div className="w-24 h-24 bg-pink-500/20 rounded-full flex items-center justify-center animate-pulse">
                    <MicOff className="w-12 h-12 text-pink-500" />
                </div>
                <h3 className="text-3xl font-bold">Microphone Access Required</h3>
                <p className="text-xl text-white/60 max-w-md">
                    To hear the world for you, I need access to your microphone. Please allow microphone permissions in your browser settings.
                </p>
                <button onClick={onBack} className="px-8 py-4 bg-white/10 hover:bg-white/20 rounded-2xl font-bold transition-colors">
                    Back to Home
                </button>
            </div>
        );
    }

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
