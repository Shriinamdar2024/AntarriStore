import React from 'react';
import { motion } from 'framer-motion';

const BackgroundDecor = () => {
    return (
        // Use will-change to tell the browser to use the GPU
        <div className="fixed inset-0 -z-50 overflow-hidden bg-[#FBFBF9] pointer-events-none will-change-transform">

            {/* 1. Static Grain (Lightweight PNG instead of SVG Filter) */}
            <div className="absolute inset-0 opacity-[0.03] bg-[url('https://res.cloudinary.com/dzf9v7nkr/image/upload/v1676451163/noise_fllvly.png')]" />

            {/* 2. Simplified Orbs (Reduced blur radius to save memory) */}
            <motion.div
                animate={{
                    x: [0, 30, 0],
                    y: [0, 20, 0],
                }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                className="absolute -top-1/4 -left-1/4 w-[50vw] h-[50vw] rounded-full bg-accent/10 blur-[80px]"
            />

            {/* 3. Static Grid (No animation here keeps it smooth) */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808005_1px,transparent_1px),linear-gradient(to_bottom,#80808005_1px,transparent_1px)] bg-[size:100px_100px]" />

            {/* 4. The Monogram - Keep it static */}
            <div className="absolute top-[15%] left-[5%] text-[12rem] font-serif text-primary/5 select-none opacity-40">
                A
            </div>
        </div>
    );
};

export default BackgroundDecor;