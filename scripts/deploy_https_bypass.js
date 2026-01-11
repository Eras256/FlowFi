
const fs = require('fs');
const {
    CasperClient,
    DeployUtil,
    CLPublicKey,
    RuntimeArgs,
    CLValueBuilder,
    Keys,
    CLKey,
    CLAccountHash
} = require('casper-js-sdk');

// --- CONFIGURATION ---
const HTTPS_NODE_URL = 'https://node.testnet.cspr.cloud/rpc';
const ACCESS_TOKEN = '019b9f79-2cd4-7e83-a46e-65f3bc6c51bd'; // Your token
const NETWORK_NAME = 'casper-test';
const WASM_PATH = '/home/vaiosvaios/CasperFlow-1/cep-78-enhanced-nft/target/wasm32-unknown-unknown/release/cep78.wasm';
const KEY_PATH = '/home/vaiosvaios/CasperFlow-1/keys/temp_admin.pem';

async function deployViaHttps() {
    console.log("🚀 Starting HTTPS BYPASS Deployment for FlowFi Invoices...");
    console.log(`📡 Target Node: ${HTTPS_NODE_URL} (Port 443)`);

    // 1. Load Keys
    const keyPair = Keys.Secp256K1.loadKeyPairFromPrivateFile(KEY_PATH);
    console.log(`🔑 Account: ${keyPair.publicKey.toHex()}`);

    // 2. Load WASM
    const wasm = new Uint8Array(fs.readFileSync(WASM_PATH));

    // 3. Arguments (CEP-78 Public)
    const args = RuntimeArgs.fromMap({
        "collection_name": CLValueBuilder.string("FlowFi Invoices"),
        "collection_symbol": CLValueBuilder.string("FLOW"),
        "total_token_supply": CLValueBuilder.u64(100000),
        "ownership_mode": CLValueBuilder.u8(2),
        "nft_kind": CLValueBuilder.u8(1),
        "holder_mode": CLValueBuilder.u8(2),
        "whitelist_mode": CLValueBuilder.u8(0),
        "minting_mode": CLValueBuilder.u8(1), // Public Minting!
        "nft_metadata_kind": CLValueBuilder.u8(2), // Raw
        "identifier_mode": CLValueBuilder.u8(0),
        "metadata_mutability": CLValueBuilder.u8(0),
        "burn_mode": CLValueBuilder.u8(0),
        "reporting_mode": CLValueBuilder.u8(0),
        "events_mode": CLValueBuilder.u8(1)
    });

    // 4. Create Signed Deploy
    const deploy = DeployUtil.makeDeploy(
        new DeployUtil.DeployParams(keyPair.publicKey, NETWORK_NAME, 1, 3600000), // 1 hour TTL
        DeployUtil.ExecutableDeployItem.newModuleBytes(wasm, args),
        DeployUtil.standardPayment(800000000000) // 800 CSPR (Increased for safety)
    );
    const signedDeploy = DeployUtil.signDeploy(deploy, keyPair);

    // 5. Serialize to JSON
    const deployJson = DeployUtil.deployToJson(signedDeploy);

    // 6. Manual Fetch Request (Bypassing SDK Transport to inject Auth Header)
    console.log("📨 Sending via manual HTTPS fetch...");

    const rpcPayload = {
        id: new Date().getTime(),
        jsonrpc: "2.0",
        method: "account_put_deploy",
        params: deployJson
    };

    try {
        const response = await fetch(HTTPS_NODE_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'authorization': ACCESS_TOKEN
            },
            body: JSON.stringify(rpcPayload)
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HTTP Error ${response.status}: ${errorText}`);
        }

        const result = await response.json();

        if (result.error) {
            console.error("❌ RPC Error:", JSON.stringify(result.error, null, 2));
            return;
        }

        const deployHash = result.result.deploy_hash;
        console.log(`✅ SUCCESS! Deploy Hash: ${deployHash}`);
        console.log(`🔗 Monitor: https://testnet.cspr.live/deploy/${deployHash}`);
        console.log("⏱️  Waiting 90s for block inclusion to verify...");

    } catch (err) {
        console.error("❌ Network Error:", err);
    }
}

deployViaHttps();
