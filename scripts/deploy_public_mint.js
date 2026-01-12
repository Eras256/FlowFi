/**
 * Deploy CEP-78 Contract with PUBLIC MINTING MODE
 * This allows ANY account to mint NFTs without being on a whitelist
 * 
 * FIXES: Error 36 (InvalidMintingMode) when non-whitelisted users try to mint
 */

require('dotenv').config({ path: './frontend/.env.local' });
const fs = require('fs');
const https = require('https');
const path = require('path');
const {
    DeployUtil,
    RuntimeArgs,
    CLValueBuilder,
    Keys,
} = require('casper-js-sdk');

// --- CONFIGURATION ---
const NODE_URL = 'https://node.testnet.cspr.cloud/rpc';
const ACCESS_TOKEN = process.env.CSPR_CLOUD_ACCESS_TOKEN || '019b9f79-2cd4-7e83-a46e-65f3bc6c51bd';
const NETWORK_NAME = 'casper-test';

// Use the existing CEP-78 WASM
const WASM_PATH = path.join(__dirname, '../contracts/cep-78.wasm');
const KEY_PATH = path.join(__dirname, '../keys/temp_admin.pem');

async function deployPublicMintContract() {
    console.log("🚀 Deploying CEP-78 Contract with PUBLIC MINTING MODE...");
    console.log("━".repeat(60));
    console.log(`📡 RPC: ${NODE_URL}`);
    console.log(`🔐 Auth Token: ${ACCESS_TOKEN.substring(0, 8)}...`);

    // 1. Load Keys
    let keyPair;
    try {
        keyPair = Keys.Secp256K1.loadKeyPairFromPrivateFile(KEY_PATH);
    } catch (e) {
        try {
            keyPair = Keys.Ed25519.loadKeyPairFromPrivateFile(KEY_PATH);
        } catch (e2) {
            console.error("❌ Failed to load key file:", e.message);
            return;
        }
    }
    console.log(`🔑 Deployer Account: ${keyPair.publicKey.toHex()}`);

    // 2. Load WASM
    if (!fs.existsSync(WASM_PATH)) {
        console.error(`❌ WASM not found at ${WASM_PATH}`);
        return;
    }
    const wasm = new Uint8Array(fs.readFileSync(WASM_PATH));
    console.log(`📦 WASM loaded: ${(wasm.length / 1024).toFixed(1)} KB`);

    // 3. Construct Arguments for CEP-78 with PUBLIC MINTING
    console.log("\n📋 Contract Configuration:");
    console.log("   ├─ Collection: FlowFi Invoices v3");
    console.log("   ├─ Symbol: FLOW3");
    console.log("   ├─ Supply: 1,000,000 tokens");
    console.log("   ├─ Minting Mode: 1 (PUBLIC - anyone can mint!) ⚡");
    console.log("   ├─ Ownership: Transferable");
    console.log("   ├─ Metadata: CEP78 Standard");
    console.log("   └─ Identifier: Ordinal (auto-increment)");

    const args = RuntimeArgs.fromMap({
        // Collection info
        "collection_name": CLValueBuilder.string("FlowFi Invoices v3"),
        "collection_symbol": CLValueBuilder.string("FLOW3"),
        "total_token_supply": CLValueBuilder.u64(1000000),

        // ★ KEY FIX: PUBLIC MINTING MODE ★
        // Mode 0 = Installer Only (only deployer can mint)
        // Mode 1 = PUBLIC (anyone can mint) <-- THIS IS THE FIX!
        // Mode 2 = ACL (whitelist required)
        "minting_mode": CLValueBuilder.u8(1),

        // Ownership & Transfer
        "ownership_mode": CLValueBuilder.u8(2),        // 2 = Transferable
        "nft_kind": CLValueBuilder.u8(1),              // 1 = Digital
        "holder_mode": CLValueBuilder.u8(2),           // 2 = Mixed (accounts + contracts)
        "whitelist_mode": CLValueBuilder.u8(0),        // 0 = Unlocked (no whitelist checks)

        // Metadata configuration
        "nft_metadata_kind": CLValueBuilder.u8(0),     // 0 = CEP78 (name, token_uri, checksum)
        "identifier_mode": CLValueBuilder.u8(0),       // 0 = Ordinal (auto-increment token IDs)
        "metadata_mutability": CLValueBuilder.u8(0),   // 0 = Immutable

        // Features
        "burn_mode": CLValueBuilder.u8(0),             // 0 = Burnable
        "allow_minting": CLValueBuilder.bool(true),    // Enable minting
        "owner_reverse_lookup_mode": CLValueBuilder.u8(1), // 1 = Complete (for querying tokens by owner)
        "events_mode": CLValueBuilder.u8(1),           // 1 = CEP47 events

        // Receipt/package
        "receipt_name": CLValueBuilder.string("flowfi_receipt"),
        "json_schema": CLValueBuilder.string("{}"),
    });

    // 4. Create Deploy with adequate gas
    const deploy = DeployUtil.makeDeploy(
        new DeployUtil.DeployParams(keyPair.publicKey, NETWORK_NAME, 1, 3600000),
        DeployUtil.ExecutableDeployItem.newModuleBytes(wasm, args),
        DeployUtil.standardPayment(800_000_000_000) // 800 CSPR (increased due to out of gas error)
    );

    // 5. Sign
    const signedDeploy = DeployUtil.signDeploy(deploy, keyPair);
    const deployJson = DeployUtil.deployToJson(signedDeploy);

    // 6. Send via HTTPS with auth header
    console.log("\n📡 Sending Deploy via CSPR.cloud...");

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
                        console.log("\n" + "═".repeat(60));
                        console.log("✅ DEPLOY SUCCESSFUL!");
                        console.log("═".repeat(60));
                        console.log(`📝 Deploy Hash: ${hash}`);
                        console.log(`🔗 Explorer: https://testnet.cspr.live/deploy/${hash}`);
                        console.log("\n⏳ NEXT STEPS:");
                        console.log("   1. Wait 2-3 minutes for execution");
                        console.log("   2. Run: node scripts/get_contract_hash.js " + hash);
                        console.log("   3. Update frontend/.env.local with new contract hash");
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

deployPublicMintContract().catch(console.error);
