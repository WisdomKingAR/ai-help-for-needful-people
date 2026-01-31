import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Fingerprint, Lock, ArrowRight, Sparkles, KeyRound } from 'lucide-react';

interface LoginProps {
    onLogin: () => void;
}

export default function Login({ onLogin }: LoginProps) {
    const [step, setStep] = useState<'creds' | 'mfa'>('creds');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleNext = () => {
        setIsLoading(true);
        setTimeout(() => {
            setStep('mfa');
            setIsLoading(false);
        }, 1500);
    };

    const handleFinal = () => {
        setIsLoading(true);
        setTimeout(() => {
            onLogin();
            setIsLoading(false);
        }, 1500);
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center p-6 relative overflow-hidden bg-[#F8F9FB]">
            {/* Background Glows */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-primary/10 blur-[120px] rounded-full animate-pulse" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-brand-secondary/10 blur-[120px] rounded-full animate-pulse" />

            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="w-full max-w-md glass-panel rounded-[3rem] p-10 border-white/10 relative z-10 shadow-2xl"
            >
                <div className="text-center mb-10">
                    <motion.div
                        initial={{ rotate: -10, scale: 0.8 }}
                        animate={{ rotate: 0, scale: 1 }}
                        className="w-20 h-20 bg-gradient-to-tr from-brand-primary to-brand-accent rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-lg shadow-brand-primary/20"
                    >
                        <Shield className="w-10 h-10 text-white" />
                    </motion.div>
                    <h1 className="text-4xl font-extrabold mb-2 text-[#1A2847]">Welcome Back</h1>
                    <p className="text-gray-500">Securely sign in to your AI companion</p>
                </div>

                <AnimatePresence mode="wait">
                    {step === 'creds' ? (
                        <motion.div
                            key="creds"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            className="space-y-6"
                        >
                            <div className="space-y-4">
                                <div className="relative group">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-brand-primary transition-colors">
                                        <Lock className="w-5 h-5" />
                                    </div>
                                    <input
                                        type="password"
                                        placeholder="Security Pattern or Pin"
                                        className="w-full h-16 bg-gray-50 border border-gray-200 rounded-2xl pl-12 pr-4 outline-none focus:border-brand-primary/50 focus:bg-white transition-all font-medium text-[#1A2847]"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </div>
                            </div>

                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={handleNext}
                                disabled={isLoading}
                                className="w-full h-16 bg-brand-primary rounded-2xl font-bold text-lg flex items-center justify-center gap-2 shadow-lg shadow-brand-primary/30 transition-all disabled:opacity-50"
                            >
                                {isLoading ? (
                                    <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <>
                                        Continue <ArrowRight className="w-5 h-5" />
                                    </>
                                )}
                            </motion.button>

                            <div className="flex items-center gap-4 py-4">
                                <div className="h-px bg-gray-200 flex-1" />
                                <span className="text-xs uppercase tracking-widest text-gray-400 font-bold">or use biometric</span>
                                <div className="h-px bg-gray-200 flex-1" />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <button className="h-16 clay-card flex items-center justify-center gap-3 hover:bg-gray-50 transition-colors">
                                    <Fingerprint className="w-6 h-6 text-brand-secondary" />
                                    <span className="text-sm font-medium text-[#1A2847]">Touch</span>
                                </button>
                                <button className="h-16 clay-card flex items-center justify-center gap-3 hover:bg-gray-50 transition-colors">
                                    <Sparkles className="w-6 h-6 text-brand-primary" />
                                    <span className="text-sm font-medium text-[#1A2847]">Face ID</span>
                                </button>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="mfa"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-8"
                        >
                            <div className="text-center">
                                <div className="w-16 h-16 bg-brand-secondary/10 rounded-full mx-auto mb-4 flex items-center justify-center">
                                    <KeyRound className="w-8 h-8 text-brand-secondary" />
                                </div>
                                <h3 className="text-xl font-bold mb-2 text-[#1A2847]">Double Verification</h3>
                                <p className="text-gray-500 text-sm px-6">We've sent a magical code to your registered device.</p>
                            </div>

                            <div className="flex justify-center gap-3">
                                {[1, 2, 3, 4].map((i) => (
                                    <input
                                        key={i}
                                        type="text"
                                        maxLength={1}
                                        className="w-14 h-14 bg-gray-50 border border-gray-200 rounded-2xl text-center text-2xl font-bold outline-none focus:border-brand-secondary/50 focus:bg-white transition-all text-[#1A2847]"
                                        autoFocus={i === 1}
                                    />
                                ))}
                            </div>

                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={handleFinal}
                                disabled={isLoading}
                                className="w-full h-16 bg-gradient-to-r from-brand-primary to-brand-secondary rounded-2xl font-bold text-lg flex items-center justify-center gap-2 shadow-lg shadow-brand-primary/30 transition-all disabled:opacity-50"
                            >
                                {isLoading ? (
                                    <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    "Verify & Enter"
                                )}
                            </motion.button>

                            <button
                                onClick={() => setStep('creds')}
                                className="w-full text-gray-400 text-sm hover:text-gray-700 transition-colors"
                            >
                                Go back to password
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>

            {/* Footer Info */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-2 text-gray-400"
            >
                <Lock className="w-4 h-4" />
                <span className="text-xs font-medium uppercase tracking-widest">Quantum Encryption Active</span>
            </motion.div>
        </div>
    );
}
