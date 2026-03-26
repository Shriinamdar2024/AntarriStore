import React from 'react';
import { motion } from 'framer-motion';
import { Instagram, Twitter, Facebook, ArrowUpRight, Mail } from 'lucide-react';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    const footerLinks = [
        { title: "Collections", links: ["The Silk Series", "Noir Essentials", "Summer Ethereal", "Heritage Knits"] },
        { title: "Support", links: ["Shipping", "Size Guide", "Track Order", "Contact"] },
        { title: "Brand", links: ["Our Story", "Sustainability", "Journal"] }
    ];

    return (
        <footer className="relative bg-[#FBFBF9] pt-24 pb-12 px-6 sm:px-12 md:px-20 border-t border-black/5 overflow-hidden">

            {/* Subtle Background Accent */}
            <div className="absolute top-0 right-0 w-[25vw] h-[25vw] bg-accent/5 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />

            <div className="max-w-7xl mx-auto relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 mb-20">

                    {/* Brand & Newsletter Section */}
                    <div className="lg:col-span-5 space-y-8">
                        <motion.h2
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            className="text-4xl md:text-5xl font-serif text-textPrimary leading-tight"
                        >
                            Elevating the <br />
                            <span className="italic font-light text-accent">Everyday</span>
                        </motion.h2>

                        <div className="relative max-w-sm group">
                            <input
                                type="email"
                                placeholder="Join the newsletter"
                                className="w-full bg-transparent border-b border-tertiary py-3 pr-10 outline-none focus:border-accent transition-all text-sm font-light"
                            />
                            <button className="absolute right-0 top-1/2 -translate-y-1/2 text-textPrimary hover:text-accent transition-colors">
                                <Mail className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    {/* Links Section */}
                    <div className="lg:col-span-7 grid grid-cols-2 md:grid-cols-3 gap-8">
                        {footerLinks.map((section, idx) => (
                            <div key={section.title}>
                                <h4 className="text-[10px] uppercase tracking-[0.3em] font-bold text-accent mb-6">
                                    {section.title}
                                </h4>
                                <ul className="space-y-3">
                                    {section.links.map(link => (
                                        <li key={link}>
                                            <a href="#" className="text-[13px] text-textSecondary hover:text-textPrimary transition-colors flex items-center group">
                                                {link}
                                                <ArrowUpRight className="w-3 h-3 ml-1 opacity-0 group-hover:opacity-100 transition-all" />
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Minimal Bottom Bar */}
                <div className="pt-8 border-t border-black/5 flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className="text-[10px] uppercase tracking-widest text-textSecondary font-medium">
                        © {currentYear} ANTARRISTORE. All Rights Reserved.
                    </p>

                    <div className="flex space-x-6">
                        {[
                            { icon: <Instagram className="w-4 h-4" />, link: "#" },
                            { icon: <Twitter className="w-4 h-4" />, link: "#" },
                            { icon: <Facebook className="w-4 h-4" />, link: "#" }
                        ].map((social, i) => (
                            <motion.a
                                key={i}
                                whileHover={{ y: -2 }}
                                href={social.link}
                                className="text-textSecondary hover:text-accent transition-colors"
                            >
                                {social.icon}
                            </motion.a>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;