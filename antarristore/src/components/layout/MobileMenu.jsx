import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { Link } from 'react-router-dom';

const MobileMenu = ({ isOpen, onClose }) => {
    const menuItems = [
        { name: 'Home', href: '/' },
        { name: 'Shop All', href: '/shop' },
        { name: 'Our Story', href: '/about' },
        { name: 'Contact', href: '/contact' },
    ];

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ x: '-100%' }}
                    animate={{ x: 0 }}
                    exit={{ x: '-100%' }}
                    transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                    className="fixed inset-0 bg-white z-[100] flex flex-col p-8 md:hidden"
                >
                    {/* Header */}
                    <div className="flex justify-between items-center mb-16">
                        <span className="text-sm font-serif tracking-widest uppercase">Antaristore</span>
                        <button onClick={onClose} className="p-2 border border-gray-100 rounded-full">
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Links */}
                    <nav className="flex flex-col space-y-8">
                        {menuItems.map((item, i) => (
                            <motion.div
                                key={item.name}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                            >
                                <Link
                                    to={item.href}
                                    onClick={onClose}
                                    className="text-4xl font-serif italic hover:text-gray-400 transition-colors"
                                >
                                    {item.name}
                                </Link>
                            </motion.div>
                        ))}
                    </nav>

                    {/* Footer Info */}
                    <div className="mt-auto border-t pt-8 space-y-4">
                        <p className="text-[10px] uppercase tracking-[0.3em] text-gray-400">Follow Us</p>
                        <div className="flex gap-6 text-xs uppercase tracking-widest">
                            <a href="#">Instagram</a>
                            <a href="#">Pinterest</a>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default MobileMenu;