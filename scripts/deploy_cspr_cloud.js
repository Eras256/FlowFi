require('dotenv').config({ path: './frontend/.env.local' });
const fs = require('fs');
const https = require('https');
const {
    CasperClient,
    DeployUtil,
    CLPublicKey,
    RuntimeArgs,
    CLValueBuilder,
    Keys,
} = require('casper-js-sdk');

// --- CONFIGURATION ---
// Use CSPR.cloud RPC (authenticated, reliable)
const NODE_URL = 'https://node.testnet.cspr.cloud/rpc';
const ACCESS_TOKEN = process.env.CSPR_CLOUD_ACCESS_TOKEN || '019b9f79-2cd4-7e83-a46e-65f3bc6c51bd';
const NETWORK_NAME = 'casper-test';
const WASM_PATH = '/home/vaiosvaios/CasperFlow-1/cep-78-enhanced-nft/target/wasm32-unknown-unknown/release/cep78.wasm';
const KEY_PATH = '/home/vaiosvaios/CasperFlow-1/keys/admin_funded.pem';

// --- DEPLOY LOGIC ---
async function deployPublicContract() {
    console.log("🚀 Starting PUBLIC Contract Deployment via CSPR.cloud...");
    console.log(`📡 RPC: ${NODE_URL}`);
    console.log(`🔐 Auth Token: ${ACCESS_TOKEN.substring(0, 8)}...`);

    // 1. Load Keys
    const keyPair = Keys.Secp256K1.loadKeyPairFromPrivateFile(KEY_PATH);
    console.log(`🔑 Deploying with Account: ${keyPair.publicKey.toHex()}`);

    // 2. Load WASM
    if (!fs.existsSync(WASM_PATH)) {
        console.error(`❌ WASM not found at ${WASM_PATH}`);
        return;
    }
    const wasm = new Uint8Array(fs.readFileSync(WASM_PATH));
    console.log(`📦 WASM loaded: ${(wasm.length / 1024).toFixed(1)} KB`);

    // 3. Construct Arguments for CEP-78 (STRICTLY PUBLIC MINTING)
    const args = RuntimeArgs.fromMap({
        "collection_name": CLValueBuilder.string("FlowFi Invoices V2"),
        "collection_symbol": CLValueBuilder.string("FLOWV2"),
        "total_token_supply": CLValueBuilder.u64(100000),
        "ownership_mode": CLValueBuilder.u8(2),      // 2 = Transferable
        "nft_kind": CLValueBuilder.u8(1),            // 1 = Digital
        "holder_mode": CLValueBuilder.u8(2),         // 2 = Mixed (accounts + contracts)
        "whitelist_mode": CLValueBuilder.u8(0),      // 0 = Unlocked
        "minting_mode": CLValueBuilder.u8(1),        // 1 = PUBLIC <-- KEY FIX
        "nft_metadata_kind": CLValueBuilder.u8(2),   // 2 = Raw (flexible JSON)
        "identifier_mode": CLValueBuilder.u8(0),     // 0 = Ordinal (auto-increment)
        "metadata_mutability": CLValueBuilder.u8(0), // 0 = Immutable
        "burn_mode": CLValueBuilder.u8(0),           // 0 = Burnable
        "reporting_mode": CLValueBuilder.u8(0),      // 0 = None
        "events_mode": CLValueBuilder.u8(1),         // 1 = CES (Standard Events)
    });

    // 4. Create Deploy with high gas
    const deploy = DeployUtil.makeDeploy(
        new DeployUtil.DeployParams(keyPair.publicKey, NETWORK_NAME, 1, 3600000),
        DeployUtil.ExecutableDeployItem.newModuleBytes(wasm, args),
        DeployUtil.standardPayment(400_000_000_000) // 400 CSPR (safe margin)
    );

    // 5. Sign
    const signedDeploy = DeployUtil.signDeploy(deploy, keyPair);
    const deployJson = DeployUtil.deployToJson(signedDeploy);

    // 6. Send via HTTPS with auth header
    console.log("📡 Sending Deploy via authenticated CSPR.cloud...");

    const rpcPayload = JSON.stringify({
        jsonrpc: "2.0",
        id: Date.now(),
        method: "account_put_deploy",
        params: [(deployJson).deploy]
    });

    const options = {
        hostname: 'node.testnet.cspr.cloud',
        port: 443,
        path: '/rpc',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': ACCESS_TOKEN,
            'Content-Length': Buffer.byteLength(rpcPayload)
        }
    };

    return new Promise((resolve, reject) => {
        const req = https.request(options, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    const result = JSON.parse(data);
                    if (result.error) {
                        console.error("❌ RPC Error:", result.error);
                        reject(result.error);
                    } else if (result.result && result.result.deploy_hash) {
                        const hash = result.result.deploy_hash;
                        console.log(`✅ Deploy Sent! Hash: ${hash}`);
                        console.log(`🔗 Check: https://testnet.cspr.live/deploy/${hash}`);
                        console.log("\n⚠️  WAIT 2-3 MINUTES for execution, then run:");
                        console.log("    node scripts/get_contract_hash.js " + hash);
                        resolve(hash);
                    } else {
                        console.log("⚠️ Unexpected response:", result);
                        resolve(null);
                    }
                } catch (e) {
                    console.error("Parse error:", e, data);
                    reject(e);
                }
            });
        });

        req.on('error', (e) => {
            console.error("❌ Request failed:", e.message);
            reject(e);
        });

        req.write(rpcPayload);
        req.end();
    });
}

deployPublicContract().catch(console.error);
