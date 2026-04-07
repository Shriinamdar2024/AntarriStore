import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useCart } from '../../context/CartContext';
import { ShoppingCart, Star, Heart } from 'lucide-react';

const ProductCard = ({ id, images, name, price, category, index }) => {
    const { addToCart, toggleWishlist, isInWishlist } = useCart();
    const [isHovered, setIsHovered] = useState(false);
    
    const isWished = isInWishlist(id);

    // Get the first image
    const displayImage = images && images.length > 0 ? images[0] : 'https://via.placeholder.com/400x400?text=Premium+Product';

    // Mock calculations for premium e-commerce feel
    const rating = (Math.random() * (5 - 3.8) + 3.8).toFixed(1); // Ratings between 3.8 and 5.0
    const reviews = Math.floor(Math.random() * 800) + 24; 
    const originalPrice = Math.floor(price * 1.3); // Mock 30% discount
    const discount = Math.round(((originalPrice - price) / originalPrice) * 100);

    return (
        <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.05 }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="group relative flex flex-col bg-white rounded-2xl border border-tertiary/60 shadow-[0_2px_12px_rgb(0,0,0,0.03)] hover:shadow-[0_8px_24px_rgb(0,0,0,0.08)] hover:border-accent/40 overflow-hidden transition-all duration-300"
        >
            {/* Wishlist Button */}
            <button 
                onClick={(e) => { 
                    e.preventDefault(); 
                    toggleWishlist({ _id: id, id, image: displayImage, images, name, price, category }); 
                }}
                className="absolute top-3 right-3 z-10 p-2 rounded-full bg-white/70 backdrop-blur-sm border border-tertiary text-textSecondary hover:text-rose-500 hover:border-rose-200 transition-all shadow-sm"
            >
                <Heart className={`w-4 h-4 transition-all duration-300 ${isWished ? 'fill-rose-500 text-rose-500 scale-110' : ''}`} />
            </button>

            {/* Badges */}
            <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5">
                {discount > 20 && (
                    <span className="bg-red-500 text-white text-[10px] uppercase font-bold tracking-wider px-2 py-1 rounded-md shadow-sm">
                        {discount}% Off
                    </span>
                )}
                {index % 3 === 0 && (
                    <span className="bg-textPrimary text-white text-[10px] uppercase font-bold tracking-wider px-2 py-1 rounded-md shadow-sm">
                        Top Rated
                    </span>
                )}
            </div>

            <Link to={`/product/${id}`} className="block relative overflow-hidden bg-primary/20 pt-6 px-6 pb-2">
                {/* Image Container */}
                <div className="relative aspect-square overflow-hidden rounded-xl bg-transparent flex items-center justify-center">
                    <motion.img
                        src={displayImage}
                        alt={name}
                        className={`w-full h-full object-contain max-h-[220px] transition-transform duration-700 ease-out ${isHovered ? 'scale-105' : 'scale-100'}`}
                    />
                </div>
            </Link>

            {/* Information Section */}
            <div className="p-4 sm:p-5 flex flex-col flex-1 bg-white">
                
                {/* Brand / Category */}
                <p className="text-[11px] font-bold uppercase tracking-widest text-[#0ea5e9] mb-1.5">
                    {category}
                </p>

                {/* Title */}
                <Link to={`/product/${id}`}>
                    <h3 className="text-sm sm:text-base font-semibold text-textPrimary leading-tight mb-2 line-clamp-2 hover:text-accent transition-colors">
                        {name}
                    </h3>
                </Link>

                {/* Ratings (Amazon/Flipkart Style) */}
                <div className="flex items-center gap-2 mb-3">
                    <span className="bg-emerald-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5">
                        {rating} <Star className="w-2.5 h-2.5 fill-white" />
                    </span>
                    <span className="text-xs text-textSecondary font-medium">({reviews.toLocaleString()})</span>
                    {index % 2 === 0 && (
                        <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/Flipkart_Assured_logo.png" alt="Assured" className="h-3 ml-auto opacity-80" onError={(e) => e.target.style.display='none'} />
                    )}
                </div>

                {/* Price Section */}
                <div className="mt-auto">
                    <div className="flex items-baseline gap-2 mb-1">
                        <span className="text-xl font-bold text-textPrimary">
                            ₹{price.toLocaleString('en-IN')}
                        </span>
                        <span className="text-sm text-textSecondary line-through font-medium">
                            ₹{originalPrice.toLocaleString('en-IN')}
                        </span>
                    </div>

                    {/* Delivery Info */}
                    <p className="text-xs text-textSecondary font-medium mb-4">
                        Free delivery by <span className="font-bold text-textPrimary">Tomorrow</span>
                    </p>

                    {/* Quick Add Button */}
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            addToCart({ id, image: displayImage, name, price, category });
                        }}
                        className="w-full bg-[#facc15] hover:bg-[#eab308] text-zinc-900 border border-[#ca8a04] py-2.5 px-4 rounded-xl text-sm font-bold transition-all shadow-[0_2px_4px_rgba(250,204,21,0.2)] flex items-center justify-center gap-2 relative overflow-hidden"
                    >
                        <ShoppingCart className="w-4 h-4" />
                        <span>Add to Cart</span>
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

export default ProductCard;