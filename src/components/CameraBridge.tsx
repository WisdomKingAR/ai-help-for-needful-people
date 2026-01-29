import { useRef, useEffect, useState } from "react";
import Webcam from "react-webcam";
import { motion } from "framer-motion";
import { Scan, Hand, Eye } from "lucide-react";

interface CameraBridgeProps {
    mode: "blind" | "deaf" | "sign";
    onGesture?: (gesture: string) => void;
}

export function CameraBridge({ mode, onGesture }: CameraBridgeProps) {
    const webcamRef = useRef<Webcam>(null);
    const [isDetecting, setIsDetecting] = useState(false);

    // Simulated detection loop
    useEffect(() => {
        const interval = setInterval(() => {
            setIsDetecting(true);
            setTimeout(() => setIsDetecting(false), 500);

            // Simulating a gesture detection occasionally
            if (mode === "sign" && Math.random() > 0.8 && onGesture) {
                onGesture("Thumbs Up");
            }
        }, 3000);
        return () => clearInterval(interval);
    }, [mode, onGesture]);

    return (
        <div className="relative rounded-2xl overflow-hidden shadow-2xl border-2 border-white/20">
            <Webcam
                ref={webcamRef}
                audio={false}
                screenshotFormat="image/jpeg"
                className="w-full h-full object-cover min-h-[300px] bg-slate-900"
            />

            {/* Overlay UI based on Mode */}
            <div className="absolute inset-0 pointer-events-none">
                {/* Scanning Overlay (Blind/Sign Mode) */}
                <motion.div
                    animate={{ y: ["0%", "100%", "0%"] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    className="absolute w-full h-[2px] bg-cyan-400/50 shadow-[0_0_15px_rgba(34,211,238,0.8)]"
                />

                {/* Detection Box Simulation */}
                {isDetecting && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 border-2 border-primary rounded-lg flex items-center justify-center bg-primary/10 backdrop-blur-sm"
                    >
                        <div className="text-primary font-bold text-sm bg-black/50 px-2 py-1 rounded-full flex items-center gap-2">
                            {mode === "sign" && <><Hand className="w-4 h-4" /> Sign Detected</>}
                            {mode === "blind" && <><Eye className="w-4 h-4" /> Object: Cup</>}
                            {mode === "deaf" && <><Scan className="w-4 h-4" /> Face Tracking</>}
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
}
