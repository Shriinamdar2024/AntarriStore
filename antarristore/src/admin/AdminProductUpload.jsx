import React, { useState, useRef } from 'react';
import axios from 'axios';
import { Smartphone, Shirt, Image as ImageIcon, CheckCircle, Package, ArrowRight, X, Upload, Plus, Tablet, Zap, Headphones, Battery, AlignLeft, Loader2 } from 'lucide-react';

// Data for Mobile Case Brands and Models
const DEVICE_DATA = {
    "Apple": [
        "iPhone 15 Pro Max", "iPhone 15 Pro", "iPhone 15 Plus", "iPhone 15",
        "iPhone 14 Pro Max", "iPhone 14 Pro", "iPhone 14 Plus", "iPhone 14",
        "iPhone 13 Pro Max", "iPhone 13 Pro", "iPhone 13", "iPhone 13 Mini",
        "iPhone 12 Pro Max", "iPhone 12 Pro", "iPhone 12", "iPhone 11"
    ],
    "Samsung": [
        "Galaxy S24 Ultra", "Galaxy S24+", "Galaxy S24",
        "Galaxy S23 Ultra", "Galaxy S23+", "Galaxy S23",
        "Galaxy Z Fold 5", "Galaxy Z Flip 5",
        "Galaxy A54 5G", "Galaxy A34 5G", "Galaxy M54"
    ],
    "Google": ["Pixel 8 Pro", "Pixel 8", "Pixel 7 Pro", "Pixel 7", "Pixel 7a"],
    "OnePlus": ["OnePlus 12", "OnePlus 12R", "OnePlus 11", "OnePlus 11R", "OnePlus Nord 3"]
};

const AdminProductUpload = () => {
    const [step, setStep] = useState(1);
    const [category, setCategory] = useState(null);
    const [subCategory, setSubCategory] = useState('');
    const [description, setDescription] = useState('');
    const [selectedImages, setSelectedImages] = useState([]);
    const [imageFiles, setImageFiles] = useState([]); // Store actual File objects

    // Submission States
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    // Mobile Case Specific State
    const [selectedBrand, setSelectedBrand] = useState('');
    const [selectedModel, setSelectedModel] = useState('');

    const [selectedSizes, setSelectedSizes] = useState([]);
    const [selectedColors, setSelectedColors] = useState([]);
    const [newColorName, setNewColorName] = useState('');
    const [newColorHex, setNewColorHex] = useState('#000000');

    const fileInputRef = useRef(null);
    const formRef = useRef(null);
    const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

    const toggleSize = (size) => {
        setSelectedSizes(prev => prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]);
    };

    const addCustomColor = () => {
        if (!newColorName.trim()) return;
        if (!selectedColors.find(c => c.name.toLowerCase() === newColorName.toLowerCase())) {
            setSelectedColors([...selectedColors, { name: newColorName, hex: newColorHex }]);
            setNewColorName('');
        }
    };

    const removeColor = (index) => {
        setSelectedColors(prev => prev.filter((_, i) => i !== index));
    };

    const startUpload = (cat) => {
        setCategory(cat);
        setStep(2);
        setSubCategory('');
        setSelectedBrand('');
        setSelectedModel('');
    };

    const handleImageClick = () => fileInputRef.current.click();

    const handleFileChange = (event) => {
        const files = Array.from(event.target.files);
        if (files.length > 0) {
            const newImageUrls = files.map(file => URL.createObjectURL(file));
            setSelectedImages(prev => [...prev, ...newImageUrls]);
            setImageFiles(prev => [...prev, ...files]);
        }
        event.target.value = null;
    };

    const removeImage = (index, e) => {
        e.stopPropagation();
        setSelectedImages(prev => prev.filter((_, i) => i !== index));
        setImageFiles(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (imageFiles.length === 0) {
            alert("Please upload at least one image.");
            return;
        }

        setIsSubmitting(true);
        const formData = new FormData();

        // Basic Fields
        formData.append('name', e.target[0].value);
        formData.append('price', e.target[1].value);
        formData.append('description', description);
        formData.append('category', category);
        formData.append('subCategory', subCategory);

        // Conditional Metadata based on Category
        const metadata = {
            colors: selectedColors,
            sizes: selectedSizes,
            brand: selectedBrand,
            model: selectedModel,
            fabric: e.target.elements['fabric']?.value || '',
            fit: e.target.elements['fit']?.value || '',
            material: e.target.elements['material']?.value || ''
        };
        formData.append('metadata', JSON.stringify(metadata));

        // Append Images (matches upload.single('image') or upload.array('image'))
        // If your backend uses upload.single('image'), only the first one is sent
        imageFiles.forEach((file) => {
            formData.append('image', file);
        });

        try {
            // Using the live Render URL if available, otherwise localhost
            const baseURL = window.location.hostname === 'localhost'
                ? 'https://antarri-backend.onrender.com'
                : 'https://shrirupportfolio.onrender.com'; // Based on your project history

            await axios.post(`${baseURL}/api/products/add`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            setIsSuccess(true);
            setTimeout(() => {
                setIsSuccess(false);
                setStep(1);
                setSelectedImages([]);
                setImageFiles([]);
                setSelectedColors([]);
                setSelectedSizes([]);
                setDescription('');
            }, 3000);
        } catch (err) {
            console.error("Upload Error:", err);
            alert(err.response?.data?.message || "Critical error during product synchronization.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (step === 1) {
        return (
            <div className="h-full flex flex-col justify-center animate-in fade-in duration-700">
                <div className="text-center mb-12">
                    <span className="text-[10px] uppercase tracking-[0.5em] text-accent font-bold">Step 01</span>
                    <h2 className="text-5xl font-serif mt-4 uppercase text-textPrimary font-bold">What are you <br /><span className="italic opacity-50 text-4xl font-normal">Listing today?</span></h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto w-full px-4 font-bold">
                    <button onClick={() => startUpload('Clothing')} className="p-12 bg-white rounded-[2.5rem] border border-black/5 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all flex flex-col items-center group">
                        <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-3xl flex items-center justify-center mb-6 group-hover:bg-black group-hover:text-white transition-all">
                            <Shirt size={32} />
                        </div>
                        <span className="text-xs font-bold uppercase tracking-[0.3em] text-textPrimary">Clothing</span>
                    </button>
                    <button onClick={() => startUpload('Mobile Accessories')} className="p-12 bg-white rounded-[2.5rem] border border-black/5 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all flex flex-col items-center group">
                        <div className="w-20 h-20 bg-orange-50 text-orange-600 rounded-3xl flex items-center justify-center mb-6 group-hover:bg-black group-hover:text-white transition-all">
                            <Smartphone size={32} />
                        </div>
                        <span className="text-xs font-bold uppercase tracking-[0.3em] text-textPrimary"> Accessories</span>
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="animate-in slide-in-from-right-10 duration-500 relative">
            {/* Success Popup */}
            {isSuccess && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm animate-in fade-in zoom-in duration-300">
                    <div className="bg-white p-12 rounded-[3rem] shadow-2xl border border-black/5 flex flex-col items-center text-center">
                        <div className="w-20 h-20 bg-green-50 text-green-500 rounded-full flex items-center justify-center mb-6 animate-bounce">
                            <CheckCircle size={48} />
                        </div>
                        <h3 className="text-2xl font-serif uppercase font-bold tracking-tight text-textPrimary">Upload Successful</h3>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mt-2">Your product is now live in the store.</p>
                    </div>
                </div>
            )}

            <header className="flex justify-between items-center mb-12 pb-8 border-b border-black/5">
                <div>
                    <button onClick={() => { setStep(1); setSelectedImages([]); setSelectedColors([]); }} className="text-[9px] font-bold uppercase tracking-widest text-slate-400 hover:text-black mb-2 flex items-center gap-2 transition-colors">
                        <ArrowRight size={12} className="rotate-180" /> Change Category
                    </button>
                    <h2 className="text-2xl font-serif uppercase tracking-tight text-textPrimary font-bold">Adding {category}</h2>
                </div>
            </header>

            <form ref={formRef} className="grid grid-cols-1 lg:grid-cols-3 gap-12" onSubmit={handleSubmit}>
                <div className="lg:col-span-2 space-y-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-3">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">Product Title</label>
                            <input required type="text" name="name" placeholder="GIVE IT A NAME..." className="w-full bg-transparent border-b border-black/10 py-4 outline-none focus:border-black transition-all text-xs tracking-widest uppercase font-bold" />
                        </div>
                        <div className="space-y-3">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">Retail Price (INR)</label>
                            <input required type="number" name="price" placeholder="00.00" className="w-full bg-transparent border-b border-black/10 py-4 outline-none focus:border-black transition-all text-xs font-bold" />
                        </div>
                    </div>

                    <div className="space-y-3">
                        <div className="flex justify-between items-center ml-1">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 flex items-center gap-2">
                                <AlignLeft size={14} /> Detailed Description
                            </label>
                            <span className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">{description.length} / 1000 Characters</span>
                        </div>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            maxLength={1000}
                            placeholder="TELL YOUR CUSTOMERS ABOUT THE FABRIC, FIT, OR TECH SPECS..."
                            className="w-full min-h-[150px] bg-white border border-black/5 rounded-2xl p-6 text-xs leading-relaxed outline-none focus:border-black/20 transition-all resize-none shadow-sm"
                        ></textarea>
                    </div>

                    <div className="p-10 bg-gray-50 rounded-[2rem] space-y-8 border border-black/5">
                        <div className="flex justify-between items-center">
                            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-textPrimary font-bold">{category} Specifications</h3>
                            {category === 'Mobile Accessories' && (
                                <select
                                    value={subCategory}
                                    onChange={(e) => { setSubCategory(e.target.value); setSelectedBrand(''); setSelectedModel(''); }}
                                    className="bg-white border border-black/5 rounded-lg px-4 py-2 text-[10px] font-bold uppercase tracking-widest outline-none shadow-sm focus:border-accent"
                                >
                                    <option value="">SELECT PRODUCT TYPE</option>
                                    <option value="Mobile Case">Mobile Case</option>
                                    <option value="Charger">Charger</option>
                                    <option value="Cables">Cables</option>
                                    <option value="Earbuds">Earbuds</option>
                                    <option value="Powerbank">Powerbank</option>
                                </select>
                            )}
                        </div>

                        <div className="grid grid-cols-1 gap-8">
                            {category === 'Clothing' ? (
                                <>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 font-bold">
                                        <div className="space-y-3">
                                            <label className="text-[9px] font-bold uppercase tracking-widest text-slate-400 ml-1">Fabric Material</label>
                                            <input name="fabric" type="text" placeholder="E.G. 100% ORGANIC COTTON" className="w-full bg-transparent border-b border-black/10 py-2 outline-none text-[10px] font-bold uppercase tracking-widest" />
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-[9px] font-bold uppercase tracking-widest text-slate-400 ml-1">Fit Profile</label>
                                            <select name="fit" className="w-full bg-transparent border-b border-black/10 py-2 outline-none text-[10px] font-bold uppercase tracking-widest cursor-pointer">
                                                <option>Oversized Fit</option>
                                                <option>Regular Fit</option>
                                                <option>Slim Fit</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="space-y-4 font-bold">
                                        <label className="text-[9px] font-bold uppercase tracking-widest text-slate-400 ml-1">Available Sizes</label>
                                        <div className="flex flex-wrap gap-3">
                                            {sizes.map(size => (
                                                <button key={size} type="button" onClick={() => toggleSize(size)} className={`px-6 py-3 rounded-xl border text-[10px] font-bold transition-all ${selectedSizes.includes(size) ? 'bg-black text-white border-black shadow-lg shadow-black/10 scale-105' : 'bg-white text-slate-400 border-black/5 hover:border-black/20'}`}>{size}</button>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="space-y-4 font-bold">
                                        <label className="text-[9px] font-bold uppercase tracking-widest text-slate-400 ml-1">Add Product Colors</label>
                                        <div className="flex gap-4 items-end mb-6">
                                            <div className="space-y-2 flex-grow">
                                                <input type="text" value={newColorName} onChange={(e) => setNewColorName(e.target.value)} placeholder="COLOR NAME (E.G. MIDNIGHT BLUE)" className="w-full bg-transparent border-b border-black/10 py-2 outline-none text-[10px] font-bold uppercase tracking-widest" />
                                            </div>
                                            <div className="flex items-center gap-3 bg-white border border-black/5 rounded-xl px-3 py-1.5 shadow-sm">
                                                <input type="color" value={newColorHex} onChange={(e) => setNewColorHex(e.target.value)} className="w-6 h-6 rounded-md cursor-pointer border-none bg-transparent" />
                                                <span className="text-[9px] font-mono text-slate-400 uppercase">{newColorHex}</span>
                                            </div>
                                            <button type="button" onClick={addCustomColor} className="bg-black text-white p-2.5 rounded-xl hover:bg-accent transition-all active:scale-95">
                                                <Plus size={18} />
                                            </button>
                                        </div>
                                        <div className="flex flex-wrap gap-4">
                                            {selectedColors.map((color, index) => (
                                                <div key={index} className="flex items-center gap-3 px-4 py-2 rounded-full border bg-white border-black ring-1 ring-black animate-in zoom-in-50 duration-300">
                                                    <div className="w-4 h-4 rounded-full border border-black/10 shadow-inner" style={{ backgroundColor: color.hex }} />
                                                    <span className="text-[9px] font-bold uppercase tracking-widest text-black">{color.name}</span>
                                                    <button type="button" onClick={() => removeColor(index)} className="text-slate-300 hover:text-red-500 transition-colors"><X size={12} /></button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <div className="grid grid-cols-1 gap-8 animate-in slide-in-from-top-2 font-bold">
                                    {subCategory === 'Mobile Case' ? (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            <div className="space-y-3">
                                                <label className="text-[9px] font-bold uppercase tracking-widest text-slate-400 ml-1">Device Brand</label>
                                                <select
                                                    value={selectedBrand}
                                                    onChange={(e) => { setSelectedBrand(e.target.value); setSelectedModel(''); }}
                                                    className="w-full bg-transparent border-b border-black/10 py-2 outline-none text-[10px] font-bold uppercase tracking-widest font-bold"
                                                >
                                                    <option value="">SELECT BRAND</option>
                                                    {Object.keys(DEVICE_DATA).map(brand => <option key={brand} value={brand}>{brand}</option>)}
                                                </select>
                                            </div>
                                            <div className="space-y-3">
                                                <label className="text-[9px] font-bold uppercase tracking-widest text-slate-400 ml-1">Device Model</label>
                                                <select
                                                    disabled={!selectedBrand}
                                                    value={selectedModel}
                                                    onChange={(e) => setSelectedModel(e.target.value)}
                                                    className="w-full bg-transparent border-b border-black/10 py-2 outline-none text-[10px] font-bold uppercase tracking-widest font-bold disabled:opacity-30"
                                                >
                                                    <option value="">SELECT MODEL</option>
                                                    {selectedBrand && DEVICE_DATA[selectedBrand].map(model => <option key={model} value={model}>{model}</option>)}
                                                </select>
                                            </div>
                                            <div className="space-y-3 md:col-span-2">
                                                <label className="text-[9px] font-bold uppercase tracking-widest text-slate-400 ml-1">Case Material</label>
                                                <input name="material" type="text" placeholder="E.G. SILICONE / LEATHER" className="w-full bg-transparent border-b border-black/10 py-2 outline-none text-[10px] font-bold uppercase tracking-widest font-bold" />
                                            </div>
                                        </div>
                                    ) : subCategory !== '' ? (
                                        <div className="py-10 text-center border-2 border-dashed border-black/5 rounded-2xl bg-white/50">
                                            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Add detailed specs for this {subCategory} in the description box above</p>
                                        </div>
                                    ) : (
                                        <div className="py-10 text-center border-2 border-dashed border-black/5 rounded-2xl">
                                            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-300 italic">Please select a product type above</p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="space-y-8">
                    <div className="space-y-4">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">Product Media ({selectedImages.length})</label>
                        <div onClick={handleImageClick} className="aspect-[4/5] bg-white border border-black/5 rounded-[2.5rem] flex flex-col items-center justify-center group cursor-pointer hover:border-accent transition-all relative overflow-hidden shadow-sm">
                            <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-accent/10 transition-colors">
                                <ImageIcon className="text-slate-300 group-hover:text-accent transition-colors" size={32} />
                            </div>
                            <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-slate-400 group-hover:text-accent transition-colors">Add New Image</span>
                        </div>
                        {selectedImages.length > 0 && (
                            <div className="grid grid-cols-3 gap-3">
                                {selectedImages.map((img, index) => (
                                    <div key={index} className="aspect-square relative rounded-xl overflow-hidden border border-black/5 group">
                                        <img src={img} alt={`Preview ${index}`} className="w-full h-full object-cover" />
                                        <button type="button" onClick={(e) => removeImage(index, e)} className="absolute top-1 right-1 bg-black/60 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"><X size={12} /></button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" multiple />

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`w-full py-6 rounded-[1.5rem] text-[10px] font-bold uppercase tracking-[0.4em] transition-all shadow-xl flex items-center justify-center gap-3 active:scale-95 ${isSubmitting ? 'bg-slate-200 text-slate-400 cursor-not-allowed' : 'bg-textPrimary text-white hover:bg-accent'}`}
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 size={16} className="animate-spin" /> Processing...
                            </>
                        ) : (
                            <>
                                <CheckCircle size={16} /> Finalize & Publish
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AdminProductUpload;