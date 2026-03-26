import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import axios from 'axios';
import ProductCard from "./ProductCard";

const FeaturedProducts = () => {
    const [featuredItems, setFeaturedItems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFeatured = async () => {
            try {
                // Fetching from your Render backend
                const response = await axios.get("http://localhost:5000/api/products/public");                // Only showing the first 3 products for a clean, curated look
                setFeaturedItems(response.data.slice(0, 3));
            } catch (error) {
                console.error("Error fetching featured products:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchFeatured();
    }, []);

    if (loading) return null; // Or a subtle skeleton loader matching your aesthetic

    return (
        /* Using bg-[#FBFBF9] to match your BackgroundDecor exactly */
        <section className="py-32 px-6 bg-[#FBFBF9] relative overflow-hidden">

            {/* --- INTEGRATED BACKGROUND DECOR --- */}
            {/* 1. Static Grain Overlay */}
            <div className="absolute inset-0 opacity-[0.03] bg-[url('https://res.cloudinary.com/dzf9v7nkr/image/upload/v1676451163/noise_fllvly.png')] pointer-events-none" />

            {/* 2. Large Watermark - Matching the 'A' Monogram style */}
            <div className="absolute top-20 -left-10 pointer-events-none select-none">
                <span className="text-[15vw] font-serif text-black/[0.02] leading-none uppercase tracking-tighter">
                    Selected
                </span>
            </div>

            {/* 3. Subtle Gradient Orb - Matching BackgroundDecor blur style */}
            <motion.div
                animate={{
                    x: [0, 20, 0],
                    y: [0, -20, 0]
                }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                className="absolute top-1/4 right-0 w-[50vw] h-[50vw] rounded-full bg-accent/10 blur-[100px] pointer-events-none"
            />

            {/* 4. Fine Grid Pattern - Matching BackgroundDecor [size:100px_100px] */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808005_1px,transparent_1px),linear-gradient(to_bottom,#80808005_1px,transparent_1px)] bg-[size:100px_100px] pointer-events-none" />

            <div className="max-w-7xl mx-auto relative z-10">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-24 gap-8">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                        className="max-w-xl"
                    >
                        <div className="flex items-center space-x-4 mb-6">
                            <motion.div
                                initial={{ width: 0 }}
                                whileInView={{ width: "3rem" }}
                                transition={{ delay: 0.5, duration: 0.8 }}
                                className="h-[1px] bg-accent"
                            />
                            <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-accent">
                                New Arrivals
                            </span>
                        </div>
                        <h2 className="text-6xl md:text-7xl font-serif text-textPrimary leading-[1.1]">
                            The Seasonal <br />
                            <span className="italic font-light text-textSecondary/80">Edit</span>
                        </h2>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.6 }}
                    >
                        <button className="group flex items-center space-x-4 text-[11px] font-bold uppercase tracking-[0.3em] text-textPrimary hover:text-accent transition-all duration-500">
                            <span className="relative">
                                View Full Collection
                                <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-accent group-hover:w-full transition-all duration-500" />
                            </span>
                            <div className="p-3 border border-black/5 rounded-full group-hover:border-accent group-hover:bg-accent group-hover:text-white transition-all duration-500 shadow-sm">
                                <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
                            </div>
                        </button>
                    </motion.div>
                </div>

                {/* Grid Section: Using the same staggered logic as Collections */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-24">
                    {featuredItems.map((product, index) => (
                        <motion.div
                            key={product._id} // Using MongoDB _id
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{
                                duration: 1,
                                delay: index * 0.2,
                                ease: [0.16, 1, 0.3, 1]
                            }}
                            /* Staggered entry matching the Collections layout */
                            className={index === 1 ? "lg:translate-y-20" : ""}
                        >
                            <ProductCard
                                {...product}
                                id={product._id} // Explicitly mapping _id to the id prop
                                index={index}
                            />
                        </motion.div>
                    ))}
                </div>

                {/* Decorative Footer Divider */}
                <div className="mt-48 relative flex justify-center items-center">
                    <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-black/10 to-transparent" />
                    <div className="absolute bg-[#FBFBF9] px-10">
                        <span className="text-[9px] uppercase tracking-[1em] text-textSecondary/60 font-medium">
                            Premium Series
                        </span>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default FeaturedProducts;