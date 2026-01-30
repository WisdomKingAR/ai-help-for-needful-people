import { useRef, useState, useEffect } from 'react';
import Webcam from 'react-webcam';
import { FilesetResolver, GestureRecognizer } from '@mediapipe/tasks-vision';
import { Camera, RefreshCw, Hand, AlertCircle, Maximize2, Minimize2, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '../context/ToastContext';
import { LoadingOverlay } from '../components/ui/LoadingOverlay';

export default function SignLanguageMode({ onBack }: { onBack: () => void }) {
    const webcamRef = useRef<Webcam>(null);
    const [recognizer, setRecognizer] = useState<GestureRecognizer | null>(null);
    const [gesture, setGesture] = useState<string>('None');
    const [confidence, setConfidence] = useState<number>(0);
    const [isProcessing, setIsProcessing] = useState(false);
    const lastVideoTime = useRef(-1);
    const requestRef = useRef<number>(0);
    const [permissionState, setPermissionState] = useState<'granted' | 'denied' | 'prompt' | 'error'>('prompt');
    const [isFullscreen, setIsFullscreen] = useState(false);

    const { showToast } = useToast();

    // Initialize MediaPipe Gesture Recognizer
    useEffect(() => {
        const init = async () => {
            try {
                // Check Camera Permission
                const stream = await navigator.mediaDevices.getUserMedia({ video: true });
                stream.getTracks().forEach(track => track.stop());
                setPermissionState('granted');

                const vision = await FilesetResolver.forVisionTasks(
                    "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3/wasm"
                );
                const recognizer = await GestureRecognizer.createFromOptions(vision, {
                    baseOptions: {
                        modelAssetPath: "https://storage.googleapis.com/mediapipe-models/gesture_recognizer/gesture_recognizer/float16/1/gesture_recognizer.task",
                        delegate: "GPU"
                    },
                    runningMode: "VIDEO",
                    numHands: 2
                });
                setRecognizer(recognizer);
                setIsProcessing(true);
                showToast("Sign Language Hand Tracking Ready", "success", "You can now start signing.");
            } catch (error: any) {
                console.error("Initialization Error:", error);
                if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
                    setPermissionState('denied');
                    showToast("Camera Access Denied", "error", "Please enable camera access.");
                } else {
                    setPermissionState('error');
                    showToast("System Error", "error", "Failed to load hand tracking models.");
                }
            }
        };
        init();
    }, [showToast]);

    const predict = () => {
        if (webcamRef.current && webcamRef.current.video && recognizer) {
            const video = webcamRef.current.video;
            if (video.currentTime !== lastVideoTime.current) {
                lastVideoTime.current = video.currentTime;
                const result = recognizer.recognizeForVideo(video, Date.now());

                if (result.gestures.length > 0) {
                    const category = result.gestures[0][0];
                    setGesture(category.categoryName);
                    setConfidence(category.score);
                } else {
                    setGesture('None');
                    setConfidence(0);
                }
            }
        }
        requestRef.current = requestAnimationFrame(predict);
    };

    useEffect(() => {
        if (isProcessing && recognizer) {
            requestRef.current = requestAnimationFrame(predict);
        }
        return () => cancelAnimationFrame(requestRef.current);
    }, [isProcessing, recognizer]);

    // Permission Denied UI
    if (permissionState === 'denied') {
        return (
            <div className="flex flex-col items-center justify-center h-[600px] glass-panel rounded-[2.5rem] p-8 text-center space-y-6">
                <div className="w-24 h-24 bg-red-500/10 rounded-full flex items-center justify-center animate-pulse">
                    <Camera className="w-12 h-12 text-red-500" />
                </div>
                <h3 className="text-3xl font-bold">Camera Access Required</h3>
                <p className="text-white/60 max-w-md text-lg">
                    We need camera access to translate your sign language gestures.
                </p>
                <button onClick={onBack} className="px-8 py-4 bg-white/10 hover:bg-white/20 rounded-2xl font-bold transition-colors">
                    Back to Home
                </button>
            </div>
        );
    }

    // Error UI
    if (permissionState === 'error') {
        return (
            <div className="flex flex-col items-center justify-center h-[600px] glass-panel rounded-[2.5rem] p-8 text-center space-y-6">
                <div className="w-24 h-24 bg-red-500/10 rounded-full flex items-center justify-center">
                    <AlertCircle className="w-12 h-12 text-red-500" />
                </div>
                <h3 className="text-3xl font-bold">System Error</h3>
                <p className="text-white/60 max-w-md text-lg">
                    Failed to initialize hand tracking.
                </p>
                <button onClick={() => window.location.reload()} className="px-8 py-4 bg-brand-primary hover:bg-brand-primary/80 rounded-2xl font-bold transition-colors">
                    Retry
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-6 relative">
            <AnimatePresence>
                {!recognizer && permissionState === 'prompt' && (
                    <LoadingOverlay message="Loading Hand Tracking" subMessage="Initializing MediaPipe Vision..." />
                )}
            </AnimatePresence>

            <div className="flex items-center justify-between">
                <button onClick={onBack} className="p-4 bg-white/5 hover:bg-white/10 rounded-2xl transition-colors border border-white/10">
                    <RefreshCw className="rotate-180" size={24} />
                </button>
                <div className="flex items-center gap-3 bg-blue-500/20 px-4 py-2 rounded-full border border-blue-500/30">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" />
                    <span className="text-blue-300 font-medium text-sm">AI Hand Tracking Active</span>
                </div>
            </div>

            {/* Main Camera Area */}
            <div className={`relative transition-all duration-500 ease-in-out ${isFullscreen ? 'fixed inset-0 z-50 bg-black' : 'aspect-video rounded-[2.5rem] overflow-hidden border-2 border-white/10 shadow-2xl bg-black'}`}>
                <Webcam
                    ref={webcamRef}
                    className="w-full h-full object-cover"
                    key={isFullscreen ? 'fullscreen' : 'windowed'}
                    mirrored
                />

                {/* Fullscreen Toggle */}
                <button
                    onClick={() => setIsFullscreen(!isFullscreen)}
                    className="absolute top-6 right-6 p-4 bg-black/40 hover:bg-black/60 backdrop-blur-md rounded-2xl text-white transition-all border border-white/10 z-10"
                >
                    {isFullscreen ? <Minimize2 size={24} /> : <Maximize2 size={24} />}
                </button>

                {/* Gesture Overlay */}
                <AnimatePresence>
                    {gesture !== 'None' && (
                        <motion.div
                            initial={{ opacity: 0, y: 20, scale: 0.9 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-xl px-8 py-4 rounded-3xl border border-white/10 flex items-center gap-4 shadow-2xl"
                        >
                            <Hand className="text-brand-primary w-8 h-8" />
                            <div>
                                <p className="text-white/40 text-xs font-bold uppercase tracking-wider mb-1">Detected Sign</p>
                                <p className="text-3xl font-bold bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
                                    {gesture}
                                </p>
                            </div>
                            <div className="h-10 w-[1px] bg-white/10 mx-2" />
                            <div className="flex flex-col items-end">
                                <p className="text-white/40 text-xs font-bold uppercase tracking-wider mb-1">Confidence</p>
                                <p className="text-xl font-bold text-green-400">
                                    {Math.round(confidence * 100)}%
                                </p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Tips Panel */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="glass-panel p-6 rounded-3xl flex items-start gap-4">
                    <div className="p-3 bg-green-500/20 rounded-xl text-green-400">
                        <CheckCircle2 size={24} />
                    </div>
                    <div>
                        <h4 className="text-lg font-bold mb-1">Lighting</h4>
                        <p className="text-white/60 text-sm leading-relaxed">
                            Ensure your hands are well-lit and clearly visible against the background.
                        </p>
                    </div>
                </div>
                <div className="glass-panel p-6 rounded-3xl flex items-start gap-4">
                    <div className="p-3 bg-purple-500/20 rounded-xl text-purple-400">
                        <Hand size={24} />
                    </div>
                    <div>
                        <h4 className="text-lg font-bold mb-1">Positioning</h4>
                        <p className="text-white/60 text-sm leading-relaxed">
                            Keep your hands within the frame and try to show your palms clearly.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
