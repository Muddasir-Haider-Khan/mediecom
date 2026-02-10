"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, Package, Truck, Calendar } from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";

export default function OrderConfirmationPage() {
    const params = useParams();
    const [order, setOrder] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchOrder() {
            try {
                const res = await fetch(`/api/orders/${params.id}`);
                if (res.ok) {
                    const data = await res.json();
                    setOrder(data);
                }
            } catch (error) {
                console.error("Failed to fetch order", error);
            } finally {
                setLoading(false);
            }
        }
        if (params.id) fetchOrder();
    }, [params.id]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-surface-50">
                <p className="text-surface-500">Loading order details...</p>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-surface-50">
                <div className="text-center">
                    <p className="text-6xl mb-4">😕</p>
                    <h2 className="font-display font-bold text-xl mb-2">Order Not Found</h2>
                    <Link href="/products" className="btn-primary mt-4">
                        Browse Products
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-surface-50 py-12">
            <div className="container-custom max-w-3xl">
                <div className="card p-8 lg:p-12 text-center mb-8">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle2 className="w-10 h-10 text-green-600" />
                    </div>
                    <h1 className="font-display font-bold text-3xl text-surface-900 mb-2">
                        Order Placed Successfully!
                    </h1>
                    <p className="text-surface-500 mb-8 max-w-md mx-auto">
                        Thank you for your purchase. Your order <span className="font-mono font-medium text-surface-900">{order.orderNumber}</span> has been confirmed and will be shipped soon.
                    </p>

                    <div className="flex justify-center gap-4">
                        <Link href="/products" className="btn-outline">
                            Continue Shopping
                        </Link>
                        {/* <Link href="/account/orders" className="btn-primary">
                            View My Orders
                        </Link> */}
                    </div>
                </div>

                <div className="card p-6 lg:p-8">
                    <h2 className="font-display font-bold text-lg text-surface-900 mb-6 flex items-center gap-2">
                        <Package className="w-5 h-5 text-primary-600" />
                        Order Details
                    </h2>

                    <div className="grid md:grid-cols-2 gap-8 mb-8">
                        <div>
                            <h3 className="text-xs font-semibold text-surface-500 uppercase mb-3">Shipping Address</h3>
                            <p className="text-surface-900 font-medium whitespace-pre-line">{order.shippingAddress}</p>
                            <p className="text-surface-600 mt-1">{order.phone}</p>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <h3 className="text-xs font-semibold text-surface-500 uppercase mb-1">Order Date</h3>
                                <p className="text-surface-900 flex items-center gap-2">
                                    <Calendar className="w-4 h-4 text-surface-400" />
                                    {formatDate(order.createdAt)}
                                </p>
                            </div>
                            <div>
                                <h3 className="text-xs font-semibold text-surface-500 uppercase mb-1">Status</h3>
                                <span className="badge bg-yellow-100 text-yellow-800">
                                    {order.status}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-surface-100 pt-6">
                        <h3 className="text-xs font-semibold text-surface-500 uppercase mb-4">Items Ordered</h3>
                        <div className="space-y-4">
                            {order.items.map((item: any) => (
                                <div key={item.id} className="flex justify-between items-center">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded bg-surface-100 flex items-center justify-center text-lg">
                                            🏥
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-surface-900">Product ID: {item.productId}</p>
                                            <p className="text-xs text-surface-500">Qty: {item.quantity}</p>
                                        </div>
                                    </div>
                                    <span className="text-sm font-medium text-surface-900">
                                        {formatCurrency(item.price * item.quantity)}
                                    </span>
                                </div>
                            ))}
                        </div>

                        <div className="flex justify-between items-center pt-6 mt-6 border-t border-surface-100">
                            <span className="font-bold text-lg text-surface-900">Total Amount</span>
                            <span className="font-bold text-xl text-primary-700">{formatCurrency(order.totalAmount)}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
