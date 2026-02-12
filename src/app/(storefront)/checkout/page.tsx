"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useCartStore } from "@/store/cart";
import { formatCurrency } from "@/lib/utils";
import { Loader2, ArrowLeft, ShieldCheck, MapPin, Phone, CreditCard } from "lucide-react";

export default function CheckoutPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const { items, totalPrice, clearCart } = useCartStore();

    const [loading, setLoading] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState("COD");
    const [formData, setFormData] = useState({
        address: "",
        city: "",
        zip: "",
        phone: "",
        notes: "",
    });

    const total = totalPrice();
    const shippingCost = 250; // Fixed shipping for now
    const grandTotal = total + shippingCost;

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/login?callbackUrl=/checkout");
        }
    }, [status, router]);

    if (status === "loading") {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
            </div>
        );
    }

    if (items.length === 0) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-surface-50 p-4">
                <div className="w-20 h-20 bg-surface-100 rounded-full flex items-center justify-center mb-6">
                    <span className="text-4xl">🛒</span>
                </div>
                <h1 className="text-2xl font-bold text-surface-900 mb-2">Your cart is empty</h1>
                <p className="text-surface-500 mb-8">Add some products to proceed to checkout</p>
                <Link href="/products" className="btn-primary">
                    Browse Products
                </Link>
            </div>
        );
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const shippingAddress = `${formData.address}, ${formData.city}, ${formData.zip}`;

        try {
            const res = await fetch("/api/orders", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    items: items.map(item => ({
                        productId: item.id,
                        quantity: item.quantity,
                        price: item.price
                    })),
                    shippingAddress,
                    phone: formData.phone,
                    notes: formData.notes,
                    paymentMethod,
                }),
            });

            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.error || "Failed to create order");
            }

            // On success
            clearCart();
            const order = await res.json();
            router.push(`/order-confirmation/${order.id}`);
        } catch (error) {
            console.error("Checkout error:", error);
            alert("Failed to place order. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-surface-50 py-12">
            <div className="container-custom">
                <Link href="/products" className="inline-flex items-center gap-2 text-sm text-surface-500 hover:text-primary-700 mb-8 transition">
                    <ArrowLeft className="w-4 h-4" />
                    Continue Shopping
                </Link>

                <h1 className="font-display font-bold text-3xl text-surface-900 mb-8">Checkout</h1>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Left Column: Shipping Form */}
                    <div className="lg:col-span-2 space-y-6">
                        <form id="checkout-form" onSubmit={handleSubmit} className="card p-6 lg:p-8">
                            <h2 className="flex items-center gap-2 font-display font-bold text-lg text-surface-900 mb-6">
                                <MapPin className="w-5 h-5 text-primary-600" />
                                Shipping Information
                            </h2>

                            <div className="grid md:grid-cols-2 gap-4 mb-4">
                                <div className="space-y-1 md:col-span-2">
                                    <label className="text-xs font-semibold text-surface-700 uppercase">Street Address</label>
                                    <input
                                        required
                                        type="text"
                                        placeholder="123 Medical Plaza, Blue Area"
                                        className="input-field"
                                        value={formData.address}
                                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-surface-700 uppercase">City</label>
                                    <input
                                        required
                                        type="text"
                                        placeholder="Islamabad"
                                        className="input-field"
                                        value={formData.city}
                                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-surface-700 uppercase">ZIP / Postal Code</label>
                                    <input
                                        required
                                        type="text"
                                        placeholder="44000"
                                        className="input-field"
                                        value={formData.zip}
                                        onChange={(e) => setFormData({ ...formData, zip: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-1 md:col-span-2">
                                    <label className="text-xs font-semibold text-surface-700 uppercase">Phone Number</label>
                                    <div className="relative">
                                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
                                        <input
                                            required
                                            type="tel"
                                            placeholder="+92 300 1234567"
                                            className="input-field pl-10"
                                            value={formData.phone}
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-1 md:col-span-2">
                                    <label className="text-xs font-semibold text-surface-700 uppercase">Order Notes (Optional)</label>
                                    <textarea
                                        rows={3}
                                        placeholder="Special instructions for delivery..."
                                        className="input-field resize-none"
                                        value={formData.notes}
                                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="pt-6 border-t border-surface-100">
                                <h2 className="flex items-center gap-2 font-display font-bold text-lg text-surface-900 mb-6">
                                    <CreditCard className="w-5 h-5 text-primary-600" />
                                    Payment Method
                                </h2>
                                <label className={`flex items-center gap-4 p-4 border-2 rounded-xl cursor-pointer transition ${paymentMethod === 'COD' ? 'border-primary-500 bg-primary-50/50' : 'border-surface-200 hover:border-surface-300'}`}>
                                    <input type="radio" name="payment" value="COD" checked={paymentMethod === 'COD'} onChange={() => setPaymentMethod('COD')} className="w-5 h-5 text-primary-600 focus:ring-primary-500" />
                                    <div className="flex-1">
                                        <div className="font-semibold text-surface-900">Cash on Delivery</div>
                                        <div className="text-sm text-surface-500">Pay securely when you receive your order</div>
                                    </div>
                                    <span className="text-2xl">💵</span>
                                </label>
                                <label className={`flex items-center gap-4 p-4 border-2 rounded-xl cursor-pointer transition mt-3 ${paymentMethod === 'JAZZCASH' ? 'border-primary-500 bg-primary-50/50' : 'border-surface-200 hover:border-surface-300'}`}>
                                    <input type="radio" name="payment" value="JAZZCASH" checked={paymentMethod === 'JAZZCASH'} onChange={() => setPaymentMethod('JAZZCASH')} className="w-5 h-5 text-primary-600 focus:ring-primary-500" />
                                    <div className="flex-1">
                                        <div className="font-semibold text-surface-900">JazzCash</div>
                                        <div className="text-sm text-surface-500">Pay via JazzCash mobile wallet</div>
                                    </div>
                                    <span className="text-2xl">📱</span>
                                </label>
                            </div>
                        </form>
                    </div>

                    {/* Right Column: Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="card p-6 sticky top-24">
                            <h2 className="font-display font-bold text-lg text-surface-900 mb-6">Order Summary</h2>

                            <div className="space-y-4 mb-6">
                                {items.map((item) => (
                                    <div key={item.id} className="flex gap-3">
                                        <div className="relative w-16 h-16 rounded-lg bg-surface-100 overflow-hidden flex-shrink-0">
                                            {item.image ? (
                                                <Image src={item.image} alt={item.name} fill className="object-cover" />
                                            ) : (
                                                <div className="flex items-center justify-center h-full text-xl">🏥</div>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-medium text-surface-900 text-sm truncate">{item.name}</h4>
                                            <p className="text-xs text-surface-500">{item.quantity} x {formatCurrency(item.price)}</p>
                                        </div>
                                        <div className="font-semibold text-sm text-surface-900">
                                            {formatCurrency(item.price * item.quantity)}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="space-y-3 pt-6 border-t border-surface-100">
                                <div className="flex justify-between text-sm text-surface-600">
                                    <span>Subtotal</span>
                                    <span>{formatCurrency(total)}</span>
                                </div>
                                <div className="flex justify-between text-sm text-surface-600">
                                    <span>Shipping</span>
                                    <span>{formatCurrency(shippingCost)}</span>
                                </div>
                                <div className="flex justify-between font-bold text-lg text-surface-900 pt-3 border-t border-dashed border-surface-200">
                                    <span>Total</span>
                                    <span>{formatCurrency(grandTotal)}</span>
                                </div>
                            </div>

                            <button
                                form="checkout-form"
                                disabled={loading}
                                className="w-full btn-primary mt-6 py-3 text-base flex justify-center items-center gap-2"
                            >
                                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                                Place Order
                            </button>

                            <div className="flex items-center gap-2 justify-center mt-4 text-xs text-surface-500">
                                <ShieldCheck className="w-4 h-4 text-green-600" />
                                Secure Checkout
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
