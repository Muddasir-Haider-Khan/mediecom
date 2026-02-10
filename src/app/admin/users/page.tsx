"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Users, Search, Eye, Edit, Trash2 } from "lucide-react";

const mockUsers = [
    { id: "1", name: "Dr. Ahmed Khan", email: "ahmed@hospital.com", role: "CUSTOMER", orders: 5, joined: "2026-01-15" },
    { id: "2", name: "City Hospital", email: "procurement@cityhospital.pk", role: "B2B_CLIENT", orders: 12, joined: "2026-01-10" },
    { id: "3", name: "Sara Ali", email: "sara@gmail.com", role: "CUSTOMER", orders: 2, joined: "2026-02-01" },
    { id: "4", name: "Hassan Rider", email: "hassan@medsurgx.com", role: "RIDER", orders: 0, joined: "2026-01-20" },
    { id: "5", name: "Admin User", email: "admin@medsurgx.com", role: "ADMIN", orders: 0, joined: "2025-12-01" },
];

const roleColors: Record<string, string> = {
    CUSTOMER: "bg-blue-100 text-blue-800",
    B2B_CLIENT: "bg-primary-100 text-primary-800",
    ADMIN: "bg-red-100 text-red-800",
    RIDER: "bg-purple-100 text-purple-800",
};

export default function UsersPage() {
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    useEffect(() => {
        async function fetchUsers() {
            try {
                const res = await fetch("/api/users");
                if (res.ok) {
                    const data = await res.json();
                    setUsers(data);
                }
            } catch (error) {
                console.error("Failed to fetch users", error);
            } finally {
                setLoading(false);
            }
        }
        fetchUsers();
    }, []);

    const filtered = users.filter((u) =>
        u.name?.toLowerCase().includes(search.toLowerCase()) ||
        u.email?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div>
                <h1 className="font-display font-bold text-2xl text-surface-900">Users</h1>
                <p className="text-sm text-surface-500 mt-1">Manage all platform users</p>
            </div>

            <div className="card p-4">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search users..."
                        className="input-field pl-10 py-2.5"
                    />
                </div>
            </div>

            <div className="card overflow-hidden">
                <table className="w-full">
                    <thead>
                        <tr className="bg-surface-50">
                            {["User", "Role", "Orders", "Joined", "Actions"].map((h) => (
                                <th key={h} className="text-left text-[10px] font-semibold text-surface-500 uppercase tracking-wider px-6 py-3">{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-surface-100">
                        {loading ? (
                            <tr>
                                <td colSpan={5} className="px-6 py-8 text-center text-sm text-surface-500">
                                    Loading users...
                                </td>
                            </tr>
                        ) : filtered.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-6 py-8 text-center text-sm text-surface-500">
                                    No users found
                                </td>
                            </tr>
                        ) : (
                            filtered.map((user) => (
                                <tr key={user.id} className="hover:bg-surface-50 transition">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-primary-100 flex items-center justify-center text-xs font-bold text-primary-700">
                                                {user.name?.charAt(0) || "U"}
                                            </div>
                                            <div>
                                                <p className="text-xs font-semibold text-surface-900">{user.name || "Unknown"}</p>
                                                <p className="text-[10px] text-surface-500">{user.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`badge text-[10px] ${roleColors[user.role] || "bg-gray-100 text-gray-800"}`}>{user.role}</span>
                                    </td>
                                    <td className="px-6 py-4 text-xs text-surface-600">{user._count?.orders || 0}</td>
                                    <td className="px-6 py-4 text-xs text-surface-500">
                                        {new Date(user.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex gap-1">
                                            <button className="p-1.5 rounded-lg hover:bg-surface-100 text-surface-400 transition"><Eye className="w-3.5 h-3.5" /></button>
                                            <button className="p-1.5 rounded-lg hover:bg-surface-100 text-surface-400 transition"><Edit className="w-3.5 h-3.5" /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
