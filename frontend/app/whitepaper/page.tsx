"use client";

import { motion } from "framer-motion";
import { Download, FileText, ChevronRight, Lock, Zap, Brain } from "lucide-react";
import { FadeInSection, AnimatedWords } from "@/components/immersive/animated-text";
import { MagneticButton } from "@/components/immersive/smooth-scroll";

export default function Whitepaper() {
    return (
        <div className="min-h-screen relative overflow-hidden flex items-center justify-center">
            {/* Background */}
            <div className="absolute inset-0 bg-grid opacity-20 pointer-events-none" />
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[var(--flow-bg-secondary)] opacity-30 blur-[150px] rounded-full" />

            <div className="container mx-auto px-6 relative z-10 py-20">
                <div className="max-w-4xl mx-auto text-center">
                    <FadeInSection>
                        <span className="badge-premium mb-6 inline-block">Technical Whitepaper v1.0</span>
                    </FadeInSection>

                    <AnimatedWords className="text-5xl md:text-7xl font-bold font-display mb-8 text-white">
                        The FlowFi Protocol
                    </AnimatedWords>

                    <FadeInSection delay={0.2}>
                        <p className="text-xl text-[var(--flow-text-secondary)] mb-12 max-w-2xl mx-auto leading-relaxed">
                            A decentralized infrastructure for transforming real-world accounts receivable into liquid, tradable assets on the Casper Network using AI-driven risk scoring.
                        </p>
                    </FadeInSection>

                    <FadeInSection delay={0.4}>
                        <div className="grid md:grid-cols-3 gap-6 mb-16 text-left">
                            <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                                <Brain className="w-8 h-8 text-[var(--flow-cyan)] mb-4" />
                                <h3 className="font-bold text-white mb-2">AI Node Consensus</h3>
                                <p className="text-sm text-[var(--flow-text-secondary)]">How NodeOps agents reach consensus on off-chain asset valuation.</p>
                            </div>
                            <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                                <Lock className="w-8 h-8 text-[var(--flow-purple)] mb-4" />
                                <h3 className="font-bold text-white mb-2">CEP-78 Standards</h3>
                                <p className="text-sm text-[var(--flow-text-secondary)]">Implementation details of metadata mutability and fractional ownership.</p>
                            </div>
                            <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                                <Zap className="w-8 h-8 text-[var(--flow-green)] mb-4" />
                                <h3 className="font-bold text-white mb-2">Liquidity Pools</h3>
                                <p className="text-sm text-[var(--flow-text-secondary)]">Mathematical models for AMM-based invoice discounting.</p>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <MagneticButton>
                                <button
                                    onClick={() => alert("The full PDF whitepaper will be available for download after the Casper Hackathon judging period.")}
                                    className="btn-primary flex items-center gap-3 px-8 py-4 text-lg"
                                >
                                    <Download className="w-5 h-5" /> Download PDF
                                </button>
                            </MagneticButton>

                            <a href="/developers" className="flex items-center gap-2 text-[var(--flow-text-secondary)] hover:text-white transition-colors px-6 py-4">
                                Developer Docs <ChevronRight className="w-4 h-4" />
                            </a>
                        </div>
                    </FadeInSection>
                </div>
            </div>
        </div>
    );
}
