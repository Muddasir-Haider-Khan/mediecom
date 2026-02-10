"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, Loader2 } from "lucide-react";

export default function LoginPage() {
    const router = useRouter();
    const [isLogin, setIsLogin] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const result = await signIn("credentials", {
                email,
                password,
                redirect: false,
            });

            if (result?.error) {
                setError("Invalid email or password");
            } else {
                router.push("/admin");
                router.refresh();
            }
        } catch {
            setError("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-surface-50 flex">
            {/* Left Panel — Branding */}
            <div className="hidden lg:flex flex-1 gradient-bg items-center justify-center p-12 relative overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-20 left-20 w-72 h-72 rounded-full border-2 border-white animate-float" />
                    <div className="absolute bottom-20 right-20 w-52 h-52 rounded-full border border-white/50" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[300px] font-display font-bold text-white/5">
                        +
                    </div>
                </div>

                <div className="relative z-10 text-center space-y-6 max-w-md">
                    <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center mx-auto">
                        <span className="text-white font-display font-bold text-2xl">M</span>
                    </div>
                    <h2 className="font-display font-bold text-3xl text-white">
                        Med<span className="text-primary-300">SurgX</span>
                    </h2>
                    <p className="text-white/70 leading-relaxed">
                        Pakistan&apos;s premier platform for medical and surgical technology.
                        Join thousands of healthcare professionals who trust MedSurgX.
                    </p>
                    <div className="flex items-center justify-center gap-6 pt-4">
                        {["10K+ Products", "500+ Hospitals", "24/7 Support"].map((stat) => (
                            <div
                                key={stat}
                                className="text-xs font-medium text-white/60 bg-white/10 rounded-full px-3 py-1.5"
                            >
                                {stat}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Right Panel — Form */}
            <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
                <div className="w-full max-w-md space-y-8">
                    {/* Mobile Logo */}
                    <div className="lg:hidden flex items-center gap-2 justify-center mb-4">
                        <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center">
                            <span className="text-white font-display font-bold text-lg">M</span>
                        </div>
                        <h1 className="font-display font-bold text-xl">
                            Med<span className="text-primary-700">SurgX</span>
                        </h1>
                    </div>

                    <div>
                        <h1 className="font-display font-bold text-2xl text-surface-900">
                            {isLogin ? "Welcome Back" : "Create Account"}
                        </h1>
                        <p className="text-sm text-surface-500 mt-1">
                            {isLogin
                                ? "Sign in to your account to continue"
                                : "Join MedSurgX for the best medical products"}
                        </p>
                    </div>

                    {/* Google OAuth */}
                    <button className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl border-2 border-surface-200 hover:border-surface-300 hover:bg-surface-50 transition font-medium text-sm text-surface-700">
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                            <path
                                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                                fill="#4285F4"
                            />
                            <path
                                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                fill="#34A853"
                            />
                            <path
                                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                fill="#FBBC05"
                            />
                            <path
                                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                fill="#EA4335"
                            />
                        </svg>
                        Continue with Google
                    </button>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-surface-200" />
                        </div>
                        <div className="relative flex justify-center text-xs">
                            <span className="bg-surface-50 px-4 text-surface-400">
                                or continue with email
                            </span>
                        </div>
                    </div>

                    {/* Error */}
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
                            {error}
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {!isLogin && (
                            <div>
                                <label className="text-xs font-semibold text-surface-700 mb-1 block">
                                    Full Name
                                </label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="Enter your full name"
                                        className="input-field pl-10"
                                    />
                                </div>
                            </div>
                        )}

                        <div>
                            <label className="text-xs font-semibold text-surface-700 mb-1 block">
                                Email Address
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Enter your email"
                                    className="input-field pl-10"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="text-xs font-semibold text-surface-700 mb-1 block">
                                Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Enter your password"
                                    className="input-field pl-10 pr-10"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-surface-400 hover:text-surface-600"
                                >
                                    {showPassword ? (
                                        <EyeOff className="w-4 h-4" />
                                    ) : (
                                        <Eye className="w-4 h-4" />
                                    )}
                                </button>
                            </div>
                        </div>

                        {isLogin && (
                            <div className="flex items-center justify-between">
                                <label className="flex items-center gap-2 text-xs text-surface-600 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="w-4 h-4 rounded border-surface-300 text-primary-600"
                                    />
                                    Remember me
                                </label>
                                <a
                                    href="#"
                                    className="text-xs text-primary-700 hover:underline font-medium"
                                >
                                    Forgot password?
                                </a>
                            </div>
                        )}

                        <button type="submit" disabled={loading} className="btn-primary w-full justify-center">
                            {loading ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <>
                                    {isLogin ? "Sign In" : "Create Account"}
                                    <ArrowRight className="w-4 h-4" />
                                </>
                            )}
                        </button>
                    </form>

                    <p className="text-center text-sm text-surface-500">
                        {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
                        <button
                            onClick={() => setIsLogin(!isLogin)}
                            className="text-primary-700 font-semibold hover:underline"
                        >
                            {isLogin ? "Sign up" : "Sign in"}
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
}
