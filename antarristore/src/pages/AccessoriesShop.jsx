import React, { useState, useMemo, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X } from 'lucide-react';
import ProductCard from '../components/products/ProductCard';

const AccessoriesShop = () => {
    const [accessories, setAccessories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeCategory, setActiveCategory] = useState('All');

    // ... inside AccessoriesShop component
    useEffect(() => {
        const fetchAccessories = async () => {
            try {
                // Updated to use your /public endpoint for better performance
                const baseURL = window.location.hostname === 'localhost'
                    ? 'http://localhost:5000'
                    : 'https://shrirupportfolio.onrender.com';

                const response = await axios.get(`${baseURL}/api/products/public`);

                // Filter specifically for the category name used in AdminUpload
                const accessoryData = response.data.filter(item =>
                    item.category === 'Mobile Accessories'
                );

                setAccessories(accessoryData);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching accessories:", error);
                setLoading(false);
            }
        };
        fetchAccessories();
    }, []);

    // Update categories to derive from the SUB-CATEGORY (Mobile Case, Charger, etc.)
    // since the main category is already locked to "Mobile Accessories"
    const categories = useMemo(() => {
        const uniqueSubCats = ['All', ...new Set(accessories.map(item => item.subCategory).filter(Boolean))];
        return uniqueSubCats;
    }, [accessories]);

    const filteredItems = useMemo(() => {
        return accessories.filter(item => {
            const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesCategory = activeCategory === 'All' || item.subCategory === activeCategory;
            return matchesSearch && matchesCategory;
        });
    }, [searchQuery, activeCategory, accessories]);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#FBFBF9] pt-32 flex items-center justify-center">
                <p className="text-[10px] uppercase tracking-[0.5em] animate-pulse">Loading Objects...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#FBFBF9] pt-32 pb-20 px-6 sm:px-12 md:px-20 relative overflow-hidden text-textPrimary">

            {/* Background Textures */}
            <div className="absolute inset-0 opacity-[0.03] bg-[url('https://res.cloudinary.com/dzf9v7nkr/image/upload/v1676451163/noise_fllvly.png')] pointer-events-none" />
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808005_1px,transparent_1px),linear-gradient(to_bottom,#80808005_1px,transparent_1px)] bg-[size:80px_80px] pointer-events-none" />

            <div className="max-w-7xl mx-auto relative z-10">
                <header className="mb-12">
                    <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-[10px] uppercase tracking-[0.5em] text-accent font-bold block mb-4"
                    >
                        Precision Objects
                    </motion.span>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-5xl md:text-7xl font-serif"
                    >
                        Accessories
                    </motion.h1>
                </header>

                <section className="mb-16 space-y-8">
                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 pb-8 border-b border-black/5">
                        <div className="relative w-full lg:w-[450px] group">
                            <Search className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-textSecondary group-focus-within:text-accent transition-colors" />
                            <input
                                type="text"
                                placeholder="Search our collection..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-transparent border-none pl-8 pr-4 py-2 text-sm uppercase tracking-widest outline-none placeholder:text-textSecondary/50"
                            />
                            {searchQuery && (
                                <X
                                    className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 cursor-pointer text-textSecondary hover:text-accent"
                                    onClick={() => setSearchQuery('')}
                                />
                            )}
                            <div className="absolute bottom-0 left-0 w-full h-[1px] bg-black/10 group-focus-within:bg-accent transition-all duration-500" />
                        </div>

                        <div className="hidden lg:block">
                            <p className="text-[10px] uppercase tracking-[0.3em] text-textSecondary font-semibold">
                                {filteredItems.length} Products found
                            </p>
                        </div>
                    </div>

                    {/* Updated to Sharp Edges */}
                    <div className="flex flex-wrap gap-4">
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                className={`px-6 py-2 text-[10px] uppercase tracking-[0.2em] transition-all duration-500 border ${activeCategory === cat
                                    ? 'bg-black border-black text-white'
                                    : 'border-black/10 text-textSecondary hover:border-black/40'
                                    }`}
                                style={{ borderRadius: 0 }}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </section>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10">
                    <AnimatePresence mode='popLayout'>
                        {filteredItems.map((item, index) => (
                            <ProductCard
                                key={item._id}
                                id={item._id}
                                // UPDATED: Passing the full 'images' array to match ProductCard's expected props
                                images={item.images}
                                name={item.name}
                                price={item.price}
                                category={item.subCategory || item.category}
                                index={index}
                            />
                        ))}
                    </AnimatePresence>
                </div>
                {/* Updated to Sharp Edges */}
                {filteredItems.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-40 border border-dashed border-black/10"
                        style={{ borderRadius: 0 }}
                    >
                        <p className="text-textSecondary uppercase tracking-[0.3em] text-[10px] mb-4">No results found</p>
                        <button
                            onClick={() => { setSearchQuery(''); setActiveCategory('All'); }}
                            className="text-accent text-[11px] uppercase tracking-widest border-b border-accent/30 hover:border-accent transition-all"
                        >
                            Clear all filters
                        </button>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default AccessoriesShop;