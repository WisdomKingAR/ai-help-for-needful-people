import { motion } from 'framer-motion';
import { Button } from './Button';

export const Hero = ({ onJoinClick }: { onJoinClick: () => void }) => {
    return (
        <section className="relative min-h-screen flex flex-col items-center justify-center pt-20 overflow-hidden">
            {/* Background Glows */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 blur-[100px] -z-10 animate-pulse" />
            <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-secondary/20 blur-[120px] -z-10 animate-pulse delay-700" />

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-center z-10 px-6 max-w-4xl"
            >
                <motion.h1
                    className="text-6xl md:text-8xl font-black mb-6 tracking-tight leading-tight"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <span className="text-gradient">Accessibility AI</span>
                </motion.h1>

                <motion.p
                    className="text-xl md:text-3xl text-white/80 mb-10 font-medium max-w-2xl mx-auto"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                >
                    Technology for All – No One Left Behind.
                </motion.p>

                <motion.div
                    className="flex flex-col sm:flex-row gap-4 justify-center"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.6 }}
                >
                    <Button
                        variant="primary"
                        className="shadow-lg shadow-primary/25"
                        onClick={onJoinClick}
                    >
                        Join the Movement
                    </Button>
                    <Button variant="outline" className="border-white/10 backdrop-blur-sm">
                        Learn More
                    </Button>
                </motion.div>
            </motion.div>

            {/* Floating Elements Decoration */}
            <motion.div
                animate={{
                    y: [0, -40, 0],
                    rotate: [0, 10, 0]
                }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-1/4 -right-10 w-24 h-24 glass flex items-center justify-center opacity-40 hidden lg:flex"
            >
                <div className="w-12 h-12 bg-white/20 rounded-full blur-sm" />
            </motion.div>

            <motion.div
                animate={{
                    y: [0, 40, 0],
                    rotate: [0, -10, 0]
                }}
                transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute bottom-1/4 -left-10 w-32 h-32 glass flex items-center justify-center opacity-40 hidden lg:flex"
            >
                <div className="w-16 h-16 bg-white/20 rounded-full blur-md" />
            </motion.div>
        </section>
    );
};
