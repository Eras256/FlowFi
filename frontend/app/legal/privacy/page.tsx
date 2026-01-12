"use client";

import { FadeInSection } from "@/components/immersive/animated-text";

export default function PrivacyPolicy() {
    return (
        <div className="min-h-screen py-24 relative">
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[var(--flow-bg-secondary)] opacity-20 blur-[100px] rounded-full" />
            </div>

            <div className="container mx-auto px-6 relative z-10 max-w-4xl">
                <FadeInSection>
                    <h1 className="text-4xl md:text-5xl font-bold font-display text-white mb-6">Privacy Policy</h1>
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
        </div>
    );
}
