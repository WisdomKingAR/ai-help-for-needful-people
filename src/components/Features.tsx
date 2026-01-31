import { Mic, Eye, Type, MessageSquare, Contrast, Shield } from 'lucide-react';
import { FloatingCard } from './FloatingCard';
import { useState } from 'react';
import { api } from '../services/api';

const features = [
    {
        icon: <Mic className="text-primary" />,
        title: "Voice Navigation",
        description: "Navigate complex interfaces using only your voice with zero latency.",
        className: "md:col-span-2 md:row-span-2 bg-brand-primary/5",
        action: "Listening for commands..."
    },
    {
        icon: <Eye className="text-secondary" />,
        title: "Screen Reader AI",
        description: "Deep content understanding that describes images and complex layouts.",
        className: "md:col-span-1 md:row-span-1 bg-brand-purple/5",
        action: "Analyzing screen content..."
    },
    {
        icon: <Type className="text-primary" />,
        title: "Real-time Captions",
        description: "Instant, accurate medical-grade captions for all audio interactions.",
        className: "md:col-span-1 md:row-span-2 bg-brand-secondary/5",
        action: "Generating captions..."
    },
    {
        icon: <MessageSquare className="text-secondary" />,
        title: "Sign Trans",
        description: "Vision that translates sign language to text.",
        className: "md:col-span-1 md:row-span-1 bg-brand-accent/5",
        action: "Detecting gestures..."
    },
    {
        icon: <Contrast className="text-primary" />,
        title: "Smart Contrast",
        description: "Dynamic color adjustments tailored to individual visual needs.",
        className: "md:col-span-2 md:row-span-1 bg-brand-secondary/5",
        action: "Optimizing colors..."
    },
    {
        icon: <Shield className="text-secondary" />,
        title: "Secure Auth",
        description: "Advanced biometric and multi-factor security for your data.",
        className: "md:col-span-1 md:row-span-1 bg-red-400/5",
        action: "Verifying identity..."
    }
];

export const Features = () => {
    const [activeAction, setActiveAction] = useState<string | null>(null);
    const [aiResponse, setAiResponse] = useState<string | null>(null);

    const handleFeatureClick = async (title: string, action: string) => {
        setActiveAction(action);
        setAiResponse(null);

        try {
            // Only attempt AI call if logged in, otherwise show immediate fallback
            const response = await api.post('/ai/process', { feature: title, action });
            setAiResponse(response.response);
        } catch (error) {
            console.error("AI Feature Error:", error);
            // Fallback for non-logged in or error state
            setAiResponse(action);
        }

        setTimeout(() => {
            setActiveAction(null);
            setAiResponse(null);
        }, 5000);
    };

    return (
        <section id="features" className="py-24 px-6 bg-white/[0.02]">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold mb-4 text-[#1A2847]">AI Features</h2>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Breaking digital barriers with our advanced **Bento Box** powered ecosystem.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {features.map((feature, index) => (
                        <FloatingCard
                            key={index}
                            delay={index * 0.1}
                            className={`group hover:border-primary/30 cursor-pointer overflow-hidden relative ${feature.className}`}
                            onClick={() => handleFeatureClick(feature.title, feature.action)}
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                            <div className="relative z-10 h-full flex flex-col">
                                <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl font-bold mb-2 text-[#1A2847]">{feature.title}</h3>
                                <p className="text-gray-500 leading-relaxed text-sm flex-grow">
                                    {feature.description}
                                </p>

                                {activeAction === feature.action && (
                                    <div className="mt-4 py-2 px-3 bg-primary/20 rounded-lg text-xs font-medium text-primary animate-pulse border border-primary/20">
                                        {aiResponse || 'AI is thinking...'}
                                    </div>
                                )}
                            </div>
                        </FloatingCard>
                    ))}
                </div>
            </div>
        </section>
    );
};
