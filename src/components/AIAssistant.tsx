import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { useEffect, useState } from "react";

interface AIAssistantProps {
    mode: "blind" | "deaf" | "sign" | null;
    isSpeaking?: boolean;
}

export function AIAssistant({ mode, isSpeaking = false }: AIAssistantProps) {
    const [message, setMessage] = useState("Hello! I'm here to help.");

    useEffect(() => {
        if (!mode) setMessage("Select a mode to begin.");
        if (mode === "blind") setMessage("I am your eyes. Point your camera at anything.");
        if (mode === "deaf") setMessage("I am listening. I will visualize sounds for you.");
        if (mode === "sign") setMessage("I can see your hands. Sign to me.");
    }, [mode]);

    return (
        <div className="flex flex-col items-center gap-4">
            {/* Avatar Container */}
            <div className="relative w-32 h-32 flex items-center justify-center">
                {/* Glow Effect */}
                <motion.div
                    animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.8, 0.5] }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur-xl"
                />

                {/* Core Avatar */}
                <div className="relative z-10 w-28 h-28 bg-white/10 backdrop-blur-md rounded-full border border-white/20 flex items-center justify-center overflow-hidden shadow-inner">
                    {/* Mode Specific Visuals */}
                    {mode === "blind" && (
                        <div className="flex gap-1 items-end h-10">
                            {[1, 2, 3, 4, 5].map((i) => (
                                <motion.div
                                    key={i}
                                    animate={{ height: isSpeaking ? [10, 30, 10] : 4 }}
                                    transition={{ duration: 0.4, repeat: Infinity, delay: i * 0.1 }}
                                    className="w-2 bg-gradient-to-t from-blue-400 to-purple-400 rounded-full"
                                />
                            ))}
                        </div>
                    )}

                    {mode === "deaf" && (
                        <motion.div animate={{ rotate: 360 }} transition={{ duration: 10, repeat: Infinity, ease: "linear" }}>
                            <Sparkles className="w-12 h-12 text-yellow-300" />
                        </motion.div>
                    )}

                    {(mode === "sign" || !mode) && (
                        <div className="relative">
                            <div className="w-16 h-16 bg-gradient-to-br from-indigo-400 to-pink-400 rounded-full flex items-center justify-center">
                                <span className="text-2xl">🤖</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Message Bubble */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                key={message}
                className="bg-white/10 backdrop-blur-md border border-white/20 px-6 py-3 rounded-2xl max-w-xs text-center shadow-lg"
            >
                <p className="text-white font-medium">{message}</p>
            </motion.div>
        </div>
    );
}
