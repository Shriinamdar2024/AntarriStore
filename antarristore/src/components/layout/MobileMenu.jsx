import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, UserCircle, Home, Search, LogIn, LogOut, Box, Watch, Shirt, BookOpen, Truck, ClipboardList, Heart } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const MobileMenu = ({ isOpen, onClose, onSearchClick }) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleSignOut = () => {
        logout();
        onClose();
        navigate('/');
    };

    const mainLinks = [
        { name: 'Home', href: '/', icon: <Home className="w-4 h-4" /> },
        { name: 'Shop', href: '/shop', icon: <Box className="w-4 h-4" /> },
        { name: 'Accessories', href: '/accessories', icon: <Watch className="w-4 h-4" /> },
        { name: 'Garments', href: '/garments', icon: <Shirt className="w-4 h-4" /> },
        { name: 'Our Story', href: '/about', icon: <BookOpen className="w-4 h-4" /> },
    ];

    const accountLinks = [
        { name: 'Track Order', href: '/track-order', icon: <Truck className="w-4 h-4" /> },
        { name: 'Orders', href: '/orders', icon: <ClipboardList className="w-4 h-4" /> },
        { name: 'Wishlist', href: '/wishlist', icon: <Heart className="w-4 h-4" /> },
    ];

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Dimmed Overlay */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[90] lg:hidden"
                    />

                    {/* Slide-out Sidebar */}
                    <motion.div
                        initial={{ x: '-100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '-100%' }}
                        transition={{ type: 'tween', duration: 0.3 }}
                        className="fixed inset-y-0 left-0 w-[80%] max-w-[300px] bg-white z-[100] flex flex-col lg:hidden shadow-2xl"
                    >
                        {/* Auth Header Area */}
                        <div className="bg-[#232F3E] text-white p-4 flex items-center gap-3 relative shrink-0">
                            <button 
                                onClick={onClose} 
                                className="absolute top-3 right-3 p-1 hover:bg-white/10 rounded-full transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>

                            <UserCircle className="w-8 h-8 text-white/90" />
                            <div className="flex flex-col">
                                {user ? (
                                    <>
                                        <span className="font-bold text-sm">Hello, {user.name || user.fullName || 'User'}</span>
                                        <Link to="/profile" onClick={onClose} className="text-[10px] text-yellow-400 hover:underline">Manage Account</Link>
                                    </>
                                ) : (
                                    <>
                                        <span className="font-bold text-sm">Browse Store</span>
                                        <Link to="/login" onClick={onClose} className="text-[10px] text-yellow-400 hover:underline">Sign In / Register</Link>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Navigation Scrollable Area */}
                        <div className="flex-1 overflow-y-auto py-2 h-full flex justify-between flex-col">
                            <div>
                                <div className="flex flex-col">
                                    {mainLinks.map((link) => (
                                        <Link key={link.name} to={link.href} onClick={onClose} className="flex items-center gap-3 px-5 py-2.5 hover:bg-slate-50 transition-colors border-b border-slate-50">
                                            <span className="text-slate-400">{link.icon}</span>
                                            <span className="text-slate-700 font-medium text-sm">{link.name}</span>
                                        </Link>
                                    ))}
                                </div>

                                <div className="my-2" />

                                <div className="flex flex-col bg-slate-50 border-y border-slate-100">
                                    <span className="px-5 py-2 text-xs font-bold text-slate-400 uppercase tracking-wider">Your Account</span>
                                    {accountLinks.map((link) => (
                                        <Link key={link.name} to={link.href} onClick={onClose} className="flex items-center gap-3 px-5 py-2.5 hover:bg-slate-100 transition-colors">
                                            <span className="text-slate-400">{link.icon}</span>
                                            <span className="text-slate-700 font-medium text-sm">{link.name}</span>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Bottom Actions */}
                        <div className="border-t border-slate-200 p-3 space-y-2 bg-slate-50 shrink-0">
                            {/* Search */}
                            {onSearchClick && (
                                <button
                                    onClick={() => { onClose(); onSearchClick(); }}
                                    className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-white border border-slate-200 rounded text-slate-700 font-bold text-sm hover:bg-slate-50 transition-colors shadow-sm"
                                >
                                    <Search className="w-4 h-4 text-slate-400" />
                                    Search Products
                                </button>
                            )}
                            {/* Auth */}
                            {user ? (
                                <button
                                    onClick={handleSignOut}
                                    className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-white border border-slate-200 text-slate-700 rounded font-bold text-sm hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors shadow-sm"
                                >
                                    <LogOut className="w-4 h-4" />
                                    Sign Out
                                </button>
                            ) : (
                                <Link
                                    to="/login"
                                    onClick={onClose}
                                    className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-[#232F3E] text-white rounded font-bold text-sm hover:bg-slate-800 transition-colors shadow-sm"
                                >
                                    <LogIn className="w-4 h-4" />
                                    Sign In / Register
                                </Link>
                            )}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default MobileMenu;