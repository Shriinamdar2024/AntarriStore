import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, UserCircle, Home, ShoppingBag, Info, Phone, Package, Heart } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const MobileMenu = ({ isOpen, onClose }) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleSignOut = () => {
        logout();
        onClose();
        navigate('/');
    };

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
                        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[90] md:hidden"
                    />

                    {/* Slide-out Sidebar */}
                    <motion.div
                        initial={{ x: '-100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '-100%' }}
                        transition={{ type: 'tween', duration: 0.3 }}
                        className="fixed inset-y-0 left-0 w-[85%] max-w-sm bg-white z-[100] flex flex-col md:hidden shadow-2xl overflow-y-auto"
                    >
                        {/* Auth Header Area */}
                        <div className="bg-[#232F3E] text-white p-6 flex items-center gap-4 relative">
                            <button 
                                onClick={onClose} 
                                className="absolute top-4 right-4 p-1.5 hover:bg-white/10 rounded-full transition-colors"
                            >
                                <X className="w-6 h-6" />
                            </button>

                            <UserCircle className="w-10 h-10 text-white/90" />
                            <div className="flex flex-col">
                                {user ? (
                                    <>
                                        <span className="font-bold text-lg">Hello, {user.name || user.fullName || 'User'}</span>
                                        <Link to="/profile" onClick={onClose} className="text-xs text-yellow-400 hover:underline">Manage Account</Link>
                                    </>
                                ) : (
                                    <>
                                        <span className="font-bold text-lg">Browse Store</span>
                                        <Link to="/login" onClick={onClose} className="text-xs text-yellow-400 hover:underline">Sign In / Register</Link>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Navigation Groups */}
                        <div className="flex-1 py-4">
                            
                            <div className="mb-6">
                                <h3 className="px-6 mb-3 text-lg font-bold text-slate-800">Shop Catalog</h3>
                                <div className="flex flex-col">
                                    <Link to="/" onClick={onClose} className="flex items-center gap-4 px-6 py-3 hover:bg-slate-50 transition-colors">
                                        <Home className="w-5 h-5 text-slate-400" />
                                        <span className="text-slate-700 font-medium font-sans">Home Page</span>
                                    </Link>
                                    <Link to="/shop" onClick={onClose} className="flex items-center gap-4 px-6 py-3 hover:bg-slate-50 transition-colors">
                                        <ShoppingBag className="w-5 h-5 text-slate-400" />
                                        <span className="text-slate-700 font-medium font-sans">All Products</span>
                                    </Link>
                                    <Link to="/accessories" onClick={onClose} className="flex items-center gap-4 px-6 py-3 hover:bg-slate-50 transition-colors">
                                        <span className="w-5 h-5 flex items-center justify-center text-slate-400 text-[10px] bg-slate-100 rounded">AC</span>
                                        <span className="text-slate-700 font-medium font-sans">Tech Accessories</span>
                                    </Link>
                                    <Link to="/apparel" onClick={onClose} className="flex items-center gap-4 px-6 py-3 hover:bg-slate-50 transition-colors">
                                        <span className="w-5 h-5 flex items-center justify-center text-slate-400 text-[10px] bg-slate-100 rounded">AP</span>
                                        <span className="text-slate-700 font-medium font-sans">Premium Apparel</span>
                                    </Link>
                                </div>
                            </div>

                            <div className="h-px bg-slate-200 mx-6 mb-6" />

                            <div className="mb-6">
                                <h3 className="px-6 mb-3 text-lg font-bold text-slate-800">Your Account</h3>
                                <div className="flex flex-col">
                                    <Link to="/orders" onClick={onClose} className="flex items-center gap-4 px-6 py-3 hover:bg-slate-50 transition-colors">
                                        <Package className="w-5 h-5 text-slate-400" />
                                        <span className="text-slate-700 font-medium font-sans">Your Orders</span>
                                    </Link>
                                    <Link to="/track-order" onClick={onClose} className="flex items-center gap-4 px-6 py-3 hover:bg-slate-50 transition-colors">
                                        <Truck className="w-5 h-5 text-slate-400" />
                                        <span className="text-slate-700 font-medium font-sans">Track Package</span>
                                    </Link>
                                </div>
                            </div>

                            <div className="h-px bg-slate-200 mx-6 mb-6" />

                            <div className="mb-6">
                                <h3 className="px-6 mb-3 text-lg font-bold text-slate-800">Support Center</h3>
                                <div className="flex flex-col">
                                    <Link to="/about" onClick={onClose} className="flex items-center gap-4 px-6 py-3 hover:bg-slate-50 transition-colors">
                                        <Info className="w-5 h-5 text-slate-400" />
                                        <span className="text-slate-700 font-medium font-sans">About Us</span>
                                    </Link>
                                    <Link to="/contact" onClick={onClose} className="flex items-center gap-4 px-6 py-3 hover:bg-slate-50 transition-colors">
                                        <Phone className="w-5 h-5 text-slate-400" />
                                        <span className="text-slate-700 font-medium font-sans">Contact Support</span>
                                    </Link>
                                </div>
                            </div>

                        </div>

                        {/* Sign Out Area */}
                        {user && (
                            <div className="border-t border-slate-200 p-6 bg-slate-50">
                                <button onClick={handleSignOut} className="w-full bg-white border border-slate-300 text-slate-700 py-3 rounded-lg font-bold shadow-sm hover:bg-slate-100 transition-colors">
                                    Sign Out
                                </button>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default MobileMenu;