"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowUpRight, Github, Twitter, Linkedin, MessageCircle } from "lucide-react";
import { AnimatedLine, FadeInSection } from "@/components/immersive/animated-text";

export default function Footer() {
    const currentYear = new Date().getFullYear();

    const footerLinks = {
        product: [
            { name: "Dashboard", href: "/dashboard" },
            { name: "Marketplace", href: "/marketplace" },
            { name: "Analytics", href: "/analytics" },
            { name: "Institutional", href: "/institutional" },
        ],
        resources: [
            { name: "Documentation", href: "/developers" },
            { name: "API Reference", href: "/developers" },
            { name: "Whitepaper", href: "/whitepaper" },
            { name: "Community", href: "https://t.me/Vaiosx" },
        ],
        legal: [
            { name: "Privacy Policy", href: "/legal/privacy" },
            { name: "Terms of Service", href: "/legal/terms" },
            { name: "Compliance", href: "/legal/compliance" },
        ],
    };

    const socialLinks = [
        { icon: Linkedin, href: "https://www.linkedin.com/company/flowficasper/about/?viewAsMember=true", label: "LinkedIn" },
    ];

    return (
        <footer className="relative bg-[var(--flow-bg-secondary)] border-t border-white/5 overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-[var(--flow-cyan)] opacity-5 blur-[120px] rounded-full pointer-events-none" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[var(--flow-purple)] opacity-5 blur-[120px] rounded-full pointer-events-none" />

            <div className="container mx-auto px-6 relative z-10">
                {/* Main Footer Content */}
                <div className="py-16 lg:py-20">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8">
                        {/* Brand Column */}
                        <FadeInSection className="lg:col-span-5" direction="up">
                            <div className="space-y-6">
                                {/* Logo */}
                                <Link href="/" className="inline-flex items-center gap-3 group">
                                    <div className="relative w-12 h-12 rounded-xl overflow-hidden group-hover:scale-105 transition-transform duration-300">
                                        <Image
                                            src="/flowfi-logo.jpg"
                                            alt="FlowFi Logo"
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                    <span className="font-bold text-3xl tracking-tight">
                                        <span className="text-white">Flow</span>
                                        <span className="text-gradient">Fi</span>
                                    </span>
                                </Link>

                                <p className="text-[var(--flow-text-secondary)] max-w-md leading-relaxed">
                                    Revolucionando el factoraje de facturas con inteligencia artificial y blockchain.
                                    Liquidez instantánea respaldada por{" "}
                                    <span className="text-[var(--flow-cyan)] font-medium">Casper Network</span> y análisis de riesgo con{" "}
                                    <span className="text-[var(--flow-cyan)] font-medium">NodeOps AI</span>.
                                </p>

                                {/* Stats Row */}
                                <div className="flex gap-8 pt-4">
                                    <div>
                                        <p className="text-2xl font-bold text-white">$142M+</p>
                                        <p className="text-xs text-[var(--flow-text-muted)] uppercase tracking-wider">Volumen Total</p>
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold text-white">0.08%</p>
                                        <p className="text-xs text-[var(--flow-text-muted)] uppercase tracking-wider">Default Rate</p>
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold text-white">500+</p>
                                        <p className="text-xs text-[var(--flow-text-muted)] uppercase tracking-wider">Inversores</p>
                                    </div>
                                </div>
                            </div>
                        </FadeInSection>

                        {/* Links Columns */}
                        <div className="lg:col-span-7 grid grid-cols-2 md:grid-cols-3 gap-8">
                            {/* Product */}
                            <FadeInSection direction="up" delay={0.1}>
                                <h4 className="text-white font-semibold mb-6 text-sm uppercase tracking-wider">Product</h4>
                                <ul className="space-y-4">
                                    {footerLinks.product.map((link) => (
                                        <li key={link.name}>
                                            <Link
                                                href={link.href}
                                                className="text-[var(--flow-text-secondary)] hover:text-[var(--flow-cyan)] transition-colors flex items-center gap-1 group"
                                            >
                                                {link.name}
                                                <ArrowUpRight className="w-3 h-3 opacity-0 -translate-y-1 translate-x-1 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all" />
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </FadeInSection>

                            {/* Resources */}
                            <FadeInSection direction="up" delay={0.2}>
                                <h4 className="text-white font-semibold mb-6 text-sm uppercase tracking-wider">Resources</h4>
                                <ul className="space-y-4">
                                    {footerLinks.resources.map((link) => (
                                        <li key={link.name}>
                                            <Link
                                                href={link.href}
                                                className="text-[var(--flow-text-secondary)] hover:text-[var(--flow-cyan)] transition-colors flex items-center gap-1 group"
                                            >
                                                {link.name}
                                                <ArrowUpRight className="w-3 h-3 opacity-0 -translate-y-1 translate-x-1 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all" />
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </FadeInSection>

                            {/* Legal */}
                            <FadeInSection direction="up" delay={0.3}>
                                <h4 className="text-white font-semibold mb-6 text-sm uppercase tracking-wider">Legal</h4>
                                <ul className="space-y-4">
                                    {footerLinks.legal.map((link) => (
                                        <li key={link.name}>
                                            <Link
                                                href={link.href}
                                                className="text-[var(--flow-text-secondary)] hover:text-[var(--flow-cyan)] transition-colors flex items-center gap-1 group"
                                            >
                                                {link.name}
                                                <ArrowUpRight className="w-3 h-3 opacity-0 -translate-y-1 translate-x-1 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all" />
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </FadeInSection>
                        </div>
                    </div>
                </div>

                {/* Divider */}
                <AnimatedLine className="opacity-20" />

                {/* Bottom Bar */}
                <div className="py-8 flex flex-col md:flex-row justify-between items-center gap-6">
                    {/* Copyright */}
                    <FadeInSection direction="up" delay={0.4}>
                        <div className="flex flex-col md:flex-row items-center gap-4 text-sm text-[var(--flow-text-muted)]">
                            <p>© {currentYear} Released under MIT License</p>
                            <span className="hidden md:block">•</span>
                            <p className="flex items-center gap-2">
                                Develop by <a href="https://t.me/Vaiosx" target="_blank" rel="noopener noreferrer" className="hover:text-[var(--flow-cyan)] transition-colors">Vaiosx</a> & M0nsxx
                            </p>
                        </div>
                    </FadeInSection>

                    {/* Social Links */}
                    <FadeInSection direction="up" delay={0.5}>
                        <div className="flex items-center gap-2">
                            {socialLinks.map((social) => (
                                <motion.a
                                    key={social.label}
                                    href={social.href}
                                    className="p-3 rounded-xl bg-white/5 border border-white/5 text-[var(--flow-text-secondary)] hover:text-[var(--flow-cyan)] hover:bg-[var(--flow-cyan)]/10 hover:border-[var(--flow-cyan)]/30 transition-all"
                                    whileHover={{ y: -2 }}
                                    whileTap={{ scale: 0.95 }}
                                    aria-label={social.label}
                                >
                                    <social.icon className="w-4 h-4" />
                                </motion.a>
                            ))}
                        </div>
                    </FadeInSection>
                </div>

                {/* Powered By Section */}
                <div className="pb-8 flex justify-center">
                    <FadeInSection direction="up" delay={0.6}>
                        <div className="flex items-center gap-6 px-6 py-3 rounded-full bg-white/5 border border-white/5">
                            <span className="text-xs text-[var(--flow-text-muted)] uppercase tracking-wider">Powered by</span>
                            <div className="flex items-center gap-4">
                                {/* Casper Logo Placeholder */}
                                <div className="flex items-center gap-2 text-[var(--flow-text-secondary)]">
                                    <div className="w-5 h-5 rounded bg-gradient-to-br from-red-500 to-pink-500" />
                                    <span className="text-sm font-medium">Casper</span>
                                </div>

                                {/* NodeOps Logo Placeholder */}
                                <div className="flex items-center gap-2 text-[var(--flow-text-secondary)]">
                                    <div className="w-5 h-5 rounded bg-gradient-to-br from-blue-500 to-purple-500" />
                                    <span className="text-sm font-medium">NodeOps</span>
                                </div>

                                {/* IPFS Storage */}
                                <div className="flex items-center gap-2 text-[var(--flow-text-secondary)]">
                                    <div className="w-5 h-5 rounded bg-gradient-to-br from-cyan-500 to-teal-500" />
                                    <span className="text-sm font-medium">IPFS</span>
                                </div>
                            </div>
                        </div>
                    </FadeInSection>
                </div>
            </div>
        </footer>
    );
}
