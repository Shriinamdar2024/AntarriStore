import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight, Check } from 'lucide-react';

const NewsletterModal = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [email, setEmail] = useState('');
    const [subscribed, setSubscribed] = useState(false);

    useEffect(() => {
        const hasSeen = sessionStorage.getItem('newsletter_seen');
        if (!hasSeen) {
            const timer = setTimeout(() => setIsVisible(true), 3000);
            return () => clearTimeout(timer);
        }
    }, []);

    const handleClose = () => {
        setIsVisible(false);
        sessionStorage.setItem('newsletter_seen', 'true');
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubscribed(true);
        setTimeout(handleClose, 2500);
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
                    {/* Darker, blurred background to focus on the content */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={handleClose}
                        className="absolute inset-0 bg-black/70 backdrop-blur-md"
                    />

                    {/* Modal Box */}
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="relative bg-white w-full max-w-3xl flex flex-col md:flex-row shadow-2xl border border-black/5"
                    >
                        {/* Left Side: Bold Visual Panel */}
                        <div className="bg-black w-full md:w-5/12 p-10 flex flex-col justify-between text-white">
                            <div>
                                <p className="text-[10px] font-bold uppercase tracking-[0.4em] opacity-40 mb-2">Member Access</p>
                                <h2 className="text-4xl font-black uppercase tracking-tighter leading-none">
                                    THE <br /> PRIVILEGE
                                </h2>
                            </div>

                            <div className="hidden md:block">
                                <p className="text-[9px] font-medium uppercase tracking-[0.2em] leading-loose opacity-30">
                                    Est. 2026 // Antarri Studio
                                </p>
                            </div>
                        </div>

                        {/* Right Side: Clean Interaction Area */}
                        <div className="flex-1 p-10 md:p-14 bg-white relative">
                            {/* Close Button */}
                            <button
                                onClick={handleClose}
                                className="absolute top-4 right-4 p-2 hover:bg-slate-50 transition-colors group"
                            >
                                <X className="w-5 h-5 text-black group-hover:rotate-90 transition-transform" />
                            </button>

                            {!subscribed ? (
                                <motion.div
                                    initial={{ opacity: 0, x: 10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="h-full flex flex-col justify-center"
                                >
                                    <h3 className="text-2xl font-black uppercase tracking-tight mb-4 text-black">
                                        Join our story.
                                    </h3>

                                    <p className="text-xs uppercase tracking-widest text-slate-400 font-bold leading-relaxed mb-10">
                                        Be the first to see our new work and receive private updates before anyone else.
                                    </p>

                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        <div className="border-b-2 border-slate-100 focus-within:border-black transition-all">
                                            <input
                                                type="email"
                                                required
                                                placeholder="YOUR EMAIL"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                className="w-full bg-transparent py-4 text-[11px] font-black tracking-[0.3em] outline-none placeholder:text-slate-300"
                                            />
                                        </div>

                                        <button className="w-full bg-black text-white py-5 text-[10px] font-black uppercase tracking-[0.4em] hover:bg-slate-800 transition-all flex items-center justify-center gap-3">
                                            GET ACCESS
                                            <ArrowRight size={14} />
                                        </button>
                                    </form>

                                    <p className="text-[8px] font-bold uppercase tracking-[0.2em] text-slate-300 mt-8">
                                        We value your privacy. Unsubscribe at any time.
                                    </p>
                                </motion.div>
                            ) : (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="h-full flex flex-col items-center justify-center text-center py-10"
                                >
                                    <div className="w-16 h-16 bg-black flex items-center justify-center mb-6">
                                        <Check className="text-white w-8 h-8" />
                                    </div>
                                    <h3 className="text-xl font-black uppercase tracking-tight mb-2">Welcome</h3>
                                    <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400">
                                        You are now part of our circle.
                                    </p>
                                </motion.div>
                            )}
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default NewsletterModal;