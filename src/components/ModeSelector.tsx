import { motion } from "framer-motion";
import { EyeOff, EarOff, Hand } from "lucide-react";

interface ModeSelectorProps {
    onSelect: (mode: "blind" | "deaf" | "sign") => void;
}

const modes = [
    {
        id: "blind",
        label: "Visual Assistance",
        sub: "For Blind / Low Vision",
        icon: EyeOff,
        color: "from-[#4A90E2] to-[#5FD3BC]",
        desc: "AI narrators & object recognition"
    },
    {
        id: "deaf",
        label: "Sound Visualizer",
        sub: "For Deaf / Hard of Hearing",
        icon: EarOff,
        color: "from-[#FFB84D] to-[#F59E0B]",
        desc: "Live captions & sound alerts"
    },
    {
        id: "sign",
        label: "Sign Interpreter",
        sub: "Sign Language Users",
        icon: Hand,
        color: "from-[#B89FD9] to-[#8B5CF6]",
        desc: "Gesture control & signing avatar"
    }
] as const;

export function ModeSelector({ onSelect }: ModeSelectorProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl px-4">
            {modes.map((mode) => (
                <motion.button
                    key={mode.id}
                    onClick={() => onSelect(mode.id)}
                    whileHover={{ scale: 1.05, y: -10 }}
                    whileTap={{ scale: 0.95 }}
                    className="relative group h-[400px] rounded-3xl overflow-hidden glass-panel text-left p-0 border-0 cursor-pointer"
                >
                    {/* Background Gradient */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${mode.color} opacity-0 group-hover:opacity-20 transition-opacity duration-500`} />

                    <div className="absolute inset-0 p-8 flex flex-col justify-between z-10">
                        <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${mode.color} flex items-center justify-center text-white shadow-lg group-hover:shadow-glow transition-all`}>
                            <mode.icon className="w-8 h-8" />
                        </div>

                        <div>
                            <h3 className="text-2xl font-bold text-[#1A2847] mb-2">{mode.label}</h3>
                            <p className="text-gray-500 text-sm font-medium mb-4 uppercase tracking-wider">{mode.sub}</p>
                            <p className="text-gray-700 text-sm leading-relaxed">{mode.desc}</p>
                        </div>
                    </div>

                    {/* Decorative Circle */}
                    <div className={`absolute -bottom-10 -right-10 w-48 h-48 bg-gradient-to-br ${mode.color} rounded-full blur-3xl opacity-20 group-hover:opacity-40 transition-opacity duration-500`} />
                </motion.button>
            ))}
        </div>
    );
}
