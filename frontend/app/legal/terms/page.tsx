"use client";

import { FadeInSection } from "@/components/immersive/animated-text";

export default function TermsOfService() {
    return (
        <div className="min-h-screen py-24 relative">
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[var(--flow-bg-secondary)] opacity-20 blur-[100px] rounded-full" />
            </div>

            <div className="container mx-auto px-6 relative z-10 max-w-4xl">
                <FadeInSection>
                    <h1 className="text-4xl md:text-5xl font-bold font-display text-white mb-6">Terms of Service</h1>
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
        </div>
    );
}
