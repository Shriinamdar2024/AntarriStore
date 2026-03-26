import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

const Contact = () => {
    const [formData, setFormData] = useState({ name: '', email: '', message: '' });

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Message Sent:", formData);
        alert("Thank you. Our concierge will contact you shortly.");
    };

    return (
        <div className="pt-32 pb-20 bg-white">
            <div className="max-w-7xl mx-auto px-6 lg:px-20">

                {/* Header */}
                <div className="mb-20">
                    <motion.span
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        className="text-[10px] uppercase tracking-[0.5em] text-gray-400 mb-4 block"
                    >
                        Get in Touch
                    </motion.span>
                    <h1 className="text-4xl md:text-6xl font-serif">We're here to assist.</h1>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-24">

                    {/* Contact Details - Left */}
                    <div className="space-y-12">
                        <div className="space-y-6">
                            <h3 className="text-xs uppercase tracking-widest font-semibold text-primary">Customer Concierge</h3>
                            <div className="space-y-4">
                                <div className="flex items-center space-x-4 group cursor-pointer">
                                    <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors duration-500">
                                        <Mail className="w-4 h-4" />
                                    </div>
                                    <span className="text-sm font-light text-gray-600">care@antarristore.com</span>
                                </div>
                                <div className="flex items-center space-x-4 group cursor-pointer">
                                    <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors duration-500">
                                        <Phone className="w-4 h-4" />
                                    </div>
                                    <span className="text-sm font-light text-gray-600">+91 98765 43210</span>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <h3 className="text-xs uppercase tracking-widest font-semibold text-primary">Headquarters</h3>
                            <div className="flex items-start space-x-4">
                                <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center shrink-0">
                                    <MapPin className="w-4 h-4" />
                                </div>
                                <p className="text-sm font-light text-gray-600 leading-relaxed max-w-xs">
                                    Suite 402, The Creative Block,<br />
                                    Bandra West, Mumbai,<br />
                                    Maharashtra 400050
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Contact Form - Right */}
                    <motion.form
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        onSubmit={handleSubmit}
                        className="space-y-8 bg-secondary p-8 md:p-12 rounded-2xl shadow-lg border border-tertiary"
                    >
                        <div className="space-y-2">
                            <label className="text-[10px] uppercase tracking-widest text-textSecondary font-semibold">Full Name</label>
                            <input
                                type="text"
                                required
                                className="w-full bg-transparent border-b border-gray-200 py-3 text-sm focus:border-accent outline-none transition-colors font-medium text-textPrimary"
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] uppercase tracking-widest text-textSecondary font-semibold">Email Address</label>
                            <input
                                type="email"
                                required
                                className="w-full bg-transparent border-b border-gray-200 py-3 text-sm focus:border-accent outline-none transition-colors font-medium text-textPrimary"
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] uppercase tracking-widest text-textSecondary font-semibold">Message</label>
                            <textarea
                                rows="4"
                                required
                                className="w-full bg-transparent border-b border-gray-200 py-3 text-sm focus:border-accent outline-none transition-colors font-medium text-textPrimary resize-none"
                                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                            ></textarea>
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-accent text-white py-4 text-[11px] font-bold tracking-[0.2em] uppercase hover:bg-accentHover transition-colors flex items-center justify-center space-x-3 rounded-md shadow-md"
                        >
                            <span>Send Message</span>
                            <Send className="w-4 h-4 ml-2" />
                        </button>
                    </motion.form>

                </div>
            </div>
        </div>
    );
};

export default Contact;