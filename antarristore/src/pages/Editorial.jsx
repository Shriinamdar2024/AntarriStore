import React from 'react';
import { motion } from 'framer-motion';

const articles = [
    {
        id: 1,
        category: "Process",
        title: "The Art of Slow Tailoring",
        excerpt: "Inside our workshop where a single blazer takes 48 hours to construct.",
        image: "https://images.unsplash.com/photo-1594932224491-994c9c512417?q=80&w=1200",
        size: "large"
    },
    {
        id: 2,
        category: "Interview",
        title: "In Conversation: Elena Rossi",
        excerpt: "Discussing minimalist architecture and its influence on modern drape.",
        image: "https://images.unsplash.com/photo-1487309078313-fe80c3e15a0f?q=80&w=800",
        size: "small"
    },
    {
        id: 3,
        category: "Sourcing",
        title: "Japanese Selvedge: A History",
        excerpt: "Why we travel to Okayama for our denim.",
        image: "https://images.unsplash.com/photo-1542272454315-4c01d7abdf4a?q=80&w=800",
        size: "small"
    }
];

const Editorial = () => {
    return (
        <div className="min-h-screen bg-primary pt-32 pb-20 px-6 md:px-12">
            <div className="max-w-7xl mx-auto">
                <header className="mb-20 text-center">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-6xl md:text-9xl font-serif text-textPrimary text-shadow-sm"
                    >
                        Journal
                    </motion.h1>
                    <div className="h-[2px] bg-accent/20 w-24 mx-auto mt-8 rounded-full" />
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24">
                    {articles.map((article, i) => (
                        <motion.article
                            key={article.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className={`group cursor-pointer ${article.size === 'large' ? 'md:col-span-2' : 'md:col-span-1'} bg-white p-6 rounded-2xl shadow-md border border-tertiary hover:shadow-xl transition-shadow`}
                        >
                            <div className="relative overflow-hidden aspect-[16/9] mb-8 bg-tertiary rounded-xl">
                                <img
                                    src={article.image}
                                    alt={article.title}
                                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                                />
                            </div>
                            <div className="max-w-2xl px-2">
                                <span className="text-xs uppercase font-bold tracking-[0.3em] text-accent block mb-3">
                                    {article.category}
                                </span>
                                <h2 className="text-3xl md:text-4xl font-serif text-textPrimary mb-4 transition-all">
                                    {article.title}
                                </h2>
                                <p className="text-textSecondary font-medium leading-relaxed mb-6">
                                    {article.excerpt}
                                </p>
                                <button className="text-[11px] font-bold uppercase tracking-widest border-b-2 border-accent/30 pb-1 text-accent hover:border-accent transition-colors">
                                    Read Story
                                </button>
                            </div>
                        </motion.article>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Editorial;