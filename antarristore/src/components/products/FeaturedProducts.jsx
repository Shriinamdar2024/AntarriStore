import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import ProductCard from "./ProductCard";

const FeaturedProducts = () => {
    const [featuredItems, setFeaturedItems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFeatured = async () => {
            try {
                const response = await axios.get("https://antarri-backend.onrender.com/api/products/public");
                // Select first 4 items specifically for the featured grid matching standard desktop viewports
                setFeaturedItems(response.data.slice(0, 4));
            } catch (error) {
                console.error("Error fetching featured products:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchFeatured();
    }, []);

    if (loading) return null;

    if (featuredItems.length === 0) return null;

    return (
        <section className="bg-[#f1f3f6] pb-16 px-4 md:px-6 lg:px-8">
            <div className="max-w-[1500px] mx-auto">
                
                {/* Standard White Container Block */}
                <div className="bg-white rounded-2xl shadow-sm border border-black/5 overflow-hidden p-6 md:p-8">
                    
                    {/* Header Section */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                        <div className="space-y-1">
                            <div className="flex items-center gap-2">
                                <h2 className="text-2xl md:text-3xl font-bold text-slate-900 leading-none">
                                    Editor's Choice
                                </h2>
                                <div className="bg-yellow-100 text-yellow-600 p-1.5 rounded-full">
                                    <Star className="w-5 h-5 fill-current" />
                                </div>
                            </div>
                            <p className="text-slate-500 font-medium text-sm md:text-base">Premium hand-picked selections tailored to you.</p>
                        </div>
                        
                        <Link to="/shop">
                            <button className="flex items-center justify-center gap-2 px-6 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg font-bold text-sm transition-colors shadow-sm whitespace-nowrap w-full sm:w-auto">
                                View Full Directory <ArrowRight className="w-4 h-4" />
                            </button>
                        </Link>
                    </div>

                    {/* Standard E-commerce Grid Matrix */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                        <AnimatePresence>
                            {featuredItems.map((product, index) => (
                                <motion.div
                                    key={product._id || product.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                >
                                    <ProductCard 
                                        {...product} 
                                        id={product._id || product.id} 
                                        index={index} 
                                    />
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default FeaturedProducts;