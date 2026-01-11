"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Search,
    ArrowUpRight,
    Shield,
    Zap,
    Sparkles,
    ExternalLink,
    Loader2,
    Check,
    TrendingUp,
    Clock,
    BarChart3,
    SlidersHorizontal,
    LayoutGrid,
    List
} from "lucide-react";
import Link from "next/link";
import { useCasper } from "@/components/providers";
import { getSupabaseClient } from "@/lib/supabase";
// casper-js-sdk is dynamically imported in handleInvest to avoid SSG issues
import { Card3D, GlowingCard, StatsCard } from "@/components/immersive/cards";
import { FadeInSection, AnimatedCounter } from "@/components/immersive/animated-text";
import { MagneticButton, StaggerContainer } from "@/components/immersive/smooth-scroll";

// Sample invoices with real Casper Testnet transactions (Verified MINT Hashes)
const sampleInvoices = [
    // --- Funded (40% - 8 invoices) ---
    // Using verified CEP-78 CONTRACT INTERACTION hashes (Mints - Historical)
    { id: "INV-3392", vendor: "Quantum Hardware", amount: 112000, score: "A+", yield: "9.5%", term: "90 Days", isNew: true, isFunded: true, deployHash: "be7e48e10d93a43fd277337515ee344e2ab19309a6c33bb976f75509e9221941", owner: "0202a4d9d6e4ac827ddd6a6e08a53dfde6181ec7d9d058e215a36cea17f7e1dc6095" },
    { id: "INV-9982", vendor: "BioLife Pharma", amount: 89500, score: "A+", yield: "10.2%", term: "45 Days", isNew: true, isFunded: true, deployHash: "8528aef0da7e6f5e4da5a1b074cc78441f7c066689acc1d449e9f7626653558e", owner: "0202a4d9d6e4ac827ddd6a6e08a53dfde6181ec7d9d058e215a36cea17f7e1dc6095" },
    { id: "INV-4419", vendor: "GreenEnergy Co", amount: 67500, score: "A+", yield: "10.8%", term: "45 Days", isNew: true, isFunded: true, deployHash: "48bd1c5b8fee2a998e2a23fb2ecd066ed9b761cf5cba5582e9931f01fa76fee1", owner: "0202a4d9d6e4ac827ddd6a6e08a53dfde6181ec7d9d058e215a36cea17f7e1dc6095" },
    { id: "INV-1175", vendor: "Urban Construction", amount: 56000, score: "A-", yield: "13.1%", term: "60 Days", isNew: true, isFunded: true, deployHash: "c0d334fb24bce160ee1793ab2493c731280afb03fad1c574e59c9cde5b5c32f6", owner: "0202a4d9d6e4ac827ddd6a6e08a53dfde6181ec7d9d058e215a36cea17f7e1dc6095" },
    { id: "INV-9042", vendor: "SolarSystems Ltd", amount: 45000, score: "A", yield: "14.2%", term: "45 Days", isNew: true, isFunded: true, deployHash: "ac83ec2b1b4f5529eaa6479f08248dfffbe8c309236f203c3b02bb6f823ca43d", owner: "0202a4d9d6e4ac827ddd6a6e08a53dfde6181ec7d9d058e215a36cea17f7e1dc6095" },
    { id: "INV-5523", vendor: "MedTech Solutions", amount: 28300, score: "A", yield: "13.4%", term: "30 Days", isNew: true, isFunded: true, deployHash: "d451f737c7423980d2054c5ab4949c749bef50927c55406e4a223fc310f3197f", owner: "0202a4d9d6e4ac827ddd6a6e08a53dfde6181ec7d9d058e215a36cea17f7e1dc6095" },
    { id: "INV-2921", vendor: "AgriFuture Corp", amount: 125000, score: "B+", yield: "15.5%", term: "180 Days", isNew: true, isFunded: true, deployHash: "7b314b1ad0ea3ccbbd95cd441866848f6057938fbd893b9f799c505dcdb50e9f", owner: "0202a4d9d6e4ac827ddd6a6e08a53dfde6181ec7d9d058e215a36cea17f7e1dc6095" },
    { id: "INV-8410", vendor: "CyberShield Sec", amount: 32000, score: "A", yield: "12.0%", term: "30 Days", isNew: true, isFunded: true, deployHash: "a5cec810dc5cca9b956756d290421eae6cbe99d08b65f26e766e9805b6baa75e", owner: "0202a4d9d6e4ac827ddd6a6e08a53dfde6181ec7d9d058e215a36cea17f7e1dc6095" },

    // --- Available to Invest (60% - 12 invoices) ---
    { id: "INV-3882", vendor: "BlueOcean Logistics", amount: 78000, score: "A", yield: "11.5%", term: "60 Days", isNew: true, isFunded: false, deployHash: "5cbea6b1e5e51605a6647f0974015ca7bf94a088f2ed3c3bb89c147ad7ebf4f7", owner: "0202a4d9d6e4ac827ddd6a6e08a53dfde6181ec7d9d058e215a36cea17f7e1dc6095" },
    { id: "INV-7331", vendor: "NanoTech Labs", amount: 42500, score: "B+", yield: "16.2%", term: "90 Days", isNew: true, isFunded: false, deployHash: "9f70509840118a9fc0c7234b1fd761f78abef3c941acccefcd9138199b673f2f", owner: "0202a4d9d6e4ac827ddd6a6e08a53dfde6181ec7d9d058e215a36cea17f7e1dc6095" },
    { id: "INV-1029", vendor: "SpaceX Dynamics", amount: 215000, score: "A+", yield: "9.8%", term: "120 Days", isNew: true, isFunded: false, deployHash: "632a44991ec1b06e6557f63d2ac3eeb553f75b509504d459c365b083042beef0", owner: "0202a4d9d6e4ac827ddd6a6e08a53dfde6181ec7d9d058e215a36cea17f7e1dc6095" },
    { id: "INV-6644", vendor: "EcoBlock Materials", amount: 18900, score: "B", yield: "14.8%", term: "45 Days", isNew: true, isFunded: false, deployHash: "3d45b81216a2695aef278f67b89b2e3b3535425474774030ac01e153f61aa7fe", owner: "0202a4d9d6e4ac827ddd6a6e08a53dfde6181ec7d9d058e215a36cea17f7e1dc6095" },
    // Using FRESH Verified Mints (post-owner-register fix)
    { id: "INV-5511", vendor: "FusionCore Energy", amount: 95000, score: "A", yield: "12.5%", term: "60 Days", isNew: true, isFunded: false, deployHash: "7b4dc4639f14133c7db3d819923db8f8210f1c24ab35ac38c29caed481504221", owner: "0202a4d9d6e4ac827ddd6a6e08a53dfde6181ec7d9d058e215a36cea17f7e1dc6095" },
    { id: "INV-4928", vendor: "GlobalNet Telecom", amount: 62000, score: "A-", yield: "13.0%", term: "30 Days", isNew: true, isFunded: false, deployHash: "60165c702d8219888439cc43dbe5a6872b70a6c887bb2e7b51d43404b59bbd47", owner: "0202a4d9d6e4ac827ddd6a6e08a53dfde6181ec7d9d058e215a36cea17f7e1dc6095" },
    { id: "INV-8172", vendor: "SmartCity Infra", amount: 145000, score: "A+", yield: "10.0%", term: "90 Days", isNew: true, isFunded: false, deployHash: "cc28354977044f2b1b0c0620f19b8f7abb14b473508787000e1245f33c449abd", owner: "0202a4d9d6e4ac827ddd6a6e08a53dfde6181ec7d9d058e215a36cea17f7e1dc6095" },
    { id: "INV-3320", vendor: "AeroSpace Parts", amount: 38000, score: "B+", yield: "15.0%", term: "45 Days", isNew: true, isFunded: false, deployHash: "d5c7b34046c04bfd1b896da93c90553fa2ecf411cf60c453b0b82bcf0949e928", owner: "0202a4d9d6e4ac827ddd6a6e08a53dfde6181ec7d9d058e215a36cea17f7e1dc6095" },
    { id: "INV-2299", vendor: "DeepBlue Marine", amount: 54000, score: "A", yield: "12.8%", term: "60 Days", isNew: true, isFunded: false, deployHash: "e64c2a1007a1069d06268afd473142ed7c4e610adaa368b81c935e8f9880592e", owner: "0202a4d9d6e4ac827ddd6a6e08a53dfde6181ec7d9d058e215a36cea17f7e1dc6095" },
    { id: "INV-7741", vendor: "Vertex Robotics", amount: 88000, score: "A", yield: "11.2%", term: "30 Days", isNew: true, isFunded: false, deployHash: "8af93f6668eb2a0231a5d71314d56651da4dc6fae8240dc0467bee831a93b286", owner: "0202a4d9d6e4ac827ddd6a6e08a53dfde6181ec7d9d058e215a36cea17f7e1dc6095" },
    { id: "INV-1182", vendor: "CloudScale Data", amount: 26500, score: "B", yield: "14.5%", term: "15 Days", isNew: true, isFunded: false, deployHash: "2df12740ff63c8c39b3f4dd4e8568087c9e272c580ac7d09fddd7f62a9d2e679", owner: "0202a4d9d6e4ac827ddd6a6e08a53dfde6181ec7d9d058e215a36cea17f7e1dc6095" },
    { id: "INV-5501", vendor: "FutureFintech", amount: 69000, score: "A-", yield: "13.5%", term: "60 Days", isNew: true, isFunded: false, deployHash: "673f73a9dd112f2a5a2975ac6b7d735167daa901fb91c9cc82119b08d42ada39", owner: "0202a4d9d6e4ac827ddd6a6e08a53dfde6181ec7d9d058e215a36cea17f7e1dc6095" },
];

interface MintedInvoice {
    id: string;
    vendor: string;
    amount: number;
    score: string;
    yield: string;
    term: string;
    signature?: string;
    deployHash?: string;
    tokenId?: string;
    mintedAt: string;
    ipfsUrl?: string;
    isNew: boolean;
    isFunded?: boolean;
}

export default function Marketplace() {
    const { isConnected, connect, activeKey, signDeploy } = useCasper();
    const [invoices, setInvoices] = useState<any[]>(sampleInvoices);
    const [filter, setFilter] = useState<"all" | "minted" | "funded">("all");
    const [sortBy, setSortBy] = useState<"amount" | "yield" | "term">("amount");
    const [investingId, setInvestingId] = useState<string | null>(null);
    const [successTx, setSuccessTx] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

    // Load minted invoices from localStorage and Supabase
    useEffect(() => {
        const loadInvoices = async () => {
            let dbInvoices: any[] = [];

            // 1. Try to fetch from Supabase (if configured)
            const supabaseClient = getSupabaseClient();
            if (supabaseClient) {
                try {
                    const { data, error } = await supabaseClient
                        .from('invoices')
                        .select('*')
                        .order('created_at', { ascending: false });

                    if (data && !error) {
                        dbInvoices = data.map((inv: any) => ({
                            id: inv.invoice_id,
                            vendor: inv.vendor_name,
                            amount: inv.amount,
                            score: inv.grade || "A",
                            yield: inv.yield_rate || "12.5%",
                            term: inv.term_days || "30 Days",
                            isNew: true,
                            isFunded: inv.funding_status === 'funded',
                            deployHash: inv.deploy_hash,
                            ipfsUrl: inv.ipfs_url,
                            mintedAt: inv.created_at,
                            owner: inv.owner_address
                        }));
                    }
                } catch (e) {
                    console.log("Supabase not configured, using localStorage");
                }
            }

            // 2. Always load from localStorage (primary for demo)
            const stored = localStorage.getItem("flowfi_minted_invoices");
            let localInvoices: any[] = [];
            if (stored) {
                try {
                    localInvoices = JSON.parse(stored).map((inv: any) => ({
                        ...inv,
                        score: inv.score || inv.grade || "A",           // Normalize grade -> score
                        yield: inv.yield || inv.yield_rate || "12.5%",  // Normalize yield_rate -> yield
                        term: inv.term || inv.term_days || 30,          // Normalize term_days -> term
                        deployHash: inv.deployHash || inv.deploy_hash,  // Normalize deploy_hash -> deployHash
                        isNew: true
                    }));
                } catch (e) {
                    console.error("Failed to parse localStorage invoices");
                }
            }

            // Merge: DB invoices + Local invoices (dedup by id) + Sample invoices
            const allMinted = [...dbInvoices, ...localInvoices];
            const mintedIds = new Set(allMinted.map(i => i.id));

            // Filter out unwanted legacy data (names looking like filenames)
            const blockedNames: string[] = [];

            const uniqueMinted = allMinted.filter((inv, idx, arr) => {
                // Deduplicate
                const isFirst = arr.findIndex(i => i.id === inv.id) === idx;
                // Block garbage names
                const isBlocked = blockedNames.some(bad => inv.vendor && inv.vendor.includes(bad));
                return isFirst && !isBlocked;
            });

            // Add sample invoices that don't conflict
            const samplesFiltered = sampleInvoices.filter(s => !mintedIds.has(s.id));

            setInvoices([...uniqueMinted, ...samplesFiltered]);
            console.log(`📦 Loaded ${uniqueMinted.length} minted + ${samplesFiltered.length} sample invoices`);
        };

        loadInvoices();

        // Listen for storage changes (when minting in another tab)
        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === "flowfi_minted_invoices") {
                loadInvoices();
            }
        };
        window.addEventListener("storage", handleStorageChange);

        // Also refresh every 5 seconds for demo reliability
        const interval = setInterval(loadInvoices, 5000);

        return () => {
            window.removeEventListener("storage", handleStorageChange);
            clearInterval(interval);
        };
    }, []);

    const sendDeployToNetwork = async (signedDeployJson: any): Promise<string> => {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

        const response = await fetch(`${apiUrl}/deploy`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ deploy: signedDeployJson })
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.detail || `HTTP ${response.status}`);
        }

        const result = await response.json();
        if (result.success && result.deploy_hash) {
            return result.deploy_hash;
        }
        throw new Error("No deploy hash returned");
    };

    const handleInvest = async (invoice: MintedInvoice) => {
        if (!isConnected || !activeKey) {
            connect();
            return;
        }

        setInvestingId(invoice.id);

        try {
            // Dynamic import to avoid SSG issues
            const { DeployUtil, CLPublicKey, RuntimeArgs, CLValueBuilder, CLKey, CLAccountHash } = await import("casper-js-sdk");

            // Contract configuration - using CEP-78 contract
            const CONTRACT_HASH = process.env.NEXT_PUBLIC_CASPER_CONTRACT_HASH || "contract-2faa3d9bd2009c1988dd45f19cf307b3737ab191a4c16605588936ebb98aaa1a";
            const CHAIN_NAME = process.env.NEXT_PUBLIC_CASPER_CHAIN_NAME || "casper-test";

            // FlowFi Vault receives portion, rest goes to invoice owner
            // If invoice has a known owner wallet, we pay them. Otherwise fallback to Main Vault.
            const FLOWFI_VAULT_PUBLIC_KEY = "0106ca7c39cd272dbf21a86eeb3b36b7c26e2e9b94af64292419f7862936bca2ca";
            const recipientAddress = (invoice as any).owner || FLOWFI_VAULT_PUBLIC_KEY;

            const senderKey = CLPublicKey.fromHex(activeKey);
            const recipientKey = CLPublicKey.fromHex(recipientAddress);
            // Optional: Split payment logic if needed, for now simplistic direct payment

            // Calculate investment amount based on invoice value (in CSPR)
            const csprPrice = 0.0245; // Fixed for demo stability
            const invoiceValueCSPR = Math.floor((invoice.amount) / csprPrice);
            // Cap max investment for demo purposes to avoid huge testnet drain
            const investmentMotes = Math.min(Math.floor(invoiceValueCSPR * 1_000_000_000), 50_000_000_000); // Max 50 CSPR for demo safety

            // Create transfer to invoice owner
            const deployParams = new DeployUtil.DeployParams(senderKey, CHAIN_NAME, 1, 1800000);
            const session = DeployUtil.ExecutableDeployItem.newTransfer(
                investmentMotes,
                recipientKey,
                null,
                Date.now()
            );
            const payment = DeployUtil.standardPayment(100_000_000); // 0.1 CSPR gas
            const deploy = DeployUtil.makeDeploy(deployParams, session, payment);

            // eslint-disable-next-line
            console.log(`💸 Paying ${investmentMotes.toString()} motes to ${recipientAddress}`);

            const deployJson = DeployUtil.deployToJson(deploy);

            // Sign
            const signatureHex = await signDeploy(JSON.stringify(deployJson));

            // Fix signature prefix logic
            const keyType = activeKey.substring(0, 2);
            let finalSignature = signatureHex;
            if (!finalSignature.startsWith(keyType)) {
                finalSignature = `${keyType}${signatureHex}`;
            }

            // Construct final JSON
            const signedDeployJson = {
                deploy: {
                    ...(deployJson as any).deploy,
                    approvals: [{
                        signer: activeKey,
                        signature: finalSignature
                    }]
                }
            };

            // Send to network
            const finalDeployHash = await sendDeployToNetwork(signedDeployJson);

            // Update UI state
            const updatedInvoices = invoices.map(inv =>
                inv.id === invoice.id ? { ...inv, isFunded: true } : inv
            );
            setInvoices(updatedInvoices);

            // Update Supabase (if configured) with full investment details
            const supabaseClient = getSupabaseClient();
            if (supabaseClient) {
                const { error: sbError } = await supabaseClient
                    .from('invoices')
                    .update({
                        funding_status: 'funded',
                        investor_deploy_hash: finalDeployHash,
                        investor_address: activeKey,
                        funded_at: new Date().toISOString(),
                    })
                    .eq('invoice_id', invoice.id);

                if (sbError) console.error("Supabase update failed", sbError);
            }

            // Fallback for localStorage to keep everything in sync
            if (invoice.isNew) {
                const stored = JSON.parse(localStorage.getItem("flowfi_minted_invoices") || "[]");
                const updatedStored = stored.map((inv: any) =>
                    inv.id === invoice.id ? { ...inv, isFunded: true } : inv
                );
                localStorage.setItem("flowfi_minted_invoices", JSON.stringify(updatedStored));
            }

            setSuccessTx(finalDeployHash);

        } catch (error) {
            console.error("Investment failed:", error);
            alert("Investment failed. See console for details.");
        } finally {
            setInvestingId(null);
        }
    };

    // Filter and sort
    const filteredInvoices = invoices
        .filter(inv => {
            if (filter === "minted") return inv.isNew;
            if (filter === "funded") return inv.isFunded;
            return true;
        })
        .filter(inv =>
            inv.vendor.toLowerCase().includes(searchQuery.toLowerCase()) ||
            inv.id.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .sort((a, b) => {
            // Prioritize NEW minted items for the demo (always show at top)
            if (a.isNew && !b.isNew) return -1;
            if (!a.isNew && b.isNew) return 1;

            if (sortBy === "amount") return b.amount - a.amount;
            if (sortBy === "yield") return parseFloat(b.yield) - parseFloat(a.yield);
            return parseInt(a.term) - parseInt(b.term);
        });

    const mintedCount = invoices.filter(inv => inv.isNew).length;
    // Fix: Parse amount safely as it might be stored as string "50000" in localStorage
    const totalVolume = invoices.reduce((sum, inv) => sum + (Number(inv.amount) || 0), 0);
    // Fix: Handle empty array div-by-zero
    const avgYield = invoices.length > 0
        ? invoices.reduce((sum, inv) => sum + (parseFloat(inv.yield) || 0), 0) / invoices.length
        : 0;

    const getScoreColor = (score: string) => {
        if (!score) return "from-gray-500 to-slate-500";
        if (score.startsWith("A")) return "from-green-500 to-emerald-500";
        if (score.startsWith("B")) return "from-yellow-500 to-amber-500";
        return "from-red-500 to-rose-500";
    };

    const getScoreBg = (score: string) => {
        if (!score) return "bg-gray-500/20 text-gray-400 border-gray-500/30";
        if (score.startsWith("A")) return "bg-green-500/20 text-green-400 border-green-500/30";
        if (score.startsWith("B")) return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
        return "bg-red-500/20 text-red-400 border-red-500/30";
    };

    return (
        <div className="min-h-screen relative">
            {/* Background Effects */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-[var(--flow-purple)] opacity-5 blur-[200px] rounded-full" />
                <div className="absolute bottom-0 left-1/4 w-[600px] h-[600px] bg-[var(--flow-cyan)] opacity-5 blur-[200px] rounded-full" />
            </div>

            <div className="container mx-auto px-6 py-12 relative z-10">
                {/* Header */}
                <FadeInSection className="mb-12">
                    <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
                        <div>
                            <span className="badge-success mb-4 inline-block">Investor Marketplace</span>
                            <h1 className="text-4xl md:text-5xl font-bold font-display mb-4">
                                <span className="text-white">Earn Yield on </span>
                                <span className="text-gradient">Real-World Assets</span>
                            </h1>
                            <p className="text-[var(--flow-text-secondary)] max-w-lg">
                                Invest in verified, AI-scored invoices and earn consistent returns backed by actual business receivables.
                            </p>
                            {mintedCount > 0 && (
                                <div className="flex items-center gap-2 mt-4 text-sm text-[var(--flow-cyan)]">
                                    <Sparkles className="w-4 h-4" />
                                    {mintedCount} newly minted invoice{mintedCount > 1 ? 's' : ''} available!
                                </div>
                            )}
                        </div>

                        {/* Quick Stats */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-center">
                                <p className="text-2xl font-bold text-gradient">
                                    <AnimatedCounter to={totalVolume / 1000} suffix="K" prefix="$" />
                                </p>
                                <p className="text-xs text-[var(--flow-text-muted)]">Total Volume</p>
                            </div>
                            <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-center">
                                <p className="text-2xl font-bold text-[var(--flow-green)]">
                                    <AnimatedCounter to={avgYield} suffix="%" decimals={1} />
                                </p>
                                <p className="text-xs text-[var(--flow-text-muted)]">Avg. Yield</p>
                            </div>
                            <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-center">
                                <p className="text-2xl font-bold text-white">{invoices.length}</p>
                                <p className="text-xs text-[var(--flow-text-muted)]">Invoices</p>
                            </div>
                        </div>
                    </div>
                </FadeInSection>

                {/* Filters Bar */}
                <FadeInSection delay={0.1} className="mb-8">
                    <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                        <div className="flex flex-wrap gap-3">
                            {/* Search */}
                            <div className="relative">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--flow-text-muted)]" />
                                <input
                                    type="text"
                                    placeholder="Search invoices..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="input-glass pl-11 pr-4 py-3 w-64"
                                />
                            </div>

                            {/* Filter Tabs */}
                            <div className="flex rounded-xl overflow-hidden border border-white/10">
                                {[
                                    { key: "all", label: "All" },
                                    { key: "minted", label: `Minted (${mintedCount})` },
                                    { key: "funded", label: "Funded" },
                                ].map((tab) => (
                                    <button
                                        key={tab.key}
                                        onClick={() => setFilter(tab.key as any)}
                                        className={`px-5 py-3 text-sm font-medium transition-all ${filter === tab.key
                                            ? "bg-gradient-to-r from-[var(--flow-cyan)] to-[var(--flow-purple)] text-white"
                                            : "bg-white/5 text-[var(--flow-text-secondary)] hover:bg-white/10"
                                            }`}
                                    >
                                        {tab.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="flex gap-3">
                            {/* Sort */}
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value as any)}
                                className="input-glass py-3 px-4 text-sm bg-white/5"
                            >
                                <option value="amount">Sort by Amount</option>
                                <option value="yield">Sort by Yield</option>
                                <option value="term">Sort by Term</option>
                            </select>

                            {/* View Toggle */}
                            <div className="flex rounded-xl overflow-hidden border border-white/10">
                                <button
                                    onClick={() => setViewMode("grid")}
                                    className={`p-3 transition-colors ${viewMode === "grid" ? "bg-white/10 text-white" : "bg-white/5 text-[var(--flow-text-muted)]"}`}
                                >
                                    <LayoutGrid className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => setViewMode("list")}
                                    className={`p-3 transition-colors ${viewMode === "list" ? "bg-white/10 text-white" : "bg-white/5 text-[var(--flow-text-muted)]"}`}
                                >
                                    <List className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                </FadeInSection>

                {/* Invoice Grid */}
                <AnimatePresence mode="popLayout">
                    {viewMode === "grid" ? (
                        <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-3 gap-6" stagger={0.05}>
                            {filteredInvoices.map((inv) => (
                                <div key={inv.id} data-stagger-item>
                                    <Card3D glowColor={inv.isNew ? "rgba(0, 245, 212, 0.2)" : "rgba(124, 58, 237, 0.2)"}>
                                        <motion.div
                                            layout
                                            className={`glass rounded-2xl p-6 h-full border transition-colors ${inv.isNew
                                                ? "border-[var(--flow-cyan)]/30"
                                                : "border-white/10 hover:border-white/20"
                                                }`}
                                        >
                                            {/* New Badge */}
                                            {inv.isNew && (
                                                <div className="flex items-center gap-2 mb-4 text-xs text-[var(--flow-cyan)] font-medium">
                                                    <Sparkles className="w-3 h-3" />
                                                    Newly Minted on Casper
                                                </div>
                                            )}

                                            {/* Header */}
                                            <div className="flex items-start justify-between mb-6">
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${getScoreColor(inv.score)} flex items-center justify-center`}>
                                                        <Zap className="w-6 h-6 text-white" />
                                                    </div>
                                                    <div>
                                                        <h3 className="font-bold text-white">{inv.vendor}</h3>
                                                        <p className="text-sm text-[var(--flow-text-muted)]">{inv.id}</p>
                                                    </div>
                                                </div>
                                                <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getScoreBg(inv.score)}`}>
                                                    {inv.score}
                                                </span>
                                            </div>

                                            {/* Stats Grid */}
                                            <div className="grid grid-cols-3 gap-4 mb-6">
                                                <div>
                                                    <p className="text-xs text-[var(--flow-text-muted)] uppercase tracking-wider mb-1">Amount</p>
                                                    <p className="text-lg font-bold font-mono text-white">${inv.amount.toLocaleString()}</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-[var(--flow-text-muted)] uppercase tracking-wider mb-1">Yield</p>
                                                    <p className="text-lg font-bold text-[var(--flow-cyan)]">{inv.yield}</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-[var(--flow-text-muted)] uppercase tracking-wider mb-1">Term</p>
                                                    <p className="text-lg font-medium text-white">{inv.term}</p>
                                                </div>
                                            </div>

                                            {/* Footer */}
                                            <div className="flex items-center justify-between pt-4 border-t border-white/10">
                                                <div className="flex items-center gap-2 text-xs text-[var(--flow-text-muted)]">
                                                    <Shield className="w-3 h-3" />
                                                    {inv.deployHash ? "Blockchain Verified" : "AI Verified"}
                                                </div>

                                                <div className="flex items-center gap-2">
                                                    {inv.deployHash && (
                                                        <a
                                                            href={`https://testnet.cspr.live/deploy/${inv.deployHash}`}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                                                            title="View on Explorer"
                                                        >
                                                            <ExternalLink className="w-3 h-3 text-[var(--flow-cyan)]" />
                                                        </a>
                                                    )}

                                                    {inv.isFunded ? (
                                                        <span className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--flow-green)]/20 text-[var(--flow-green)] font-medium text-sm">
                                                            <Check className="w-4 h-4" /> Funded
                                                        </span>
                                                    ) : (
                                                        <button
                                                            onClick={() => handleInvest(inv)}
                                                            disabled={!!investingId}
                                                            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[var(--flow-cyan)] to-[var(--flow-purple)] text-white font-medium text-sm hover:opacity-90 transition-opacity disabled:opacity-50"
                                                        >
                                                            {investingId === inv.id ? (
                                                                <>
                                                                    <Loader2 className="w-4 h-4 animate-spin" />
                                                                    Investing...
                                                                </>
                                                            ) : (
                                                                <>
                                                                    Invest <ArrowUpRight className="w-4 h-4" />
                                                                </>
                                                            )}
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </motion.div>
                                    </Card3D>
                                </div>
                            ))}
                        </StaggerContainer>
                    ) : (
                        /* List View */
                        <div className="space-y-4">
                            {filteredInvoices.map((inv, i) => (
                                <motion.div
                                    key={inv.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                >
                                    <GlowingCard className="rounded-2xl overflow-hidden">
                                        <div className="bg-[var(--flow-bg-secondary)] p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                                            <div className="flex items-center gap-4">
                                                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${getScoreColor(inv.score)} flex items-center justify-center`}>
                                                    <span className="text-lg font-bold text-white">{inv.score}</span>
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <h3 className="font-bold text-white">{inv.vendor}</h3>
                                                        {inv.isNew && (
                                                            <span className="px-2 py-0.5 rounded text-xs bg-[var(--flow-cyan)]/20 text-[var(--flow-cyan)]">New</span>
                                                        )}
                                                    </div>
                                                    <p className="text-sm text-[var(--flow-text-muted)]">{inv.id}</p>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-8">
                                                <div className="text-center">
                                                    <p className="text-xl font-bold font-mono text-white">${inv.amount.toLocaleString()}</p>
                                                    <p className="text-xs text-[var(--flow-text-muted)]">Amount</p>
                                                </div>
                                                <div className="text-center">
                                                    <p className="text-xl font-bold text-[var(--flow-cyan)]">{inv.yield}</p>
                                                    <p className="text-xs text-[var(--flow-text-muted)]">APY</p>
                                                </div>
                                                <div className="text-center">
                                                    <p className="text-xl font-medium text-white">{inv.term}</p>
                                                    <p className="text-xs text-[var(--flow-text-muted)]">Term</p>
                                                </div>

                                                {/* Blockchain Verified Badge + Explorer Link */}
                                                {inv.deployHash && (
                                                    <a
                                                        href={`https://testnet.cspr.live/deploy/${inv.deployHash}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[var(--flow-cyan)]/10 text-[var(--flow-cyan)] text-sm font-medium hover:bg-[var(--flow-cyan)]/20 transition-colors"
                                                        title="View on Explorer"
                                                    >
                                                        <Shield className="w-3 h-3" />
                                                        Verified
                                                        <ExternalLink className="w-3 h-3" />
                                                    </a>
                                                )}

                                                {inv.isFunded ? (
                                                    <span className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[var(--flow-green)]/20 text-[var(--flow-green)] font-medium">
                                                        <Check className="w-4 h-4" /> Funded
                                                    </span>
                                                ) : (
                                                    <button
                                                        onClick={() => handleInvest(inv)}
                                                        disabled={!!investingId}
                                                        className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[var(--flow-cyan)] to-[var(--flow-purple)] text-white font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
                                                    >
                                                        {investingId === inv.id ? (
                                                            <Loader2 className="w-4 h-4 animate-spin" />
                                                        ) : (
                                                            <>Invest Now</>
                                                        )}
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </GlowingCard>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </AnimatePresence>

                {/* Empty State */}
                {filteredInvoices.length === 0 && (
                    <div className="text-center py-20">
                        <div className="w-20 h-20 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-6">
                            <Search className="w-8 h-8 text-[var(--flow-text-muted)]" />
                        </div>
                        <p className="text-[var(--flow-text-muted)] mb-4">No invoices found matching your criteria.</p>
                        <Link href="/dashboard" className="text-[var(--flow-cyan)] font-medium hover:underline">
                            Go to Dashboard to mint your first invoice →
                        </Link>
                    </div>
                )}
            </div>

            {/* Success Modal */}
            <AnimatePresence>
                {successTx && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/80 backdrop-blur-xl flex items-center justify-center z-50 p-4"
                        onClick={() => setSuccessTx(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 30 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 30 }}
                            className="bg-[var(--flow-bg-secondary)] rounded-3xl p-8 max-w-md w-full border border-white/10"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Gradient Top Bar */}
                            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[var(--flow-cyan)] via-[var(--flow-purple)] to-[var(--flow-pink)] rounded-t-3xl" />

                            <div className="text-center">
                                {/* Success Icon */}
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ type: "spring", delay: 0.2 }}
                                    className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-[var(--flow-green)] to-emerald-500 flex items-center justify-center"
                                >
                                    <Check className="w-10 h-10 text-white" strokeWidth={3} />
                                </motion.div>

                                <h2 className="text-2xl font-bold text-white mb-2">Investment Successful!</h2>
                                <p className="text-[var(--flow-text-secondary)] mb-8">
                                    You have successfully funded this Real-World Asset on Casper Network.
                                </p>

                                {/* Transaction Hash */}
                                <div className="p-4 rounded-xl bg-white/5 border border-white/10 mb-6 text-left">
                                    <p className="text-xs text-[var(--flow-text-muted)] uppercase tracking-wider mb-1">Transaction Hash</p>
                                    <p className="font-mono text-xs text-[var(--flow-text-secondary)] break-all">{successTx}</p>
                                </div>

                                {/* Actions */}
                                <div className="flex flex-col gap-3">
                                    <a
                                        href={`https://testnet.cspr.live/deploy/${successTx}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-full py-4 rounded-xl font-bold bg-gradient-to-r from-[var(--flow-cyan)] to-[var(--flow-purple)] text-white hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                                    >
                                        View on Explorer <ExternalLink className="w-4 h-4" />
                                    </a>
                                    <button
                                        onClick={() => setSuccessTx(null)}
                                        className="w-full py-4 rounded-xl font-bold bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-colors"
                                    >
                                        Close
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
