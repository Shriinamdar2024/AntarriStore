import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Search as SearchIcon, TrendingUp, Clock, ArrowRight, Loader2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const TRENDING = ['Wireless Earbuds', 'Smart Watch', 'Running Shoes', 'Backpack', 'Sunglasses'];

const SearchOverlay = ({ isOpen, onClose }) => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [recentSearches, setRecentSearches] = useState(() => {
        try { return JSON.parse(localStorage.getItem('ant_recent_searches')) || []; }
        catch { return []; }
    });

    const inputRef = useRef(null);
    const navigate = useNavigate();
    const debounceTimer = useRef(null);

    // Focus input when opened
    useEffect(() => {
        if (isOpen) {
            setTimeout(() => inputRef.current?.focus(), 100);
        } else {
            setQuery('');
            setResults([]);
        }
    }, [isOpen]);

    // Debounced live search from backend
    const fetchResults = useCallback(async (searchQuery) => {
        if (!searchQuery.trim()) { setResults([]); return; }
        setLoading(true);
        try {
            const { data } = await axios.get(`http://localhost:5000/api/products/public`);
            const q = searchQuery.toLowerCase();
            const filtered = data.filter(p =>
                p.name?.toLowerCase().includes(q) ||
                p.category?.toLowerCase().includes(q) ||
                p.brand?.toLowerCase().includes(q) ||
                p.description?.toLowerCase().includes(q)
            ).slice(0, 8);
            setResults(filtered);
        } catch {
            setResults([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        clearTimeout(debounceTimer.current);
        if (!query.trim()) { setResults([]); setLoading(false); return; }
        setLoading(true);
        debounceTimer.current = setTimeout(() => fetchResults(query), 300);
        return () => clearTimeout(debounceTimer.current);
    }, [query, fetchResults]);

    const saveSearch = (term) => {
        const updated = [term, ...recentSearches.filter(s => s !== term)].slice(0, 5);
        setRecentSearches(updated);
        localStorage.setItem('ant_recent_searches', JSON.stringify(updated));
    };

    const handleResultClick = (product) => {
        saveSearch(query);
        onClose();
    };

    const handleTrendingClick = (term) => {
        saveSearch(term);
        onClose();
        navigate(`/shop?search=${encodeURIComponent(term)}`);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (query.trim()) {
            saveSearch(query.trim());
            onClose();
            navigate(`/shop?search=${encodeURIComponent(query.trim())}`);
        }
    };

    const clearRecent = () => {
        setRecentSearches([]);
        localStorage.removeItem('ant_recent_searches');
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 z-[109] bg-slate-900/60 backdrop-blur-sm"
                        onClick={onClose}
                    />

                    {/* Search Panel — drops from the top like Amazon */}
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                        className="fixed top-0 left-0 right-0 z-[110] bg-white shadow-2xl border-b border-slate-200"
                    >
                        {/* Search Input Bar */}
                        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
                            <form onSubmit={handleSubmit} className="flex items-center gap-4 py-4 border-b border-slate-100">
                                <SearchIcon className="w-6 h-6 text-slate-400 shrink-0" />
                                <input
                                    ref={inputRef}
                                    type="text"
                                    placeholder="Search for products, brands and more..."
                                    className="flex-1 text-lg font-medium text-slate-900 placeholder:text-slate-400 outline-none bg-transparent"
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                />
                                {loading && <Loader2 className="w-5 h-5 text-blue-500 animate-spin shrink-0" />}
                                {query && !loading && (
                                    <button type="button" onClick={() => { setQuery(''); setResults([]); inputRef.current?.focus(); }} className="text-slate-400 hover:text-slate-700 shrink-0 transition-colors">
                                        <X className="w-5 h-5" />
                                    </button>
                                )}
                                <button type="submit" className="hidden sm:flex bg-[#facc15] hover:bg-[#eab308] text-slate-900 px-5 py-2 rounded-lg font-bold text-sm transition-colors items-center gap-2 shrink-0">
                                    Search <ArrowRight className="w-4 h-4" />
                                </button>
                                <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-900 p-1.5 hover:bg-slate-100 rounded-lg transition-colors shrink-0 ml-1">
                                    <X className="w-5 h-5" />
                                </button>
                            </form>
                        </div>

                        {/* Suggestions / Results Dropdown */}
                        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-4 max-h-[75vh] overflow-y-auto">
                            <AnimatePresence mode="wait">

                                {/* LIVE SEARCH RESULTS */}
                                {query.trim() && (
                                    <motion.div key="results" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                        {results.length > 0 ? (
                                            <>
                                                <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">
                                                    {results.length} Product{results.length !== 1 ? 's' : ''} Found
                                                </p>
                                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
                                                    {results.map((product) => (
                                                        <Link
                                                            to={`/product/${product._id || product.id}`}
                                                            key={product._id || product.id}
                                                            onClick={() => handleResultClick(product)}
                                                            className="flex gap-3 items-center p-3 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-blue-50 hover:border-blue-200 transition-all group"
                                                        >
                                                            <div className="w-14 h-16 rounded-lg bg-white border border-slate-100 flex items-center justify-center p-1 shrink-0 overflow-hidden">
                                                                <img
                                                                    src={product.image || (product.images && product.images[0])}
                                                                    alt={product.name}
                                                                    className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-300"
                                                                />
                                                            </div>
                                                            <div className="min-w-0">
                                                                <p className="text-[10px] font-bold uppercase tracking-wider text-blue-600 mb-0.5">{product.category}</p>
                                                                <h4 className="text-sm font-bold text-slate-800 line-clamp-2 leading-tight group-hover:text-blue-700 transition-colors">{product.name}</h4>
                                                                <p className="text-sm font-extrabold text-slate-900 mt-1">₹{product.price?.toLocaleString()}</p>
                                                            </div>
                                                        </Link>
                                                    ))}
                                                </div>
                                                <div className="border-t border-slate-100 pt-4">
                                                    <button onClick={handleSubmit} className="w-full flex items-center justify-center gap-2 py-3 bg-slate-50 hover:bg-blue-50 rounded-xl text-sm font-bold text-blue-600 hover:text-blue-700 border border-slate-200 hover:border-blue-200 transition-all">
                                                        See all results for "{query}" <ArrowRight className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </>
                                        ) : !loading ? (
                                            <div className="py-12 text-center">
                                                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                                    <SearchIcon className="w-8 h-8 text-slate-400" />
                                                </div>
                                                <p className="font-bold text-slate-700 mb-1">No results for "{query}"</p>
                                                <p className="text-sm text-slate-500 font-medium">Try a different keyword or browse our categories.</p>
                                            </div>
                                        ) : null}
                                    </motion.div>
                                )}

                                {/* DEFAULT STATE — Recent + Trending */}
                                {!query.trim() && (
                                    <motion.div key="default" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6 pb-4">

                                        {/* Recent Searches */}
                                        {recentSearches.length > 0 && (
                                            <div>
                                                <div className="flex items-center justify-between mb-3">
                                                    <div className="flex items-center gap-2">
                                                        <Clock className="w-4 h-4 text-slate-400" />
                                                        <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500">Recent Searches</h3>
                                                    </div>
                                                    <button onClick={clearRecent} className="text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors">Clear</button>
                                                </div>
                                                <div className="flex flex-wrap gap-2">
                                                    {recentSearches.map((term, i) => (
                                                        <button
                                                            key={i}
                                                            onClick={() => setQuery(term)}
                                                            className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-full text-sm font-bold text-slate-700 transition-colors"
                                                        >
                                                            <Clock className="w-3.5 h-3.5 text-slate-400" />
                                                            {term}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Trending Searches */}
                                        <div>
                                            <div className="flex items-center gap-2 mb-3">
                                                <TrendingUp className="w-4 h-4 text-orange-500" />
                                                <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500">Trending Now</h3>
                                            </div>
                                            <div className="flex flex-wrap gap-2">
                                                {TRENDING.map((term, i) => (
                                                    <button
                                                        key={i}
                                                        onClick={() => handleTrendingClick(term)}
                                                        className="flex items-center gap-2 px-4 py-2 bg-orange-50 hover:bg-orange-100 border border-orange-100 hover:border-orange-200 rounded-full text-sm font-bold text-orange-800 transition-colors"
                                                    >
                                                        <TrendingUp className="w-3.5 h-3.5 text-orange-500" />
                                                        {term}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Quick Category Links */}
                                        <div>
                                            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-3">Browse Categories</h3>
                                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
                                                {['Men', 'Women', 'Electronics', 'Accessories', 'Footwear'].map((cat) => (
                                                    <Link
                                                        to={`/shop?category=${cat}`}
                                                        key={cat}
                                                        onClick={onClose}
                                                        className="flex flex-col items-center gap-2 py-3 px-2 bg-slate-50 hover:bg-blue-50 border border-slate-100 hover:border-blue-200 rounded-xl transition-all group text-center"
                                                    >
                                                        <span className="text-sm font-bold text-slate-700 group-hover:text-blue-700 transition-colors">{cat}</span>
                                                        <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-500 group-hover:translate-x-0.5 transition-all" />
                                                    </Link>
                                                ))}
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default SearchOverlay;