import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Camera, StopCircle, Hand } from 'lucide-react';

export const GesturePanel = () => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isDetecting, setIsDetecting] = useState(false);
    const [detectedGesture, setDetectedGesture] = useState('none');
    const [confidence, setConfidence] = useState(0);
    const [error, setError] = useState<string | null>(null);
    const [handsDetected, setHandsDetected] = useState(0);
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const startGestureDetection = async () => {
        try {
            setError(null);

            const stream = await navigator.mediaDevices.getUserMedia({
                video: { width: 640, height: 480, facingMode: 'user' }
            });

            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                setIsDetecting(true);

                videoRef.current.onloadedmetadata = () => {
                    videoRef.current?.play();
                    startProcessing();
                };
            }
        } catch (err) {
            setError(`Camera access failed: ${(err as Error).message}`);
        }
    };

    const startProcessing = () => {
        intervalRef.current = setInterval(async () => {
            if (!videoRef.current || !canvasRef.current) return;

            const video = videoRef.current;
            const canvas = canvasRef.current;
            const context = canvas.getContext('2d');

            if (!context) return;

            canvas.width = 640;
            canvas.height = 480;
            context.drawImage(video, 0, 0, 640, 480);

            const frameData = canvas.toDataURL('image/jpeg', 0.8);

            try {
                const response = await fetch(`${import.meta.env.VITE_PYTHON_API_URL || 'http://localhost:5001/api'}/accessibility/detect-gesture`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ frame: frameData })
                });

                if (!response.ok) throw new Error(`HTTP ${response.status}`);

                const result = await response.json();

                if (result.gesture) {
                    setDetectedGesture(result.gesture);
                    setConfidence(Math.round(result.confidence * 100));
                    setHandsDetected(result.hands_detected || 0);
                }
            } catch (err) {
                console.error('Detection error:', err);
            }
        }, 150); // ~7 FPS
    };

    const stopGestureDetection = () => {
        setIsDetecting(false);

        if (videoRef.current?.srcObject) {
            (videoRef.current.srcObject as MediaStream).getTracks().forEach(track => track.stop());
            videoRef.current.srcObject = null;
        }

        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
    };

    useEffect(() => {
        return () => {
            if (videoRef.current?.srcObject) {
                (videoRef.current.srcObject as MediaStream).getTracks().forEach(track => track.stop());
            }
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, []);

    const gestureEmojis: Record<string, string> = {
        thumbs_up: '👍',
        peace_sign: '✌️',
        pointing: '👉',
        open_hand: '✋',
        fist: '✊',
        none: '❓'
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
                <Hand className="text-primary" size={24} />
                <h3 className="text-lg font-bold">Hand Gesture Control</h3>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2 bg-blue-500/20 rounded-lg">👍 Thumbs Up → Scroll Down</div>
                <div className="p-2 bg-green-500/20 rounded-lg">✌️ Peace → Scroll Up</div>
                <div className="p-2 bg-purple-500/20 rounded-lg">👉 Point → Click</div>
                <div className="p-2 bg-yellow-500/20 rounded-lg">✋ Open → Pause</div>
            </div>

            {error && (
                <div className="p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-300 text-sm">
                    {error}
                </div>
            )}

            <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={isDetecting ? stopGestureDetection : startGestureDetection}
                className={`w-full py-3 rounded-xl font-bold text-white transition flex items-center justify-center gap-2 ${isDetecting
                    ? 'bg-red-500 hover:bg-red-600'
                    : 'bg-primary hover:bg-primary/80'
                    }`}
            >
                {isDetecting ? (
                    <>
                        <StopCircle size={20} />
                        Stop Detection
                    </>
                ) : (
                    <>
                        <Camera size={20} />
                        Start Camera
                    </>
                )}
            </motion.button>

            {isDetecting && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-3"
                >
                    <video
                        ref={videoRef}
                        className="w-full rounded-xl border-2 border-white/20"
                        autoPlay
                        playsInline
                        muted
                        style={{ transform: 'scaleX(-1)' }}
                    />

                    <canvas ref={canvasRef} className="hidden" />

                    <div className="p-4 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl border border-white/20">
                        <div className="grid grid-cols-3 gap-4 text-center">
                            <div>
                                <p className="text-xs text-white/60 font-semibold">Gesture</p>
                                <p className="text-2xl">{gestureEmojis[detectedGesture] || '❓'}</p>
                                <p className="text-sm font-bold text-white/80">
                                    {detectedGesture.replace('_', ' ')}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs text-white/60 font-semibold">Confidence</p>
                                <p className="text-2xl font-bold text-green-400">{confidence}%</p>
                            </div>
                            <div>
                                <p className="text-xs text-white/60 font-semibold">Hands</p>
                                <p className="text-2xl font-bold text-blue-400">{handsDetected}</p>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
        </div>
    );
};
