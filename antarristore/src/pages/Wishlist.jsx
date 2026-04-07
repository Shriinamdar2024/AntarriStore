import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, ShoppingBag, ArrowRight, Heart, ShoppingCart } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';

const Wishlist = () => {
    const { wishlist, removeFromWishlist, addToCart, clearWishlist } = useCart();
    const navigate = useNavigate();

    // Get logged-in user
    const user = JSON.parse(localStorage.getItem('userInfo'));

    // Create user-specific wishlist key
    const userWishlistKey = user ? `wishlist_${user._id}` : 'wishlist_guest';

    // Load correct wishlist on mount
    useEffect(() => {
        const stored = JSON.parse(localStorage.getItem(userWishlistKey)) || [];
        localStorage.setItem(userWishlistKey, JSON.stringify(stored));
    }, [userWishlistKey]);

    const handleMoveToCart = (item) => {
        addToCart(item);

        const updatedWishlist = wishlist.filter(
            (i) => (i._id || i.id) !== (item._id || item.id)
        );

        localStorage.setItem(userWishlistKey, JSON.stringify(updatedWishlist));
        removeFromWishlist(item._id || item.id);
    };

    const handleRemove = (id) => {
        const updatedWishlist = wishlist.filter(
            (i) => (i._id || i.id) !== id
        );

        localStorage.setItem(userWishlistKey, JSON.stringify(updatedWishlist));
        removeFromWishlist(id);
    };

    const handleClear = () => {
        localStorage.setItem(userWishlistKey, JSON.stringify([]));
        clearWishlist();
    };

    return (
        <div className="min-h-screen bg-[#f1f3f6] pt-24 pb-20 px-4 md:px-6 lg:px-8 font-sans text-slate-900">
            <div className="max-w-[1400px] mx-auto">
                
                {/* Header Container */}
                <div className="bg-white rounded-xl shadow-sm border border-black/5 p-6 mb-6 flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center shrink-0">
                            <Heart className="w-6 h-6 fill-rose-500 text-rose-500" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-slate-900">My Wishlist</h1>
                            <p className="text-sm text-slate-500 font-medium">{wishlist.length} {wishlist.length === 1 ? 'Item' : 'Items'}</p>
                        </div>
                    </div>

                    {wishlist.length > 0 && (
                        <button
                            onClick={handleClear}
                            className="bg-white border border-slate-200 hover:border-red-200 text-slate-600 hover:text-red-600 hover:bg-red-50 transition-colors px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2"
                        >
                            <Trash2 className="w-4 h-4" />
                            Empty Wishlist
                        </button>
                    )}
                </div>

                <AnimatePresence mode="popLayout">
                    {wishlist.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                            className="bg-white rounded-xl shadow-sm border border-black/5 py-24 px-4 text-center max-w-2xl mx-auto mt-10"
                        >
                            <div className="w-20 h-20 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Heart className="w-10 h-10" />
                            </div>
                            <h2 className="text-2xl font-bold text-slate-900 mb-2">Your wishlist is empty</h2>
                            <p className="text-slate-500 font-medium mb-8">Save items you like in your wishlist. Review them anytime and easily move them to cart.</p>
                            <button 
                                onClick={() => navigate('/shop')} 
                                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3.5 rounded-xl font-bold transition-colors shadow-sm inline-flex items-center justify-center gap-2"
                            >
                                Continue Shopping
                            </button>
                        </motion.div>
                    ) : (
                        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
                            {wishlist.map((item) => (
                                <motion.div
                                    layout
                                    key={item._id || item.id}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
                                    className="bg-white rounded-xl shadow-sm border border-black/5 overflow-hidden flex flex-col hover:shadow-md transition-shadow relative group"
                                >
                                    {/* Action Top Right Overlay */}
                                    <button
                                        onClick={() => handleRemove(item._id || item.id)}
                                        className="absolute top-3 right-3 z-10 w-8 h-8 bg-white/90 backdrop-blur text-slate-400 hover:text-red-500 rounded-full flex items-center justify-center shadow-sm opacity-100 lg:opacity-0 group-hover:opacity-100 transition-all border border-slate-200 hover:border-red-200"
                                        title="Remove from Wishlist"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>

                                    {/* Image Container */}
                                    <div className="aspect-[4/5] bg-slate-50 relative overflow-hidden group-hover:bg-slate-100 transition-colors p-4 flex items-center justify-center cursor-pointer" onClick={() => navigate(`/product/${item._id || item.id}`)}>
                                        <img
                                            src={item.image || (item.images && item.images[0])}
                                            alt={item.name}
                                            className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-500"
                                        />
                                    </div>

                                    {/* Details */}
                                    <div className="p-4 flex flex-col flex-1 border-t border-slate-100">
                                        <div className="mb-3 flex-1 flex flex-col" onClick={() => navigate(`/product/${item._id || item.id}`)}>
                                            <h3 className="text-sm font-bold text-slate-800 line-clamp-2 leading-tight cursor-pointer hover:text-blue-600 transition-colors">{item.name}</h3>
                                            <p className="text-lg font-extrabold text-slate-900 mt-auto pt-2">₹{item.price.toLocaleString()}</p>
                                        </div>

                                        {/* Move to Cart CTA */}
                                        <button
                                            onClick={() => handleMoveToCart(item)}
                                            className="w-full bg-[#facc15] hover:bg-[#eab308] text-slate-900 py-2.5 rounded-lg font-bold text-sm transition-colors flex items-center justify-center gap-2 shadow-sm"
                                        >
                                            <ShoppingCart className="w-4 h-4 text-slate-800" />
                                            Move to Cart
                                        </button>
                                    </div>
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