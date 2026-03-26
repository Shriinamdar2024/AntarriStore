import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Search as SearchIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { products } from '../../data/products';

const SearchOverlay = ({ isOpen, onClose }) => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);

    useEffect(() => {
        if (query.trim() === '') {
            setResults([]);
            return;
        }
        const filtered = products.filter(p =>
            p.name.toLowerCase().includes(query.toLowerCase()) ||
            p.category.toLowerCase().includes(query.toLowerCase())
        );
        setResults(filtered);
    }, [query]);

    // Reset query when closed
    useEffect(() => {
        if (!isOpen) setQuery('');
    }, [isOpen]);

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[110] bg-primary/95 backdrop-blur-md flex flex-col"
                >
                    <div className="p-8 flex justify-end">
                        <button onClick={onClose} className="p-2 text-textSecondary hover:text-accent hover:rotate-90 transition-all duration-300">
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    <div className="flex-1 flex flex-col items-center px-6">
                        <div className="w-full max-w-2xl">
                            <div className="relative border-b border-tertiary pb-4 mb-12">
                                <SearchIcon className="absolute left-0 top-1 w-5 h-5 text-textSecondary" />
                                <input
                                    autoFocus
                                    type="text"
                                    placeholder="SEARCH OUR COLLECTIONS..."
                                    className="w-full bg-transparent pl-10 text-xl md:text-3xl font-serif outline-none text-textPrimary placeholder:text-textSecondary/50 uppercase tracking-widest focus:border-accent transition-colors"
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 overflow-y-auto max-h-[60vh] pr-4 custom-scrollbar">
                                {results.map((product) => (
                                    <Link
                                        to={`/product/${product.id}`}
                                        key={product.id}
                                        onClick={onClose}
                                        className="flex gap-4 group p-3 rounded bg-secondary/30 hover:bg-secondary/70 border border-transparent hover:border-tertiary transition-all duration-300"
                                    >
                                        <div className="w-20 h-24 bg-secondary overflow-hidden rounded-sm">
                                            <img src={product.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={product.name} />
                                        </div>
                                        <div className="flex flex-col justify-center">
                                            <p className="text-[9px] uppercase tracking-widest text-textSecondary">{product.category}</p>
                                            <h4 className="font-serif italic text-textPrimary group-hover:text-accent transition-colors">{product.name}</h4>
                                            <p className="text-xs mt-1 text-accent">₹{product.price}</p>
                                        </div>
                                    </Link>
                                ))}
                                {query && results.length === 0 && (
                                    <p className="text-sm font-serif italic text-textSecondary">No results found for "{query}"</p>
                                )}
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default SearchOverlay;