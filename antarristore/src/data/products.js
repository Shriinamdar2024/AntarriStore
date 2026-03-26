export const products = [
    {
        id: '1',
        name: 'Classic Linen Shirt',
        price: '2,499',
        category: 'Menswear',
        image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?q=80&w=1200',
        description: 'Crafted from the finest Italian linen, this shirt offers unparalleled breathability and a relaxed yet refined silhouette.',
        details: ['100% Organic Linen', 'Mother of pearl buttons', 'Relaxed fit', 'Made in India']
    },
    {
        id: '2',
        name: 'Silk Slip Dress',
        price: '4,200',
        category: 'Womenswear',
        image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=1200',
        description: 'A timeless silhouette cut from heavy-weight mulberry silk. Designed to drape elegantly over the body.',
        details: ['100% Mulberry Silk', 'Adjustable straps', 'Bias cut', 'Dry clean only']
    },
    {
        id: '3',
        name: 'Sculptural Gold Hoop',
        price: '1,850',
        category: 'Accessories',
        image: 'https://images.unsplash.com/photo-1535633302704-b02f4faad747?q=80&w=1200',
        description: 'Hand-cast recycled gold hoops with a textured, organic finish. A modern staple for everyday wear.',
        details: ['18k Gold Plated', 'Recycled Brass base', 'Hypoallergenic', 'Lightweight']
    },
    {
        id: "101",
        name: "Lithos Titanium Case",
        price: 7999,
        category: "Accessories",
        type: "case",
        image: "https://images.unsplash.com/photo-1603313011101-31c726a5418a?q=80&w=800",
        description: "A precision-engineered titanium case for maximum protection.",
        details: ["Grade 5 Titanium", "MagSafe Compatible", "Suede Interior"],
        // Grouped compatibility for the dependent filter
        compatibility: {
            "Apple": ["iPhone 16 Pro", "iPhone 16 Pro Max", "iPhone 15 Pro"],
            "Samsung": ["Galaxy S24 Ultra", "Galaxy S23 Ultra"],
            "Google": ["Pixel 9 Pro", "Pixel 8 Pro"]
        }
    },
    {
        id: "102",
        name: "Noir MagSafe Wallet",
        price: 5499,
        category: "Accessories",
        subCategory: "Cases",
        image: "https://images.unsplash.com/photo-1625772299848-391b6a87d7b3?q=80&w=800",
        description: "Elegant leather wallet with strong magnetic attachment.",
        details: ["Top-grain Leather", "Holds 3 cards", "RFID Shielding"]
    }
];