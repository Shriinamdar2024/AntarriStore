import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const About = () => {
    const { scrollYProgress } = useScroll();
    const y = useTransform(scrollYProgress, [0, 1], [0, -100]);

    return (
        <div className="pt-32 pb-20 bg-transparent relative z-10 overflow-hidden">
            {/* Hero Section - Minimalist & Impactful */}
            <section className="px-6 max-w-7xl mx-auto mb-40">
                <div className="flex flex-col items-center text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1.2, ease: "easeOut" }}
                    >
                        <span className="text-[10px] uppercase tracking-[0.6em] text-accent mb-8 block font-semibold">
                            Est. 2026 — The Manifesto
                        </span>
                        <h1 className="text-6xl md:text-8xl font-serif mb-12 leading-tight text-textPrimary">
                            Simplicity is the <br />
                            <span className="italic font-light opacity-70">ultimate sophistication.</span>
                        </h1>
                    </motion.div>
                </div>

                {/* Asymmetric Split Image Section */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mt-20 items-center">
                    <motion.div
                        style={{ y }}
                        className="md:col-span-7 relative group"
                    >
                        <div className="absolute -inset-4 border border-accent/20 rounded-2xl -z-10 group-hover:scale-105 transition-transform duration-700" />
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 1 }}
                            className="aspect-[16/9] rounded-xl overflow-hidden shadow-2xl"
                        >
                            <img
                                src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1200"
                                alt="Workshop"
                                className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000 scale-110 group-hover:scale-100"
                            />
                        </motion.div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 1, delay: 0.3 }}
                        className="md:col-span-5 space-y-8 md:pl-12"
                    >
                        <h2 className="text-3xl font-serif text-textPrimary leading-snug">
                            Beyond the Fabric. <br />Inside the Object.
                        </h2>
                        <p className="text-textSecondary font-light leading-relaxed text-base">
                            Antarri was born at the intersection of artisanal craft and modern technology. We believe that your daily essentials—whether a silk blazer or a titanium phone case—should share the same soul of quality.
                        </p>
                        <p className="text-textSecondary font-light leading-relaxed text-base">
                            We don't chase trends; we build a legacy through a "slow-design" philosophy. Every piece is an investment in time, sourced responsibly, and finished by hand.
                        </p>
                        <div className="pt-8 border-t border-accent/20">
                            <p className="font-serif italic text-xl text-accent">— The Antarri Collective</p>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Impact Section - Large Numbers */}
            <section className="py-32 px-6 mb-40 relative">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
                        {[
                            { label: "Organic Sourced", value: "100%" },
                            { label: "Hand-Crafted", value: "850+" },
                            { label: "Eco-Packaging", value: "0% Plastic" },
                            { label: "Global Reach", value: "24/7" }
                        ].map((stat, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, scale: 0.8 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                transition={{ delay: i * 0.1 }}
                                className="flex flex-col gap-2"
                            >
                                <span className="text-4xl md:text-5xl font-serif text-accent">{stat.value}</span>
                                <span className="text-[10px] uppercase tracking-[0.3em] text-textSecondary">{stat.label}</span>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Values Section - High-End Layout */}
            <section className="px-6 mb-40">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-1px bg-accent/10 rounded-3xl overflow-hidden shadow-sm border border-accent/10">
                        {[
                            {
                                title: "Sourcing",
                                desc: "Premium organic linens and grade-5 titanium. We only harvest what is ethical.",
                                icon: "✧"
                            },
                            {
                                title: "Design",
                                desc: "Architectural silhouettes built to outlast seasons and software updates alike.",
                                icon: "◈"
                            },
                            {
                                title: "Impact",
                                desc: "A commitment to circularity. Every Antarri item is designed to be recycled or reborn.",
                                icon: "◎"
                            }
                        ].map((value, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                transition={{ delay: i * 0.2 }}
                                className="bg-primary/40 backdrop-blur-md p-16 hover:bg-accent/5 transition-colors duration-500 text-center"
                            >
                                <span className="text-2xl text-accent mb-6 block font-light">{value.icon}</span>
                                <h3 className="text-xs uppercase tracking-[0.4em] font-bold mb-6 text-textPrimary">{value.title}</h3>
                                <p className="text-sm text-textSecondary font-light leading-relaxed">{value.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Final CTA / Quote */}
            <section className="text-center px-6 py-20">
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    className="max-w-3xl mx-auto"
                >
                    <p className="text-textSecondary text-xs uppercase tracking-[0.5em] mb-8">Join the Movement</p>
                    <h2 className="text-3xl md:text-5xl font-serif italic text-textPrimary mb-12">
                        Build a wardrobe of objects, not just clothes.
                    </h2>
                    <button className="px-10 py-4 bg-accent text-white rounded-full text-[10px] uppercase tracking-widest hover:bg-accentHover transition-all duration-300 shadow-xl hover:shadow-accent/20">
                        View Collections
                    </button>
                </motion.div>
            </section>
        </div>
    );
};

export default About;