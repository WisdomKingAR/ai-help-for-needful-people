import { motion } from 'framer-motion';
import { FloatingCard } from './FloatingCard';
import { Heart, ShieldCheck, Users } from 'lucide-react';

export const About = () => {
    return (
        <section id="about" className="py-24 px-6 max-w-7xl mx-auto">
            <div className="grid md:grid-cols-2 gap-16 items-center">
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                >
                    <h2 className="text-4xl md:text-5xl font-bold mb-6">Our Mission</h2>
                    <p className="text-xl text-white/70 leading-relaxed mb-8">
                        At Accessibility AI, we believe that the digital world should be open to everyone.
                        Our mission is to bridge the accessibility gap using ethical AI that empowers individuals
                        of all abilities to navigate, create, and connect without barriers.
                    </p>
                    <div className="space-y-6">
                        <div className="flex gap-4 items-start">
                            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                                <Heart size={24} />
                            </div>
                            <div>
                                <h3 className="text-xl font-semibold mb-1">Human-Centered</h3>
                                <p className="text-white/60">Designed with empathy and co-created with the disability community.</p>
                            </div>
                        </div>
                        <div className="flex gap-4 items-start">
                            <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary shrink-0">
                                <ShieldCheck size={24} />
                            </div>
                            <div>
                                <h3 className="text-xl font-semibold mb-1">Ethical Integrity</h3>
                                <p className="text-white/60">Privacy-first AI that respects user data and autonomy.</p>
                            </div>
                        </div>
                    </div>
                </motion.div>

                <div className="relative">
                    <FloatingCard className="relative z-10">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center">
                                <Users className="text-white" size={24} />
                            </div>
                            <h3 className="text-2xl font-bold">1 Billion+</h3>
                        </div>
                        <p className="text-xl text-white/80">
                            People worldwide live with some form of disability. We're here to ensure the future
                            is accessible for all of them.
                        </p>
                    </FloatingCard>

                    <div className="absolute -top-10 -right-10 w-48 h-48 bg-primary/20 blur-[80px] -z-10" />
                    <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-secondary/20 blur-[80px] -z-10" />
                </div>
            </div>
        </section>
    );
};
