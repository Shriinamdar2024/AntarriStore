import React, { useState } from 'react';
import { Printer, Download, ArrowLeft, Edit3, Save } from 'lucide-react';
import html2pdf from 'html2pdf.js';

const AdminInvoice = ({ order, onBack }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [adminDetails, setAdminDetails] = useState({
        company: "AntarriStore Sangli",
        address: "123 Enterprise Hub, Phase 3, Hinjewadi, Pune, MH - 411057",
        gstin: "27AAAAA0000A1Z5",
        email: "shriinamdar88@gmail.com"
    });

    // Helper: Convert Number to Words (Simple version for Invoice)
    const numberToWords = (num) => {
        const a = ['', 'One ', 'Two ', 'Three ', 'Four ', 'Five ', 'Six ', 'Seven ', 'Eight ', 'Nine ', 'Ten ', 'Eleven ', 'Twelve ', 'Thirteen ', 'Fourteen ', 'Fifteen ', 'Sixteen ', 'Seventeen ', 'Eighteen ', 'Nineteen '];
        const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

        const makeWords = (n) => {
            if (n < 20) return a[n];
            if (n < 100) return b[Math.floor(n / 10)] + (n % 10 !== 0 ? " " + a[n % 10] : "");
            if (n < 1000) return a[Math.floor(n / 100)] + "Hundred " + (n % 100 !== 0 ? "and " + makeWords(n % 100) : "");
            if (n < 100000) return makeWords(Math.floor(n / 1000)) + "Thousand " + (n % 1000 !== 0 ? makeWords(n % 1000) : "");
            return n;
        };
        return makeWords(Math.floor(num)) + "Rupees Only";
    };

    // Calculations based on order data
    const subTotal = order.totalPrice ? (order.totalPrice / 1.18) : 0;
    const taxAmount = order.totalPrice - subTotal;
    const cgst = taxAmount / 2;
    const sgst = taxAmount / 2;

    const handleDownloadPDF = () => {
        const element = document.getElementById('invoice-sheet');
        const opt = {
            margin: 0,
            filename: `Invoice_${order.orderId || order._id}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2, useCORS: true, letterRendering: true },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
        };
        html2pdf().from(element).set(opt).save();
    };

    return (
        <div className="max-w-5xl mx-auto py-10 px-4 animate-in fade-in duration-500 bg-slate-50/50 min-h-screen">
            {/* Control Bar */}
            <div className="flex justify-between items-center mb-8 no-print bg-white p-6 rounded-2xl border border-black/5 shadow-sm">
                <button onClick={onBack} className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-black transition-all">
                    <ArrowLeft size={14} /> Return to Orders
                </button>
                <div className="flex gap-3">
                    <button
                        onClick={() => setIsEditing(!isEditing)}
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${isEditing ? 'bg-green-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                    >
                        {isEditing ? <><Save size={14} /> Save Header</> : <><Edit3 size={14} /> Edit Admin Info</>}
                    </button>
                    <button onClick={handleDownloadPDF} className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-blue-700 transition-all shadow-md">
                        <Download size={14} /> Download PDF
                    </button>
                    <button onClick={() => window.print()} className="flex items-center gap-2 px-5 py-2.5 bg-black text-white rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-slate-800 transition-all shadow-md">
                        <Printer size={14} /> Print
                    </button>
                </div>
            </div>

            <div id="invoice-sheet" className="bg-white p-12 shadow-sm border border-black/5 mx-auto w-[210mm] min-h-[297mm] font-sans text-slate-900 print:shadow-none print:border-none">
                {/* Header Section */}
                <div className="flex justify-between items-start mb-12 border-b-4 border-black pb-8">
                    <div className="space-y-1">
                        {isEditing ? (
                            <div className="space-y-2 w-80">
                                <input className="block text-xl font-bold uppercase border border-blue-200 p-1 w-full outline-none" value={adminDetails.company} onChange={(e) => setAdminDetails({ ...adminDetails, company: e.target.value })} />
                                <textarea className="block text-[10px] border border-blue-200 p-1 w-full outline-none" rows="2" value={adminDetails.address} onChange={(e) => setAdminDetails({ ...adminDetails, address: e.target.value })} />
                                <input className="block text-[10px] border border-blue-200 p-1 w-full outline-none" value={adminDetails.gstin} onChange={(e) => setAdminDetails({ ...adminDetails, gstin: e.target.value })} />
                            </div>
                        ) : (
                            <>
                                <h1 className="text-2xl font-black uppercase tracking-tighter">{adminDetails.company}</h1>
                                <p className="text-[11px] leading-relaxed text-slate-500 max-w-sm font-medium">{adminDetails.address}</p>
                                <div className="pt-2 text-[10px] font-bold uppercase tracking-widest text-slate-700">
                                    GSTIN: <span className="text-black">{adminDetails.gstin}</span>
                                </div>
                            </>
                        )}
                    </div>
                    <div className="text-right">
                        <h2 className="text-4xl font-black uppercase tracking-tighter text-slate-200 mb-2">TAX INVOICE</h2>
                        <table className="ml-auto text-[10px] font-bold uppercase tracking-widest">
                            <tbody>
                                <tr>
                                    <td className="text-slate-400 pr-4 py-1">Invoice No:</td>
                                    <td>{order.orderId || order._id?.slice(-6).toUpperCase()}</td>
                                </tr>
                                <tr>
                                    <td className="text-slate-400 pr-4 py-1">Date:</td>
                                    <td>{new Date(order.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Billing Details */}
                <div className="grid grid-cols-2 gap-12 mb-12">
                    <div className="p-6 bg-slate-50 rounded-sm">
                        <h4 className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-400 mb-3 border-b border-slate-200 pb-2">Billed To (Customer)</h4>
                        <p className="text-sm font-bold uppercase mb-1">{order.user?.name || "Guest Customer"}</p>
                        <p className="text-[10px] leading-relaxed text-slate-500 font-medium uppercase">
                            {order.shippingAddress?.address}, {order.shippingAddress?.city}<br />
                            {order.shippingAddress?.postalCode}, {order.shippingAddress?.country}<br />
                            <span className="font-bold text-slate-700">Contact: {order.user?.email}</span>
                        </p>
                    </div>
                    <div className="p-6 bg-slate-50 rounded-sm">
                        <h4 className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-400 mb-3 border-b border-slate-200 pb-2">Shipping Details</h4>
                        <p className="text-[10px] font-bold uppercase text-slate-700 mb-1">Method: {order.paymentMethod || 'Online Payment'}</p>
                        <p className="text-[10px] font-bold uppercase text-slate-700">Status: {order.status}</p>
                    </div>
                </div>

                {/* Items Table */}
                <table className="w-full mb-10 border-collapse">
                    <thead>
                        <tr className="bg-black text-white text-[9px] font-black uppercase tracking-widest">
                            <th className="p-4 text-left border border-black">Sl.</th>
                            <th className="p-4 text-left border border-black w-1/2">Product Description</th>
                            <th className="p-4 text-center border border-black">Qty</th>
                            <th className="p-4 text-right border border-black">Unit Rate</th>
                            <th className="p-4 text-right border border-black">Amount</th>
                        </tr>
                    </thead>
                    <tbody className="text-[11px] font-bold uppercase">
                        {order.orderItems?.map((item, index) => (
                            <tr key={item._id} className="border-x border-slate-200">
                                <td className="p-4 text-slate-400 border-r border-slate-100">{index + 1}</td>
                                <td className="p-4 border-r border-slate-100">{item.name}</td>
                                <td className="p-4 text-center border-r border-slate-100">{item.qty}</td>
                                <td className="p-4 text-right border-r border-slate-100">₹{item.price?.toLocaleString()}</td>
                                <td className="p-4 text-right">₹{(item.qty * item.price)?.toLocaleString()}</td>
                            </tr>
                        ))}
                        {[...Array(Math.max(0, 4 - (order.orderItems?.length || 0)))].map((_, i) => (
                            <tr key={i} className="border-x border-slate-200 min-h-[40px]">
                                <td className="p-4 border-r border-slate-100">&nbsp;</td>
                                <td className="p-4 border-r border-slate-100">&nbsp;</td>
                                <td className="p-4 border-r border-slate-100">&nbsp;</td>
                                <td className="p-4 border-r border-slate-100">&nbsp;</td>
                                <td className="p-4">&nbsp;</td>
                            </tr>
                        ))}
                    </tbody>
                    <tfoot>
                        <tr className="border border-slate-200 bg-slate-50/50">
                            <td colSpan="3" className="p-4 text-[9px] font-medium normal-case text-slate-400">
                                Amount in words: <span className="capitalize">{numberToWords(order.totalPrice)}</span>
                            </td>
                            <td className="p-4 text-right text-[9px] font-black text-slate-500 uppercase">Sub-Total</td>
                            <td className="p-4 text-right font-black">₹{subTotal.toFixed(2)}</td>
                        </tr>
                        <tr className="border border-slate-200 bg-slate-50/50">
                            <td colSpan="3"></td>
                            <td className="p-4 text-right text-[9px] font-black text-slate-500 uppercase">CGST (9%)</td>
                            <td className="p-4 text-right font-black">₹{cgst.toFixed(2)}</td>
                        </tr>
                        <tr className="border border-slate-200 bg-slate-50/50">
                            <td colSpan="3"></td>
                            <td className="p-4 text-right text-[9px] font-black text-slate-500 uppercase">SGST (9%)</td>
                            <td className="p-4 text-right font-black">₹{sgst.toFixed(2)}</td>
                        </tr>
                        <tr className="border border-black bg-black text-white">
                            <td colSpan="3"></td>
                            <td className="p-4 text-right text-[11px] font-black uppercase tracking-widest">Total Amount</td>
                            <td className="p-4 text-right text-sm font-black tracking-tight">₹{order.totalPrice?.toLocaleString()}</td>
                        </tr>
                    </tfoot>
                </table>

                {/* Bottom Section */}
                <div className="flex justify-between items-end mt-20">
                    <div className="w-2/3">
                        <h5 className="text-[10px] font-black uppercase mb-2">Terms & Conditions:</h5>
                        <ul className="text-[8px] text-slate-400 space-y-1 uppercase font-bold leading-tight">
                            <li>1. Goods once sold will not be taken back.</li>
                            <li>2. Interest @18% p.a. charged if payment is not made within 7 days.</li>
                            <li>3. Subject to Pune Jurisdiction only.</li>
                        </ul>
                    </div>
                    <div className="text-center w-64">
                        <div className="border-b border-slate-300 h-16 w-full mb-2"></div>
                        <p className="text-[9px] font-black uppercase tracking-widest">Authorized Signatory</p>
                        <p className="text-[8px] font-bold text-slate-400 mt-1 uppercase">For {adminDetails.company}</p>
                    </div>
                </div>

                <div className="mt-16 text-center border-t border-slate-100 pt-6">
                    <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.5em]">Authentic Invoice Generated by MillionAI Portal</p>
                </div>
            </div>

            <style>{`
                @media print {
                    body * { visibility: hidden; }
                    #invoice-sheet, #invoice-sheet * { visibility: visible; }
                    #invoice-sheet {
                        position: absolute; left: 0; top: 0; width: 100% !important;
                        margin: 0 !important; padding: 20px !important;
                        border: none !important; box-shadow: none !important;
                    }
                    .no-print { display: none !important; }
                    body { background: white !important; }
                }
            `}</style>
        </div>
    );
};

export default AdminInvoice;