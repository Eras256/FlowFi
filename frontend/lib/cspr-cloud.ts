/**
 * CSPR.cloud API Client
 * Market Data, Token Prices, and Analytics
 * 
 * Documentation: https://docs.cspr.cloud
 * Console: https://console.cspr.build
 */

import axios from 'axios';

// API Configuration
const CSPR_CLOUD_BASE_URL = 'https://api.cspr.cloud';
const CSPR_CLOUD_TESTNET_BASE = 'https://api.testnet.cspr.cloud';
const ACCESS_TOKEN = process.env.NEXT_PUBLIC_CSPR_CLOUD_ACCESS_TOKEN || '';

// Create axios instance with auth
const csprCloudApi = axios.create({
    baseURL: CSPR_CLOUD_TESTNET_BASE,
    headers: {
        'Content-Type': 'application/json',
        ...(ACCESS_TOKEN && { 'Authorization': ACCESS_TOKEN }),
    },
});

// ============ TYPES ============

export interface TokenPrice {
    contract_package_hash: string;
    name: string;
    symbol: string;
    decimals: number;
    price_usd: number;
    price_change_24h: number;
    volume_24h: number;
    market_cap: number;
    total_supply: string;
    holders_count: number;
    logo_url?: string;
}

export interface TokenRate {
    base_token: string;
    quote_token: string;
    rate: number;
    liquidity_usd: number;
    dex: string;
    pool_address: string;
}

export interface MarketOverview {
    total_market_cap_usd: number;
    total_volume_24h_usd: number;
    cspr_price_usd: number;
    cspr_price_change_24h: number;
    active_tokens: number;
    total_transactions_24h: number;
}

export interface DEXPool {
    pool_hash: string;
    token0: TokenInfo;
    token1: TokenInfo;
    reserve0: string;
    reserve1: string;
    liquidity_usd: number;
    volume_24h: number;
    fee_tier: number;
    apy_7d: number;
}

export interface TokenInfo {
    contract_package_hash: string;
    name: string;
    symbol: string;
    decimals: number;
    logo_url?: string;
}

export interface TokenHolder {
    account_hash: string;
    balance: string;
    percentage: number;
}

export interface PriceHistory {
    timestamp: number;
    price_usd: number;
    volume_usd: number;
}

export interface Transaction {
    deploy_hash: string;
    timestamp: string;
    from: string;
    to: string;
    amount: string;
    token_symbol: string;
    type: 'transfer' | 'swap' | 'mint' | 'burn' | 'stake';
    status: 'success' | 'failed';
}

// ============ API FUNCTIONS ============

/**
 * Get market overview with CSPR price and total stats
 */
export async function getMarketOverview(): Promise<MarketOverview> {
    try {
        // Try real API first
        const response = await csprCloudApi.get('/market/overview');
        return response.data;
    } catch (error) {
        // Fallback to simulated data for demo
        console.warn('Using simulated market data');
        return {
            total_market_cap_usd: 142_000_000,
            total_volume_24h_usd: 8_500_000,
            cspr_price_usd: 0.0245,
            cspr_price_change_24h: 3.42,
            active_tokens: 47,
            total_transactions_24h: 15420,
        };
    }
}

/**
 * Get all token prices with market data
 */
export async function getTokenPrices(): Promise<TokenPrice[]> {
    try {
        const response = await csprCloudApi.get('/market/tokens');
        return response.data.data || response.data;
    } catch (error) {
        // Return simulated tokens for demo
        console.warn('Using simulated token prices');
        return getSimulatedTokens();
    }
}

/**
 * Get price for a specific token
 */
export async function getTokenPrice(contractHash: string): Promise<TokenPrice | null> {
    try {
        const response = await csprCloudApi.get(`/market/tokens/${contractHash}`);
        return response.data;
    } catch (error) {
        console.error('Failed to fetch token price:', error);
        return null;
    }
}

/**
 * Get token price history for charts
 */
export async function getTokenPriceHistory(
    contractHash: string,
    interval: '1h' | '24h' | '7d' | '30d' = '24h'
): Promise<PriceHistory[]> {
    try {
        const response = await csprCloudApi.get(`/market/tokens/${contractHash}/history`, {
            params: { interval }
        });
        return response.data.data || response.data;
    } catch (error) {
        // Generate simulated history
        return generateSimulatedPriceHistory(interval);
    }
}

/**
 * Get trading pairs/rates
 */
export async function getTokenRates(): Promise<TokenRate[]> {
    try {
        const response = await csprCloudApi.get('/market/rates');
        return response.data.data || response.data;
    } catch (error) {
        console.warn('Using simulated rates');
        return getSimulatedRates();
    }
}

/**
 * Get DEX pools with liquidity info
 */
export async function getDEXPools(): Promise<DEXPool[]> {
    try {
        const response = await csprCloudApi.get('/dex/pools');
        return response.data.data || response.data;
    } catch (error) {
        console.warn('Using simulated DEX pools');
        return getSimulatedPools();
    }
}

/**
 * Get recent transactions
 */
export async function getRecentTransactions(limit: number = 20): Promise<Transaction[]> {
    try {
        const response = await csprCloudApi.get('/transactions/recent', {
            params: { limit }
        });
        return response.data.data || response.data;
    } catch (error) {
        return getSimulatedTransactions();
    }
}

/**
 * Get account token balances
 */
export async function getAccountTokenBalances(accountHash: string): Promise<{
    cspr_balance: string;
    tokens: Array<{
        token: TokenInfo;
        balance: string;
        value_usd: number;
    }>;
}> {
    try {
        const response = await csprCloudApi.get(`/accounts/${accountHash}/tokens`);
        return response.data;
    } catch (error) {
        return {
            cspr_balance: '0',
            tokens: []
        };
    }
}

/**
 * Get NFT collections
 */
export async function getNFTCollections(): Promise<Array<{
    contract_hash: string;
    name: string;
    symbol: string;
    total_supply: number;
    holders: number;
    floor_price_cspr: number;
    volume_24h: number;
}>> {
    try {
        const response = await csprCloudApi.get('/nft/collections');
        return response.data.data || response.data;
    } catch (error) {
        return getSimulatedNFTCollections();
    }
}

// ============ SIMULATED DATA (for demo when API unavailable) ============

function getSimulatedTokens(): TokenPrice[] {
    return [
        {
            contract_package_hash: 'cspr',
            name: 'Casper',
            symbol: 'CSPR',
            decimals: 9,
            price_usd: 0.0245,
            price_change_24h: 3.42,
            volume_24h: 5_200_000,
            market_cap: 320_000_000,
            total_supply: '13000000000000000000',
            holders_count: 125000,
            logo_url: 'https://cryptologos.cc/logos/casper-cspr-logo.png',
        },
        {
            contract_package_hash: 'a1b2c3d4e5f6...',
            name: 'Wrapped CSPR',
            symbol: 'WCSPR',
            decimals: 9,
            price_usd: 0.0244,
            price_change_24h: 3.38,
            volume_24h: 890_000,
            market_cap: 45_000_000,
            total_supply: '1850000000000000000',
            holders_count: 8500,
        },
        {
            contract_package_hash: 'b2c3d4e5f6a1...',
            name: 'CasperPad',
            symbol: 'CSPD',
            decimals: 18,
            price_usd: 0.0012,
            price_change_24h: -2.15,
            volume_24h: 125_000,
            market_cap: 2_400_000,
            total_supply: '2000000000000000000000000000',
            holders_count: 4200,
        },
        {
            contract_package_hash: 'c3d4e5f6a1b2...',
            name: 'CasperSwap',
            symbol: 'SWAP',
            decimals: 18,
            price_usd: 0.0089,
            price_change_24h: 5.67,
            volume_24h: 78_000,
            market_cap: 890_000,
            total_supply: '100000000000000000000000000',
            holders_count: 2100,
        },
        {
            contract_package_hash: 'd4e5f6a1b2c3...',
            name: 'Friendly Market',
            symbol: 'FM',
            decimals: 18,
            price_usd: 0.0034,
            price_change_24h: 12.45,
            volume_24h: 45_000,
            market_cap: 340_000,
            total_supply: '100000000000000000000000000',
            holders_count: 890,
        },
        {
            contract_package_hash: 'e5f6a1b2c3d4...',
            name: 'FlowFi Token',
            symbol: 'FLOW',
            decimals: 18,
            price_usd: 0.0156,
            price_change_24h: 8.92,
            volume_24h: 32_000,
            market_cap: 156_000,
            total_supply: '10000000000000000000000000',
            holders_count: 520,
        },
    ];
}

function getSimulatedRates(): TokenRate[] {
    return [
        {
            base_token: 'CSPR',
            quote_token: 'USDT',
            rate: 0.0245,
            liquidity_usd: 2_500_000,
            dex: 'CasperSwap',
            pool_address: 'pool-1234...',
        },
        {
            base_token: 'WCSPR',
            quote_token: 'CSPR',
            rate: 0.998,
            liquidity_usd: 1_200_000,
            dex: 'CasperSwap',
            pool_address: 'pool-5678...',
        },
        {
            base_token: 'CSPD',
            quote_token: 'CSPR',
            rate: 0.049,
            liquidity_usd: 450_000,
            dex: 'FriendlyMarket',
            pool_address: 'pool-9012...',
        },
    ];
}

function getSimulatedPools(): DEXPool[] {
    return [
        {
            pool_hash: 'pool-cspr-usdt-001',
            token0: { contract_package_hash: 'cspr', name: 'Casper', symbol: 'CSPR', decimals: 9 },
            token1: { contract_package_hash: 'usdt', name: 'USDT', symbol: 'USDT', decimals: 6 },
            reserve0: '102000000000000000',
            reserve1: '2500000000000',
            liquidity_usd: 5_000_000,
            volume_24h: 890_000,
            fee_tier: 0.003,
            apy_7d: 24.5,
        },
        {
            pool_hash: 'pool-wcspr-cspr-001',
            token0: { contract_package_hash: 'wcspr', name: 'Wrapped CSPR', symbol: 'WCSPR', decimals: 9 },
            token1: { contract_package_hash: 'cspr', name: 'Casper', symbol: 'CSPR', decimals: 9 },
            reserve0: '50000000000000000',
            reserve1: '50100000000000000',
            liquidity_usd: 2_450_000,
            volume_24h: 320_000,
            fee_tier: 0.001,
            apy_7d: 8.2,
        },
        {
            pool_hash: 'pool-cspd-cspr-001',
            token0: { contract_package_hash: 'cspd', name: 'CasperPad', symbol: 'CSPD', decimals: 18 },
            token1: { contract_package_hash: 'cspr', name: 'Casper', symbol: 'CSPR', decimals: 9 },
            reserve0: '45000000000000000000000000',
            reserve1: '22000000000000000',
            liquidity_usd: 1_078_000,
            volume_24h: 125_000,
            fee_tier: 0.003,
            apy_7d: 42.8,
        },
    ];
}

function getSimulatedTransactions(): Transaction[] {
    const types: Transaction['type'][] = ['transfer', 'swap', 'mint', 'stake'];
    const tokens = ['CSPR', 'WCSPR', 'CSPD', 'SWAP', 'FLOW'];

    return Array.from({ length: 20 }, (_, i) => ({
        deploy_hash: `${Math.random().toString(36).substring(2, 10)}${Math.random().toString(36).substring(2, 10)}`,
        timestamp: new Date(Date.now() - i * 60000 * Math.random() * 10).toISOString(),
        from: `account-hash-${Math.random().toString(36).substring(2, 10)}`,
        to: `account-hash-${Math.random().toString(36).substring(2, 10)}`,
        amount: (Math.random() * 10000 + 100).toFixed(2),
        token_symbol: tokens[Math.floor(Math.random() * tokens.length)],
        type: types[Math.floor(Math.random() * types.length)],
        status: Math.random() > 0.05 ? 'success' : 'failed',
    }));
}

function generateSimulatedPriceHistory(interval: string): PriceHistory[] {
    const points = interval === '1h' ? 60 : interval === '24h' ? 24 : interval === '7d' ? 168 : 720;
    const basePrice = 0.0245;

    return Array.from({ length: points }, (_, i) => {
        const variance = (Math.random() - 0.5) * 0.002;
        return {
            timestamp: Date.now() - (points - i) * (interval === '1h' ? 60000 : 3600000),
            price_usd: basePrice + variance,
            volume_usd: Math.random() * 500000 + 100000,
        };
    });
}

function getSimulatedNFTCollections() {
    return [
        {
            contract_hash: '113fd0f7f4f803e2401a9547442e2ca31bd9001b4fcd803eaff7a3dac11e4623',
            name: 'FlowFi Invoices',
            symbol: 'FLOW',
            total_supply: 156,
            holders: 89,
            floor_price_cspr: 250,
            volume_24h: 12500,
        },
        {
            contract_hash: 'f1e2d3c4b5a6...',
            name: 'Casper Punks',
            symbol: 'CPUNK',
            total_supply: 10000,
            holders: 3200,
            floor_price_cspr: 1500,
            volume_24h: 45000,
        },
        {
            contract_hash: 'a6b5c4d3e2f1...',
            name: 'Casper Apes',
            symbol: 'CAPE',
            total_supply: 5000,
            holders: 1800,
            floor_price_cspr: 800,
            volume_24h: 28000,
        },
    ];
}

// ============ REAL-TIME SUBSCRIPTIONS (WebSocket) ============

export class CSPRCloudWebSocket {
    private ws: WebSocket | null = null;
    private subscribers: Map<string, Set<(data: any) => void>> = new Map();

    connect() {
        if (typeof window === 'undefined') return;

        try {
            this.ws = new WebSocket('wss://streaming.cspr.cloud');

            this.ws.onmessage = (event) => {
                const data = JSON.parse(event.data);
                const channel = data.channel;

                if (this.subscribers.has(channel)) {
                    this.subscribers.get(channel)?.forEach(cb => cb(data.payload));
                }
            };

            this.ws.onerror = (error) => {
                console.error('CSPR.cloud WebSocket error:', error);
            };
        } catch (error) {
            console.warn('WebSocket connection failed, using polling instead');
        }
    }

    subscribe(channel: string, callback: (data: any) => void) {
        if (!this.subscribers.has(channel)) {
            this.subscribers.set(channel, new Set());
        }
        this.subscribers.get(channel)?.add(callback);

        // Send subscribe message
        if (this.ws?.readyState === WebSocket.OPEN) {
            this.ws.send(JSON.stringify({ action: 'subscribe', channel }));
        }
    }

    unsubscribe(channel: string, callback: (data: any) => void) {
        this.subscribers.get(channel)?.delete(callback);
    }

    disconnect() {
        this.ws?.close();
        this.ws = null;
    }
}

// Singleton instance
let wsInstance: CSPRCloudWebSocket | null = null;

export function getCSPRCloudWebSocket(): CSPRCloudWebSocket {
    if (!wsInstance) {
        wsInstance = new CSPRCloudWebSocket();
    }
    return wsInstance;
}
