"use client";

import { useEffect, useState } from "react";
import {
    DollarSign,
    ShoppingCart,
    Package,
    Users,
    TrendingUp,
    ArrowUpRight,
    ArrowDownRight,
} from "lucide-react";
import {
    LineChart,
    Line,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
} from "recharts";
import { formatCurrency } from "@/lib/utils";

// Static mock data (kept outside component — no hooks needed)
const revenueData = [
    { month: "Jan", revenue: 180000, orders: 42 },
    { month: "Feb", revenue: 220000, orders: 51 },
    { month: "Mar", revenue: 195000, orders: 47 },
    { month: "Apr", revenue: 310000, orders: 68 },
    { month: "May", revenue: 280000, orders: 62 },
    { month: "Jun", revenue: 350000, orders: 78 },
    { month: "Jul", revenue: 420000, orders: 92 },
];

const channelData = [
    { name: "Website", value: 45, color: "#0f766e" },
    { name: "WhatsApp", value: 25, color: "#25D366" },
    { name: "Facebook", value: 15, color: "#1877F2" },
    { name: "Instagram", value: 10, color: "#E4405F" },
    { name: "TikTok", value: 5, color: "#000000" },
];

const recentOrders = [
    { id: "MSX-001", customer: "Dr. Ahmed", amount: 45000, status: "DELIVERED", date: "Today" },
    { id: "MSX-002", customer: "City Hospital", amount: 285000, status: "SHIPPED", date: "Today" },
    { id: "MSX-003", customer: "Sara Clinic", amount: 18500, status: "PROCESSING", date: "Yesterday" },
    { id: "MSX-004", customer: "Ali Pharmacy", amount: 7200, status: "PENDING", date: "Yesterday" },
    { id: "MSX-005", customer: "Dr. Fatima", amount: 92000, status: "DELIVERED", date: "2 days ago" },
];

const statusColors: Record<string, string> = {
    PENDING: "badge-warning",
    PROCESSING: "badge bg-blue-100 text-blue-800",
    SHIPPED: "badge bg-purple-100 text-purple-800",
    DELIVERED: "badge-success",
};

export default function AdminDashboard() {
    const [realStats, setRealStats] = useState({
        revenue: 0,
        orders: 0,
        products: 0,
        users: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchStats() {
            try {
                const res = await fetch("/api/dashboard/stats");
                if (res.ok) {
                    const data = await res.json();
                    setRealStats(data);
                }
            } catch (error) {
                console.error("Failed to fetch stats", error);
            } finally {
                setLoading(false);
            }
        }
        fetchStats();
    }, []);

    const stats = [
        {
            label: "Total Revenue",
            value: loading ? "..." : formatCurrency(realStats.revenue),
            change: "+12.5%",
            isUp: true,
            icon: DollarSign,
            color: "text-emerald-600 bg-emerald-50",
        },
        {
            label: "Total Orders",
            value: loading ? "..." : realStats.orders.toString(),
            change: "+8.2%",
            isUp: true,
            icon: ShoppingCart,
            color: "text-blue-600 bg-blue-50",
        },
        {
            label: "Products",
            value: loading ? "..." : realStats.products.toString(),
            change: "+3",
            isUp: true,
            icon: Package,
            color: "text-purple-600 bg-purple-50",
        },
        {
            label: "Active Users",
            value: loading ? "..." : realStats.users.toString(),
            change: "+5",
            isUp: true,
            icon: Users,
            color: "text-orange-600 bg-orange-50",
        },
    ];

    return (
        <div className="space-y-6">
            <div>
                <h1 className="font-display font-bold text-2xl text-surface-900">
                    Dashboard
                </h1>
                <p className="text-sm text-surface-500 mt-1">
                    Welcome back! Here&apos;s your business overview.
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat) => (
                    <div key={stat.label} className="card p-5">
                        <div className="flex items-center justify-between mb-4">
                            <div className={`w-10 h-10 rounded-xl ${stat.color} flex items-center justify-center`}>
                                <stat.icon className="w-5 h-5" />
                            </div>
                            <div
                                className={`flex items-center gap-0.5 text-xs font-semibold ${stat.isUp ? "text-emerald-600" : "text-red-500"
                                    }`}
                            >
                                {stat.isUp ? (
                                    <ArrowUpRight className="w-3 h-3" />
                                ) : (
                                    <ArrowDownRight className="w-3 h-3" />
                                )}
                                {stat.change}
                            </div>
                        </div>
                        <p className="text-2xl font-bold text-surface-900">{stat.value}</p>
                        <p className="text-xs text-surface-500 mt-1">{stat.label}</p>
                    </div>
                ))}
            </div>

            {/* Charts Row */}
            <div className="grid lg:grid-cols-3 gap-6">
                {/* Revenue Chart */}
                <div className="lg:col-span-2 card p-6">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="font-display font-bold text-sm text-surface-900">
                                Revenue Overview
                            </h3>
                            <p className="text-xs text-surface-500 mt-0.5">Monthly revenue trends</p>
                        </div>
                        <div className="flex items-center gap-4 text-[10px]">
                            <div className="flex items-center gap-1.5">
                                <div className="w-2.5 h-2.5 rounded-full bg-primary-600" />
                                Revenue
                            </div>
                            <div className="flex items-center gap-1.5">
                                <div className="w-2.5 h-2.5 rounded-full bg-accent-500" />
                                Orders
                            </div>
                        </div>
                    </div>
                    <ResponsiveContainer width="100%" height={280}>
                        <LineChart data={revenueData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                            <XAxis dataKey="month" tick={{ fontSize: 11 }} stroke="#94a3b8" />
                            <YAxis tick={{ fontSize: 11 }} stroke="#94a3b8" />
                            <Tooltip
                                contentStyle={{
                                    borderRadius: "12px",
                                    border: "1px solid #e2e8f0",
                                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                                    fontSize: "12px",
                                }}
                            />
                            <Line
                                type="monotone"
                                dataKey="revenue"
                                stroke="#0f766e"
                                strokeWidth={2.5}
                                dot={{ fill: "#0f766e", r: 4 }}
                                activeDot={{ r: 6 }}
                            />
                            <Line
                                type="monotone"
                                dataKey="orders"
                                stroke="#f59e0b"
                                strokeWidth={2}
                                dot={{ fill: "#f59e0b", r: 3 }}
                                strokeDasharray="5 5"
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                {/* Sales Channels */}
                <div className="card p-6">
                    <h3 className="font-display font-bold text-sm text-surface-900 mb-1">
                        Sales Channels
                    </h3>
                    <p className="text-xs text-surface-500 mb-4">Revenue distribution</p>
                    <ResponsiveContainer width="100%" height={180}>
                        <PieChart>
                            <Pie
                                data={channelData}
                                cx="50%"
                                cy="50%"
                                innerRadius={50}
                                outerRadius={80}
                                paddingAngle={3}
                                dataKey="value"
                            >
                                {channelData.map((entry) => (
                                    <Cell key={entry.name} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip
                                contentStyle={{
                                    borderRadius: "12px",
                                    border: "1px solid #e2e8f0",
                                    fontSize: "12px",
                                }}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                    <div className="space-y-2 mt-4">
                        {channelData.map((channel) => (
                            <div
                                key={channel.name}
                                className="flex items-center justify-between text-xs"
                            >
                                <div className="flex items-center gap-2">
                                    <div
                                        className="w-2.5 h-2.5 rounded-full"
                                        style={{ backgroundColor: channel.color }}
                                    />
                                    <span className="text-surface-600">{channel.name}</span>
                                </div>
                                <span className="font-semibold text-surface-900">
                                    {channel.value}%
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Recent Orders */}
            <div className="card overflow-hidden">
                <div className="p-6 border-b border-surface-100 flex items-center justify-between">
                    <div>
                        <h3 className="font-display font-bold text-sm text-surface-900">
                            Recent Orders
                        </h3>
                        <p className="text-xs text-surface-500 mt-0.5">Latest order activity</p>
                    </div>
                    <a
                        href="/admin/orders"
                        className="text-xs font-semibold text-primary-700 hover:underline"
                    >
                        View All
                    </a>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-surface-50">
                                <th className="text-left text-[10px] font-semibold text-surface-500 uppercase tracking-wider px-6 py-3">
                                    Order ID
                                </th>
                                <th className="text-left text-[10px] font-semibold text-surface-500 uppercase tracking-wider px-6 py-3">
                                    Customer
                                </th>
                                <th className="text-left text-[10px] font-semibold text-surface-500 uppercase tracking-wider px-6 py-3">
                                    Amount
                                </th>
                                <th className="text-left text-[10px] font-semibold text-surface-500 uppercase tracking-wider px-6 py-3">
                                    Status
                                </th>
                                <th className="text-left text-[10px] font-semibold text-surface-500 uppercase tracking-wider px-6 py-3">
                                    Date
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-surface-100">
                            {recentOrders.map((order) => (
                                <tr key={order.id} className="hover:bg-surface-50 transition">
                                    <td className="px-6 py-4 text-xs font-semibold text-primary-700">
                                        {order.id}
                                    </td>
                                    <td className="px-6 py-4 text-xs text-surface-900">
                                        {order.customer}
                                    </td>
                                    <td className="px-6 py-4 text-xs font-semibold text-surface-900">
                                        {formatCurrency(order.amount)}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={statusColors[order.status]}>
                                            {order.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-xs text-surface-500">
                                        {order.date}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
