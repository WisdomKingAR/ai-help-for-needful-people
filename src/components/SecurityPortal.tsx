import { motion } from 'framer-motion';
import { ShieldCheck, History, Eye, Lock, RefreshCw, AlertTriangle, Fingerprint, Waves } from 'lucide-react';

export default function SecurityPortal() {
    const events = [
        { time: '12:45 PM', action: 'Camera accessed', detail: 'Sign Language recognition', icon: Eye, color: 'text-blue-400' },
        { time: '11:20 AM', action: 'Microphone active', detail: 'Deaf Mode ambient scan', icon: Waves, color: 'text-pink-400' },
        { time: 'Yesterday', action: 'Profile encrypted', detail: 'AES-256 update', icon: Lock, color: 'text-green-400' },
        { time: '2 days ago', action: 'Biometric Login', detail: 'FaceID verification', icon: Fingerprint, color: 'text-purple-400' },
    ];

    return (
        <div className="space-y-10">
            {/* Security Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 glass-panel rounded-[2.5rem] p-10 border-white/5 bg-gradient-to-br from-green-500/5 to-transparent flex flex-col md:flex-row items-center gap-10">
                    <div className="relative w-48 h-48">
                        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                            <circle cx="50" cy="50" r="45" fill="transparent" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
                            <motion.circle
                                cx="50" cy="50" r="45" fill="transparent" stroke="#22c55e" strokeWidth="8"
                                strokeDasharray="283"
                                initial={{ strokeDashoffset: 283 }}
                                animate={{ strokeDashoffset: 283 - (283 * 0.98) }}
                                transition={{ duration: 2, ease: "easeOut" }}
                                strokeLinecap="round"
                            />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-5xl font-extrabold text-green-400">98</span>
                            <span className="text-xs font-bold uppercase tracking-widest opacity-40">Trust Score</span>
                        </div>
                    </div>

                    <div className="flex-1 space-y-6">
                        <div>
                            <h3 className="text-3xl font-bold mb-2">Maximum Protection</h3>
                            <p className="text-white/50">Your accessibility data is isolated and encrypted using quantum-resistant protocols.</p>
                        </div>

                        <div className="flex flex-wrap gap-4">
                            <div className="flex items-center gap-2 px-4 py-2 bg-green-500/10 rounded-full border border-green-500/20">
                                <ShieldCheck className="w-4 h-4 text-green-400" />
                                <span className="text-xs font-bold uppercase tracking-widest text-green-400">Zero Trust Active</span>
                            </div>
                            <div className="flex items-center gap-2 px-4 py-2 bg-blue-500/10 rounded-full border border-blue-500/20">
                                <Lock className="w-4 h-4 text-blue-400" />
                                <span className="text-xs font-bold uppercase tracking-widest text-blue-400">AES-256 GCM</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="glass-panel rounded-[2.5rem] p-8 flex flex-col items-center justify-center text-center space-y-4">
                    <div className="w-16 h-16 bg-brand-primary/10 rounded-2xl flex items-center justify-center mb-2">
                        <RefreshCw className="w-8 h-8 text-brand-primary animate-spin-[reverse]" />
                    </div>
                    <h4 className="text-xl font-bold">Deep Scan</h4>
                    <p className="text-sm text-white/50 px-4">AI-driven audit of sensory data permissions.</p>
                    <button className="w-full py-3 bg-white/5 hover:bg-white/10 rounded-xl transition-colors font-bold text-sm">
                        Run Audit
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Privacy Timeline */}
                <div className="glass-panel rounded-[2.5rem] p-8 border-white/5 h-full">
                    <div className="flex items-center gap-4 mb-10">
                        <div className="p-3 bg-white/5 rounded-2xl">
                            <History className="w-6 h-6 text-brand-secondary" />
                        </div>
                        <h3 className="text-2xl font-bold">Privacy Timeline</h3>
                    </div>

                    <div className="space-y-8">
                        {events.map((event, i) => (
                            <div key={i} className="flex gap-6 group">
                                <div className="flex flex-col items-center">
                                    <div className={`p-3 rounded-2xl bg-white/5 group-hover:bg-white/10 transition-colors ${event.color}`}>
                                        <event.icon className="w-5 h-5" />
                                    </div>
                                    {i !== events.length - 1 && <div className="w-px flex-1 bg-white/10 my-2" />}
                                </div>
                                <div className="pb-8">
                                    <div className="flex items-center gap-3 mb-1">
                                        <span className="text-sm font-bold">{event.action}</span>
                                        <span className="text-[10px] uppercase font-bold text-white/20 px-2 py-0.5 border border-white/10 rounded-full">{event.time}</span>
                                    </div>
                                    <p className="text-sm text-white/40">{event.detail}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Sensory Protection Settings */}
                <div className="space-y-6">
                    <div className="glass-panel rounded-[2.5rem] p-8 border-white/5">
                        <div className="flex justify-between items-center mb-8">
                            <h3 className="text-2xl font-bold">Sensory Shield</h3>
                            <div className="w-12 h-6 bg-brand-primary rounded-full relative p-1 cursor-pointer">
                                <div className="w-4 h-4 bg-white rounded-full absolute right-1" />
                            </div>
                        </div>

                        <div className="space-y-6 text-sm text-white/60">
                            <div className="flex items-start gap-4 p-4 bg-white/5 rounded-2xl">
                                <AlertTriangle className="w-6 h-6 text-yellow-500 shrink-0" />
                                <p>Auto-disable sensors when the app is in background to prevent accidental monitoring.</p>
                            </div>
                            <div className="flex items-start gap-4 p-4 bg-white/5 rounded-2xl">
                                <Lock className="w-6 h-6 text-blue-400 shrink-0" />
                                <p>Local AI Processing: Your voice and video data never leave this device.</p>
                            </div>
                        </div>
                    </div>

                    <div className="glass-panel rounded-[2rem] p-6 border-white/5 bg-brand-primary/5 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Fingerprint className="w-8 h-8 text-brand-primary" />
                            <div>
                                <p className="font-bold">Biometric Vault</p>
                                <p className="text-xs text-white/40">Protect accessibility profiles</p>
                            </div>
                        </div>
                        <button className="px-6 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-sm font-bold transition-all">
                            Configure
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
