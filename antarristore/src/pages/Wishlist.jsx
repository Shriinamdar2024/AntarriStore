import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, ShoppingBag, ArrowRight, X } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';

const Wishlist = () => {
    const { wishlist, removeFromWishlist, addToCart, clearWishlist } = useCart();
    const navigate = useNavigate();

    const handleMoveToCart = (item) => {
        addToCart(item);
        removeFromWishlist(item._id || item.id);
    };

    return (
        <div className="min-h-screen bg-[#FBFBF9] pt-40 pb-20 px-6 sm:px-12 md:px-20 relative">
            {/* Background Texture */}
            <div className="absolute inset-0 opacity-[0.02] bg-[url('https://res.cloudinary.com/dzf9v7nkr/image/upload/v1676451163/noise_fllvly.png')] pointer-events-none" />

            <div className="max-w-6xl mx-auto relative z-10">
                <header className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <span className="text-[10px] uppercase tracking-[0.5em] text-accent font-bold block mb-2">Curated Selection</span>
                        <h1 className="text-5xl font-serif text-textPrimary leading-none">Your <span className="italic font-light opacity-50">Wishlist</span></h1>
                    </div>

                    {wishlist.length > 0 && (
                        <button
                            onClick={clearWishlist}
                            className="text-[9px] uppercase tracking-[0.3em] text-red-400 hover:text-red-600 transition-colors flex items-center gap-2 group"
                        >
                            <X size={12} className="group-hover:rotate-90 transition-transform" />
                            Clear All Items
                        </button>
                    )}
                </header>

                <AnimatePresence mode="popLayout">
                    {wishlist.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="py-32 text-center border border-dashed border-black/10 bg-white/30"
                            style={{ borderRadius: 0 }}
                        >
                            <p className="text-[11px] uppercase tracking-[0.3em] text-textSecondary mb-8">Your sanctuary is currently empty</p>
                            <button onClick={() => navigate('/shop')} className="text-[10px] font-bold uppercase tracking-[0.3em] border-b border-black/20 pb-1 hover:border-accent transition-all flex items-center mx-auto space-x-2 group">
                                <span>Explore Collection</span>
                                <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                            </button>
                        </motion.div>
                    ) : (
                        <motion.div
                            layout
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12"
                        >
                            {wishlist.map((item) => (
                                <motion.div
                                    layout
                                    key={item._id || item.id}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                                    className="group border border-black/5 bg-white p-6 shadow-sm hover:shadow-md transition-all"
                                    style={{ borderRadius: 0 }}
                                >
                                    <div className="aspect-[3/4] overflow-hidden bg-stone-100 mb-6 relative">
                                        <img
                                            src={item.image || (item.images && item.images[0])}
                                            alt={item.name}
                                            className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
                                        />
                                        <button
                                            onClick={() => removeFromWishlist(item._id || item.id)}
                                            className="absolute top-4 right-4 p-2 bg-white/90 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity"
                                            style={{ borderRadius: 0 }}
                                        >
                                            <Trash2 className="w-4 h-4 text-red-400 hover:text-red-600" />
                                        </button>
                                    </div>

                                    <div className="flex justify-between items-start mb-6">
                                        <div>
                                            <h3 className="text-[11px] font-bold uppercase tracking-widest text-textPrimary">{item.name}</h3>
                                            <p className="text-sm font-serif italic text-textSecondary mt-1">₹{item.price.toLocaleString()}</p>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => handleMoveToCart(item)}
                                        className="w-full border border-textPrimary py-4 text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-textPrimary hover:text-white transition-all flex items-center justify-center space-x-3"
                                        style={{ borderRadius: 0 }}
                                    >
                                        <ShoppingBag className="w-3.5 h-3.5" />
                                        <span>Move to Cart</span>
                                    </button>
                                </motion.div>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default Wishlist;