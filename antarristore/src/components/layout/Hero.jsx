import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Zap, ShieldCheck, Truck } from 'lucide-react';
import { Link } from 'react-router-dom';

const Hero = () => {
    return (
        <section className="bg-[#f1f3f6] pt-24 pb-8 w-full md:px-4 lg:px-8">
            <div className="max-w-[1500px] mx-auto">
                <div className="relative w-full h-[400px] sm:h-[500px] md:h-[600px] md:rounded-3xl overflow-hidden shadow-[0_4px_20px_rgb(0,0,0,0.08)] bg-gradient-to-br from-slate-900 via-sky-900 to-indigo-950 flex shadow-sm border border-black/5">
                    
                    {/* Background Tech Textures (Amazon/Flipkart Mega Sale Vibe) */}
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
                    <div className="absolute top-0 right-0 w-3/4 h-full bg-gradient-to-l from-sky-400/30 to-transparent"></div>
                    <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-accent/40 blur-[100px] rounded-full point-events-none"></div>

                    {/* Image Placeholder on Right */}
                    <motion.div 
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 1 }}
                        className="absolute right-0 bottom-0 w-full md:w-[60%] h-[80%] md:h-full opacity-60 md:opacity-100"
                    >
                        <img
                            src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=80&w=2070"
                            alt="Mega Sale Products"
                            className="w-full h-full object-cover object-center md:object-right [-webkit-mask-image:linear-gradient(to_right,transparent,black_40%)]"
                        />
                    </motion.div>

                    {/* Content Left side */}
                    <div className="relative z-10 w-full h-full flex flex-col justify-center items-start px-6 sm:px-12 md:px-20 lg:px-24">
                        
                        <motion.div 
                            initial={{ opacity: 0, y: 15 }} 
                            animate={{ opacity: 1, y: 0 }} 
                            transition={{ duration: 0.5 }}
                            className="bg-yellow-400 text-yellow-900 text-xs sm:text-sm font-extrabold uppercase tracking-widest px-4 py-1.5 rounded-sm flex items-center gap-2 mb-6 shadow-lg"
                        >
                            <Zap className="w-4 h-4 fill-yellow-900" /> Blockbuster Deals
                        </motion.div>

                        <motion.h1 
                            initial={{ opacity: 0, y: 15 }} 
                            animate={{ opacity: 1, y: 0 }} 
                            transition={{ duration: 0.5, delay: 0.1 }}
                            className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-white leading-[1.1] tracking-tight mb-4 drop-shadow-xl"
                        >
                            Grand <br className="hidden sm:block"/>
                            <span className="text-yellow-400">Festival</span> Sale
                        </motion.h1>

                        <motion.p 
                            initial={{ opacity: 0, y: 15 }} 
                            animate={{ opacity: 1, y: 0 }} 
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="text-sky-100 text-base sm:text-xl md:text-2xl font-medium max-w-xl mb-8 drop-shadow-md"
                        >
                            Up to 60% Off on Top Accessories and Premium Apparel. Limited time offer!
                        </motion.p>

                        <motion.div 
                            initial={{ opacity: 0, y: 15 }} 
                            animate={{ opacity: 1, y: 0 }} 
                            transition={{ duration: 0.5, delay: 0.3 }}
                            className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
                        >
                            <Link to="/shop">
                                <button className="w-full sm:w-auto px-10 py-4 bg-yellow-400 hover:bg-yellow-500 text-slate-900 rounded-lg font-bold text-lg transition-transform hover:-translate-y-1 shadow-[0_8px_20px_rgba(250,204,21,0.3)] flex items-center justify-center gap-2">
                                    Shop Now <ArrowRight className="w-5 h-5" />
                                </button>
                            </Link>
                            <Link to="/accessories">
                                <button className="w-full sm:w-auto px-10 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/30 rounded-lg font-bold text-lg transition-colors flex items-center justify-center gap-2">
                                    Explore Tech
                                </button>
                            </Link>
                        </motion.div>

                    </div>
                </div>

                {/* E-commerce Trust Badges Banner */}
                <div className="mx-4 md:mx-0 mt-6 md:mt-8 bg-white border border-black/5 rounded-2xl shadow-sm p-4 sm:p-6 grid grid-cols-1 sm:grid-cols-3 gap-6 divide-y sm:divide-y-0 sm:divide-x divide-slate-100">
                    <div className="flex items-center justify-center sm:justify-start gap-4 pt-4 sm:pt-0 sm:pl-6">
                        <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center shrink-0">
                            <ShieldCheck className="w-6 h-6 text-emerald-600" />
                        </div>
                        <div>
                            <h4 className="font-bold text-slate-800">100% Secure Payments</h4>
                            <p className="text-xs font-medium text-slate-500">All major cards supported</p>
                        </div>
                    </div>
                    <div className="flex items-center justify-center sm:justify-start gap-4 pt-4 sm:pt-0 sm:pl-6">
                        <div className="w-12 h-12 rounded-full bg-indigo-50 flex items-center justify-center shrink-0">
                            <Truck className="w-6 h-6 text-indigo-600" />
                        </div>
                        <div>
                            <h4 className="font-bold text-slate-800">Free Fast Delivery</h4>
                            <p className="text-xs font-medium text-slate-500">On all orders over ₹999</p>
                        </div>
                    </div>
                    <div className="flex items-center justify-center sm:justify-start gap-4 pt-4 sm:pt-0 sm:pl-6">
                        <div className="w-12 h-12 rounded-full bg-rose-50 flex items-center justify-center shrink-0">
                            <Zap className="w-6 h-6 text-rose-600" />
                        </div>
                        <div>
                            <h4 className="font-bold text-slate-800">Extended Returns</h4>
                            <p className="text-xs font-medium text-slate-500">Up to 7 days replacement</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;