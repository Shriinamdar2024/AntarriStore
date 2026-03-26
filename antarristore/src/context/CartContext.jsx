import React, { createContext, useContext, useState, useMemo, useEffect } from 'react';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const { user } = useAuth();

    const [cartItems, setCartItems] = useState([]);
    const [wishlist, setWishlist] = useState([]);
    const [isCartOpen, setIsCartOpen] = useState(false);

    // Effect 1: Handle Login/Logout State Reset
    useEffect(() => {
        if (user) {
            // If user logs in, load their specific cart from localStorage
            const savedCart = localStorage.getItem(`ant_cart_${user.id}`);
            const savedWishlist = localStorage.getItem(`ant_wishlist_${user.id}`);
            setCartItems(savedCart ? JSON.parse(savedCart) : []);
            setWishlist(savedWishlist ? JSON.parse(savedWishlist) : []);
        } else {
            // If user logs out, clear the current state completely
            setCartItems([]);
            setWishlist([]);
        }
    }, [user]);

    // Effect 2: Persist to user-specific storage keys
    useEffect(() => {
        if (user) {
            localStorage.setItem(`ant_cart_${user.id}`, JSON.stringify(cartItems));
        }
    }, [cartItems, user]);

    useEffect(() => {
        if (user) {
            localStorage.setItem(`ant_wishlist_${user.id}`, JSON.stringify(wishlist));
        }
    }, [wishlist, user]);

    const cartCount = useMemo(() =>
        cartItems.reduce((total, item) => total + item.quantity, 0),
        [cartItems]);

    const cartTotal = useMemo(() => {
        return cartItems.reduce((total, item) => {
            const price = typeof item.price === 'string'
                ? parseFloat(item.price.replace(/,/g, ''))
                : item.price;
            return total + (price * item.quantity);
        }, 0);
    }, [cartItems]);

    const addToCart = (product) => {
        if (!user) {
            alert("Please login to add items to your bag.");
            return;
        }

        setCartItems((prev) => {
            const productId = String(product._id || product.id);
            const exists = prev.find((item) =>
                String(item._id || item.id) === productId && item.selectedSize === product.selectedSize
            );
            if (exists) {
                return prev.map((item) =>
                    (String(item._id || item.id) === productId && item.selectedSize === product.selectedSize)
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            }
            return [...prev, { ...product, quantity: 1 }];
        });
        setIsCartOpen(true);
    };

    const updateQuantity = (id, newQuantity) => {
        const idToUpdate = String(id);
        setCartItems((prev) =>
            prev.map(item => String(item._id || item.id) === idToUpdate ? { ...item, quantity: Math.max(0, newQuantity) } : item)
                .filter(item => item.quantity > 0)
        );
    };

    const removeFromCart = (id) => {
        const idToRemove = String(id);
        setCartItems((prev) => prev.filter((item) => String(item._id || item.id) !== idToRemove));
    };

    const toggleWishlist = (product) => {
        if (!user) {
            alert("Please login to manage your wishlist.");
            return;
        }
        setWishlist((prev) => {
            const productId = String(product._id || product.id);
            const exists = prev.find((item) => String(item._id || item.id) === productId);

            if (exists) {
                return prev.filter((item) => String(item._id || item.id) !== productId);
            }
            return [...prev, product];
        });
    };

    const removeFromWishlist = (id) => {
        const idToCompare = String(id);
        setWishlist((prev) => prev.filter((item) => String(item._id || item.id) !== idToCompare));
    };

    const clearWishlist = () => {
        setWishlist([]);
    };

    const isInWishlist = (id) => {
        const idToCompare = String(id);
        return wishlist.some(item => String(item._id || item.id) === idToCompare);
    }

    return (
        <CartContext.Provider value={{
            cartItems, setCartItems, addToCart, removeFromCart, updateQuantity,
            cartCount, cartTotal, isCartOpen, setIsCartOpen, wishlist,
            toggleWishlist, isInWishlist, removeFromWishlist, clearWishlist
        }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) throw new Error("useCart must be used within a CartProvider");
    return context;
};