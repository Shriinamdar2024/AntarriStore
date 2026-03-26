import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useCart } from '../../context/CartContext';
import { Plus, ArrowUpRight } from 'lucide-react';

const ProductCard = ({ id, images, name, price, category, index }) => {
    const { addToCart } = useCart();

    // FIXED: Access the first image from the Cloudinary array saved in your MongoDB
    const displayImage = images && images.length > 0 ? images[0] : 'https://via.placeholder.com/300x400?text=No+Image';

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{
                duration: 0.9,
                delay: index * 0.1,
                ease: [0.215, 0.61, 0.355, 1]
            }}
            className="group relative flex flex-col w-full"
        >
            <Link to={`/product/${id}`} className="block relative overflow-hidden">
                {/* Image Container - Sharp Edges */}
                <div className="relative aspect-[3/4] overflow-hidden bg-[#F5F5F3] transition-all duration-700 ease-in-out border border-black/[0.05]">
                    <motion.img
                        src={displayImage}
                        alt={name}
                        className="w-full h-full object-cover grayscale-[15%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000 ease-out"
                    />

                    {/* Industrial Quick Add - Sharp Edges */}
                    <div className="absolute inset-x-0 bottom-0 p-4 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 ease-out z-20">
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                // Passing the resolved displayImage to the cart context
                                addToCart({ id, image: displayImage, name, price, category });
                            }}
                            className="w-full bg-white text-textPrimary py-3 text-[10px] tracking-[0.3em] font-bold uppercase hover:bg-black hover:text-white transition-all duration-300 flex items-center justify-center space-x-2 border border-black shadow-none"
                        >
                            <span>Quick Add</span>
                            <Plus className="w-3 h-3 stroke-[3]" />
                        </button>
                    </div>

                    {/* Floating Category Badge */}
                    <div className="absolute top-4 left-4">
                        <span className="text-[8px] uppercase tracking-[0.4em] font-bold text-textPrimary/60 bg-white border border-black/10 px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                            {category}
                        </span>
                    </div>

                    <div className="absolute inset-0 bg-black/[0.02] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                </div>

                {/* Information Section */}
                <div className="mt-6 space-y-2">
                    <div className="flex justify-between items-start group/title">
                        <div className="space-y-1">
                            <h3 className="text-[15px] font-serif text-textPrimary leading-tight tracking-tight">
                                {name}
                            </h3>
                            <p className="text-[10px] uppercase tracking-[0.15em] text-textSecondary/60 font-medium">
                                {category}
                            </p>
                        </div>
                        <div className="text-right flex flex-col items-end">
                            <p className="text-[13px] font-sans font-bold text-textPrimary tracking-tight">
                                ₹{price.toLocaleString('en-IN')}
                            </p>
                            <ArrowUpRight className="w-3 h-3 text-accent opacity-0 -translate-x-1 translate-y-1 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0 transition-all duration-500" />
                        </div>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
};

export default ProductCard;