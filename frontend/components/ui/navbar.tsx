"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useCasper } from "@/components/providers";
import { useEffect, useState } from "react";
import { Wallet, Menu, X, ExternalLink, Copy, Check } from "lucide-react";
import { MagneticButton } from "@/components/immersive/smooth-scroll";

export default function Navbar() {
    const pathname = usePathname();
    const { isConnected, activeKey, connect, disconnect } = useCasper();
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const navLinks = [
        { name: "Dashboard", href: "/dashboard" },
        { name: "Marketplace", href: "/marketplace" },
        { name: "Analytics", href: "/analytics" },
        { name: "Institutional", href: "/institutional" },
        { name: "Developers", href: "/developers" },
    ];

    const copyAddress = () => {
        if (activeKey) {
            navigator.clipboard.writeText(activeKey);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    return (
        <>
            <motion.header
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled
                    ? "bg-[var(--flow-bg-primary)]/80 backdrop-blur-xl border-b border-white/5 shadow-2xl shadow-black/20"
                    : "bg-transparent"
                    }`}
            >
                <div className="container mx-auto px-6">
                    <div className="h-20 flex items-center justify-between">
                        {/* Logo */}
                        <Link href="/" className="flex items-center gap-3 group">
                            <motion.div
                                className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--flow-cyan)] to-[var(--flow-purple)] flex items-center justify-center"
                                whileHover={{ rotate: 180 }}
                                transition={{ duration: 0.5 }}
                            >
                                <span className="text-white font-bold text-lg">F</span>

                                {/* Ping effect */}
                                <span className="absolute inset-0 rounded-xl bg-gradient-to-br from-[var(--flow-cyan)] to-[var(--flow-purple)] animate-ping-slow opacity-50" />
                            </motion.div>

                            <span className="font-bold text-2xl tracking-tight">
                                <span className="text-white">Flow</span>
                                <span className="text-gradient">Fi</span>
                            </span>
                        </Link>

                        {/* Desktop Navigation */}
                        <nav className="hidden lg:flex items-center gap-1">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    className="relative px-5 py-2 group"
                                >
                                    <span className={`relative z-10 text-sm font-medium transition-colors ${pathname === link.href
                                        ? "text-white"
                                        : "text-[var(--flow-text-secondary)] hover:text-white"
                                        }`}>
                                        {link.name}
                                    </span>

                                    {/* Active Indicator */}
                                    {pathname === link.href && (
                                        <motion.div
                                            layoutId="navbar-indicator"
                                            className="absolute inset-0 bg-white/10 rounded-lg border border-white/10"
                                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                        />
                                    )}

                                    {/* Hover Effect */}
                                    <motion.div
                                        className="absolute inset-0 bg-white/5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                                    />
                                </Link>
                            ))}
                        </nav>

                        {/* Wallet Section */}
                        <div className="flex items-center gap-4">
                            {!isConnected ? (
                                <MagneticButton>
                                    <motion.button
                                        onClick={connect}
                                        className="hidden md:flex items-center gap-2 px-6 py-2.5 rounded-full font-medium text-sm border border-white/20 text-white hover:border-[var(--flow-cyan)] hover:text-[var(--flow-cyan)] transition-all duration-300 group"
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        <Wallet className="w-4 h-4" />
                                        <span>Connect Wallet</span>

                                        {/* Shimmer effect */}
                                        <div className="absolute inset-0 rounded-full overflow-hidden">
                                            <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                                        </div>
                                    </motion.button>
                                </MagneticButton>
                            ) : (
                                <div className="hidden md:flex items-center gap-3">
                                    {/* Address Display */}
                                    <motion.div
                                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                    >
                                        {/* Status Dot */}
                                        <span className="relative flex h-2 w-2">
                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--flow-cyan)] opacity-75" />
                                            <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--flow-cyan)]" />
                                        </span>

                                        <span className="text-xs font-mono text-[var(--flow-text-secondary)]">
                                            {activeKey?.slice(0, 8)}...{activeKey?.slice(-6)}
                                        </span>

                                        <button
                                            onClick={copyAddress}
                                            className="p-1 rounded hover:bg-white/10 transition-colors"
                                            title="Copy address"
                                        >
                                            {copied ? (
                                                <Check className="w-3 h-3 text-[var(--flow-cyan)]" />
                                            ) : (
                                                <Copy className="w-3 h-3 text-[var(--flow-text-muted)]" />
                                            )}
                                        </button>
                                    </motion.div>

                                    {/* Disconnect Button */}
                                    <motion.button
                                        onClick={disconnect}
                                        className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-[var(--flow-text-secondary)] hover:bg-red-500/20 hover:border-red-500/30 hover:text-red-400 transition-all"
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        title="Disconnect"
                                    >
                                        <Wallet className="w-4 h-4" />
                                    </motion.button>
                                </div>
                            )}

                            {/* Mobile Menu Button */}
                            <motion.button
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                className="lg:hidden p-2 rounded-xl bg-white/5 border border-white/10 text-white"
                                whileTap={{ scale: 0.9 }}
                            >
                                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                            </motion.button>
                        </div>
                    </div>
                </div>
            </motion.header>

            {/* Mobile Menu */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-40 lg:hidden"
                    >
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/80 backdrop-blur-xl"
                            onClick={() => setMobileMenuOpen(false)}
                        />

                        {/* Menu Content */}
                        <motion.nav
                            initial={{ x: "100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "100%" }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            className="absolute right-0 top-0 bottom-0 w-80 bg-[var(--flow-bg-secondary)] border-l border-white/10 p-6 pt-24"
                        >
                            <div className="space-y-2">
                                {navLinks.map((link, i) => (
                                    <motion.div
                                        key={link.name}
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.1 }}
                                    >
                                        <Link
                                            href={link.href}
                                            onClick={() => setMobileMenuOpen(false)}
                                            className={`block px-4 py-3 rounded-xl text-lg font-medium transition-all ${pathname === link.href
                                                ? "bg-white/10 text-white"
                                                : "text-[var(--flow-text-secondary)] hover:text-white hover:bg-white/5"
                                                }`}
                                        >
                                            {link.name}
                                        </Link>
                                    </motion.div>
                                ))}
                            </div>

                            {/* Mobile Wallet Section */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                                className="mt-8 pt-8 border-t border-white/10"
                            >
                                {!isConnected ? (
                                    <button
                                        onClick={connect}
                                        className="w-full py-4 rounded-xl font-semibold text-[var(--flow-bg-primary)] bg-gradient-to-r from-[var(--flow-cyan)] to-[var(--flow-purple)] hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                                    >
                                        <Wallet className="w-5 h-5" />
                                        Connect Wallet
                                    </button>
                                ) : (
                                    <div className="space-y-4">
                                        <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                                            <p className="text-xs text-[var(--flow-text-muted)] mb-1">Connected as</p>
                                            <p className="font-mono text-sm text-white break-all">
                                                {activeKey}
                                            </p>
                                        </div>
                                        <button
                                            onClick={disconnect}
                                            className="w-full py-3 rounded-xl font-medium text-red-400 bg-red-500/20 border border-red-500/30 hover:bg-red-500/30 transition-colors"
                                        >
                                            Disconnect
                                        </button>
                                    </div>
                                )}
                            </motion.div>
                        </motion.nav>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
