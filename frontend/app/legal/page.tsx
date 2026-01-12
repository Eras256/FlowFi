"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { FadeInSection } from "@/components/immersive/animated-text";

export default function Legal() {
    const searchParams = useSearchParams();

    // Simple hash scrolling fix
    useEffect(() => {
        const hash = window.location.hash;
        if (hash) {
            const id = hash.replace("#", "");
            const element = document.getElementById(id);
            if (element) element.scrollIntoView({ behavior: "smooth" });
        }
    }, [searchParams]);

    return (
        <div className="min-h-screen py-24 relative">
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[var(--flow-bg-secondary)] opacity-20 blur-[100px] rounded-full" />
            </div>

            <div className="container mx-auto px-6 relative z-10 max-w-4xl">
                <div className="mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold font-display text-white mb-6">
                        Legal Information
                    </h1>
                    <p className="text-xl text-[var(--flow-text-secondary)]">
                        Transparency and compliance are at the core of FlowFi's infrastructure.
                    </p>
                </div>

                <div className="space-y-24">
                    {/* Privacy Policy */}
                    <div id="privacy" className="scroll-mt-32">
                        <FadeInSection>
                            <h2 className="text-3xl font-bold text-white mb-6">Privacy Policy</h2>
                            <div className="prose prose-invert max-w-none text-[var(--flow-text-secondary)]">
                                <p className="mb-4">Last Updated: January 11, 2026</p>
                                <p className="mb-4">
                                    At FlowFi, we take your privacy seriously. This Privacy Policy explains how we collect, use, and protect your personal information when you use our decentralized factoring platform ("Service") on the Casper Network.
                                </p>
                                <h3 className="text-xl font-bold text-white mt-8 mb-4">1. Data Collection</h3>
                                <p className="mb-4">
                                    We collect information that you provide directly to us, such as when you create an account, upload invoices, or communicate with us. This may include:
                                </p>
                                <ul className="list-disc pl-6 mb-4 space-y-2">
                                    <li>Identity data (Name, Tax ID, Company Details) via CasperID integration.</li>
                                    <li>Transactional data (Wallet addresses, Invoice details, Payment history) stored on-chain.</li>
                                    <li>Technical data (IP address, Browser type) for security purposes.</li>
                                </ul>

                                <h3 className="text-xl font-bold text-white mt-8 mb-4">2. Blockchain Transparency</h3>
                                <p className="mb-4">
                                    Please be aware that transactions on the Casper Network are public. While we do not publish your personal identity directly on-chain without encryption, your wallet address and transaction history are visible to anyone.
                                </p>
                            </div>
                        </FadeInSection>
                    </div>

                    {/* Terms of Service */}
                    <div id="terms" className="scroll-mt-32">
                        <FadeInSection>
                            <h2 className="text-3xl font-bold text-white mb-6">Terms of Service</h2>
                            <div className="prose prose-invert max-w-none text-[var(--flow-text-secondary)]">
                                <p className="mb-4">
                                    By accessing or using FlowFi, you agree to be bound by these Terms of Service and our Smart Contract protocols.
                                </p>
                                <h3 className="text-xl font-bold text-white mt-8 mb-4">1. Acceptable Use</h3>
                                <p className="mb-4">
                                    You represent that any invoice you mint on FlowFi is a valid, legally enforceable debt obligation. Minting fraudulent or duplicate invoices will result in immediate blacklisting and legal action.
                                </p>
                                <h3 className="text-xl font-bold text-white mt-8 mb-4">2. Smart Contract Risks</h3>
                                <p className="mb-4">
                                    FlowFi operates on the Casper Network using self-executing smart contracts. While we have audited our code, you acknowledge that blockchain technology carries inherent risks, including potential code vulnerabilities or network congestion.
                                </p>
                            </div>
                        </FadeInSection>
                    </div>

                    {/* Compliance */}
                    <div id="compliance" className="scroll-mt-32">
                        <FadeInSection>
                            <h2 className="text-3xl font-bold text-white mb-6">Compliance & AML</h2>
                            <div className="prose prose-invert max-w-none text-[var(--flow-text-secondary)]">
                                <p className="mb-4">
                                    FlowFi is committed to preventing money laundering and terrorist financing.
                                </p>
                                <ul className="list-disc pl-6 mb-4 space-y-2">
                                    <li>All institutional investors must pass KYC/KYB verification.</li>
                                    <li>We utilize NodeOps AI agents to screen invoice counterparts against global sanctions lists.</li>
                                    <li>We reserve the right to freeze funds associated with illicit activity in coordination with legal authorities.</li>
                                </ul>
                            </div>
                        </FadeInSection>
                    </div>
                </div>
            </div>
        </div>
    );
}
