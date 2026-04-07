import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Flame } from 'lucide-react';
import axios from 'axios';
import ProductCard from './ProductCard'; // Correct path to ProductCard

const Collections = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLatestProducts = async () => {
      try {
        const API_URL = import.meta.env.VITE_API_URL || 'https://antarri-backend.onrender.com';
        const response = await axios.get(`${API_URL}/api/products/public`);

        if (Array.isArray(response.data)) {
          // Take top 4 or 5 newest/featured items
          const latest = response.data.slice(0, 4);
          setProducts(latest);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchLatestProducts();
  }, []);

  if (loading) {
      return (
          <div className="bg-[#f1f3f6] py-20 flex flex-col items-center justify-center gap-4 min-h-[400px]">
              <div className="w-10 h-10 rounded-full border-4 border-slate-200 border-t-accent animate-spin" />
              <p className="text-textSecondary font-medium text-sm animate-pulse">Loading amazing deals...</p>
          </div>
      );
  }

  if (products.length === 0) return null;

  return (
    <div className="bg-[#f1f3f6] pb-16 px-4 md:px-6 lg:px-8">
      <div className="max-w-[1500px] mx-auto">
        
        {/* Amazon/Flipkart White Section Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-black/5 overflow-hidden p-6 md:p-8">
          
          {/* Section Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h2 className="text-2xl md:text-3xl font-bold text-slate-900 leading-none">
                  Trending Top Deals
                </h2>
                <div className="bg-rose-100 text-rose-600 p-1.5 rounded-full animate-bounce">
                    <Flame className="w-5 h-5 fill-current" />
                </div>
              </div>
              <p className="text-slate-500 font-medium text-sm md:text-base">Hurry, grabbing deals at massive discounts!</p>
            </div>
            
            <Link to="/shop">
              <button className="flex items-center justify-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold text-sm transition-colors shadow-sm whitespace-nowrap w-full sm:w-auto">
                View All <ArrowRight className="w-4 h-4" />
              </button>
            </Link>
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            <AnimatePresence>
              {products.map((item, index) => (
                <motion.div
                  key={item._id || item.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <ProductCard 
                    {...item} 
                    id={item._id || item.id} 
                    images={item.images || [item.image]} 
                    index={index} 
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default Collections;