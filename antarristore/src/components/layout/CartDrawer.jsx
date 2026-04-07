import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, Plus, Minus, ShoppingCart } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useNavigate } from 'react-router-dom';

const CartDrawer = ({ isOpen, onClose }) => {
    const { cartItems, cartTotal, removeFromCart, updateQuantity } = useCart();
    const navigate = useNavigate();

    const handleCheckout = () => {
        onClose();
        navigate('/checkout');
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
                        onClick={onClose}
                        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[60]"
                    />

                    {/* Drawer */}
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ duration: 0.3, ease: 'easeOut' }}
                        className="fixed right-0 top-0 h-full w-full max-w-sm sm:max-w-md bg-white z-[70] shadow-2xl flex flex-col"
                    >
                        {/* Header */}
                        <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-white">
                            <div className="flex items-center space-x-2 text-slate-800">
                                <ShoppingCart className="w-5 h-5 text-blue-600" />
                                <h2 className="text-lg font-bold">Shopping Cart ({cartItems.length})</h2>
                            </div>
                            <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Items List */}
                        <div className="flex-1 overflow-y-auto p-4 bg-slate-50">
                            {cartItems.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-center">
                                    <div className="w-24 h-24 mb-6 opacity-20">
                                        <ShoppingCart className="w-full h-full text-slate-500" />
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-800 mb-2">Your Cart is Empty</h3>
                                    <p className="text-sm text-slate-500 mb-6 font-medium">Looks like you haven't added anything yet.</p>
                                    <button onClick={onClose} className="px-8 py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-colors shadow-sm">
                                        Start Shopping
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {cartItems.map((item) => (
                                        <div key={`${item.id}-${item.selectedSize}`} className="flex space-x-4 bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                                            <div className="w-20 h-24 shrink-0 rounded-lg overflow-hidden border border-slate-100 bg-slate-50 p-1 flex items-center justify-center">
                                                <img src={item.image} alt={item.name} className="max-w-full max-h-full object-contain" />
                                            </div>
                                            <div className="flex-1 flex flex-col pt-1">
                                                <div className="flex justify-between items-start mb-1">
                                                    <h3 className="text-sm font-bold text-slate-800 line-clamp-2 leading-snug pr-2">{item.name}</h3>
                                                    <button onClick={() => removeFromCart(item.id || item._id)} className="text-slate-400 hover:text-red-500 transition-colors shrink-0 p-1">
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                                <p className="text-xs text-slate-500 font-medium mb-3">
                                                    {item.category} {item.selectedSize ? `| Size: ${item.selectedSize}` : ''}
                                                </p>

                                                <div className="mt-auto flex justify-between items-center">
                                                    <div className="flex items-center border border-slate-200 rounded-md bg-white">
                                                        <button onClick={() => updateQuantity(item.id || item._id, item.quantity - 1)} className="px-2.5 py-1 text-slate-500 hover:bg-slate-50 rounded-l-md transition-colors">
                                                            <Minus className="w-3 h-3" />
                                                        </button>
                                                        <span className="px-3 text-xs font-bold text-slate-800 border-x border-slate-200 min-w-[32px] text-center">{item.quantity}</span>
                                                        <button onClick={() => updateQuantity(item.id || item._id, item.quantity + 1)} className="px-2.5 py-1 text-slate-500 hover:bg-slate-50 rounded-r-md transition-colors">
                                                            <Plus className="w-3 h-3" />
                                                        </button>
                                                    </div>
                                                    <p className="text-base font-extrabold text-slate-900">₹{item.price.toLocaleString('en-IN')}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Footer / Summary */}
                        {cartItems.length > 0 && (
                            <div className="p-5 border-t border-slate-200 bg-white shadow-[0_-4px_10px_rgb(0,0,0,0.03)] z-10">
                                <div className="space-y-3 mb-5">
                                    <div className="flex justify-between text-sm font-medium text-slate-600">
                                        <span>Total Items</span>
                                        <span>{cartItems.reduce((acc, i) => acc + i.quantity, 0)}</span>
                                    </div>
                                    <div className="flex justify-between items-center pt-2 border-t border-slate-100">
                                        <span className="text-base font-bold text-slate-800">Subtotal</span>
                                        <span className="text-xl font-extrabold text-slate-900">₹{cartTotal.toLocaleString('en-IN')}</span>
                                    </div>
                                </div>
                                <button
                                    onClick={handleCheckout}
                                    className="w-full bg-[#facc15] hover:bg-[#eab308] text-slate-900 py-3.5 rounded-xl font-bold text-lg shadow-sm transition-colors flex items-center justify-center gap-2"
                                >
                                    Proceed to Buy
                                </button>
                                <p className="text-xs text-center text-slate-500 mt-3 font-medium">Safe and secure checkout</p>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default CartDrawer;