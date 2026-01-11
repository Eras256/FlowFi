
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const deployData = body.deploy;

        if (!deployData) {
            return NextResponse.json({ error: 'Missing deploy data' }, { status: 400 });
        }

        // Logic to select RPC node
        const CSPR_CLOUD_KEY = process.env.NEXT_PUBLIC_CSPR_CLOUD_ACCESS_TOKEN || process.env.CSPR_CLOUD_ACCESS_TOKEN;
        let rpcUrl = "https://node.testnet.casper.network/rpc"; // Public fallback
        let headers: any = { "Content-Type": "application/json" };

        if (CSPR_CLOUD_KEY) {
            rpcUrl = "https://node.testnet.cspr.cloud/rpc";
            headers["authorization"] = CSPR_CLOUD_KEY; // lowercase 'authorization' for CSPR.cloud
        }

        console.log(`Forwarding deploy to: ${rpcUrl}`);

        // Construct RPC Request
        const rpcPayload = {
            jsonrpc: "2.0",
            id: Date.now(),
            method: "account_put_deploy",
            params: [deployData.deploy || deployData] // Handle both wrapper styles
        };

        const response = await fetch(rpcUrl, {
            method: "POST",
            headers: headers,
            body: JSON.stringify(rpcPayload)
        });

        const result = await response.json();

        if (result.error) {
            console.error("RPC Error:", result.error);
            return NextResponse.json({
                success: false,
                error: result.error
            }, { status: 500 });
        }

        return NextResponse.json({
            success: true,
            deploy_hash: result.result.deploy_hash
        });

    } catch (error: any) {
        console.error("Deploy Proxy Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
