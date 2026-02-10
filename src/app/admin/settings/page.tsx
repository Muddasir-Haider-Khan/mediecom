"use client";

import { useState } from "react";
import { Save, Bell, Lock, Globe, Mail, Shield, Loader2 } from "lucide-react";

export default function AdminSettingsPage() {
    const [loading, setLoading] = useState(false);
    const [settings, setSettings] = useState({
        siteName: "MedSurgX",
        supportEmail: "support@medsurgx.com",
        currency: "PKR",
        enableRegistrations: true,
        enableB2B: true,
        maintenanceMode: false,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setSettings(prev => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        setLoading(false);
        // In a real app, we would show a toast notification here
        alert("Settings saved successfully!");
    };

    return (
        <div className="space-y-6 max-w-4xl">
            <div>
                <h1 className="font-display font-bold text-2xl text-surface-900">Settings</h1>
                <p className="text-sm text-surface-500 mt-1">Manage global application settings</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* General Settings */}
                <div className="card p-6 space-y-4">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-primary-50 rounded-lg text-primary-600">
                            <Globe className="w-5 h-5" />
                        </div>
                        <h2 className="font-display font-semibold text-surface-900">General Information</h2>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs font-semibold text-surface-700 mb-1 block">Site Name</label>
                            <input
                                name="siteName"
                                value={settings.siteName}
                                onChange={handleChange}
                                className="input-field"
                            />
                        </div>
                        <div>
                            <label className="text-xs font-semibold text-surface-700 mb-1 block">Support Email</label>
                            <input
                                name="supportEmail"
                                value={settings.supportEmail}
                                onChange={handleChange}
                                className="input-field"
                            />
                        </div>
                        <div>
                            <label className="text-xs font-semibold text-surface-700 mb-1 block">Currency</label>
                            <input
                                name="currency"
                                value={settings.currency}
                                onChange={handleChange}
                                className="input-field"
                                disabled
                            />
                        </div>
                    </div>
                </div>

                {/* Feature Flags */}
                <div className="card p-6 space-y-4">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-purple-50 rounded-lg text-purple-600">
                            <Shield className="w-5 h-5" />
                        </div>
                        <h2 className="font-display font-semibold text-surface-900">Features & Security</h2>
                    </div>

                    <div className="space-y-3">
                        <label className="flex items-center justify-between p-3 rounded-xl border border-surface-200 hover:border-primary-200 transition cursor-pointer">
                            <div>
                                <span className="text-sm font-medium text-surface-900 block">Enable User Registrations</span>
                                <span className="text-xs text-surface-500">Allow new users to sign up</span>
                            </div>
                            <input
                                type="checkbox"
                                name="enableRegistrations"
                                checked={settings.enableRegistrations}
                                onChange={handleChange}
                                className="w-5 h-5 rounded border-surface-300 text-primary-600 focus:ring-primary-500"
                            />
                        </label>

                        <label className="flex items-center justify-between p-3 rounded-xl border border-surface-200 hover:border-primary-200 transition cursor-pointer">
                            <div>
                                <span className="text-sm font-medium text-surface-900 block">Enable B2B Module</span>
                                <span className="text-xs text-surface-500">Allow business accounts and wholesale pricing</span>
                            </div>
                            <input
                                type="checkbox"
                                name="enableB2B"
                                checked={settings.enableB2B}
                                onChange={handleChange}
                                className="w-5 h-5 rounded border-surface-300 text-primary-600 focus:ring-primary-500"
                            />
                        </label>

                        <label className="flex items-center justify-between p-3 rounded-xl border border-surface-200 hover:border-red-200 transition cursor-pointer">
                            <div>
                                <span className="text-sm font-medium text-surface-900 block">Maintenance Mode</span>
                                <span className="text-xs text-surface-500">Disable store access for all users except admins</span>
                            </div>
                            <input
                                type="checkbox"
                                name="maintenanceMode"
                                checked={settings.maintenanceMode}
                                onChange={handleChange}
                                className="w-5 h-5 rounded border-surface-300 text-primary-600 focus:ring-primary-500"
                            />
                        </label>
                    </div>
                </div>

                {/* Notifications */}
                <div className="card p-6 space-y-4">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-orange-50 rounded-lg text-orange-600">
                            <Bell className="w-5 h-5" />
                        </div>
                        <h2 className="font-display font-semibold text-surface-900">Notifications</h2>
                    </div>

                    <p className="text-sm text-surface-500">Notification settings coming soon...</p>
                </div>

                <div className="flex justify-end">
                    <button type="submit" disabled={loading} className="btn-primary">
                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        Save Changes
                    </button>
                </div>
            </form>
        </div>
    );
}
