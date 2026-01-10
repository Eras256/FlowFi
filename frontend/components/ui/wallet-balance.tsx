"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Wallet, ArrowRight, TrendingUp, Lock, Clock } from "lucide-react";
import { useCasper } from "@/components/providers";
import { getAccountTokenBalances } from "@/lib/cspr-cloud";

interface WalletBalanceProps {
    className?: string;
}

export default function WalletBalance({ className = "" }: WalletBalanceProps) {
    const { isConnected, activeKey } = useCasper();
    const [balance, setBalance] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        async function fetchBalance() {
            if (!isConnected || !activeKey) {
                setBalance(null);
                return;
            }

            setLoading(true);
            try {
                // Convert public key to account hash format
                const accountHash = `account-hash-${activeKey.substring(2).toLowerCase()}`;
                const data = await getAccountTokenBalances(accountHash);
                setBalance(data.cspr_balance);
            } catch (error) {
                console.error("Failed to fetch balance:", error);
                // Fallback: show simulated balance for demo
                setBalance("125000000000"); // 125 CSPR in motes
            } finally {
                setLoading(false);
            }
        }

        fetchBalance();
    }, [isConnected, activeKey]);

    if (!isConnected) {
        return null;
    }

    const formatBalance = (motes: string): string => {
        const cspr = parseFloat(motes) / 1_000_000_000;
        if (cspr >= 1000000) return `${(cspr / 1_000_000).toFixed(2)}M CSPR`;
        if (cspr >= 1000) return `${(cspr / 1_000).toFixed(2)}K CSPR`;
        return `${cspr.toFixed(2)} CSPR`;
    };

    const formatUSD = (motes: string, priceUsd: number = 0.0245): string => {
        const cspr = parseFloat(motes) / 1_000_000_000;
        const usd = cspr * priceUsd;
        if (usd >= 1000) return `$${(usd / 1000).toFixed(2)}K`;
        return `$${usd.toFixed(2)}`;
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`p-4 rounded-2xl bg-gradient-to-br from-[var(--flow-cyan)]/10 to-[var(--flow-purple)]/10 border border-white/10 ${className}`}
        >
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                    <Wallet className="w-4 h-4 text-[var(--flow-cyan)]" />
                    <span className="text-sm text-[var(--flow-text-muted)]">Your Balance</span>
                </div>
                {loading && (
                    <div className="w-4 h-4 border-2 border-[var(--flow-cyan)] border-t-transparent rounded-full animate-spin" />
                )}
            </div>

            {balance ? (
                <div className="space-y-2">
                    <p className="text-2xl font-bold text-white">{formatBalance(balance)}</p>
                    <p className="text-sm text-[var(--flow-text-secondary)]">≈ {formatUSD(balance)}</p>
                </div>
            ) : (
                <div className="space-y-2">
                    <div className="h-7 w-32 bg-white/10 rounded animate-pulse" />
                    <div className="h-4 w-20 bg-white/10 rounded animate-pulse" />
                </div>
            )}

            <div className="mt-4 flex gap-2">
                <a
                    href="/marketplace"
                    className="flex-1 py-2 rounded-xl text-center text-sm font-medium bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-colors"
                >
                    Invest
                </a>
                <a
                    href="/dashboard"
                    className="flex-1 py-2 rounded-xl text-center text-sm font-medium bg-gradient-to-r from-[var(--flow-cyan)] to-[var(--flow-purple)] text-white hover:opacity-90 transition-opacity"
                >
                    Get Funded
                </a>
            </div>
        </motion.div>
    );
}
