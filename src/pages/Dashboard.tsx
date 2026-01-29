import { useState, useEffect } from "react";
import { CameraBridge } from "../components/CameraBridge";
import { AIAssistant } from "../components/AIAssistant";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Mic, Keyboard, Volume2 } from "lucide-react";

interface DashboardProps {
    mode: "blind" | "deaf" | "sign";
    onExit: () => void;
}

export function Dashboard({ mode, onExit }: DashboardProps) {
    const [activeAction, setActiveAction] = useState<string | null>(null);

    // Effect to auto-clear action for demo purposes
    useEffect(() => {
        if (activeAction) {
            const timer = setTimeout(() => setActiveAction(null), 2000);
            return () => clearTimeout(timer);
        }
    }, [activeAction]);

    return (
        <div className="min-h-screen p-6 flex flex-col items-center max-w-7xl mx-auto">
            {/* Top Bar */}
            <header className="w-full flex items-center justify-between mb-8">
                <button
                    onClick={onExit}
                    className="flex items-center gap-2 text-white/70 hover:text-white transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                    <span>Back to Modes</span>
                </button>
                <div className="px-4 py-1 rounded-full bg-white/10 border border-white/20 text-sm font-medium uppercase tracking-widest">
                    {mode} Mode Active
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 w-full flex-1">
                {/* Visual / Camera Area */}
                <div className="lg:col-span-2 flex flex-col gap-6">
                    <CameraBridge mode={mode} onGesture={(g) => setActiveAction(g)} />

                    {/* Live Output Log */}
                    <div className="flex-1 rounded-2xl glass-panel p-6 overflow-hidden relative">
                        <h3 className="text-sm text-white/50 uppercase tracking-wider mb-4">
                            {mode === "blind" ? "AI Vision Log" : mode === "deaf" ? "Transcribed Audio" : "Sign Translation"}
                        </h3>

                        <div className="space-y-4">
                            <AnimatePresence>
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="p-3 rounded-lg bg-white/5 border-l-2 border-primary"
                                >
                                    <p className="text-lg">
                                        {mode === "blind" && "I see a coffee cup on the table."}
                                        {mode === "deaf" && "Teacher: \"Please open your books to page 32.\""}
                                        {mode === "sign" && "Current Sign detected: \"Hello\" 👋"}
                                    </p>
                                </motion.div>
                            </AnimatePresence>
                        </div>

                        {/* Fake "Listening/Scanning" lines */}
                        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/50 to-transparent pointer-events-none" />
                    </div>
                </div>

                {/* Sidebar: Assistant & Controls */}
                <div className="flex flex-col gap-6">
                    <div className="glass-panel p-8 rounded-2xl flex flex-col items-center justify-center min-h-[300px]">
                        <AIAssistant mode={mode} isSpeaking={true} />
                    </div>

                    {/* Contextual Actions */}
                    <div className="grid grid-cols-2 gap-4">
                        <button className="h-24 rounded-xl glass-panel hover:bg-white/10 transition-colors flex flex-col items-center justify-center gap-2">
                            {mode === "blind" ? <Mic className="w-6 h-6 text-cyan-400" /> : <Keyboard className="w-6 h-6 text-purple-400" />}
                            <span className="text-xs font-medium">{mode === "blind" ? "Voice Command" : "Type Response"}</span>
                        </button>
                        <button className="h-24 rounded-xl glass-panel hover:bg-white/10 transition-colors flex flex-col items-center justify-center gap-2">
                            <Volume2 className="w-6 h-6 text-pink-400" />
                            <span className="text-xs font-medium">Adjust Volume</span>
                        </button>
                    </div>

                    <div className="p-4 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-white/10">
                        <h4 className="font-bold mb-2 text-sm text-indigo-300">Quick Tip</h4>
                        <p className="text-xs text-white/70">
                            {mode === "blind" ? "Tap anywhere with 3 fingers to pause narration." :
                                mode === "deaf" ? "Flash screen disabled in dark environments." :
                                    "Raise hand to pause scrolling."}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
