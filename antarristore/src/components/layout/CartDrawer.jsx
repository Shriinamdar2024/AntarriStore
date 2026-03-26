import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag, Trash2, Plus, Minus } from 'lucide-react';
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
                        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60]"
                    />

                    {/* Drawer */}
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ duration: 0.5, ease: [0.25, 1, 0.5, 1] }}
                        className="fixed right-0 top-0 h-full w-full max-w-md bg-primary z-[70] shadow-2xl flex flex-col border-l border-tertiary"
                        style={{ borderRadius: 0 }}
                    >
                        {/* Header */}
                        <div className="p-6 border-b border-tertiary flex justify-between items-center bg-secondary">
                            <div className="flex items-center space-x-2 text-textPrimary">
                                <ShoppingBag className="w-4 h-4 text-accent" />
                                <h2 className="text-xs uppercase tracking-[0.2em] font-semibold">Your Bag</h2>
                            </div>
                            <button onClick={onClose} className="p-2 text-textSecondary hover:text-accent hover:rotate-90 transition-all duration-300">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Items List */}
                        <div className="flex-1 overflow-y-auto p-6 bg-primary no-scrollbar">
                            {cartItems.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-center">
                                    <p className="text-textSecondary font-serif italic mb-4">Your bag is empty</p>
                                    <button onClick={onClose} className="text-[10px] uppercase tracking-widest border-b border-accent text-accent pb-1 hover:text-textPrimary transition-colors duration-300">Continue Shopping</button>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    {cartItems.map((item) => (
                                        <div key={`${item.id}-${item.selectedSize}`} className="flex space-x-4 group bg-secondary/30 p-3 border border-tertiary" style={{ borderRadius: 0 }}>
                                            <div className="w-20 h-24 bg-secondary shrink-0 overflow-hidden border border-tertiary">
                                                <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                            </div>
                                            <div className="flex-1 flex flex-col justify-between py-0.5">
                                                <div>
                                                    <div className="flex justify-between items-start">
                                                        <h3 className="text-[11px] uppercase tracking-widest font-bold text-textPrimary truncate max-w-[180px]">{item.name}</h3>
                                                        <button onClick={() => removeFromCart(item.id)} className="text-textSecondary hover:text-red-500 transition-colors">
                                                            <Trash2 className="w-3.5 h-3.5" />
                                                        </button>
                                                    </div>
                                                    <p className="text-[9px] text-textSecondary uppercase mt-1 tracking-wider">
                                                        {item.category} {item.selectedSize ? `| Size: ${item.selectedSize}` : ''}
                                                    </p>
                                                </div>

                                                <div className="flex justify-between items-center">
                                                    {/* Quantity Controls */}
                                                    <div className="flex items-center border border-tertiary bg-primary">
                                                        <button
                                                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                            className="px-2 py-1 hover:bg-tertiary transition-colors"
                                                        >
                                                            <Minus className="w-2.5 h-2.5" />
                                                        </button>
                                                        <span className="px-2 text-[10px] font-bold min-w-[20px] text-center">{item.quantity}</span>
                                                        <button
                                                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                            className="px-2 py-1 hover:bg-tertiary transition-colors"
                                                        >
                                                            <Plus className="w-2.5 h-2.5" />
                                                        </button>
                                                    </div>
                                                    <p className="text-sm font-bold text-textPrimary">₹{item.price.toLocaleString('en-IN')}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Footer / Summary */}
                        {cartItems.length > 0 && (
                            <div className="p-8 border-t border-tertiary bg-secondary">
                                <div className="flex justify-between mb-2">
                                    <span className="text-[10px] uppercase tracking-widest text-textSecondary font-bold">Subtotal</span>
                                    <span className="text-sm font-bold text-textPrimary">₹{cartTotal.toLocaleString('en-IN')}</span>
                                </div>
                                <p className="text-[9px] text-textSecondary mb-6 uppercase tracking-wider italic">Shipping & taxes calculated at checkout</p>
                                <button
                                    onClick={handleCheckout}
                                    className="w-full bg-textPrimary text-white py-4 text-[10px] tracking-[0.3em] font-bold uppercase hover:bg-accent transition-all duration-300"
                                    style={{ borderRadius: 0 }}
                                >
                                    Proceed to Checkout
                                </button>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default CartDrawer;