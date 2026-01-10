import { NextRequest, NextResponse } from 'next/server';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

/**
 * Market Data API Route
 * Proxies requests to CSPR.cloud Market Data API
 * Avoids CORS issues and adds authentication
 */

const CSPR_CLOUD_BASE = 'https://api.testnet.cspr.cloud';
const ACCESS_TOKEN = process.env.CSPR_CLOUD_ACCESS_TOKEN || '';

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const endpoint = searchParams.get('endpoint') || 'market/overview';

        const url = `${CSPR_CLOUD_BASE}/${endpoint}`;

        console.log(`Proxying market data request to: ${url}`);

        const response = await fetch(url, {
            headers: {
                'Content-Type': 'application/json',
                ...(ACCESS_TOKEN && { 'Authorization': ACCESS_TOKEN }),
            },
            next: { revalidate: 60 } // Cache for 60 seconds
        });

        if (!response.ok) {
            console.warn(`CSPR.cloud API returned ${response.status}, using fallback data`);
            return NextResponse.json(getFallbackData(endpoint));
        }

        const data = await response.json();
        return NextResponse.json(data);

    } catch (error: any) {
        console.error('Market Data API Error:', error);
        return NextResponse.json(getFallbackData('market/overview'));
    }
}

function getFallbackData(endpoint: string) {
    if (endpoint.includes('overview')) {
        return {
            total_market_cap_usd: 142_000_000,
            total_volume_24h_usd: 8_500_000,
            cspr_price_usd: 0.0245,
            cspr_price_change_24h: 3.42,
            active_tokens: 47,
            total_transactions_24h: 15420,
        };
    }

    if (endpoint.includes('tokens')) {
        return {
            data: [
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
                },
            ]
        };
    }

    if (endpoint.includes('pools')) {
        return {
            data: [
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
            ]
        };
    }

    return { data: [] };
}
