import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search, ShoppingBag, Menu, X, User, Heart,
    Box, Shirt, Watch, BookOpen, Truck, ClipboardList, LogIn, LogOut
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext'; // Ensure this path is correct

const Navbar = ({ onCartClick, onMenuClick, onSearchClick }) => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { cartCount, wishlist } = useCart();
    const { user, logout } = useAuth(); // Accessing global auth state
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
    }, [isMobileMenuOpen]);

    const navLinks = [
        { name: 'Shop', href: '/shop', icon: <Box size={13} /> },
        { name: 'Accessories', href: '/accessories', icon: <Watch size={13} /> },
        { name: 'Garments', href: '/garments', icon: <Shirt size={13} /> },
        { name: 'Our Story', href: '/about', icon: <BookOpen size={13} /> },
        { name: 'Track Order', href: '/track-order', icon: <Truck size={13} /> },
        { name: 'Orders', href: '/orders', icon: <ClipboardList size={13} /> },
    ];

    const handleAuthAction = () => {
        if (user) {
            logout();
            navigate('/');
        } else {
            navigate('/login');
        }
    };

    return (
        <>
            <motion.nav
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className={`fixed top-0 w-full z-50 transition-all duration-500 border-b ${isScrolled
                    ? 'bg-primary/90 backdrop-blur-lg border-tertiary py-3 shadow-sm shadow-slate-200/50'
                    : 'bg-gradient-to-b from-primary/90 to-transparent border-transparent py-6'
                    }`}
            >
                <div className="max-w-[1800px] mx-auto px-6 sm:px-10">
                    <div className="flex items-center justify-between gap-8">

                        {/* Left - Brand Logo */}
                        <div className="flex-shrink-0">
                            <Link to="/" className="text-xl md:text-2xl font-serif tracking-[0.15em] text-textPrimary whitespace-nowrap group">
                                ANTARRI<span className="text-accent italic font-light transition-colors duration-300 group-hover:text-textPrimary">STORE</span>
                            </Link>
                        </div>

                        {/* Center - Primary Navigation */}
                        <div className="hidden lg:flex items-center justify-center flex-grow space-x-10">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    to={link.href}
                                    className={`flex items-center gap-2.5 text-[10px] uppercase tracking-[0.25em] font-bold transition-all duration-300 relative group py-2 ${location.pathname === link.href ? 'text-accent' : 'text-textPrimary/70 hover:text-accent'
                                        }`}
                                >
                                    <span className="opacity-50 group-hover:opacity-100 transition-opacity">
                                        {link.icon}
                                    </span>
                                    <span className="whitespace-nowrap">{link.name}</span>
                                    <span className={`absolute -bottom-1 left-0 h-[1.5px] bg-accent transition-all duration-300 ${location.pathname === link.href ? 'w-full' : 'w-0 group-hover:w-full'
                                        }`}></span>
                                </Link>
                            ))}
                        </div>

                        {/* Right - Secondary Actions */}
                        <div className="flex items-center justify-end space-x-5 sm:space-x-8 flex-shrink-0">
                            <div className="hidden xl:flex items-center space-x-6 mr-2 border-r border-tertiary pr-8">
                                <button
                                    onClick={onSearchClick}
                                    className="text-textPrimary/70 hover:text-accent transition-colors duration-300 flex items-center gap-2"
                                >
                                    <Search className="w-4 h-4" />
                                </button>

                                <button
                                    onClick={() => navigate('/wishlist')}
                                    className="text-textPrimary/70 hover:text-accent transition-colors duration-300 relative flex items-center gap-2"
                                >
                                    <Heart className="w-4 h-4" />
                                    {wishlist?.length > 0 && (
                                        <span className="absolute -top-1 left-2 w-2 h-2 bg-accent rounded-full" />
                                    )}
                                </button>
                            </div>

                            {/* Dynamic Login/Logout Button */}
                            <button
                                onClick={handleAuthAction}
                                className={`text-textPrimary/70 hover:text-accent transition-colors duration-300 p-1 ${location.pathname === '/login' ? 'text-accent' : ''}`}
                                title={user ? "Logout" : "Login"}
                            >
                                {user ? <LogOut className="w-4 h-4" /> : <LogIn className="w-4 h-4" />}
                            </button>

                            {/* Profile Icon - Only visible when logged in */}
                            {user && (
                                <button
                                    onClick={() => navigate('/profile')}
                                    className={`text-textPrimary/70 hover:text-accent transition-colors duration-300 p-1 ${location.pathname === '/profile' || location.pathname === '/orders' ? 'text-accent' : ''}`}
                                    title="Account"
                                >
                                    <User className="w-4 h-4" />
                                </button>
                            )}

                            <button
                                onClick={onCartClick}
                                className="bg-textPrimary text-primary px-4 py-2 hover:bg-accent hover:text-white transition-all duration-300 flex items-center group"
                            >
                                <ShoppingBag className="w-4 h-4 mr-3" />
                                <span className="text-[10px] uppercase tracking-[0.2em] font-black whitespace-nowrap">
                                    Cart ({cartCount})
                                </span>
                            </button>

                            {/* Mobile Menu Toggle */}
                            <button
                                onClick={() => setIsMobileMenuOpen(true)}
                                className="lg:hidden text-textPrimary/70 hover:text-accent transition-colors"
                            >
                                <Menu className="w-6 h-6" />
                            </button>
                        </div>

                    </div>
                </div>
            </motion.nav>

            {/* Mobile Full-Screen Menu */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, clipPath: 'circle(0% at right top)' }}
                        animate={{ opacity: 1, clipPath: 'circle(150% at right top)' }}
                        exit={{ opacity: 0, clipPath: 'circle(0% at right top)' }}
                        transition={{ duration: 0.6, ease: [0.7, 0, 0.3, 1] }}
                        className="fixed inset-0 z-[100] bg-primary flex flex-col"
                    >
                        <div className="flex justify-between items-center p-6 sm:p-12 border-b border-tertiary">
                            <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="text-xl font-serif tracking-[0.15em] text-textPrimary">
                                ANTARRI<span className="text-accent italic font-light">STORE</span>
                            </Link>
                            <button
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="text-textPrimary/60 hover:text-accent transition-transform duration-300 hover:rotate-90 p-2"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="flex-1 flex flex-col justify-center px-12 sm:px-20 space-y-6">
                            {/* Mobile Profile Link - Only visible when logged in */}
                            {user && (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
                                    <Link to="/profile" onClick={() => setIsMobileMenuOpen(false)} className="text-[10px] uppercase tracking-[0.4em] text-accent font-bold mb-4 block underline">Account Archive</Link>
                                </motion.div>
                            )}

                            {navLinks.map((link, i) => (
                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.2 + (i * 0.1), duration: 0.5 }}
                                    key={link.name}
                                >
                                    <Link
                                        to={link.href}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className={`flex items-center gap-4 text-3xl sm:text-5xl font-serif text-textPrimary hover:text-accent transition-all duration-300 ${location.pathname === link.href ? 'italic text-accent' : ''
                                            }`}
                                    >
                                        <span className="opacity-30">{link.icon}</span>
                                        {link.name}
                                    </Link>
                                </motion.div>
                            ))}

                            {/* Mobile Auth Link */}
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.8, duration: 0.5 }}
                            >
                                <button
                                    onClick={() => {
                                        handleAuthAction();
                                        setIsMobileMenuOpen(false);
                                    }}
                                    className="flex items-center gap-4 text-3xl sm:text-5xl font-serif text-textPrimary hover:text-accent transition-all duration-300"
                                >
                                    <span className="opacity-30">{user ? <LogOut /> : <LogIn />}</span>
                                    {user ? "Sign Out" : "Sign In"}
                                </button>
                            </motion.div>
                        </div>

                        <div className="p-12 sm:p-20 flex space-x-6 text-textPrimary/50 text-[10px] tracking-widest uppercase font-bold">
                            <a href="#" className="hover:text-accent transition-colors">Instagram</a>
                            <a href="#" className="hover:text-accent transition-colors">Twitter</a>
                            <a href="#" className="hover:text-accent transition-colors">Contact</a>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default Navbar;