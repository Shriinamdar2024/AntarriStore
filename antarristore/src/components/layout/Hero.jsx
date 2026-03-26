import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Hero = () => {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.15, delayChildren: 0.4 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 40 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 1, ease: [0.22, 1, 0.36, 1] }
        }
    };

    return (
        <section className="relative h-screen w-full flex items-center bg-primary overflow-hidden">

            {/* Dynamic Ambient Background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <motion.div
                    animate={{
                        x: [0, 100, 0],
                        y: [0, -70, 0],
                        scale: [1, 1.1, 1]
                    }}
                    transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute -top-[15%] -left-[5%] w-[60%] h-[60%] rounded-full bg-accent/10 blur-[120px]"
                />
                <motion.div
                    animate={{
                        x: [0, -80, 0],
                        y: [0, 80, 0],
                        scale: [1, 1.3, 1]
                    }}
                    transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-1/2 -right-[10%] w-[50%] h-[50%] rounded-full bg-blue-200/10 blur-[120px]"
                />
            </div>

            {/* Cinematic Image Layer */}
            <motion.div
                initial={{ scale: 1.15, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 2, ease: [0.16, 1, 0.3, 1] }}
                className="absolute inset-0 w-full h-full -z-10"
            >
                <img
                    src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=2000"
                    alt="Premium Collection"
                    className="w-full h-full object-cover object-top grayscale-[20%] opacity-25"
                />
                {/* Multi-layered Gradients for Premium Depth */}
                <div className="absolute inset-0 bg-gradient-to-b from-primary/20 via-primary to-primary"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/40 to-transparent"></div>
            </motion.div>

            {/* Content Layer */}
            <div className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-12 md:px-20 pt-10">
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="max-w-3xl"
                >
                    {/* Perspective Line & Label */}
                    <motion.div variants={itemVariants} className="flex items-center space-x-6 mb-8">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: 64 }}
                            transition={{ delay: 0.8, duration: 1 }}
                            className="h-[1px] bg-accent"
                        />
                        <span className="text-[10px] md:text-xs uppercase tracking-[0.5em] text-accent font-bold">
                            Established MMXXVI • Limited Release
                        </span>
                    </motion.div>

                    {/* Master Headline with Masking Effect */}
                    <motion.h1
                        variants={itemVariants}
                        className="text-6xl sm:text-8xl md:text-9xl lg:text-[9rem] font-serif text-textPrimary leading-[0.9] tracking-tighter mb-10 select-none"
                    >
                        Pure <br />
                        <span className="italic font-light text-accent/90 relative inline-block">
                            Aesthetic
                            <motion.span
                                initial={{ width: 0 }}
                                animate={{ width: "100%" }}
                                transition={{ delay: 1.2, duration: 1 }}
                                className="absolute bottom-4 left-0 h-[2px] bg-accent/20 -z-10"
                            />
                        </span>
                    </motion.h1>

                    {/* Minimalist Narrative */}
                    <motion.p
                        variants={itemVariants}
                        className="text-base md:text-lg text-textSecondary/80 mb-14 font-sans leading-relaxed max-w-md"
                    >
                        Merging architectural precision with fluid silhouettes. Our 2026 collection redefines the boundaries of modern minimalism.
                    </motion.p>

                    {/* High-Impact CTA */}
                    <motion.div variants={itemVariants}>
                        <Link to="/shop">
                            <button className="group relative px-10 py-5 bg-textPrimary text-primary overflow-hidden transition-all duration-500 hover:shadow-[0_20px_50px_rgba(0,0,0,0.15)] hover:-translate-y-1">
                                <span className="relative z-10 flex items-center text-xs tracking-[0.3em] font-bold uppercase">
                                    Browse Collection
                                    <motion.div
                                        animate={{ x: [0, 5, 0] }}
                                        transition={{ repeat: Infinity, duration: 1.5 }}
                                    >
                                        <ArrowRight className="ml-3 w-4 h-4" />
                                    </motion.div>
                                </span>
                                {/* Hover Invert Effect */}
                                <div className="absolute inset-0 bg-accent translate-y-[101%] group-hover:translate-y-0 transition-transform duration-500 ease-[0.76, 0, 0.24, 1]"></div>
                            </button>
                        </Link>
                    </motion.div>
                </motion.div>
            </div>

            {/* Sophisticated Scroll Architecture */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 2, duration: 1 }}
                className="absolute bottom-12 right-12 hidden lg:flex flex-col items-center gap-6"
            >
                <div className="h-24 w-[1px] bg-black/5 relative overflow-hidden">
                    <motion.div
                        animate={{ y: ["-100%", "100%"] }}
                        transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                        className="absolute inset-0 w-full h-1/2 bg-accent"
                    />
                </div>
                <span className="text-[9px] uppercase tracking-[0.6em] font-black text-textPrimary/30 vertical-text rotate-180">
                    Discover More
                </span>
            </motion.div>

            <style>{`
                .vertical-text {
                    writing-mode: vertical-rl;
                }
            `}</style>
        </section>
    );
};

export default Hero;