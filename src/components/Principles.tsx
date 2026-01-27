import { motion } from 'framer-motion';
import { Accessibility, Shield, Zap, Info } from 'lucide-react';

const principles = [
    {
        icon: <Accessibility size={32} />,
        title: "Keyboard-First",
        description: "Full site navigation with zero mouse dependency.",
        span: "col-span-1"
    },
    {
        icon: <Zap size={32} />,
        title: "Low Cognitive Load",
        description: "Simplified layouts to prevent user fatigue.",
        span: "col-span-1"
    },
    {
        icon: <Shield size={32} />,
        title: "Privacy First",
        description: "On-device processing for assistive data.",
        span: "col-span-1 md:col-span-2"
    },
    {
        icon: <Info size={32} />,
        title: "Self-Describing UI",
        description: "Every element communicates its purpose clearly.",
        span: "col-span-1"
    }
];

export const Principles = () => {
    return (
        <section id="principles" className="py-24 px-6 max-w-7xl mx-auto">
            <div className="mb-16">
                <h2 className="text-4xl md:text-5xl font-bold mb-4">Design Principles</h2>
                <p className="text-xl text-white/60">Our commitment to universal accessibility.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {principles.map((p, i) => (
                    <motion.div
                        key={i}
                        whileHover={{ y: -5 }}
                        className={`glass p-10 flex flex-col justify-between min-h-[250px] ${p.span} group transition-all duration-300 hover:bg-white/[0.08]`}
                    >
                        <div className="text-secondary mb-8 group-hover:scale-110 transition-transform origin-left">
                            {p.icon}
                        </div>
                        <div>
                            <h3 className="text-2xl font-bold mb-2">{p.title}</h3>
                            <p className="text-white/60 text-lg leading-relaxed">{p.description}</p>
                        </div>
                    </motion.div>
                ))}
            </div>
        </section>
    );
};
