import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import ProductCard from '../components/products/ProductCard';
import { Heart, Sparkles, ChevronDown, Truck, ChevronLeft, ChevronRight, ShieldCheck, Star } from 'lucide-react';

const ProductDetail = () => {
    const { id } = useParams();
    const { addToCart, toggleWishlist, isInWishlist } = useCart();

    const [product, setProduct] = useState(null);
    const [allProducts, setAllProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedSize, setSelectedSize] = useState("");
    const [selectedColor, setSelectedColor] = useState("");
    const [selectedBrand, setSelectedBrand] = useState("");
    const [selectedModel, setSelectedModel] = useState("");
    const [activeImageIndex, setActiveImageIndex] = useState(0);

    const scrollRef = useRef(null);

    useEffect(() => {
        const fetchProductData = async () => {
            setLoading(true);
            try {
                const baseURL = "http://localhost:5000";
                const response = await axios.get(`http://localhost:5000/api/products/${id}`);
                setProduct(response.data);

                const allRes = await axios.get(`${baseURL}/api/products/public`);
                setAllProducts(allRes.data);
            } catch (error) {
                console.error("Error fetching product details:", error);
                setProduct(null);
            } finally {
                setLoading(false);
            }
        };

        fetchProductData();
        window.scrollTo(0, 0);
    }, [id]);

    const handleScroll = () => {
        if (scrollRef.current) {
            const index = Math.round(scrollRef.current.scrollLeft / scrollRef.current.clientWidth);
            setActiveImageIndex(index);
        }
    };

    const scrollSlider = (direction) => {
        if (scrollRef.current) {
            const { scrollLeft, clientWidth } = scrollRef.current;
            const scrollTo = direction === 'left' ? scrollLeft - clientWidth : scrollLeft + clientWidth;
            scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
        }
    };

    const getExpectedDeliveryDate = (days) => {
        const date = new Date();
        date.setDate(date.getDate() + (days || 3));
        return date.toLocaleDateString('en-IN', {
            weekday: 'long', day: 'numeric', month: 'short'
        });
    };

    const handleBrandChange = (brand) => {
        setSelectedBrand(brand);
        if (product.compatibility) {
            setSelectedModel(product.compatibility[brand][0]);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#f1f3f6] flex flex-col items-center justify-center gap-4">
                <div className="w-12 h-12 rounded-full border-4 border-slate-200 border-t-accent animate-spin" />
                <p className="text-textSecondary font-medium animate-pulse mt-4">Loading Product Data...</p>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="pt-40 pb-20 text-center min-h-screen bg-[#f1f3f6]">
                <h2 className="text-2xl font-bold text-textPrimary">Product not found.</h2>
                <Link to="/" className="text-sm border border-accent rounded-lg px-6 py-2 mt-4 inline-block text-accent font-bold hover:bg-accent/10 transition">Return Home</Link>
            </div>
        );
    }

    const displayImages = product.images && product.images.length > 0 ? product.images : [product.image];
    const currentId = String(product._id || product.id);
    const relatedProducts = allProducts.filter(p => p.category === product.category && String(p._id || p.id) !== currentId).slice(0, 4);
    
    // Mock Ratings for Premium Feel
    const rating = 4.8;
    const reviewCount = 2451;
    
    // Derived Pricing
    const originalPrice = Math.round(product.price * 1.35); // 35% markup for strikethrough

    return (
        <div className="pt-24 pb-20 bg-[#f1f3f6] min-h-screen font-sans text-textPrimary">
            <div className="max-w-[1400px] mx-auto px-4 md:px-6 lg:px-8">
                
                {/* Breadcrumbs */}
                <div className="flex items-center gap-2 text-xs text-textSecondary font-medium mb-4 ml-2">
                    <Link to="/" className="hover:text-accent transition-colors">Home</Link>
                    <ChevronRight className="w-3 h-3" />
                    <Link to={product.category === 'Mobile Accessories' ? '/accessories' : '/garments'} className="hover:text-accent transition-colors">{product.category}</Link>
                    <ChevronRight className="w-3 h-3" />
                    <span className="text-textPrimary font-semibold truncate max-w-[200px]">{product.name}</span>
                </div>

                {/* Main Product Container */}
                <div className="bg-white rounded-2xl shadow-sm border border-black/5 overflow-hidden flex flex-col lg:flex-row mb-8">

                    {/* Left: Product Image Slider */}
                    <div className="w-full lg:w-[45%] xl:w-[40%] bg-white border-b lg:border-b-0 lg:border-r border-slate-100 p-6 flex flex-col">
                        <div className="relative w-full rounded-xl overflow-hidden border border-slate-100 mb-4 group h-[400px] sm:h-[500px] md:h-[600px] bg-slate-50 flex-shrink-0 flex items-center justify-center">
                            
                            {/* In-stock Badge */}
                            <div className="absolute top-4 left-4 z-10 bg-emerald-100 text-emerald-700 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider shadow-sm">
                                Pre-verified
                            </div>

                            {/* Main Slider */}
                            <div
                                ref={scrollRef}
                                onScroll={handleScroll}
                                className="flex overflow-x-auto snap-x snap-mandatory h-full w-full no-scrollbar"
                                style={{ msOverflowStyle: 'none', scrollbarWidth: 'none' }}
                            >
                                {displayImages.map((img, idx) => (
                                    <div key={idx} className="min-w-full h-full snap-center relative flex items-center justify-center p-4">
                                        <img
                                            src={img}
                                            alt={`${product.name} ${idx}`}
                                            className="max-w-full max-h-full object-contain transition-transform duration-300 group-hover:scale-105"
                                        />
                                    </div>
                                ))}
                            </div>

                            {/* Floating Navigation Controls */}
                            {displayImages.length > 1 && (
                                <>
                                    <button
                                        onClick={() => scrollSlider('left')}
                                        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 backdrop-blur shadow-md flex items-center justify-center text-slate-800 hover:bg-white hover:scale-110 transition-all z-10 opacity-0 group-hover:opacity-100"
                                    >
                                        <ChevronLeft className="w-5 h-5" />
                                    </button>
                                    <button
                                        onClick={() => scrollSlider('right')}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 backdrop-blur shadow-md flex items-center justify-center text-slate-800 hover:bg-white hover:scale-110 transition-all z-10 opacity-0 group-hover:opacity-100"
                                    >
                                        <ChevronRight className="w-5 h-5" />
                                    </button>
                                </>
                            )}
                        </div>

                        {/* Thumbnail Strip */}
                        {displayImages.length > 1 && (
                            <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
                                {displayImages.map((img, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => {
                                            scrollRef.current.scrollTo({
                                                left: idx * scrollRef.current.clientWidth,
                                                behavior: 'smooth'
                                            });
                                            setActiveImageIndex(idx);
                                        }}
                                        className={`relative shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all duration-300 ${activeImageIndex === idx ? 'border-accent shadow-sm' : 'border-slate-200 hover:border-slate-300'}`}
                                    >
                                        <img src={img} className="w-full h-full object-contain p-1" alt="thumbnail" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Right: Product Content */}
                    <div className="w-full lg:w-[55%] xl:w-[60%] p-6 lg:p-10 flex flex-col">
                        
                        {/* Title & Ratings Header */}
                        <div className="border-b border-slate-100 pb-6 mb-6">
                            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-slate-900 mb-3 leading-tight">
                                {product.name}
                            </h1>
                            
                            <div className="flex items-center flex-wrap gap-4 text-sm mb-4">
                                <div className="flex items-center gap-1 bg-emerald-600 text-white px-2 py-0.5 rounded text-xs font-bold shadow-sm">
                                    {rating} <Star className="w-3 h-3 fill-current" />
                                </div>
                                <span className="text-accent font-medium hover:underline cursor-pointer">{reviewCount.toLocaleString()} Ratings & 350 Reviews</span>
                                <span className="text-slate-300">|</span>
                                <div className="flex items-center gap-1.5 bg-slate-800 text-white px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wide italic">
                                    <ShieldCheck className="w-3 h-3 text-emerald-400" /> PREMIUM ASSURED
                                </div>
                            </div>
                            <span className="text-emerald-600 font-bold text-sm">Special price</span>
                            <div className="flex items-end gap-3 mt-1">
                                <span className="text-3xl md:text-4xl font-extrabold text-slate-900">
                                    ₹{product.price.toLocaleString('en-IN')}
                                </span>
                                <span className="text-lg text-slate-500 font-medium line-through mb-1">
                                    ₹{originalPrice.toLocaleString('en-IN')}
                                </span>
                                <span className="text-emerald-600 font-bold text-lg mb-1">
                                    35% off
                                </span>
                            </div>
                            <p className="text-xs text-textSecondary mt-1">Inclusive of all taxes</p>
                        </div>

                        {/* Order Options */}
                        <div className="space-y-6 mb-8 flex-1">
                            {/* Sizes */}
                            {product.sizes && product.sizes.length > 0 && (
                                <div>
                                    <div className="flex justify-between mb-2">
                                        <span className="text-sm font-bold text-slate-800">Size <span className="text-red-500">*</span></span>
                                        <button className="text-xs font-bold text-accent hover:underline">Size Chart</button>
                                    </div>
                                    <div className="flex flex-wrap gap-3">
                                        {product.sizes.map(size => (
                                            <button
                                                key={size}
                                                onClick={() => setSelectedSize(size)}
                                                className={`px-4 py-2 min-w-[50px] rounded-lg text-sm font-bold border-2 transition-all ${selectedSize === size ? 'border-emerald-500 bg-emerald-50 text-emerald-700 shadow-sm' : 'border-slate-200 text-slate-600 hover:border-slate-300 bg-white'}`}
                                            >
                                                {size}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Colors */}
                            {product.colors && product.colors.length > 0 && (
                                <div>
                                    <span className="text-sm font-bold text-slate-800 block mb-2">Color: <span className="text-slate-500 font-medium">{selectedColor || 'Select'}</span> <span className="text-red-500">*</span></span>
                                    <div className="flex gap-3">
                                        {product.colors.map(color => (
                                            <button
                                                key={color.name}
                                                title={color.name}
                                                onClick={() => setSelectedColor(color.name)}
                                                className={`w-10 h-10 rounded-full border-2 transition-all ${selectedColor === color.name ? 'border-emerald-500 ring-2 ring-emerald-500/20 shadow-sm' : 'border-slate-200 hover:border-slate-400'}`}
                                                style={{ backgroundColor: color.hex }}
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Compatibility (Mobile Covers) */}
                            {product.compatibility && (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <span className="text-sm font-bold text-slate-800 block mb-2">Brand <span className="text-red-500">*</span></span>
                                        <div className="relative">
                                            <select
                                                value={selectedBrand}
                                                onChange={(e) => handleBrandChange(e.target.value)}
                                                className="w-full bg-white border border-slate-300 rounded-lg py-2.5 px-4 text-sm font-medium appearance-none outline-none focus:border-accent focus:ring-2 focus:ring-accent/10 shadow-sm"
                                            >
                                                <option value="" disabled>Select Brand...</option>
                                                {Object.keys(product.compatibility).map(brand => (
                                                    <option key={brand} value={brand}>{brand}</option>
                                                ))}
                                            </select>
                                            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-textSecondary pointer-events-none" />
                                        </div>
                                    </div>
                                    <div>
                                        <span className="text-sm font-bold text-slate-800 block mb-2">Model <span className="text-red-500">*</span></span>
                                        <div className="relative">
                                            <select
                                                value={selectedModel}
                                                onChange={(e) => setSelectedModel(e.target.value)}
                                                disabled={!selectedBrand}
                                                className="w-full bg-white border border-slate-300 rounded-lg py-2.5 px-4 text-sm font-medium appearance-none outline-none focus:border-accent focus:ring-2 focus:ring-accent/10 shadow-sm disabled:bg-slate-50 disabled:text-slate-400"
                                            >
                                                <option value="" disabled>Select Model...</option>
                                                {selectedBrand && product.compatibility[selectedBrand]?.map(model => (
                                                    <option key={model} value={model}>{model}</option>
                                                ))}
                                            </select>
                                            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-textSecondary pointer-events-none" />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="bg-indigo-50/50 border border-indigo-100 rounded-xl p-4 mb-6 flex items-start gap-4 shadow-sm">
                            <div className="bg-white p-2 rounded-lg shadow-sm border border-indigo-100">
                                <Truck className="w-5 h-5 text-indigo-600" />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-indigo-900 mb-0.5">Free Premium Delivery</p>
                                <p className="text-sm text-indigo-700/80 font-medium">Estimated delivery by <span className="font-bold text-indigo-800">{getExpectedDeliveryDate(product.deliveryDays)}</span></p>
                            </div>
                        </div>

                        {/* CTA Buttons - Amazon/Flipkart inspired */}
                        <div className="flex flex-col sm:flex-row gap-4 mb-8">
                            <button
                                onClick={() => addToCart({ ...product, image: displayImages[0], selectedSize, selectedColor, selectedBrand, selectedModel })}
                                className="flex-1 bg-[#facc15] hover:bg-[#eab308] text-zinc-900 py-3.5 rounded-xl font-bold text-lg transition-colors shadow-sm flex items-center justify-center gap-2"
                            >
                                Add to Cart
                            </button>
                            <button
                                className="flex-1 bg-[#fb923c] hover:bg-[#f97316] text-white py-3.5 rounded-xl font-bold text-lg transition-colors shadow-sm flex items-center justify-center gap-2"
                            >
                                Buy Now
                            </button>
                            <button
                                onClick={() => toggleWishlist(product)}
                                className={`w-14 h-14 rounded-xl border flex items-center justify-center shrink-0 transition-colors shadow-sm ${isInWishlist(product._id || product.id) ? 'bg-red-50 border-red-200' : 'bg-white border-slate-200 hover:bg-slate-50'}`}
                            >
                                <Heart className={`w-6 h-6 ${isInWishlist(product._id || product.id) ? 'fill-red-500 stroke-red-500' : 'stroke-slate-600'}`} />
                            </button>
                        </div>

                        {/* Details Accordion style view */}
                        <div className="border border-slate-200 rounded-xl overflow-hidden bg-white">
                            <div className="p-4 border-b border-slate-200 bg-slate-50 font-bold text-slate-800 text-sm uppercase tracking-wide">
                                Product Details & Specifications
                            </div>
                            <div className="p-6">
                                <p className="text-sm text-slate-600 leading-relaxed max-w-none">
                                    {product.description}
                                </p>
                                {product.details && product.details.length > 0 && (
                                    <ul className="mt-6 space-y-2">
                                        {product.details.map((detail, i) => (
                                            <li key={i} className="flex items-start gap-3 text-sm text-slate-700">
                                                <div className="w-1.5 h-1.5 rounded-full bg-slate-300 mt-1.5 shrink-0" />
                                                <span className="font-medium">{detail}</span>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        </div>

                    </div>
                </div>

                {/* Related Products Grid */}
                {relatedProducts.length > 0 && (
                    <div className="bg-white rounded-2xl shadow-sm border border-black/5 p-6 md:p-8">
                        <div className="flex items-center gap-2 mb-8">
                            <h2 className="text-xl md:text-2xl font-bold text-slate-900 border-b-2 border-emerald-500 pb-1 inline-block">Similar Products</h2>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            {relatedProducts.map((p, index) => (
                                <ProductCard key={p._id || p.id} {...p} id={p._id || p.id} index={index} />
                            ))}
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};

export default ProductDetail;