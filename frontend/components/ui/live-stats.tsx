"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Activity, DollarSign, Coins, Users } from "lucide-react";
import { getMarketOverview, type MarketOverview } from "@/lib/cspr-cloud";

interface LiveStatsProps {
    className?: string;
}

export default function LiveStats({ className = "" }: LiveStatsProps) {
    const [marketData, setMarketData] = useState<MarketOverview | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            try {
                const data = await getMarketOverview();
                setMarketData(data);
            } catch (error) {
                console.error("Failed to fetch market data:", error);
            } finally {
                setLoading(false);
            }
        }

        fetchData();
        // Refresh every 60 seconds
        const interval = setInterval(fetchData, 60000);
        return () => clearInterval(interval);
    }, []);

    if (loading) {
        return (
            <div className={`flex items-center gap-4 ${className}`}>
                {[1, 2, 3].map((i) => (
                    <div
                        key={i}
                        className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 animate-pulse"
                    >
                        <div className="h-4 w-20 bg-white/10 rounded" />
                    </div>
                ))}
            </div>
        );
    }

    if (!marketData) return null;

    const stats = [
        {
            label: "CSPR",
            value: `$${marketData.cspr_price_usd.toFixed(4)}`,
            change: marketData.cspr_price_change_24h,
            icon: Coins,
        },
        {
            label: "24h Vol",
            value: formatNumber(marketData.total_volume_24h_usd),
            icon: Activity,
        },
        {
            label: "Market Cap",
            value: formatNumber(marketData.total_market_cap_usd),
            icon: DollarSign,
        },
    ];

    return (
        <div className={`flex flex-wrap items-center gap-3 ${className}`}>
            {/* Live indicator */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--flow-green)]/10 border border-[var(--flow-green)]/20">
                <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--flow-green)] opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--flow-green)]" />
                </span>
                <span className="text-xs text-[var(--flow-green)] font-medium">LIVE</span>
            </div>

            {stats.map((stat, i) => (
                <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-colors"
                >
                    <stat.icon className="w-4 h-4 text-[var(--flow-cyan)]" />
                    <span className="text-xs text-[var(--flow-text-muted)]">{stat.label}</span>
                    <span className="text-sm font-medium text-white">{stat.value}</span>
                    {stat.change !== undefined && (
                        <span className={`flex items-center gap-0.5 text-xs ${stat.change >= 0 ? 'text-[var(--flow-green)]' : 'text-[var(--flow-pink)]'}`}>
                            {stat.change >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                            {stat.change >= 0 ? '+' : ''}{stat.change.toFixed(2)}%
                        </span>
                    )}
                </motion.div>
            ))}
        </div>
    );
}

function formatNumber(num: number): string {
    if (num >= 1_000_000_000) return `$${(num / 1_000_000_000).toFixed(1)}B`;
    if (num >= 1_000_000) return `$${(num / 1_000_000).toFixed(1)}M`;
    if (num >= 1_000) return `$${(num / 1_000).toFixed(1)}K`;
    return `$${num.toFixed(2)}`;
}
