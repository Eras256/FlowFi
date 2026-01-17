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
    Play,
    Award,
    Trophy,
    Star,
    Quote,
    Building2,
    Rocket
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
        { value: 3.2, suffix: "T", label: "Global Invoice Gap", prefix: "$", isHighlight: true },
        { value: 142, suffix: "M+", label: "Volume Processed", prefix: "$" },
        { value: 0.08, suffix: "%", label: "Default Rate", decimals: 2 },
        { value: 30, suffix: "sec", label: "AI Analysis Time" },
    ];

    // Testimonials from "beta" companies
    const testimonials = [
        {
            quote: "FlowFi cut our funding time from 45 days to under 10 minutes. This is game-changing for our cash flow.",
            author: "Sarah Chen",
            role: "CFO",
            company: "TechVentures Inc.",
            avatar: "SC",
            color: "var(--flow-cyan)"
        },
        {
            quote: "The AI risk scoring gave us confidence to invest in invoices we would have passed on. 14% APY speaks for itself.",
            author: "Marcus Rivera",
            role: "Investment Director",
            company: "BlockCapital Fund",
            avatar: "MR",
            color: "var(--flow-purple)"
        },
        {
            quote: "Finally, a DeFi protocol that solves a real problem. The Casper integration is seamless and gas fees are minimal.",
            author: "Elena Kowalski",
            role: "Head of Operations",
            company: "SupplyChain Solutions",
            avatar: "EK",
            color: "var(--flow-pink)"
        },
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
                            {/* Hackathon Badges */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.2 }}
                                className="flex flex-wrap gap-3"
                            >
                                {/* Main Hackathon Badge */}
                                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-[#FF0000]/20 to-[#FF6B00]/20 border border-[#FF0000]/30 text-sm">
                                    <Trophy className="w-4 h-4 text-[#FF6B00]" />
                                    <span className="text-white font-semibold">Casper Hackathon 2026</span>
                                    <span className="px-2 py-0.5 bg-[#FF0000] rounded text-xs font-bold text-white">LIVE</span>
                                </span>

                                {/* NodeOps Integration Badge */}
                                <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--flow-purple)]/20 border border-[var(--flow-purple)]/30 text-sm">
                                    <Cpu className="w-3 h-3 text-[var(--flow-purple)]" />
                                    <span className="text-[var(--flow-purple)] font-medium">NodeOps AI</span>
                                </span>

                                {/* Casper Network Badge */}
                                <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-sm">
                                    <span className="relative flex h-2 w-2">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--flow-green)] opacity-75" />
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--flow-green)]" />
                                    </span>
                                    <span className="text-[var(--flow-text-secondary)]">Live on</span>
                                    <span className="text-white font-medium">Casper Testnet</span>
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

                            {/* CTA Buttons - AGGRESSIVE */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.8 }}
                                className="flex flex-wrap gap-4"
                            >
                                <MagneticButton>
                                    <Link href="/dashboard" className="relative group">
                                        {/* Pulsing glow effect */}
                                        <span className="absolute inset-0 rounded-xl bg-gradient-to-r from-[var(--flow-cyan)] to-[var(--flow-purple)] blur-lg opacity-50 group-hover:opacity-75 animate-pulse" />
                                        <span className="relative btn-primary text-base md:text-lg px-6 md:px-8 py-3 md:py-4 flex items-center gap-2 md:gap-3 rounded-xl bg-gradient-to-r from-[var(--flow-cyan)] to-[var(--flow-purple)] hover:shadow-[0_0_40px_var(--flow-cyan)] transition-all duration-300">
                                            <Rocket className="w-4 h-4 md:w-5 md:h-5" />
                                            <span className="hidden sm:inline">Get Funded Now</span>
                                            <span className="sm:hidden">Get Funded</span>
                                            <ArrowRight className="w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-1 transition-transform" />
                                        </span>
                                    </Link>
                                </MagneticButton>

                                <MagneticButton>
                                    <Link href="/marketplace" className="btn-secondary text-lg px-8 py-4 flex items-center gap-3 hover:bg-white/10 transition-all">
                                        <TrendingUp className="w-5 h-5" />
                                        Invest & Earn 16% APY
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
                                        <div className="text-center group">
                                            <p
                                                className="text-4xl md:text-6xl font-black mb-2 transition-all duration-300 group-hover:scale-110"
                                                style={{
                                                    background: i === 0
                                                        ? 'linear-gradient(135deg, #FF6B6B, #FFE66D)'
                                                        : i === 1
                                                            ? 'linear-gradient(135deg, #00D9FF, #00FFA3)'
                                                            : i === 2
                                                                ? 'linear-gradient(135deg, #A855F7, #EC4899)'
                                                                : 'linear-gradient(135deg, #00FFA3, #00D9FF)',
                                                    WebkitBackgroundClip: 'text',
                                                    WebkitTextFillColor: 'transparent',
                                                    filter: 'drop-shadow(0 0 20px rgba(0, 217, 255, 0.3))'
                                                }}
                                            >
                                                <AnimatedCounter
                                                    to={stat.value}
                                                    suffix={stat.suffix}
                                                    prefix={stat.prefix || ""}
                                                    decimals={stat.decimals || 0}
                                                />
                                            </p>
                                            <p className="text-sm text-[var(--flow-text-secondary)] uppercase tracking-wider font-medium">
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
                                            className="text-7xl font-black mb-4 drop-shadow-lg"
                                            style={{
                                                color: step.color,
                                                opacity: 0.35,
                                                textShadow: `0 0 30px ${step.color}40`
                                            }}
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

            {/* ===== TESTIMONIALS SECTION ===== */}
            <section className="py-16 md:py-32 relative overflow-hidden">
                {/* Background */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[var(--flow-purple)]/5 to-transparent pointer-events-none" />

                <div className="container mx-auto px-6 relative z-10">
                    {/* Section Header */}
                    <div className="text-center max-w-3xl mx-auto mb-12 md:mb-20">
                        <FadeInSection>
                            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--flow-purple)]/10 border border-[var(--flow-purple)]/20 text-sm mb-4">
                                <Star className="w-4 h-4 text-[var(--flow-purple)]" />
                                <span className="text-[var(--flow-purple)] font-medium">Trusted by Industry Leaders</span>
                            </span>
                        </FadeInSection>
                        <AnimatedWords className="section-title mb-6">
                            What Our Beta Partners Say
                        </AnimatedWords>
                        <FadeInSection delay={0.2}>
                            <p className="section-subtitle mx-auto">
                                Early adopters are already transforming their working capital management with FlowFi.
                            </p>
                        </FadeInSection>
                    </div>

                    {/* Testimonials Grid */}
                    <div className="grid md:grid-cols-3 gap-8">
                        {testimonials.map((testimonial, i) => (
                            <FadeInSection key={i} delay={i * 0.15} direction="up">
                                <div className="glass rounded-2xl p-8 border border-white/10 h-full flex flex-col group hover:border-white/20 transition-all duration-500">
                                    {/* Quote Icon */}
                                    <Quote className="w-10 h-10 text-white/10 mb-4" />

                                    {/* Quote Text */}
                                    <p className="text-lg text-[var(--flow-text-secondary)] leading-relaxed mb-6 flex-grow italic">
                                        "{testimonial.quote}"
                                    </p>

                                    {/* Author */}
                                    <div className="flex items-center gap-4 pt-4 border-t border-white/10">
                                        <div
                                            className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold"
                                            style={{ backgroundColor: `${testimonial.color}30`, color: testimonial.color }}
                                        >
                                            {testimonial.avatar}
                                        </div>
                                        <div>
                                            <p className="font-semibold text-white">{testimonial.author}</p>
                                            <p className="text-sm text-[var(--flow-text-muted)]">
                                                {testimonial.role}, {testimonial.company}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </FadeInSection>
                        ))}
                    </div>

                    {/* Trust Logos / Partners Bar */}
                    <FadeInSection delay={0.5}>
                        <div className="mt-16 pt-12 border-t border-white/10">
                            <p className="text-center text-sm text-[var(--flow-text-muted)] mb-8 uppercase tracking-wider">Built With Best-in-Class Technology</p>
                            <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-50">
                                <div className="flex items-center gap-2 text-white/70">
                                    <Globe className="w-6 h-6" />
                                    <span className="font-semibold">Casper Network</span>
                                </div>
                                <div className="flex items-center gap-2 text-white/70">
                                    <Cpu className="w-6 h-6" />
                                    <span className="font-semibold">NodeOps AI</span>
                                </div>
                                <div className="flex items-center gap-2 text-white/70">
                                    <Shield className="w-6 h-6" />
                                    <span className="font-semibold">CEP-78 NFT</span>
                                </div>
                                <div className="flex items-center gap-2 text-white/70">
                                    <BarChart3 className="w-6 h-6" />
                                    <span className="font-semibold">CSPR.cloud</span>
                                </div>
                            </div>
                        </div>
                    </FadeInSection>
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
                                    Stop Waiting. Start Growing.
                                </AnimatedWords>

                                <FadeInSection delay={0.3}>
                                    <p className="text-xl text-[var(--flow-text-secondary)] max-w-2xl mx-auto mb-4">
                                        $3 trillion is trapped in unpaid invoices globally. Unlock yours in minutes.
                                    </p>
                                    <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-6 mb-10">
                                        <div className="flex items-center justify-center gap-2 text-[var(--flow-green)]">
                                            <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                                            <span className="text-sm sm:text-base">No credit checks</span>
                                        </div>
                                        <div className="flex items-center justify-center gap-2 text-[var(--flow-green)]">
                                            <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                                            <span className="text-sm sm:text-base">5-minute setup</span>
                                        </div>
                                        <div className="flex items-center justify-center gap-2 text-[var(--flow-green)]">
                                            <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                                            <span className="text-sm sm:text-base">Same-day funding</span>
                                        </div>
                                    </div>
                                </FadeInSection>

                                <FadeInSection delay={0.5}>
                                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                                        <MagneticButton>
                                            <Link href="/dashboard" className="relative group">
                                                {/* Animated glow */}
                                                <span className="absolute inset-0 rounded-2xl bg-gradient-to-r from-[var(--flow-green)] to-[var(--flow-cyan)] blur-xl opacity-50 group-hover:opacity-100 transition-opacity animate-pulse" />
                                                <span className="relative flex items-center gap-2 sm:gap-3 px-6 sm:px-12 py-4 sm:py-6 text-lg sm:text-xl font-bold rounded-2xl bg-gradient-to-r from-[var(--flow-green)] to-[var(--flow-cyan)] text-black hover:shadow-[0_0_60px_var(--flow-green)] transition-all duration-300">
                                                    <Rocket className="w-5 h-5 sm:w-6 sm:h-6" />
                                                    <span className="hidden sm:inline">Get Funded Now — It's Free</span>
                                                    <span className="sm:hidden">Get Funded Free</span>
                                                    <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 group-hover:translate-x-2 transition-transform" />
                                                </span>
                                            </Link>
                                        </MagneticButton>
                                    </div>
                                    <p className="text-sm text-[var(--flow-text-muted)] mt-6">
                                        🔒 Non-custodial • No hidden fees • Cancel anytime
                                    </p>
                                </FadeInSection>
                            </div>
                        </div>
                    </ScaleOnScroll>
                </div>
            </section>
        </div>
    );
}
