import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Webcam from 'react-webcam';
import { ChevronLeft, Volume2, Eye, EyeOff, AlertCircle, Loader2, Box, Type } from 'lucide-react';
import * as tf from '@tensorflow/tfjs';
import * as cocoSsd from '@tensorflow-models/coco-ssd';
import { useToast } from '../context/ToastContext';
import { LoadingOverlay } from '../components/ui/LoadingOverlay';

interface BlindModeProps {
    onBack: () => void;
}

export default function BlindMode({ onBack }: BlindModeProps) {
    const [lastAnnouncement, setLastAnnouncement] = useState('');
    const [isScanning, setIsScanning] = useState(false);
    const [model, setModel] = useState<cocoSsd.ObjectDetection | null>(null);
    const [predictions, setPredictions] = useState<cocoSsd.DetectedObject[]>([]);
    const [permissionState, setPermissionState] = useState<'granted' | 'denied' | 'prompt' | 'error'>('prompt');
    const webcamRef = useRef<Webcam>(null);
    const requestRef = useRef<number | null>(null);
    const lastSpokenTime = useRef<number>(0);

    const { showToast } = useToast();

    // Text-to-Speech Helper
    const announce = useCallback((text: string) => {
        const now = Date.now();
        // Debounce same message within 2 seconds
        if (now - lastSpokenTime.current < 2000 && text === lastAnnouncement) return;

        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 1.0;
        window.speechSynthesis.speak(utterance);
        lastSpokenTime.current = now;
        setLastAnnouncement(text);
    }, [lastAnnouncement]);

    // Initial Permission & Model Load
    useEffect(() => {
        const checkPermissionsAndLoad = async () => {
            try {
                // Check Camera Permission
                const stream = await navigator.mediaDevices.getUserMedia({ video: true });
                // Stop tracks immediately after check to let Webcam component take over
                stream.getTracks().forEach(track => track.stop());
                setPermissionState('granted');

                // Load AI Model
                await tf.ready();
                const loadedModel = await cocoSsd.load();
                setModel(loadedModel);

                showToast("Visual Cortex Ready", "success", "Object detection system initialized.");
                const readyMsg = 'Visual cortex ready. I can now see objects around you.';
                announce(readyMsg);
                setIsScanning(true);
            } catch (err: any) {
                console.error("Initialization error:", err);
                if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
                    setPermissionState('denied');
                    showToast("Camera Access Denied", "error", "Please enable camera permissions in settings.");
                    announce("Camera access denied. Please enable camera permissions.");
                } else {
                    setPermissionState('error');
                    showToast("System Error", "error", err.message || "Failed to initialize AI.");
                    setLastAnnouncement("System error. Please check connection and refresh.");
                }
            }
        };
        checkPermissionsAndLoad();
    }, [announce, showToast]);

    // Detection Loop
    const detect = useCallback(async () => {
        if (webcamRef.current && webcamRef.current.video && webcamRef.current.video.readyState === 4 && model && isScanning) {
            const video = webcamRef.current.video;
            const preds = await model.detect(video);
            setPredictions(preds);

            if (preds.length > 0) {
                // Find the most confident prediction
                const bestPrediction = preds.reduce((prev, current) => (prev.score > current.score) ? prev : current);

                // Announce if high confidence
                if (bestPrediction.score > 0.7) {
                    announce(`I see a ${bestPrediction.class}`);
                }
            }
        }
        requestRef.current = requestAnimationFrame(detect);
    }, [model, isScanning, announce]);

    useEffect(() => {
        if (isScanning && model) {
            requestRef.current = requestAnimationFrame(detect);
        } else if (requestRef.current) {
            cancelAnimationFrame(requestRef.current);
        }
        return () => {
            if (requestRef.current) cancelAnimationFrame(requestRef.current);
        };
    }, [isScanning, model, detect]);

    // Cleanup speech on unmount
    useEffect(() => {
        return () => window.speechSynthesis.cancel();
    }, []);

    // Render Permission States
    if (permissionState === 'denied') {
        return (
            <div className="flex flex-col items-center justify-center h-[600px] glass-panel rounded-[2.5rem] p-8 text-center space-y-6">
                <div className="w-24 h-24 bg-red-500/10 rounded-full flex items-center justify-center animate-pulse">
                    <EyeOff className="w-12 h-12 text-red-500" />
                </div>
                <h3 className="text-3xl font-bold">Camera Access Required</h3>
                <p className="text-white/60 max-w-md text-lg">
                    We need your camera to help you see the world. Please enable access in your browser settings.
                </p>
                <button onClick={onBack} className="px-8 py-4 bg-white/10 hover:bg-white/20 rounded-2xl font-bold transition-colors">
                    Back to Home
                </button>
            </div>
        );
    }

    if (permissionState === 'error') {
        return (
            <div className="flex flex-col items-center justify-center h-[600px] glass-panel rounded-[2.5rem] p-8 text-center space-y-6">
                <div className="w-24 h-24 bg-red-500/10 rounded-full flex items-center justify-center">
                    <AlertCircle className="w-12 h-12 text-red-500" />
                </div>
                <h3 className="text-3xl font-bold">System Error</h3>
                <p className="text-white/60 max-w-md text-lg">
                    {lastAnnouncement}
                </p>
                <button onClick={() => window.location.reload()} className="px-8 py-4 bg-purple-500 hover:bg-purple-600 rounded-2xl font-bold transition-colors">
                    Retry
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-8 relative">
            <AnimatePresence>
                {!model && permissionState === 'prompt' && (
                    <LoadingOverlay message="Initializing Vision" subMessage="Loading neural networks..." />
                )}
            </AnimatePresence>

            {/* Header Controls */}
            <div className="flex justify-between items-center">
                <button
                    onClick={onBack}
                    className="p-4 bg-white/5 hover:bg-white/10 rounded-2xl transition-colors border border-white/10"
                >
                    <ChevronLeft size={24} />
                </button>
                <div className="flex items-center gap-3 px-6 py-3 bg-white/5 rounded-2xl border border-white/10">
                    <Eye size={20} className={isScanning ? "text-green-400" : "text-white/40"} />
                    <span className="font-bold tracking-wide">
                        {isScanning ? "SCANNING ACTIVE" : "PAUSED"}
                    </span>
                    {isScanning && (
                        <span className="flex h-3 w-3 relative">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                        </span>
                    )}
                </div>
                <button
                    onClick={() => setIsScanning(!isScanning)}
                    className={`p-4 rounded-2xl transition-all duration-300 ${isScanning
                            ? 'bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/30'
                            : 'bg-green-500/20 hover:bg-green-500/30 text-green-300 border border-green-500/30'
                        }`}
                >
                    {isScanning ? <EyeOff size={24} /> : <Eye size={24} />}
                </button>
            </div>

            {/* Main Viewfinder */}
            <div className="relative aspect-[4/3] rounded-[2.5rem] overflow-hidden border-2 border-white/10 shadow-2xl bg-black">
                <Webcam
                    ref={webcamRef}
                    audio={false}
                    className="w-full h-full object-cover"
                    videoConstraints={{ facingMode: "environment" }}
                />

                {/* Bounding Boxes */}
                {predictions.map((pred, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="absolute border-2 border-brand-primary/80 bg-brand-primary/10 rounded-lg flex flex-col items-start p-1"
                        style={{
                            left: pred.bbox[0],
                            top: pred.bbox[1],
                            width: pred.bbox[2],
                            height: pred.bbox[3],
                        }}
                    >
                        <span className="text-xs font-bold px-2 py-1 bg-brand-primary text-white rounded-md shadow-sm">
                            {pred.class} {Math.round(pred.score * 100)}%
                        </span>
                    </motion.div>
                ))}
            </div>

            {/* Object List */}
            <div className="grid grid-cols-2 gap-4">
                <div className="glass-panel p-5 rounded-3xl flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-500/20 rounded-2xl flex items-center justify-center text-blue-400">
                        <Box size={24} />
                    </div>
                    <div>
                        <p className="text-white/40 text-sm font-medium">Objects Detected</p>
                        <p className="text-2xl font-bold">{predictions.length}</p>
                    </div>
                </div>
                <div className="glass-panel p-5 rounded-3xl flex items-center gap-4">
                    <div className="w-12 h-12 bg-purple-500/20 rounded-2xl flex items-center justify-center text-purple-400">
                        <Type size={24} />
                    </div>
                    <div>
                        <p className="text-white/40 text-sm font-medium">Description</p>
                        <p className="text-sm font-bold truncate max-w-[120px]">
                            {predictions.length > 0 ? predictions[0].class : 'Scanning...'}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
