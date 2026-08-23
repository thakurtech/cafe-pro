"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import {
    Home,
    ShoppingCart,
    ChefHat,
    QrCode,
    Gift,
    Users,
    LayoutDashboard,
    Menu,
    X,
    Coffee,
    LogIn
} from "lucide-react"
import { useAuth } from "@/lib/auth-context"

const navItems = [
    { name: "Features", href: "#features" },
    { name: "Pricing", href: "#pricing" },
    { name: "Demo", href: "#demo" },
]

const appNavItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "POS", href: "/pos", icon: ShoppingCart },
    { name: "Kitchen", href: "/kitchen", icon: ChefHat },
    { name: "QR Menu", href: "/table/1", icon: QrCode },
]

export function MainNav() {
    const pathname = usePathname()
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const { user } = useAuth()
    
    // Determine if we're on the landing page or in the app
    const isLandingPage = pathname === "/"
    const isLoggedIn = !!user

    // Landing page nav (dark, minimal)
    if (isLandingPage) {
        return (
            <nav className="fixed top-0 left-0 right-0 z-50 bg-stone-950/80 backdrop-blur-xl border-b border-white/5">
                {/* Unified Persona Switcher Bar */}
                <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 px-4 py-1 text-center text-xs font-semibold text-white flex items-center justify-between">
                    <span className="hidden sm:inline font-mono">🧪 DEMO LOOP SWITCHER:</span>
                    <div className="flex items-center gap-3 mx-auto sm:mx-0">
                        <Link href="/super-admin" className="hover:underline flex items-center gap-1 bg-black/20 px-2 py-0.5 rounded">
                            👑 1. Super Admin
                        </Link>
                        <span>•</span>
                        <Link href="/pos" className="hover:underline flex items-center gap-1 bg-black/20 px-2 py-0.5 rounded">
                            ☕ 2. Cafe Owner & POS
                        </Link>
                        <span>•</span>
                        <Link href="/table/T-4?shop=cafe-noir" className="hover:underline flex items-center gap-1 bg-black/20 px-2 py-0.5 rounded">
                            📱 3. Customer QR
                        </Link>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex items-center justify-between h-16">
                        {/* Logo */}
                        <Link href="/" className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/20">
                                <Coffee className="w-5 h-5 text-white" />
                            </div>
                            <span className="font-bold text-xl text-white">CaféOS</span>
                        </Link>

                        {/* Desktop Navigation */}
                        <div className="hidden md:flex items-center gap-8">
                            {navItems.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className="text-white/60 hover:text-white text-sm font-medium transition-colors"
                                >
                                    {item.name}
                                </Link>
                            ))}
                        </div>

                        {/* Auth Buttons */}
                        <div className="hidden md:flex items-center gap-4">
                            {isLoggedIn ? (
                                <Link href="/dashboard">
                                    <button className="px-5 py-2 bg-gradient-to-r from-amber-500 to-orange-600 rounded-lg font-medium text-sm text-white hover:shadow-lg hover:shadow-orange-500/25 transition-all">
                                        Go to Dashboard
                                    </button>
                                </Link>
                            ) : (
                                <>
                                    <Link href="/login">
                                        <button className="text-white/60 hover:text-white text-sm font-medium transition-colors">
                                            Sign In
                                        </button>
                                    </Link>
                                    <Link href="/register">
                                        <button className="px-5 py-2 bg-gradient-to-r from-amber-500 to-orange-600 rounded-lg font-medium text-sm text-white hover:shadow-lg hover:shadow-orange-500/25 transition-all">
                                            Start Free Trial
                                        </button>
                                    </Link>
                                </>
                            )}
                        </div>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="md:hidden p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/5"
                        >
                            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <div className="md:hidden border-t border-white/5 bg-stone-950">
                        <div className="px-6 py-4 space-y-2">
                            {navItems.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="block px-4 py-3 rounded-lg text-white/60 hover:text-white hover:bg-white/5 font-medium"
                                >
                                    {item.name}
                                </Link>
                            ))}
                            <div className="h-px bg-white/5 my-3" />
                            {isLoggedIn ? (
                                <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                                    <button className="w-full px-4 py-3 bg-gradient-to-r from-amber-500 to-orange-600 rounded-lg font-medium text-white">
                                        Go to Dashboard
                                    </button>
                                </Link>
                            ) : (
                                <>
                                    <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                                        <button className="w-full px-4 py-3 rounded-lg text-white/60 hover:text-white hover:bg-white/5 font-medium text-left">
                                            Sign In
                                        </button>
                                    </Link>
                                    <Link href="/register" onClick={() => setMobileMenuOpen(false)}>
                                        <button className="w-full px-4 py-3 bg-gradient-to-r from-amber-500 to-orange-600 rounded-lg font-medium text-white mt-2">
                                            Start Free Trial
                                        </button>
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </nav>
        )
    }

    // App navigation (light theme for internal pages)
    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-stone-200 shadow-sm">
            {/* Unified Persona Switcher Bar */}
            <div className="bg-stone-900 px-4 py-1 text-center text-xs font-semibold text-white flex items-center justify-between">
                <span className="hidden sm:inline text-amber-400 font-mono">🧪 DEMO SWITCHER:</span>
                <div className="flex items-center gap-3 mx-auto sm:mx-0">
                    <Link href="/super-admin" className="hover:text-amber-400 flex items-center gap-1">
                        👑 Super Admin
                    </Link>
                    <span className="text-stone-600">•</span>
                    <Link href="/pos" className="hover:text-amber-400 flex items-center gap-1">
                        ☕ Cafe POS
                    </Link>
                    <span className="text-stone-600">•</span>
                    <Link href="/kitchen" className="hover:text-amber-400 flex items-center gap-1">
                        🍳 Kitchen
                    </Link>
                    <span className="text-stone-600">•</span>
                    <Link href="/table/T-4?shop=cafe-noir" className="hover:text-amber-400 flex items-center gap-1">
                        📱 Customer QR
                    </Link>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 flex-shrink-0">
                        <div className="w-10 h-10 rounded-lg overflow-hidden">
                            <img src="/logo.png" alt="CaféOS" className="w-full h-full object-cover" />
                        </div>
                        <span className="font-bold text-xl text-stone-900 hidden sm:inline">CaféOS</span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden lg:flex items-center gap-2">
                        {appNavItems.map((item) => {
                            const Icon = item.icon
                            const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href))

                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${isActive
                                            ? "bg-amber-500 text-white"
                                            : "text-stone-600 hover:bg-stone-100"
                                        }`}
                                >
                                    <Icon className="w-4 h-4" />
                                    <span>{item.name}</span>
                                </Link>
                            )
                        })}

                        {user?.role === 'SUPER_ADMIN' && (
                            <>
                                <div className="h-8 w-px bg-stone-200 mx-2" />
                                <Link
                                    href="/super-admin"
                                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors border-2 ${pathname.startsWith('/super-admin')
                                            ? "bg-gradient-to-r from-amber-500 to-orange-600 text-white border-transparent"
                                            : "text-amber-600 border-amber-500 hover:bg-amber-50"
                                        }`}
                                >
                                    <LayoutDashboard className="w-4 h-4" />
                                    <span>Super Admin</span>
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="lg:hidden p-2 rounded-lg hover:bg-stone-100 text-stone-600"
                    >
                        {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="lg:hidden border-t border-stone-200 bg-white">
                    <div className="px-4 py-4 space-y-2 max-h-[calc(100vh-4rem)] overflow-y-auto">
                        {appNavItems.map((item) => {
                            const Icon = item.icon
                            const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href))

                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium transition-colors ${isActive
                                            ? "bg-amber-500 text-white"
                                            : "text-stone-600 hover:bg-stone-100"
                                        }`}
                                >
                                    <Icon className="w-5 h-5" />
                                    <span>{item.name}</span>
                                </Link>
                            )
                        })}

                        {user?.role === 'SUPER_ADMIN' && (
                            <>
                                <div className="h-px bg-stone-200 my-2" />
                                <Link
                                    href="/super-admin"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium transition-colors border-2 ${pathname.startsWith('/super-admin')
                                            ? "bg-gradient-to-r from-amber-500 to-orange-600 text-white border-transparent"
                                            : "text-amber-600 border-amber-500 hover:bg-amber-50"
                                        }`}
                                >
                                    <LayoutDashboard className="w-5 h-5" />
                                    <span>Super Admin</span>
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            )}
        </nav>
    )
}
