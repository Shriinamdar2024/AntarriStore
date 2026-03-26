import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Loader2 } from 'lucide-react';
import axios from 'axios';

const Collections = () => {
  const [dynamicCollections, setDynamicCollections] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLatestProducts = async () => {
      try {
        // FIXED: Using the correct '/public' endpoint from your productRoutes.js
        // Change your axios calls from this:
        // axios.get('http://localhost:5000/api/products/public')

        // To this:
        const API_URL = import.meta.env.VITE_API_URL;
        const response = await axios.get(`${API_URL}/api/products/public`);

        const products = response.data;

        if (Array.isArray(products)) {
          const latest = products
            .slice(0, 4) // Getting the top 4 (already sorted by createdAt: -1 in backend)
            .map((item) => ({
              id: item._id,
              title: item.name,
              description: item.description || "Fluid silhouettes meets timeless elegance.",
              // FIXED: Mapping to your 'images' array from the backend
              image: item.images && item.images.length > 0 ? item.images[0] : "https://via.placeholder.com/1200",
              tag: item.category || "Signature"
            }));
          setDynamicCollections(latest);
        }
      } catch (error) {
        console.error("❌ Error fetching admin products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLatestProducts();
  }, []);

  return (
    <div className="min-h-screen bg-[#FBFBF9] pt-28 pb-16 px-6 sm:px-12 relative overflow-hidden">
      {/* Background Textures */}
      <div className="absolute inset-0 opacity-[0.02] bg-[url('https://res.cloudinary.com/dzf9v7nkr/image/upload/v1676451163/noise_fllvly.png')] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808005_1px,transparent_1px),linear-gradient(to_bottom,#80808005_1px,transparent_1px)] bg-[size:60px_60px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <header className="mb-20 grid grid-cols-1 lg:grid-cols-2 gap-8 items-end">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center space-x-3 mb-4">
              <span className="w-8 h-[1px] bg-accent" />
              <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-accent">Curated Series</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-serif text-textPrimary leading-[0.9]">
              The <span className="italic font-light text-textSecondary/60">Collections</span>
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-textSecondary text-sm font-light leading-relaxed max-w-sm lg:ml-auto border-l border-black/5 pl-6"
          >
            A deliberate study of form, fabric, and silhouette. Exploring the architectural approach to contemporary tailoring.
          </motion.p>
        </header>

        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loader"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="h-[50vh] flex flex-col items-center justify-center space-y-4"
            >
              <Loader2 className="w-8 h-8 animate-spin text-accent/50" />
              <p className="text-[10px] uppercase tracking-widest text-textSecondary">Syncing Gallery...</p>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-20 lg:gap-x-20">
              {dynamicCollections.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: index * 0.1 }}
                  className={`group relative ${index % 2 !== 0 ? 'md:mt-32' : ''}`}
                >
                  <Link to={`/product/${item.id}`}>
                    <div className="relative aspect-[10/13] overflow-hidden rounded-sm bg-stone-100 shadow-xl group-hover:shadow-2xl transition-all duration-700">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover grayscale-[40%] group-hover:grayscale-0 transition-all duration-[1.8s] ease-out group-hover:scale-105"
                      />

                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-40 group-hover:opacity-70 transition-opacity duration-700" />

                      <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-12 text-white">
                        <span className="text-[9px] uppercase tracking-[0.5em] font-bold mb-4 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                          {item.tag}
                        </span>

                        <h3 className="text-3xl md:text-4xl font-serif mb-3 leading-none">
                          {item.title}
                        </h3>

                        <p className="text-xs md:text-sm text-white/60 font-light max-w-[240px] h-0 group-hover:h-auto opacity-0 group-hover:opacity-100 transition-all duration-700 overflow-hidden leading-relaxed">
                          {item.description}
                        </p>

                        <div className="mt-6 flex items-center space-x-3 group-hover:text-accent transition-colors duration-300">
                          <span className="text-[10px] font-bold uppercase tracking-[0.3em] border-b border-white/20 pb-1 group-hover:border-accent">
                            Explore Series
                          </span>
                          <ArrowUpRight className="w-3 h-3 translate-y-0.5 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" />
                        </div>
                      </div>
                    </div>
                  </Link>

                  <div className="absolute -bottom-8 -right-4 md:-right-8 pointer-events-none select-none">
                    <span className="text-[8vw] font-serif text-black/[0.03] italic leading-none group-hover:text-accent/5 transition-colors duration-1000">
                      0{index + 1}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </AnimatePresence>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="mt-48 pt-12 border-t border-black/5 flex flex-col items-center"
        >
          <h2 className="text-2xl font-serif italic text-textPrimary text-center mb-6">
            Timelessness, <span className="text-accent/60">Defined.</span>
          </h2>
          <div className="w-[1px] h-20 bg-gradient-to-b from-accent to-transparent" />
        </motion.div>
      </div>
    </div>
  );
};

export default Collections;