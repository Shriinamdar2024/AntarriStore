import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import ProductCard from '../components/products/ProductCard';
import { Heart, Sparkles, ChevronDown, Truck, ChevronLeft, ChevronRight } from 'lucide-react';

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

    const scrollRef = useRef(null);

    useEffect(() => {
        const fetchProductData = async () => {
            setLoading(true);
            try {
                const baseURL = "http://localhost:5000";

                // DEBUG: See exactly what ID is being sent
                console.log("Fetching product with ID:", id);

                if (!id || id === "undefined") {
                    console.error("ID is undefined! Check your Link components.");
                    setProduct(null);
                    return;
                }

                const response = await axios.get(`http://localhost:5000/api/products/${id}`); setProduct(response.data);

                // Fetch related products
                const allRes = await axios.get(`${baseURL}/api/products/public`);
                setAllProducts(allRes.data);

            } catch (error) {
                console.error("Error fetching product details:", error);
                setProduct(null); // Ensure state is cleared on 404
            } finally {
                setLoading(false);
            }
        };

        fetchProductData();
        window.scrollTo(0, 0);
    }, [id]);

    const getExpectedDeliveryDate = (days) => {
        const date = new Date();
        date.setDate(date.getDate() + (days || 3));
        return date.toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };

    const handleBrandChange = (brand) => {
        setSelectedBrand(brand);
        if (product.compatibility) {
            setSelectedModel(product.compatibility[brand][0]);
        }
    };

    const scrollSlider = (direction) => {
        if (scrollRef.current) {
            const { scrollLeft, clientWidth } = scrollRef.current;
            const scrollTo = direction === 'left' ? scrollLeft - clientWidth : scrollLeft + clientWidth;
            scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
        }
    };

    if (loading) {
        return (
            <div className="pt-40 pb-20 text-center min-h-screen bg-white">
                <p className="text-[10px] uppercase tracking-[0.5em] animate-pulse">Retrieving Product Data...</p>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="pt-40 pb-20 text-center min-h-screen bg-white">
                <h2 className="text-2xl font-serif italic text-textPrimary">Product not found.</h2>
                <Link to="/" className="text-[10px] uppercase tracking-widest border-b border-accent mt-4 inline-block text-accent font-bold">Return Home</Link>
            </div>
        );
    }

    const displayImages = product.images && product.images.length > 0
        ? product.images
        : [product.image];

    const currentId = String(product._id || product.id);
    const relatedProducts = allProducts.filter(p => p.category === product.category && String(p._id || p.id) !== currentId).slice(0, 4);
    const relatedAccessories = allProducts.filter(p => p.category === 'Accessories' && String(p._id || p.id) !== currentId).slice(0, 4);

    return (
        <div className="pt-20 bg-white min-h-screen">
            <div className="px-4 md:px-8 lg:px-16 max-w-[1440px] mx-auto">
                <div className="flex flex-col lg:flex-row gap-8 lg:gap-16 py-10">
                    {/* Left: Product Image Slider */}
                    <div className="w-full lg:w-[55%]">
                        <div className="sticky top-28 group">
                            <div
                                ref={scrollRef}
                                className="flex overflow-x-auto snap-x snap-mandatory no-scrollbar bg-primary border border-tertiary h-[50vh] lg:h-[70vh]"
                                style={{ borderRadius: 0 }}
                            >
                                {displayImages.map((img, idx) => (
                                    <div key={idx} className="min-w-full h-full snap-center flex items-center justify-center bg-white">
                                        <img
                                            src={img}
                                            className="w-full h-full object-contain p-6"
                                            alt={`${product.name} view ${idx + 1}`}
                                        />
                                    </div>
                                ))}
                            </div>

                            {displayImages.length > 1 && (
                                <>
                                    <button
                                        onClick={() => scrollSlider('left')}
                                        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 p-2 border border-tertiary opacity-0 group-hover:opacity-100 transition-opacity z-10"
                                    >
                                        <ChevronLeft className="w-5 h-5" />
                                    </button>
                                    <button
                                        onClick={() => scrollSlider('right')}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 p-2 border border-tertiary opacity-0 group-hover:opacity-100 transition-opacity z-10"
                                    >
                                        <ChevronRight className="w-5 h-5" />
                                    </button>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Right: Product Content */}
                    <div className="w-full lg:w-[45%] flex flex-col">
                        <div className="border-b border-gray-100 pb-6 mb-6">
                            <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-accent mb-3">{product.category}</p>
                            <h1 className="text-3xl md:text-4xl font-serif text-textPrimary mb-4 leading-tight">{product.name}</h1>
                            <p className="text-2xl font-bold text-textPrimary italic">₹{product.price.toLocaleString('en-IN')}</p>
                        </div>

                        <div className="space-y-8">
                            {product.colors && product.colors.length > 0 && (
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center">
                                        <span className="text-[11px] uppercase tracking-widest font-extrabold text-textSecondary">Color / {selectedColor}</span>
                                    </div>
                                    <div className="flex gap-2">
                                        {product.colors.map(color => (
                                            <button
                                                key={color.name}
                                                onClick={() => setSelectedColor(color.name)}
                                                className={`w-10 h-10 border transition-all ${selectedColor === color.name ? 'border-accent p-0.5' : 'border-transparent'}`}
                                                style={{ borderRadius: 0 }}
                                            >
                                                <div className="w-full h-full" style={{ backgroundColor: color.hex }} />
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {product.sizes && product.sizes.length > 0 && (
                                <div className="space-y-3">
                                    <div className="flex justify-between">
                                        <span className="text-[11px] uppercase tracking-widest font-extrabold text-textSecondary">Select Size</span>
                                        <button className="text-[10px] uppercase font-bold tracking-widest text-accent border-b border-accent">Size Guide</button>
                                    </div>
                                    <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                                        {product.sizes.map(size => (
                                            <button
                                                key={size}
                                                onClick={() => setSelectedSize(size)}
                                                className={`py-3 text-[12px] font-bold border transition-all ${selectedSize === size ? 'border-accent bg-accent text-white' : 'border-tertiary text-textSecondary hover:border-textPrimary'}`}
                                                style={{ borderRadius: 0 }}
                                            >
                                                {size}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {product.compatibility && (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <span className="text-[11px] uppercase tracking-widest font-extrabold text-textSecondary">Brand</span>
                                        <div className="relative">
                                            <select
                                                value={selectedBrand}
                                                onChange={(e) => handleBrandChange(e.target.value)}
                                                className="w-full bg-primary border border-tertiary py-3 px-4 text-sm appearance-none outline-none focus:border-accent cursor-pointer font-medium"
                                                style={{ borderRadius: 0 }}
                                            >
                                                {Object.keys(product.compatibility).map(brand => (
                                                    <option key={brand} value={brand}>{brand}</option>
                                                ))}
                                            </select>
                                            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-textSecondary pointer-events-none" />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <span className="text-[11px] uppercase tracking-widest font-extrabold text-textSecondary">Model</span>
                                        <div className="relative">
                                            <select
                                                value={selectedModel}
                                                onChange={(e) => setSelectedModel(e.target.value)}
                                                className="w-full bg-primary border border-tertiary py-3 px-4 text-sm appearance-none outline-none focus:border-accent cursor-pointer font-medium"
                                                style={{ borderRadius: 0 }}
                                            >
                                                {product.compatibility[selectedBrand]?.map(model => (
                                                    <option key={model} value={model}>{model}</option>
                                                ))}
                                            </select>
                                            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-textSecondary pointer-events-none" />
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="p-4 bg-primary border border-tertiary flex items-start gap-4" style={{ borderRadius: 0 }}>
                                <Truck className="w-5 h-5 text-accent mt-0.5" />
                                <div>
                                    <p className="text-[10px] uppercase tracking-widest font-extrabold text-textSecondary">Enterprise Shipping</p>
                                    <p className="text-sm font-serif italic text-textPrimary mt-0.5">Estimated delivery by {getExpectedDeliveryDate(product.deliveryDays)}</p>
                                </div>
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    onClick={() => addToCart({ ...product, image: displayImages[0], selectedSize, selectedColor, selectedBrand, selectedModel })}
                                    className="flex-grow bg-textPrimary text-white py-5 text-[11px] font-bold tracking-[0.3em] uppercase hover:bg-zinc-800 transition-colors duration-300"
                                    style={{ borderRadius: 0 }}
                                >
                                    Add to Bag
                                </button>
                                <button
                                    onClick={() => toggleWishlist(product)}
                                    className={`px-6 border transition-all duration-300 flex items-center justify-center ${isInWishlist(product._id || product.id) ? 'bg-red-50 border-red-100 text-red-500' : 'bg-white border-tertiary text-textSecondary hover:border-textPrimary'}`}
                                    style={{ borderRadius: 0 }}
                                >
                                    <Heart className={`w-5 h-5 ${isInWishlist(product._id || product.id) ? 'fill-current' : ''}`} />
                                </button>
                            </div>

                            <div className="space-y-10 pt-10 border-t border-gray-100">
                                <div>
                                    <h4 className="text-[11px] uppercase tracking-widest font-extrabold mb-4 text-textPrimary">The Narrative</h4>
                                    <p className="text-textSecondary font-light leading-relaxed text-[15px]">{product.description}</p>
                                </div>
                                {product.details && (
                                    <div>
                                        <h4 className="text-[11px] uppercase tracking-widest font-extrabold mb-4 text-textPrimary">Specifications</h4>
                                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-6 text-textSecondary font-light text-[14px]">
                                            {product.details.map((detail, i) => (
                                                <li key={i} className="flex items-start">
                                                    <span className="w-1.5 h-1.5 bg-accent mt-1.5 mr-3 shrink-0"></span>
                                                    {detail}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Related Sections */}
            {relatedAccessories.length > 0 && product.category !== 'Accessories' && (
                <section className="px-4 md:px-8 lg:px-16 py-20 bg-primary border-y border-tertiary mt-20">
                    <div className="max-w-[1440px] mx-auto">
                        <div className="flex items-center justify-center gap-4 mb-12">
                            <Sparkles className="w-5 h-5 text-accent" />
                            <h2 className="text-2xl font-serif italic text-textPrimary">Curated Pairings</h2>
                            <Sparkles className="w-5 h-5 text-accent" />
                        </div>
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                            {relatedAccessories.map((p, index) => (
                                <ProductCard key={p._id || p.id} {...p} id={p._id || p.id} index={index} />
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {relatedProducts.length > 0 && (
                <section className="px-4 md:px-8 lg:px-16 py-20">
                    <div className="max-w-[1440px] mx-auto">
                        <h2 className="text-2xl font-serif mb-12 italic text-center text-textPrimary">More from {product.category}</h2>
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                            {relatedProducts.map((p, index) => (
                                <ProductCard key={p._id || p.id} {...p} id={p._id || p.id} index={index} />
                            ))}
                        </div>
                    </div>
                </section>
            )}
        </div>
    );
};

export default ProductDetail;