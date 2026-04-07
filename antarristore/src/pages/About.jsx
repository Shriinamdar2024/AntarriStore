import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, ShieldCheck, Truck, Earth, RefreshCcw } from 'lucide-react';

const About = () => {
    return (
        <div className="bg-[#f1f3f6] min-h-screen pt-24 pb-20 font-sans text-slate-900">
            
            {/* Header Banner */}
            <section className="bg-white border-b border-black/5 shadow-sm mb-10">
                <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
                    <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 mb-6 font-sans">
                        About Antari Store
                    </h1>
                    <p className="text-slate-600 text-lg max-w-2xl mx-auto font-medium leading-relaxed">
                        We are a leading e-commerce platform dedicated to providing the ultimate shopping experience. Bringing premium quality products right to your doorstep, with a focus on trust, scale, and uncompromising customer service.
                    </p>
                </div>
            </section>

            <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
                
                {/* Core Promises Section */}
                <section className="bg-white rounded-2xl border border-black/5 shadow-sm p-8 md:p-12">
                    <h2 className="text-2xl font-bold text-slate-900 mb-8 border-b-2 border-blue-600 pb-2 inline-block">The Antari Promise</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                            { icon: <ShieldCheck className="w-8 h-8 text-blue-600" />, title: "100% Secure", desc: "Enterprise-grade encryption for all your transactions and data." },
                            { icon: <Truck className="w-8 h-8 text-blue-600" />, title: "Fast Delivery", desc: "Expedited shipping network guaranteeing prompt physical arrival." },
                            { icon: <RefreshCcw className="w-8 h-8 text-blue-600" />, title: "Easy Returns", desc: "No-questions-asked 7 day replacement on eligible catalog items." },
                            { icon: <Earth className="w-8 h-8 text-blue-600" />, title: "Global Scale", desc: "Sourcing premium products directly from the world's best manufacturers." }
                        ].map((item, i) => (
                            <motion.div 
                                key={i}
                                initial={{ opacity: 0, y: 15 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="flex flex-col items-center text-center p-4"
                            >
                                <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4">
                                    {item.icon}
                                </div>
                                <h3 className="text-lg font-bold text-slate-900 mb-2">{item.title}</h3>
                                <p className="text-sm font-medium text-slate-500 leading-relaxed">{item.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* Operations & Scale Section */}
                <section className="bg-white rounded-2xl border border-black/5 shadow-sm overflow-hidden flex flex-col md:flex-row">
                    <div className="w-full md:w-1/2 bg-slate-900 p-10 md:p-16 flex flex-col justify-center">
                        <h2 className="text-3xl font-extrabold text-white mb-6">Operations & Scale</h2>
                        <ul className="space-y-4">
                            {[
                                "Fulfillment centers across 50+ major cities",
                                "24/7 Priority Customer Support",
                                "Partnerships with 200+ Verified Brands",
                                "Quality Checked & Certified Catalog"
                            ].map((text, i) => (
                                <li key={i} className="flex items-center gap-3 text-slate-300 font-medium">
                                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                                    {text}
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="w-full md:w-1/2 p-10 md:p-16 flex flex-col justify-center items-center text-center bg-blue-50">
                        <p className="text-sm font-bold text-blue-600 uppercase tracking-widest mb-4">Join Millions of Shoppers</p>
                        <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-6">Start Exploring Now</h2>
                        <a href="/shop" className="px-8 py-4 bg-[#facc15] hover:bg-[#eab308] text-slate-900 font-bold rounded-xl shadow-sm hover:-translate-y-0.5 transition-all w-full max-w-xs text-lg">
                            Shop The Catalog
                        </a>
                    </div>
                </section>

            </div>
        </div>
    );
};

export default About;