"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    TrendingUp,
    TrendingDown,
    Activity,
    BarChart3,
    Coins,
    ArrowUpRight,
    ArrowDownRight,
    RefreshCcw,
    Search,
    ExternalLink,
    Droplets,
    Zap,
    Clock,
    Filter,
    ChevronDown,
    Star,
    Layers,
    PieChart,
    ArrowLeftRight,
} from "lucide-react";
import { Card3D, GlowingCard } from "@/components/immersive/cards";
import { FadeInSection, AnimatedCounter } from "@/components/immersive/animated-text";
import { MagneticButton, StaggerContainer } from "@/components/immersive/smooth-scroll";
import {
    getMarketOverview,
    getTokenPrices,
    getDEXPools,
    getRecentTransactions,
    getTokenPriceHistory,
    type TokenPrice,
    type DEXPool,
    type Transaction,
    type MarketOverview,
    type PriceHistory,
} from "@/lib/cspr-cloud";

// Mini chart component
function MiniChart({ data, positive }: { data: number[]; positive: boolean }) {
    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min || 1;

    const points = data.map((val, i) => {
        const x = (i / (data.length - 1)) * 100;
        const y = 100 - ((val - min) / range) * 100;
        return `${x},${y}`;
    }).join(' ');

    return (
        <svg viewBox="0 0 100 100" className="w-24 h-8" preserveAspectRatio="none">
            <polyline
                points={points}
                fill="none"
                stroke={positive ? "var(--flow-green)" : "var(--flow-pink)"}
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

// Price change badge
function PriceChange({ change }: { change: number }) {
    const positive = change >= 0;
    return (
        <span className={`flex items-center gap-1 text-sm font-medium ${positive ? 'text-[var(--flow-green)]' : 'text-[var(--flow-pink)]'}`}>
            {positive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            {positive ? '+' : ''}{change.toFixed(2)}%
        </span>
    );
}

export default function Analytics() {
    const [marketOverview, setMarketOverview] = useState<MarketOverview | null>(null);
    const [tokens, setTokens] = useState<TokenPrice[]>([]);
    const [pools, setPools] = useState<DEXPool[]>([]);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [selectedToken, setSelectedToken] = useState<string | null>(null);
    const [priceHistory, setPriceHistory] = useState<PriceHistory[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<"tokens" | "pools" | "transactions">("tokens");
    const [searchQuery, setSearchQuery] = useState("");
    const [sortBy, setSortBy] = useState<"market_cap" | "volume" | "change">("market_cap");
    const [timeframe, setTimeframe] = useState<"1h" | "24h" | "7d" | "30d">("24h");
    const [favorites, setFavorites] = useState<Set<string>>(new Set());

    // Load data
    useEffect(() => {
        async function loadData() {
            setLoading(true);
            try {
                const [overview, tokenData, poolData, txData] = await Promise.all([
                    getMarketOverview(),
                    getTokenPrices(),
                    getDEXPools(),
                    getRecentTransactions(20),
                ]);

                setMarketOverview(overview);
                setTokens(tokenData);
                setPools(poolData);
                setTransactions(txData);

                // Load price history for first token
                if (tokenData.length > 0) {
                    const history = await getTokenPriceHistory(tokenData[0].contract_package_hash, timeframe);
                    setPriceHistory(history);
                    setSelectedToken(tokenData[0].contract_package_hash);
                }
            } catch (error) {
                console.error("Failed to load analytics data:", error);
            } finally {
                setLoading(false);
            }
        }

        loadData();
    }, []);

    // Load price history when token or timeframe changes
    useEffect(() => {
        if (selectedToken) {
            getTokenPriceHistory(selectedToken, timeframe).then(setPriceHistory);
        }
    }, [selectedToken, timeframe]);

    // Filtered and sorted tokens
    const filteredTokens = useMemo(() => {
        let result = tokens.filter(t =>
            t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            t.symbol.toLowerCase().includes(searchQuery.toLowerCase())
        );

        result.sort((a, b) => {
            if (sortBy === "market_cap") return b.market_cap - a.market_cap;
            if (sortBy === "volume") return b.volume_24h - a.volume_24h;
            return Math.abs(b.price_change_24h) - Math.abs(a.price_change_24h);
        });

        return result;
    }, [tokens, searchQuery, sortBy]);

    const toggleFavorite = (hash: string) => {
        setFavorites(prev => {
            const next = new Set(prev);
            if (next.has(hash)) next.delete(hash);
            else next.add(hash);
            return next;
        });
    };

    const formatNumber = (num: number) => {
        if (num >= 1_000_000_000) return `$${(num / 1_000_000_000).toFixed(2)}B`;
        if (num >= 1_000_000) return `$${(num / 1_000_000).toFixed(2)}M`;
        if (num >= 1_000) return `$${(num / 1_000).toFixed(2)}K`;
        return `$${num.toFixed(2)}`;
    };

    const formatPrice = (price: number) => {
        if (price < 0.0001) return `$${price.toExponential(2)}`;
        if (price < 1) return `$${price.toFixed(6)}`;
        return `$${price.toFixed(4)}`;
    };

    return (
        <div className="min-h-screen relative">
            {/* Background Effects */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-[var(--flow-cyan)] opacity-5 blur-[200px] rounded-full" />
                <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-[var(--flow-purple)] opacity-5 blur-[200px] rounded-full" />
            </div>

            <div className="container mx-auto px-6 py-12 relative z-10">
                {/* Header */}
                <FadeInSection className="mb-12">
                    <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
                        <div>
                            <span className="badge-premium mb-4 inline-flex items-center gap-2">
                                <Activity className="w-3 h-3" />
                                Real-Time Analytics
                            </span>
                            <h1 className="text-4xl md:text-5xl font-bold font-display mb-4">
                                <span className="text-white">Casper </span>
                                <span className="text-gradient">Market Data</span>
                            </h1>
                            <p className="text-[var(--flow-text-secondary)] max-w-lg">
                                Live token prices, DEX liquidity, and transaction analytics powered by CSPR.cloud
                            </p>
                        </div>

                        {/* Quick Stats */}
                        {marketOverview && (
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                                    <p className="text-xs text-[var(--flow-text-muted)] mb-1">CSPR Price</p>
                                    <p className="text-xl font-bold text-white">${marketOverview.cspr_price_usd.toFixed(4)}</p>
                                    <PriceChange change={marketOverview.cspr_price_change_24h} />
                                </div>
                                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                                    <p className="text-xs text-[var(--flow-text-muted)] mb-1">Market Cap</p>
                                    <p className="text-xl font-bold text-gradient">{formatNumber(marketOverview.total_market_cap_usd)}</p>
                                </div>
                                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                                    <p className="text-xs text-[var(--flow-text-muted)] mb-1">24h Volume</p>
                                    <p className="text-xl font-bold text-[var(--flow-cyan)]">{formatNumber(marketOverview.total_volume_24h_usd)}</p>
                                </div>
                                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                                    <p className="text-xs text-[var(--flow-text-muted)] mb-1">24h Txs</p>
                                    <p className="text-xl font-bold text-white">{marketOverview.total_transactions_24h.toLocaleString()}</p>
                                </div>
                            </div>
                        )}
                    </div>
                </FadeInSection>

                {/* Tabs & Filters */}
                <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between mb-8">
                    <div className="flex gap-2 p-1 rounded-2xl bg-white/5 border border-white/10">
                        {[
                            { key: "tokens", label: "Tokens", icon: Coins },
                            { key: "pools", label: "DEX Pools", icon: Droplets },
                            { key: "transactions", label: "Transactions", icon: ArrowLeftRight },
                        ].map((tab) => (
                            <button
                                key={tab.key}
                                onClick={() => setActiveTab(tab.key as any)}
                                className={`flex items-center gap-2 px-5 py-3 rounded-xl font-medium text-sm transition-all ${activeTab === tab.key
                                        ? "bg-gradient-to-r from-[var(--flow-cyan)] to-[var(--flow-purple)] text-white"
                                        : "text-[var(--flow-text-secondary)] hover:text-white"
                                    }`}
                            >
                                <tab.icon className="w-4 h-4" />
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    <div className="flex gap-3">
                        {/* Search */}
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--flow-text-muted)]" />
                            <input
                                type="text"
                                placeholder="Search tokens..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="input-glass pl-11 pr-4 py-3 w-64"
                            />
                        </div>

                        {/* Timeframe */}
                        <div className="flex rounded-xl overflow-hidden border border-white/10">
                            {(["1h", "24h", "7d", "30d"] as const).map((tf) => (
                                <button
                                    key={tf}
                                    onClick={() => setTimeframe(tf)}
                                    className={`px-4 py-3 text-sm font-medium transition-all ${timeframe === tf
                                            ? "bg-[var(--flow-cyan)]/20 text-[var(--flow-cyan)]"
                                            : "bg-white/5 text-[var(--flow-text-muted)] hover:text-white"
                                        }`}
                                >
                                    {tf}
                                </button>
                            ))}
                        </div>

                        {/* Refresh */}
                        <button
                            onClick={() => window.location.reload()}
                            className="p-3 rounded-xl bg-white/5 border border-white/10 text-[var(--flow-text-muted)] hover:text-white transition-colors"
                        >
                            <RefreshCcw className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <AnimatePresence mode="wait">
                    {loading ? (
                        <motion.div
                            key="loading"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex items-center justify-center py-20"
                        >
                            <div className="flex flex-col items-center gap-4">
                                <div className="w-12 h-12 border-4 border-[var(--flow-cyan)] border-t-transparent rounded-full animate-spin" />
                                <p className="text-[var(--flow-text-muted)]">Loading market data...</p>
                            </div>
                        </motion.div>
                    ) : (
                        <>
                            {/* Tokens Tab */}
                            {activeTab === "tokens" && (
                                <motion.div
                                    key="tokens"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                >
                                    {/* Token Table */}
                                    <GlowingCard className="rounded-2xl overflow-hidden">
                                        <div className="bg-[var(--flow-bg-secondary)]">
                                            {/* Table Header */}
                                            <div className="grid grid-cols-12 gap-4 p-4 border-b border-white/10 text-xs text-[var(--flow-text-muted)] uppercase tracking-wider">
                                                <div className="col-span-1">#</div>
                                                <div className="col-span-3">Token</div>
                                                <div className="col-span-2 text-right">Price</div>
                                                <div className="col-span-1 text-right">24h</div>
                                                <div className="col-span-2 text-right">Volume</div>
                                                <div className="col-span-2 text-right">Market Cap</div>
                                                <div className="col-span-1 text-center">Chart</div>
                                            </div>

                                            {/* Token Rows */}
                                            {filteredTokens.map((token, i) => (
                                                <motion.div
                                                    key={token.contract_package_hash}
                                                    initial={{ opacity: 0, x: -20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: i * 0.03 }}
                                                    className="grid grid-cols-12 gap-4 p-4 border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer items-center"
                                                    onClick={() => setSelectedToken(token.contract_package_hash)}
                                                >
                                                    <div className="col-span-1 flex items-center gap-2">
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                toggleFavorite(token.contract_package_hash);
                                                            }}
                                                            className="text-[var(--flow-text-muted)] hover:text-yellow-400"
                                                        >
                                                            <Star
                                                                className={`w-4 h-4 ${favorites.has(token.contract_package_hash) ? 'fill-yellow-400 text-yellow-400' : ''}`}
                                                            />
                                                        </button>
                                                        <span className="text-[var(--flow-text-muted)]">{i + 1}</span>
                                                    </div>

                                                    <div className="col-span-3 flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[var(--flow-cyan)] to-[var(--flow-purple)] flex items-center justify-center text-xs font-bold text-white">
                                                            {token.symbol.substring(0, 2)}
                                                        </div>
                                                        <div>
                                                            <p className="font-medium text-white">{token.name}</p>
                                                            <p className="text-xs text-[var(--flow-text-muted)]">{token.symbol}</p>
                                                        </div>
                                                    </div>

                                                    <div className="col-span-2 text-right">
                                                        <p className="font-mono font-medium text-white">{formatPrice(token.price_usd)}</p>
                                                    </div>

                                                    <div className="col-span-1 text-right">
                                                        <PriceChange change={token.price_change_24h} />
                                                    </div>

                                                    <div className="col-span-2 text-right">
                                                        <p className="text-[var(--flow-text-secondary)]">{formatNumber(token.volume_24h)}</p>
                                                    </div>

                                                    <div className="col-span-2 text-right">
                                                        <p className="text-white">{formatNumber(token.market_cap)}</p>
                                                    </div>

                                                    <div className="col-span-1 flex justify-center">
                                                        <MiniChart
                                                            data={Array.from({ length: 24 }, () => token.price_usd * (0.95 + Math.random() * 0.1))}
                                                            positive={token.price_change_24h >= 0}
                                                        />
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </div>
                                    </GlowingCard>
                                </motion.div>
                            )}

                            {/* Pools Tab */}
                            {activeTab === "pools" && (
                                <motion.div
                                    key="pools"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                >
                                    <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-3 gap-6" stagger={0.05}>
                                        {pools.map((pool, i) => (
                                            <div key={pool.pool_hash} data-stagger-item>
                                                <Card3D>
                                                    <div className="glass rounded-2xl p-6 border border-white/10 hover:border-[var(--flow-cyan)]/30 transition-all">
                                                        {/* Pool Header */}
                                                        <div className="flex items-center justify-between mb-6">
                                                            <div className="flex items-center gap-3">
                                                                <div className="flex -space-x-2">
                                                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--flow-cyan)] to-blue-500 flex items-center justify-center text-xs font-bold text-white border-2 border-[var(--flow-bg-secondary)]">
                                                                        {pool.token0.symbol.substring(0, 2)}
                                                                    </div>
                                                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--flow-purple)] to-pink-500 flex items-center justify-center text-xs font-bold text-white border-2 border-[var(--flow-bg-secondary)]">
                                                                        {pool.token1.symbol.substring(0, 2)}
                                                                    </div>
                                                                </div>
                                                                <div>
                                                                    <p className="font-bold text-white">{pool.token0.symbol}/{pool.token1.symbol}</p>
                                                                    <p className="text-xs text-[var(--flow-text-muted)]">{pool.fee_tier * 100}% fee</p>
                                                                </div>
                                                            </div>
                                                            <span className="px-3 py-1 rounded-full text-xs font-medium bg-[var(--flow-green)]/20 text-[var(--flow-green)]">
                                                                {pool.apy_7d.toFixed(1)}% APY
                                                            </span>
                                                        </div>

                                                        {/* Pool Stats */}
                                                        <div className="grid grid-cols-2 gap-4">
                                                            <div>
                                                                <p className="text-xs text-[var(--flow-text-muted)] mb-1">Liquidity</p>
                                                                <p className="text-lg font-bold text-white">{formatNumber(pool.liquidity_usd)}</p>
                                                            </div>
                                                            <div>
                                                                <p className="text-xs text-[var(--flow-text-muted)] mb-1">Volume 24h</p>
                                                                <p className="text-lg font-bold text-[var(--flow-cyan)]">{formatNumber(pool.volume_24h)}</p>
                                                            </div>
                                                        </div>

                                                        {/* Add Liquidity Button */}
                                                        <button className="w-full mt-6 py-3 rounded-xl font-medium bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-colors flex items-center justify-center gap-2">
                                                            <Droplets className="w-4 h-4" />
                                                            Add Liquidity
                                                        </button>
                                                    </div>
                                                </Card3D>
                                            </div>
                                        ))}
                                    </StaggerContainer>
                                </motion.div>
                            )}

                            {/* Transactions Tab */}
                            {activeTab === "transactions" && (
                                <motion.div
                                    key="transactions"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                >
                                    <GlowingCard className="rounded-2xl overflow-hidden">
                                        <div className="bg-[var(--flow-bg-secondary)]">
                                            {/* Table Header */}
                                            <div className="grid grid-cols-12 gap-4 p-4 border-b border-white/10 text-xs text-[var(--flow-text-muted)] uppercase tracking-wider">
                                                <div className="col-span-2">Type</div>
                                                <div className="col-span-2">Token</div>
                                                <div className="col-span-2">Amount</div>
                                                <div className="col-span-3">From</div>
                                                <div className="col-span-2">Time</div>
                                                <div className="col-span-1">Status</div>
                                            </div>

                                            {/* Transaction Rows */}
                                            {transactions.map((tx, i) => (
                                                <motion.a
                                                    key={tx.deploy_hash}
                                                    href={`https://testnet.cspr.live/deploy/${tx.deploy_hash}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    initial={{ opacity: 0, x: -20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: i * 0.03 }}
                                                    className="grid grid-cols-12 gap-4 p-4 border-b border-white/5 hover:bg-white/5 transition-colors items-center"
                                                >
                                                    <div className="col-span-2">
                                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${tx.type === 'swap' ? 'bg-[var(--flow-cyan)]/20 text-[var(--flow-cyan)]' :
                                                                tx.type === 'transfer' ? 'bg-[var(--flow-purple)]/20 text-[var(--flow-purple)]' :
                                                                    tx.type === 'mint' ? 'bg-[var(--flow-green)]/20 text-[var(--flow-green)]' :
                                                                        tx.type === 'stake' ? 'bg-yellow-500/20 text-yellow-400' :
                                                                            'bg-white/10 text-white'
                                                            }`}>
                                                            {tx.type.charAt(0).toUpperCase() + tx.type.slice(1)}
                                                        </span>
                                                    </div>

                                                    <div className="col-span-2">
                                                        <span className="font-medium text-white">{tx.token_symbol}</span>
                                                    </div>

                                                    <div className="col-span-2">
                                                        <span className="font-mono text-[var(--flow-text-secondary)]">{parseFloat(tx.amount).toLocaleString()}</span>
                                                    </div>

                                                    <div className="col-span-3">
                                                        <span className="font-mono text-xs text-[var(--flow-text-muted)]">
                                                            {tx.from.substring(0, 8)}...{tx.from.substring(tx.from.length - 6)}
                                                        </span>
                                                    </div>

                                                    <div className="col-span-2 flex items-center gap-2 text-[var(--flow-text-muted)]">
                                                        <Clock className="w-3 h-3" />
                                                        <span className="text-xs">{new Date(tx.timestamp).toLocaleTimeString()}</span>
                                                    </div>

                                                    <div className="col-span-1">
                                                        {tx.status === 'success' ? (
                                                            <span className="flex items-center gap-1 text-[var(--flow-green)] text-xs">
                                                                <Zap className="w-3 h-3" /> Success
                                                            </span>
                                                        ) : (
                                                            <span className="flex items-center gap-1 text-[var(--flow-pink)] text-xs">
                                                                Failed
                                                            </span>
                                                        )}
                                                    </div>
                                                </motion.a>
                                            ))}
                                        </div>
                                    </GlowingCard>
                                </motion.div>
                            )}
                        </>
                    )}
                </AnimatePresence>

                {/* FlowFi NFT Collection Highlight */}
                <section className="mt-16">
                    <FadeInSection>
                        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                            <Layers className="w-6 h-6 text-[var(--flow-cyan)]" />
                            FlowFi Invoice NFTs
                        </h2>
                    </FadeInSection>

                    <GlowingCard className="rounded-2xl">
                        <div className="bg-[var(--flow-bg-secondary)] p-8 rounded-2xl">
                            <div className="grid md:grid-cols-4 gap-8">
                                <div>
                                    <p className="text-sm text-[var(--flow-text-muted)] mb-2">Collection</p>
                                    <p className="text-xl font-bold text-white">FlowFi Invoices</p>
                                    <p className="text-sm text-[var(--flow-cyan)]">FLOW</p>
                                </div>
                                <div>
                                    <p className="text-sm text-[var(--flow-text-muted)] mb-2">Total Minted</p>
                                    <p className="text-3xl font-bold text-gradient">
                                        <AnimatedCounter to={156} />
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-[var(--flow-text-muted)] mb-2">Total Value Locked</p>
                                    <p className="text-3xl font-bold text-white">
                                        $<AnimatedCounter to={1420000} suffix="" />
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-[var(--flow-text-muted)] mb-2">Avg. Yield</p>
                                    <p className="text-3xl font-bold text-[var(--flow-green)]">
                                        <AnimatedCounter to={13.4} suffix="%" decimals={1} />
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-4 mt-8">
                                <a
                                    href="https://testnet.cspr.live/contract-package/113fd0f7f4f803e2401a9547442e2ca31bd9001b4fcd803eaff7a3dac11e4623"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn-primary flex items-center gap-2"
                                >
                                    View on Explorer <ExternalLink className="w-4 h-4" />
                                </a>
                                <a href="/marketplace" className="btn-secondary">
                                    Browse Marketplace
                                </a>
                            </div>
                        </div>
                    </GlowingCard>
                </section>
            </div>
        </div>
    );
}
