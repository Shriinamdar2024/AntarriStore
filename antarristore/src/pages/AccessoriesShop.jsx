import React, { useState, useMemo, useEffect } from 'react';
import axios from 'axios';
import ProductCard from '../components/products/ProductCard';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, Grid, Search, SlidersHorizontal, ChevronRight, PackageOpen, LayoutList, ChevronDown, Check } from 'lucide-react';

const AccessoriesShop = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
    const [viewMode, setViewMode] = useState('grid');
    const [sortBy, setSortBy] = useState('popularity');
    const [isSortOpen, setIsSortOpen] = useState(false);

    // Fetch dynamic data from backend
    useEffect(() => {
        const fetchAccessories = async () => {
            try {
                const response = await axios.get('https://antarri-backend.onrender.com/api/products/public');

                // Filter specifically for the category name used in AdminUpload
                const accessoryData = response.data.filter(item =>
                    item.category === 'Mobile Accessories'
                );

                setProducts(accessoryData);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching accessories:", error);
                setLoading(false);
            }
        };
        fetchAccessories();
    }, []);

    // Derive sub-categories dynamically from the fetched data
    const categories = useMemo(() => {
        if (!products) return ['All'];
        const uniqueSubCats = ['All', ...new Set(products.map(item => item.subCategory).filter(Boolean))];
        return uniqueSubCats;
    }, [products]);

    // Apply filters and search
    const filteredProducts = useMemo(() => {
        let result = products;

        if (filter !== 'All') {
            result = result.filter(p => p.subCategory === filter);
        }

        if (searchQuery.trim() !== '') {
            const query = searchQuery.toLowerCase();
            result = result.filter(p =>
                p.name?.toLowerCase().includes(query) ||
                p.description?.toLowerCase().includes(query) ||
                p.brand?.toLowerCase().includes(query)
            );
        }

        // Mock Sorting Logic
        if (sortBy === 'price-low') result.sort((a, b) => a.price - b.price);
        if (sortBy === 'price-high') result.sort((a, b) => b.price - a.price);
        if (sortBy === 'newest') result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        return result;
    }, [filter, searchQuery, products, sortBy]);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#f1f3f6] flex flex-col items-center justify-center gap-4">
                <div className="w-12 h-12 rounded-full border-4 border-tertiary border-t-accent animate-spin" />
                <p className="text-textSecondary font-medium animate-pulse mt-4">Curating Accessories Collection...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f1f3f6] pt-16 sm:pt-24 pb-20 font-sans text-textPrimary">

            {/* Amazon/Flipkart Style Premium Hero Banner */}
            <div className="bg-white border-b border-black/5 shadow-[0_2px_10px_rgb(0,0,0,0.02)] mb-6">
                <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center gap-2 text-xs text-textSecondary font-medium mb-4">
                        <span className="hover:text-accent cursor-pointer transition-colors">Home</span>
                        <ChevronRight className="w-3 h-3" />
                        <span className="hover:text-accent cursor-pointer transition-colors">Accessories Collection</span>
                        <ChevronRight className="w-3 h-3" />
                        <span className="text-textPrimary font-semibold">{filter}</span>
                    </div>

                    <div className="relative w-full h-[130px] sm:h-[280px] lg:h-[340px] rounded-xl md:rounded-3xl overflow-hidden group shadow-sm bg-gradient-to-r from-teal-900 via-emerald-900 to-green-950 border border-black/5">
                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
                        <div className="absolute right-0 top-0 w-1/2 h-full bg-gradient-to-l from-emerald-500/40 to-transparent"></div>
                        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-teal-500/30 blur-[100px] rounded-full"></div>

                        <div className="relative h-full flex flex-col justify-center px-5 md:px-16 lg:px-24 z-10">
                            <motion.span
                                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                                className="inline-block px-2 py-0.5 bg-yellow-400 text-yellow-900 text-[9px] sm:text-xs font-bold uppercase tracking-widest rounded-sm w-fit mb-1 sm:mb-4"
                            >
                                Tech & Gadget Sale
                            </motion.span>
                            <motion.h1
                                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                                className="text-xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-1 sm:mb-4 tracking-tight"
                            >
                                {filter === 'All' ? 'Premium Accessories' : `${filter}`}
                            </motion.h1>
                            <motion.p
                                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                                className="hidden sm:block text-teal-50 text-sm sm:text-lg max-w-xl font-medium"
                            >
                                Upgrade your ecosystem with our certified, top-rated tech. Guaranteed best prices.
                            </motion.p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col lg:flex-row gap-6">

                    {/* Mobile Filters Trigger */}
                    <div className="lg:hidden flex justify-between bg-white px-3 py-2 rounded-xl border border-black/5 shadow-sm">
                        <button onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)} className="flex items-center gap-1.5 font-semibold text-textPrimary px-2 py-1 focus:bg-primary rounded-lg transition-colors text-sm">
                            <Filter size={15} /> Filters
                        </button>
                        <div className="flex items-center gap-1 border-l border-tertiary pl-3">
                            <span className="text-xs font-medium text-textSecondary">Sort:</span>
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="text-xs font-bold text-textPrimary bg-transparent outline-none border-none cursor-pointer"
                            >
                                <option value="popularity">Popular</option>
                                <option value="price-low">Price: Low to High</option>
                                <option value="price-high">Price: High to Low</option>
                                <option value="newest">Newest</option>
                            </select>
                        </div>
                    </div>

                    {/* Premium Sidebar */}
                    <aside className={`lg:w-[280px] flex-shrink-0 ${isMobileFilterOpen ? 'block' : 'hidden'} lg:block`}>
                        <div className="sticky top-24 space-y-4">

                            <div className="bg-white rounded-xl shadow-sm border border-black/5 overflow-hidden">
                                <div className="p-4 border-b border-black/5 bg-slate-50/50">
                                    <h3 className="font-bold text-textPrimary uppercase tracking-wide text-xs">Search Accessories</h3>
                                </div>
                                <div className="p-4">
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-textSecondary" />
                                        <input
                                            type="text"
                                            placeholder="Find cases, chargers..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-4 py-2.5 text-sm font-medium text-textPrimary placeholder:font-normal placeholder:text-textSecondary outline-none focus:border-emerald-600 focus:bg-white transition-all shadow-inner"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* SubCategories Switcher */}
                            <div className="bg-white rounded-xl shadow-sm border border-black/5 overflow-hidden">
                                <div className="p-4 border-b border-black/5 bg-slate-50/50 flex justify-between items-center">
                                    <h3 className="font-bold text-textPrimary uppercase tracking-wide text-xs">Categories</h3>
                                    {filter !== 'All' && (
                                        <button onClick={() => setFilter('All')} className="text-xs text-emerald-600 font-semibold hover:underline">Clear</button>
                                    )}
                                </div>
                                <div className="p-4 space-y-3">
                                    {categories.map((cat) => {
                                        const isSelected = filter === cat;
                                        const count = cat === 'All' ? products.length : products.filter(p => p.subCategory === cat).length;
                                        return (
                                            <label key={cat} className="flex items-center justify-between cursor-pointer group" onClick={() => setFilter(cat)}>
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${isSelected ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-slate-300 bg-white group-hover:border-emerald-600'}`}>
                                                        {isSelected && <Check className="w-3 h-3" strokeWidth={3} />}
                                                    </div>
                                                    <span className={`text-sm font-medium ${isSelected ? 'text-textPrimary' : 'text-textSecondary group-hover:text-textPrimary'}`}>
                                                        {cat === 'All' ? 'Every Accessory' : cat}
                                                    </span>
                                                </div>
                                                <span className="text-xs text-textSecondary font-medium bg-slate-50 px-2 py-0.5 rounded-full border border-slate-100">
                                                    {count}
                                                </span>
                                            </label>
                                        );
                                    })}
                                </div>
                            </div>

                            <div className="bg-white rounded-xl shadow-sm border border-black/5 overflow-hidden hidden md:block">
                                <div className="p-4 border-b border-black/5 bg-slate-50/50">
                                    <h3 className="font-bold text-textPrimary uppercase tracking-wide text-xs">Customer Ratings</h3>
                                </div>
                                <div className="p-4 space-y-3">
                                    {[4, 3, 2, 1].map((star) => (
                                        <label key={star} className="flex items-center gap-3 cursor-pointer group">
                                            <div className="w-4 h-4 rounded border border-slate-300 bg-white group-hover:border-emerald-600 flex items-center justify-center transition-colors" />
                                            <div className="flex items-center gap-1 text-yellow-400">
                                                {[...Array(5)].map((_, i) => (
                                                    <svg key={i} className={`w-3.5 h-3.5 ${i < star ? 'fill-current' : 'fill-slate-200'}`} viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                                                ))}
                                                <span className="text-sm font-medium text-textSecondary ml-1">& Up</span>
                                            </div>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </aside>

                    {/* Main Content Grid Area */}
                    <main className="flex-1 w-full min-w-0">
                        {/* Premium Sort / View Bar */}
                        <div className="hidden lg:flex items-center justify-between bg-white px-6 py-4 rounded-xl border border-black/5 shadow-sm mb-6">
                            <div className="flex items-center gap-2 text-sm">
                                <span className="font-bold text-textPrimary text-lg">{filteredProducts.length}</span>
                                <span className="text-textSecondary font-medium text-base">items found</span>
                            </div>

                            <div className="flex items-center gap-6">
                                <div className="flex items-center gap-3 relative">
                                    <span className="text-sm font-semibold text-textPrimary uppercase tracking-wide">Sort By:</span>
                                    <button
                                        onClick={() => setIsSortOpen(!isSortOpen)}
                                        className="flex items-center gap-6 border-b-2 border-emerald-600 pb-1 text-sm font-bold text-emerald-700 hover:text-emerald-800 transition-colors"
                                    >
                                        {sortBy === 'popularity' ? 'Top Rated' : sortBy === 'price-low' ? 'Price: Low to High' : sortBy === 'price-high' ? 'Price: High to Low' : 'Newest Arrivals'}
                                        <ChevronDown className="w-4 h-4" />
                                    </button>

                                    {isSortOpen && (
                                        <div className="absolute top-10 right-0 w-48 bg-white border border-black/10 rounded-xl shadow-xl py-2 z-30">
                                            {['popularity', 'price-low', 'price-high', 'newest'].map(s => (
                                                <button
                                                    key={s}
                                                    onClick={() => { setSortBy(s); setIsSortOpen(false); }}
                                                    className={`w-full text-left px-4 py-2.5 text-sm font-medium hover:bg-slate-50 transition-colors ${sortBy === s ? 'text-emerald-700 bg-emerald-50' : 'text-textPrimary'}`}
                                                >
                                                    {s === 'popularity' ? 'Top Rated' : s === 'price-low' ? 'Price: Low to High' : s === 'price-high' ? 'Price: High to Low' : 'Newest Arrivals'}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <div className="flex items-center gap-1 border-l border-slate-200 pl-6">
                                    <button onClick={() => setViewMode('grid')} className={`p-2 rounded md ${viewMode === 'grid' ? 'bg-slate-100 text-textPrimary' : 'text-textSecondary hover:bg-slate-50'}`}>
                                        <Grid className="w-5 h-5" />
                                    </button>
                                    <button onClick={() => setViewMode('list')} className={`p-2 rounded md ${viewMode === 'list' ? 'bg-slate-100 text-textPrimary' : 'text-textSecondary hover:bg-slate-50'}`}>
                                        <LayoutList className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Product Grid */}
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={filter + searchQuery + sortBy}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.3 }}
                                className={`grid ${viewMode === 'grid' ? 'grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-4' : 'grid-cols-1 gap-4'}`}
                            >
                                {filteredProducts.map((product, index) => (
                                    <ProductCard
                                        key={product._id || product.id}
                                        {...product}
                                        id={product._id || product.id}
                                        images={product.images}
                                        category={product.subCategory || product.category}
                                        index={index % 6}
                                    />
                                ))}
                            </motion.div>
                        </AnimatePresence>

                        {/* Empty States */}
                        {filteredProducts.length === 0 && (
                            <motion.div
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                className="py-32 text-center bg-white rounded-2xl border border-black/5 shadow-sm mt-4 flex flex-col items-center justify-center"
                            >
                                <img src="https://cdn-icons-png.flaticon.com/512/10411/10411883.png" alt="No products" className="w-32 h-32 mb-6 opacity-30 grayscale" />
                                <h3 className="text-2xl font-bold text-textPrimary mb-3">No Accessories Found</h3>
                                <p className="text-textSecondary max-w-md mx-auto text-sm leading-relaxed mb-8 font-medium">
                                    We couldn't find any items matching your current search "{searchQuery}" under the "{filter}" category.
                                </p>
                                <button
                                    onClick={() => { setFilter('All'); setSearchQuery(''); }}
                                    className="px-8 py-3 bg-emerald-600 text-white rounded-xl font-bold hover:-translate-y-0.5 transition-transform shadow-sm"
                                >
                                    Browse All Accessories
                                </button>
                            </motion.div>
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
};

export default AccessoriesShop;