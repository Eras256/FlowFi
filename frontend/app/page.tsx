"use client";

import { useRef, useEffect, Suspense } from "react";
import dynamic from "next/dynamic";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import Link from "next/link";
import {
    ArrowRight,
    Shield,
    Zap,
    TrendingUp,
    FileText,
    Coins,
    BarChart3,
    Lock,
    Globe,
    Cpu,
    Sparkles,
    CheckCircle,
    ArrowUpRight,
    Play
} from "lucide-react";

// Dynamic import with SSR disabled for Three.js component
const ParticleField = dynamic(() => import("@/components/immersive/particle-field"), { ssr: false });

import AnimatedText, {
    AnimatedWords,
    AnimatedCounter,
    AnimatedLine,
    FadeInSection,
    Parallax
} from "@/components/immersive/animated-text";
import {
    Card3D,
    GlowingCard,
    FloatingCard,
    InvoicePreviewCard,
    StatsCard
} from "@/components/immersive/cards";
import {
    MagneticButton,
    StaggerContainer,
    ScaleOnScroll
} from "@/components/immersive/smooth-scroll";

export default function Home() {
    const heroRef = useRef<HTMLElement>(null);
    const processRef = useRef<HTMLElement>(null);
    const featuresRef = useRef<HTMLElement>(null);

    const { scrollYProgress } = useScroll({
        target: heroRef,
        offset: ["start start", "end start"],
    });

    const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
    const heroScale = useTransform(scrollYProgress, [0, 0.5], [1, 0.95]);
    const heroY = useTransform(scrollYProgress, [0, 0.5], [0, 100]);

    const processInView = useInView(processRef, { once: true, margin: "-100px" });

    const processSteps = [
        {
            step: "01",
            title: "Upload Invoice",
            description: "Drop your PDF invoice. Our AI instantly extracts and validates all data.",
            icon: FileText,
            color: "var(--flow-cyan)",
        },
        {
            step: "02",
            title: "AI Risk Analysis",
            description: "NodeOps AI scores risk in seconds, analyzing thousands of data points.",
            icon: Cpu,
            color: "var(--flow-purple)",
        },
        {
            step: "03",
            title: "Mint as NFT",
            description: "Your verified invoice becomes a tradeable asset on Casper Network.",
            icon: Coins,
            color: "var(--flow-pink)",
        },
        {
            step: "04",
            title: "Get Funded",
            description: "Investors fund your invoice instantly. You get liquidity in minutes.",
            icon: TrendingUp,
            color: "var(--flow-green)",
        },
    ];

    const stats = [
        { value: 142, suffix: "M+", label: "Volume Traded", prefix: "$" },
        { value: 0.08, suffix: "%", label: "Default Rate", decimals: 2 },
        { value: 500, suffix: "+", label: "Active Investors" },
        { value: 30, suffix: "sec", label: "AI Analysis Time" },
    ];

    const features = [
        {
            icon: Zap,
            title: "Instant Liquidity",
            description: "Skip the 90-day wait. Get funded in minutes, not months. Our smart contracts ensure instant settlement.",
            gradient: "from-yellow-500 to-orange-500",
        },
        {
            icon: Shield,
            title: "AI Risk Scoring",
            description: "NodeOps AI analyzes thousands of data points to verify every invoice, ensuring enterprise-grade security.",
            gradient: "from-cyan-500 to-blue-500",
        },
        {
            icon: TrendingUp,
            title: "High-Yield Returns",
            description: "Earn consistent 8-16% APY returns backed by real-world assets. Diversify with verified invoices.",
            gradient: "from-green-500 to-emerald-500",
        },
        {
            icon: Lock,
            title: "Blockchain Security",
            description: "Built on Casper Network with enterprise-grade smart contracts. Every transaction is immutable and verifiable.",
            gradient: "from-purple-500 to-pink-500",
        },
        {
            icon: Globe,
            title: "Global Access",
            description: "Access invoice factoring from anywhere in the world. No borders, no middlemen, no delays.",
            gradient: "from-blue-500 to-indigo-500",
        },
        {
            icon: BarChart3,
            title: "Real-Time Analytics",
            description: "Track your portfolio performance with advanced analytics. Monitor risk scores and yields in real-time.",
            gradient: "from-pink-500 to-rose-500",
        },
    ];

    return (
        <div className="relative overflow-hidden">
            {/* ===== HERO SECTION ===== */}
            <section
                ref={heroRef}
                className="relative min-h-screen flex items-center justify-center overflow-hidden"
            >
                {/* 3D Particle Background */}
                <Suspense fallback={
                    <div className="absolute inset-0 bg-gradient-to-br from-[var(--flow-bg-primary)] to-[var(--flow-bg-secondary)]" />
                }>
                    <ParticleField className="absolute inset-0 z-0" intensity="high" />
                </Suspense>

                {/* Gradient Orbs */}
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[var(--flow-cyan)] opacity-10 blur-[150px] rounded-full pointer-events-none animate-orb-float" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[var(--flow-purple)] opacity-10 blur-[150px] rounded-full pointer-events-none animate-orb-float" style={{ animationDelay: '-5s' }} />

                <motion.div
                    className="container mx-auto px-6 relative z-10"
                    style={{ opacity: heroOpacity, scale: heroScale, y: heroY }}
                >
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        {/* Left: Text Content */}
                        <div className="space-y-8">
                            {/* Badge */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.2 }}
                            >
                                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm">
                                    <span className="relative flex h-2 w-2">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--flow-cyan)] opacity-75" />
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--flow-cyan)]" />
                                    </span>
                                    <span className="text-[var(--flow-text-secondary)]">Project on</span>
                                    <span className="text-white font-medium">Casper Network</span>
                                </span>
                            </motion.div>

                            {/* Headline */}
                            <div>
                                <AnimatedWords
                                    className="font-display text-5xl md:text-6xl lg:text-7xl font-bold leading-tight"
                                >
                                    Liquidity at the Speed of AI
                                </AnimatedWords>
                            </div>

                            {/* Subheadline */}
                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.6 }}
                                className="text-lg md:text-xl text-[var(--flow-text-secondary)] max-w-lg leading-relaxed"
                            >
                                Transform unpaid invoices into instant working capital using{" "}
                                <span className="text-[var(--flow-cyan)] font-medium">Casper Network's</span> enterprise-grade security and{" "}
                                <span className="text-[var(--flow-cyan)] font-medium">NodeOps AI</span> risk scoring.
                            </motion.p>

                            {/* CTA Buttons */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.8 }}
                                className="flex flex-wrap gap-4"
                            >
                                <MagneticButton>
                                    <Link href="/dashboard" className="btn-primary flex items-center gap-2">
                                        Get Funded <ArrowRight className="w-4 h-4" />
                                    </Link>
                                </MagneticButton>

                                <MagneticButton>
                                    <Link href="/marketplace" className="btn-secondary flex items-center gap-2">
                                        Start Investing <ArrowUpRight className="w-4 h-4" />
                                    </Link>
                                </MagneticButton>
                            </motion.div>

                            {/* Trust Badges */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.6, delay: 1 }}
                                className="flex items-center gap-6 pt-4"
                            >
                                <div className="flex items-center gap-2 text-sm text-[var(--flow-text-muted)]">
                                    <CheckCircle className="w-4 h-4 text-[var(--flow-green)]" />
                                    <span>Non-custodial</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-[var(--flow-text-muted)]">
                                    <CheckCircle className="w-4 h-4 text-[var(--flow-green)]" />
                                    <span>CEP-78 NFTs</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-[var(--flow-text-muted)]">
                                    <CheckCircle className="w-4 h-4 text-[var(--flow-green)]" />
                                    <span>AI Verified</span>
                                </div>
                            </motion.div>
                        </div>

                        {/* Right: Visual */}
                        <div className="relative lg:h-[600px] flex items-center justify-center">
                            <FloatingCard delay={0}>
                                <InvoicePreviewCard
                                    invoiceId="INV-8821"
                                    vendor="TechCorp Inc."
                                    amount={12500}
                                    riskScore="A+"
                                    apy="12.5%"
                                    className="w-80"
                                />
                            </FloatingCard>

                            {/* Floating Elements */}
                            <motion.div
                                className="absolute -right-8 top-20 glass rounded-xl p-4 border border-white/10"
                                animate={{ y: [0, -15, 0], rotate: [0, 2, 0] }}
                                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-[var(--flow-green)]/20 flex items-center justify-center">
                                        <TrendingUp className="w-5 h-5 text-[var(--flow-green)]" />
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold text-[var(--flow-green)]">+12.5%</p>
                                        <p className="text-xs text-[var(--flow-text-muted)]">Est. APY</p>
                                    </div>
                                </div>
                            </motion.div>

                            <motion.div
                                className="absolute -left-12 bottom-32 glass rounded-xl p-4 border border-white/10"
                                animate={{ y: [0, 15, 0], rotate: [0, -2, 0] }}
                                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-[var(--flow-cyan)]/20 flex items-center justify-center">
                                        <Shield className="w-5 h-5 text-[var(--flow-cyan)]" />
                                    </div>
                                    <div>
                                        <p className="text-lg font-bold text-white">AI Verified</p>
                                        <p className="text-xs text-[var(--flow-text-muted)]">Risk Score: A+</p>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </motion.div>

                {/* Scroll Indicator */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.5 }}
                    className="absolute bottom-8 left-1/2 -translate-x-1/2"
                >
                    <motion.div
                        animate={{ y: [0, 10, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="flex flex-col items-center gap-2 text-[var(--flow-text-muted)]"
                    >
                        <span className="text-xs uppercase tracking-widest">Scroll</span>
                        <div className="w-5 h-8 rounded-full border-2 border-white/20 flex items-start justify-center p-1">
                            <motion.div
                                animate={{ y: [0, 12, 0] }}
                                transition={{ duration: 2, repeat: Infinity }}
                                className="w-1 h-2 rounded-full bg-[var(--flow-cyan)]"
                            />
                        </div>
                    </motion.div>
                </motion.div>
            </section>

            {/* ===== STATS SECTION ===== */}
            <section className="py-12 md:py-24 relative">
                <div className="container mx-auto px-6">
                    <ScaleOnScroll>
                        <div className="glass rounded-3xl p-8 md:p-12 border border-white/10">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                                {stats.map((stat, i) => (
                                    <FadeInSection key={i} delay={i * 0.1} direction="up">
                                        <div className="text-center">
                                            <p className="text-4xl md:text-5xl font-bold text-gradient mb-2">
                                                <AnimatedCounter
                                                    to={stat.value}
                                                    suffix={stat.suffix}
                                                    prefix={stat.prefix || ""}
                                                    decimals={stat.decimals || 0}
                                                />
                                            </p>
                                            <p className="text-sm text-[var(--flow-text-muted)] uppercase tracking-wider">
                                                {stat.label}
                                            </p>
                                        </div>
                                    </FadeInSection>
                                ))}
                            </div>
                        </div>
                    </ScaleOnScroll>
                </div>
            </section>

            {/* ===== HOW IT WORKS SECTION ===== */}
            <section ref={processRef} className="py-16 md:py-32 relative overflow-hidden">
                {/* Background Decoration */}
                <div className="absolute left-0 top-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                <div className="absolute right-0 top-1/2 w-1/2 h-px bg-gradient-to-l from-transparent via-white/10 to-transparent" />

                <div className="container mx-auto px-6">
                    {/* Section Header */}
                    <div className="text-center max-w-3xl mx-auto mb-12 md:mb-20">
                        <FadeInSection>
                            <span className="badge-premium mb-4 inline-block">How It Works</span>
                        </FadeInSection>
                        <AnimatedWords className="section-title mb-6">
                            From Invoice to Funding in 4 Simple Steps
                        </AnimatedWords>
                        <FadeInSection delay={0.2}>
                            <p className="section-subtitle mx-auto">
                                Our streamlined process combines AI verification with blockchain security to deliver the fastest invoice factoring experience.
                            </p>
                        </FadeInSection>
                    </div>

                    {/* Process Steps */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {processSteps.map((step, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 40 }}
                                animate={processInView ? { opacity: 1, y: 0 } : {}}
                                transition={{ duration: 0.6, delay: i * 0.15 }}
                            >
                                <GlowingCard className="h-full rounded-2xl">
                                    <div className="p-8 h-full flex flex-col">
                                        {/* Step Number */}
                                        <span
                                            className="text-6xl font-bold opacity-10 mb-4"
                                            style={{ color: step.color }}
                                        >
                                            {step.step}
                                        </span>

                                        {/* Icon */}
                                        <div
                                            className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6"
                                            style={{
                                                backgroundColor: `${step.color}20`,
                                                color: step.color
                                            }}
                                        >
                                            <step.icon className="w-7 h-7" />
                                        </div>

                                        {/* Content */}
                                        <h3 className="text-xl font-bold text-white mb-3">
                                            {step.title}
                                        </h3>
                                        <p className="text-[var(--flow-text-secondary)] leading-relaxed flex-grow">
                                            {step.description}
                                        </p>

                                        {/* Connector Line (except last) */}
                                        {i < processSteps.length - 1 && (
                                            <div className="hidden lg:block absolute right-0 top-1/2 w-8 h-px bg-gradient-to-r from-white/20 to-transparent" />
                                        )}
                                    </div>
                                </GlowingCard>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ===== FEATURES SECTION ===== */}
            <section ref={featuresRef} className="py-16 md:py-32 relative">
                {/* Background */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[var(--flow-cyan)]/5 to-transparent pointer-events-none" />

                <div className="container mx-auto px-6 relative z-10">
                    {/* Section Header */}
                    <div className="text-center max-w-3xl mx-auto mb-12 md:mb-20">
                        <FadeInSection>
                            <span className="badge-success mb-4 inline-block">Features</span>
                        </FadeInSection>
                        <AnimatedWords className="section-title mb-6">
                            Built for the Future of Finance
                        </AnimatedWords>
                        <FadeInSection delay={0.2}>
                            <p className="section-subtitle mx-auto">
                                Experience the most advanced invoice factoring platform, powered by cutting-edge AI and blockchain technology.
                            </p>
                        </FadeInSection>
                    </div>

                    {/* Features Grid */}
                    <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-3 gap-8" stagger={0.1}>
                        {features.map((feature, i) => (
                            <div key={i} data-stagger-item>
                                <Card3D className="h-full">
                                    <div className="glass rounded-2xl p-8 h-full border border-white/10 group hover:border-white/20 transition-all duration-500">
                                        {/* Icon */}
                                        <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500`}>
                                            <feature.icon className="w-7 h-7 text-white" />
                                        </div>

                                        {/* Content */}
                                        <h3 className="text-xl font-bold text-white mb-3 group-hover:text-gradient transition-all duration-500">
                                            {feature.title}
                                        </h3>
                                        <p className="text-[var(--flow-text-secondary)] leading-relaxed">
                                            {feature.description}
                                        </p>
                                    </div>
                                </Card3D>
                            </div>
                        ))}
                    </StaggerContainer>
                </div>
            </section>

            {/* ===== CTA SECTION ===== */}
            <section className="py-16 md:py-32 relative overflow-hidden">
                <div className="container mx-auto px-6">
                    <ScaleOnScroll>
                        <div className="relative rounded-3xl overflow-hidden">
                            {/* Background Gradient */}
                            <div className="absolute inset-0 bg-gradient-to-br from-[var(--flow-cyan)]/20 via-[var(--flow-purple)]/20 to-[var(--flow-pink)]/20" />
                            <div className="absolute inset-0 bg-[var(--flow-bg-secondary)]" style={{ opacity: 0.9 }} />

                            {/* Grid Pattern */}
                            <div className="absolute inset-0 bg-grid opacity-50" />

                            {/* Content */}
                            <div className="relative z-10 py-12 md:py-20 px-8 md:px-16 text-center">
                                <FadeInSection>
                                    <Sparkles className="w-12 h-12 text-[var(--flow-cyan)] mx-auto mb-6" />
                                </FadeInSection>

                                <AnimatedWords className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 max-w-4xl mx-auto">
                                    Ready to Transform Your Cash Flow?
                                </AnimatedWords>

                                <FadeInSection delay={0.3}>
                                    <p className="text-xl text-[var(--flow-text-secondary)] max-w-2xl mx-auto mb-10">
                                        Join hundreds of businesses already using FlowFi to unlock instant liquidity. Start in under 5 minutes.
                                    </p>
                                </FadeInSection>

                                <FadeInSection delay={0.5}>
                                    <div className="flex flex-wrap justify-center gap-4">
                                        <MagneticButton>
                                            <Link href="/dashboard" className="btn-primary text-lg px-10 py-5 flex items-center gap-3">
                                                Start Now <ArrowRight className="w-5 h-5" />
                                            </Link>
                                        </MagneticButton>

                                        <MagneticButton>
                                            <Link href="/developers" className="btn-secondary text-lg px-10 py-5 flex items-center gap-3">
                                                View Documentation
                                            </Link>
                                        </MagneticButton>
                                    </div>
                                </FadeInSection>
                            </div>
                        </div>
                    </ScaleOnScroll>
                </div>
            </section>
        </div>
    );
}
