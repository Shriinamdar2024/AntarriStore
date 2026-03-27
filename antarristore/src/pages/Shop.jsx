import React, { useState, useMemo, useEffect } from 'react';
import axios from 'axios';
import ProductCard from '../components/products/ProductCard';
import { motion, AnimatePresence } from 'framer-motion';

const Shop = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('All');

    // Fetch dynamic data from Render backend
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                // Use the specific /public route defined in your productRoutes.js
                // Replace 'http://localhost:5000' with your actual Antaristore backend URL if deployed
                const response = await axios.get('http://localhost:5000/api/products/public');

                setProducts(response.data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching products:", error);
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    // Memoizing categories to prevent recalculation on every render
    const categories = useMemo(() => {
        if (!products) return ['All'];
        return ['All', ...new Set(products.map(p => p.category))];
    }, [products]);

    // Memoizing filtered list for performance
    const filteredProducts = useMemo(() =>
        filter === 'All'
            ? products
            : products.filter(p => p.category === filter),
        [filter, products]);

    if (loading) {
        return (
            <div className="pt-32 pb-20 bg-[#FBFBF9] min-h-screen flex items-center justify-center">
                <p className="text-[10px] uppercase tracking-[0.5em] animate-pulse">Loading Collection...</p>
            </div>
        );
    }

    return (
        /* Matches your #FBFBF9 theme and background patterns */
        <div className="pt-32 pb-20 bg-[#FBFBF9] min-h-screen relative overflow-hidden">

            {/* Background Decorative Patterns */}
            <div className="absolute inset-0 opacity-[0.03] bg-[url('https://res.cloudinary.com/dzf9v7nkr/image/upload/v1676451163/noise_fllvly.png')] pointer-events-none" />
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808005_1px,transparent_1px),linear-gradient(to_bottom,#80808005_1px,transparent_1px)] bg-[size:80px_80px] pointer-events-none" />

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                {/* Minimal Header */}
                <header className="mb-20">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <span className="text-[10px] uppercase tracking-[0.5em] text-accent font-bold block mb-4">
                            Archive 2024
                        </span>
                        <h1 className="text-5xl md:text-7xl font-serif text-textPrimary leading-none">
                            Shop <span className="italic font-light text-textSecondary/60">All</span>
                        </h1>
                    </motion.div>
                </header>

                <div className="flex flex-col lg:flex-row gap-16">
                    {/* Sidebar Filter - Professional and structure-focused */}
                    <aside className="lg:w-48 flex-shrink-0">
                        <div className="sticky top-40 space-y-10">
                            <div>
                                <h3 className="text-[10px] uppercase tracking-[0.3em] font-bold text-textPrimary mb-8 border-b border-black/5 pb-4">
                                    Categories
                                </h3>
                                <div className="flex flex-row lg:flex-col flex-wrap gap-x-8 gap-y-4">
                                    {categories.map((cat) => (
                                        <button
                                            key={cat}
                                            onClick={() => setFilter(cat)}
                                            className={`text-[11px] font-bold uppercase tracking-[0.2em] text-left transition-all duration-300 relative group w-fit ${filter === cat ? 'text-accent' : 'text-textSecondary/60 hover:text-textPrimary'
                                                }`}
                                        >
                                            {cat}
                                            {filter === cat && (
                                                <motion.div
                                                    layoutId="activeFilter"
                                                    className="absolute -left-4 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-accent hidden lg:block"
                                                    style={{ borderRadius: 0 }} /* Explicit sharp edge for the indicator */
                                                />
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="pt-10 border-t border-black/5 hidden lg:block">
                                <p className="text-[9px] uppercase tracking-[0.2em] text-textSecondary leading-relaxed italic">
                                    {filteredProducts.length} curated pieces <br /> currently available.
                                </p>
                            </div>
                        </div>
                    </aside>

                    {/* Product Grid - Staggered entrance */}
                    <main className="flex-1">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={filter}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.5 }}
                                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-x-8 gap-y-16"
                            >
                                {filteredProducts.map((product, index) => (
                                    <ProductCard
                                        key={product._id || product.id} // Supporting MongoDB _id
                                        {...product}
                                        id={product._id || product.id}
                                        index={index % 3}
                                    />
                                ))}
                            </motion.div>
                        </AnimatePresence>

                        {filteredProducts.length === 0 && (
                            <div className="py-40 text-center border border-dashed border-black/10">
                                <p className="font-serif italic text-textSecondary/50 text-sm">
                                    No pieces found in this collection.
                                </p>
                            </div>
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
};

export default Shop;