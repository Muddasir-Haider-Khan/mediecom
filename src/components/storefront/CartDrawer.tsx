"use client";

import { X, Plus, Minus, ShoppingBag, ArrowRight, Trash2 } from "lucide-react";
import { useCartStore } from "@/store/cart";
import { formatCurrency } from "@/lib/utils";
import Link from "next/link";

export default function CartDrawer() {
    const { items, isOpen, closeCart, updateQuantity, removeItem, totalPrice, totalItems } =
        useCartStore();

    if (!isOpen) return null;

    return (
        <>
            {/* Overlay */}
            <div
                className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 transition-opacity"
                onClick={closeCart}
            />

            {/* Drawer */}
            <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 flex flex-col animate-slide-in-right">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-surface-100">
                    <div className="flex items-center gap-2">
                        <ShoppingBag className="w-5 h-5 text-primary-700" />
                        <h2 className="font-display font-bold text-lg">Your Cart</h2>
                        <span className="badge-primary">{totalItems()}</span>
                    </div>
                    <button
                        onClick={closeCart}
                        className="p-2 rounded-xl hover:bg-surface-100 transition"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Items */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                    {items.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-center">
                            <div className="w-20 h-20 rounded-full bg-surface-100 flex items-center justify-center mb-4">
                                <ShoppingBag className="w-8 h-8 text-surface-400" />
                            </div>
                            <p className="font-display font-semibold text-surface-900 mb-1">
                                Your cart is empty
                            </p>
                            <p className="text-sm text-surface-500 mb-6">
                                Add some medical products to get started
                            </p>
                            <button onClick={closeCart} className="btn-primary text-sm">
                                Continue Shopping
                            </button>
                        </div>
                    ) : (
                        items.map((item) => (
                            <div
                                key={item.id}
                                className="flex gap-4 p-3 rounded-xl bg-surface-50 border border-surface-100"
                            >
                                {/* Image placeholder */}
                                <div className="w-20 h-20 rounded-lg bg-gradient-to-br from-surface-100 to-surface-200 flex items-center justify-center text-2xl flex-shrink-0">
                                    🏥
                                </div>

                                <div className="flex-1 min-w-0">
                                    <h3 className="text-sm font-semibold text-surface-900 line-clamp-2 leading-snug">
                                        {item.name}
                                    </h3>
                                    <p className="text-sm font-bold text-primary-700 mt-1">
                                        {formatCurrency(item.price)}
                                    </p>

                                    <div className="flex items-center justify-between mt-2">
                                        <div className="flex items-center gap-1 bg-white rounded-lg border border-surface-200">
                                            <button
                                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                className="p-1.5 hover:bg-surface-50 rounded-l-lg transition"
                                            >
                                                <Minus className="w-3 h-3" />
                                            </button>
                                            <span className="text-xs font-semibold w-8 text-center">
                                                {item.quantity}
                                            </span>
                                            <button
                                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                className="p-1.5 hover:bg-surface-50 rounded-r-lg transition"
                                            >
                                                <Plus className="w-3 h-3" />
                                            </button>
                                        </div>
                                        <button
                                            onClick={() => removeItem(item.id)}
                                            className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                                        >
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Footer */}
                {items.length > 0 && (
                    <div className="p-6 border-t border-surface-100 space-y-4 bg-white">
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-surface-600">Subtotal</span>
                            <span className="text-lg font-bold text-surface-900">
                                {formatCurrency(totalPrice())}
                            </span>
                        </div>
                        <p className="text-[10px] text-surface-400">
                            Shipping & taxes calculated at checkout
                        </p>
                        <Link
                            href="/checkout"
                            onClick={closeCart}
                            className="btn-primary w-full justify-center"
                        >
                            Proceed to Checkout
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                        <button
                            onClick={closeCart}
                            className="btn-ghost w-full justify-center text-xs"
                        >
                            Continue Shopping
                        </button>
                    </div>
                )}
            </div>
        </>
    );
}
