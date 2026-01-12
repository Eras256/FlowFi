"use client";

import { FadeInSection } from "@/components/immersive/animated-text";

export default function Compliance() {
    return (
        <div className="min-h-screen py-24 relative">
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[var(--flow-bg-secondary)] opacity-20 blur-[100px] rounded-full" />
            </div>

            <div className="container mx-auto px-6 relative z-10 max-w-4xl">
                <FadeInSection>
                    <h1 className="text-4xl md:text-5xl font-bold font-display text-white mb-6">Compliance & AML</h1>
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
    );
}
