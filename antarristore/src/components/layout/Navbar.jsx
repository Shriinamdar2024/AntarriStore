import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    Search, ShoppingBag, Menu, User, Heart,
    Box, Shirt, Watch, BookOpen, Truck, ClipboardList, LogIn, LogOut
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';

const Navbar = ({ onCartClick, onMenuClick, onSearchClick }) => {
    const [isScrolled, setIsScrolled] = useState(false);
    const { cartCount, wishlist } = useCart();
    const { user, logout } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

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
        <motion.nav
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className={`fixed top-0 w-full z-50 transition-all duration-500 border-b ${isScrolled
                ? 'bg-primary/90 backdrop-blur-lg border-tertiary shadow-sm shadow-slate-200/50'
                : 'bg-gradient-to-b from-primary/90 to-transparent border-transparent'
                }`}
        >
            <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-10">
                <div className="flex items-center justify-between gap-2 sm:gap-4 py-3 sm:py-4 lg:py-6">

                    {/* Left - Brand Logo */}
                    <div className="flex-shrink-0">
                        <Link to="/" className="text-lg sm:text-xl md:text-2xl font-serif tracking-[0.12em] sm:tracking-[0.15em] text-textPrimary whitespace-nowrap group">
                            ANTARRI<span className="text-accent italic font-light transition-colors duration-300 group-hover:text-textPrimary">STORE</span>
                        </Link>
                    </div>

                    {/* Center - Primary Navigation (Desktop only) */}
                    <div className="hidden lg:flex items-center justify-center flex-grow space-x-8 xl:space-x-10">
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
                    <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">

                        {/* Search - hidden on very small mobile */}
                        <button
                            onClick={onSearchClick}
                            className="hidden sm:flex text-textPrimary/70 hover:text-accent transition-colors duration-300 p-1"
                            title="Search"
                        >
                            <Search className="w-4 h-4 sm:w-5 sm:h-5" />
                        </button>

                        {/* Wishlist - desktop only */}
                        <button
                            onClick={() => navigate('/wishlist')}
                            className="hidden xl:flex text-textPrimary/70 hover:text-accent transition-colors duration-300 relative p-1 mr-1 border-r border-tertiary pr-4"
                            title="Wishlist"
                        >
                            <Heart className="w-4 h-4" />
                            {wishlist?.length > 0 && (
                                <span className="absolute top-0 right-3 w-2 h-2 bg-accent rounded-full" />
                            )}
                        </button>

                        {/* Login/Logout Button */}
                        <button
                            onClick={handleAuthAction}
                            className={`hidden sm:flex text-textPrimary/70 hover:text-accent transition-colors duration-300 p-1 ${location.pathname === '/login' ? 'text-accent' : ''}`}
                            title={user ? "Logout" : "Login"}
                        >
                            {user ? <LogOut className="w-4 h-4 sm:w-5 sm:h-5" /> : <LogIn className="w-4 h-4 sm:w-5 sm:h-5" />}
                        </button>

                        {/* Profile Icon - Only visible when logged in, desktop */}
                        {user && (
                            <button
                                onClick={() => navigate('/profile')}
                                className={`hidden sm:flex text-textPrimary/70 hover:text-accent transition-colors duration-300 p-1 ${location.pathname === '/profile' || location.pathname === '/orders' ? 'text-accent' : ''}`}
                                title="Account"
                            >
                                <User className="w-4 h-4 sm:w-5 sm:h-5" />
                            </button>
                        )}

                        {/* Cart Button */}
                        <button
                            onClick={onCartClick}
                            className="bg-textPrimary text-primary hover:bg-accent hover:text-white transition-all duration-300 flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-4 py-1.5 sm:py-2 group"
                        >
                            <ShoppingBag className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                            <span className="text-[9px] sm:text-[10px] uppercase tracking-[0.15em] sm:tracking-[0.2em] font-black whitespace-nowrap">
                                <span className="hidden xs:inline">Cart </span>({cartCount})
                            </span>
                        </button>

                        {/* Mobile Menu Toggle — triggers the MobileMenu sidebar via onMenuClick */}
                        <button
                            onClick={onMenuClick}
                            className="lg:hidden text-textPrimary/70 hover:text-accent transition-colors p-1"
                            title="Menu"
                            aria-label="Open navigation menu"
                        >
                            <Menu className="w-5 h-5 sm:w-6 sm:h-6" />
                        </button>
                    </div>

                </div>
            </div>
        </motion.nav>
    );
};

export default Navbar;