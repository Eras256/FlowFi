
const {
    CasperClient,
    Keys,
    DeployUtil,
    RuntimeArgs,
    CLValueBuilder,
    CLAccountHash
} = require("casper-js-sdk");
const fs = require("fs");
const path = require("path");

// Configuration
const NODE_URL = "https://node.testnet.cspr.cloud/rpc";
// Usamos el Auth header via fetch si fuera necesario, pero intentaremos standard client primero 
// Si falla, usaremos el metodo manual como antes.
const NETWORK_NAME = "casper-test";
const CONTRACT_HASH = "hash-efc6a6f5e51c3a8cf993d9b58f6ebd03155f9eb7f013eedcab5709688938eb0f";
const KEY_PATH = path.resolve(__dirname, "../keys/temp_admin.pem");

// Fetch wrapper for Auth
const AUTH_TOKEN = "019b9f79-2cd4-7e83-a46e-65f3bc6c51bd";

async function sendDeploy(signedDeploy) {
    const deployJson = DeployUtil.deployToJson(signedDeploy);
    const response = await fetch(NODE_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': AUTH_TOKEN
        },
        body: JSON.stringify({
            jsonrpc: "2.0",
            method: "account_put_deploy",
            params: deployJson,
            id: Date.now()
        })
    });
    const data = await response.json();
    if (data.error) throw new Error(data.error.message);
    return data.result.deploy_hash;
}

function loadKeys() {
    try {
        return Keys.Secp256K1.loadKeyPairFromPrivateFile(KEY_PATH);
    } catch (_) {
        return Keys.Ed25519.loadKeyPairFromPrivateFile(KEY_PATH);
    }
}

async function main() {
    console.log("🚀 Starting Batch Minting (8 Invoices)...");
    const keys = loadKeys();
    const publicKey = keys.publicKey;
    console.log(`📝 Account: ${publicKey.toHex()}`);

    const newHashes = [];

    for (let i = 0; i < 8; i++) {
        const tokenId = `INV-BATCH-${Date.now()}-${i}`; // Unique ID
        console.log(`\n💎 Minting ${tokenId} (${i + 1}/8)...`);

        const args = RuntimeArgs.fromMap({
            token_owner: CLValueBuilder.key(new CLAccountHash(publicKey.toAccountHash())),
            token_meta_data: CLValueBuilder.string(JSON.stringify({
                name: "FlowFi Invoice " + tokenId,
                description: "Verified Invoice",
                amount: 50000 + (i * 1000),
                status: "financed"
            }))
        });

        const deployParams = new DeployUtil.DeployParams(
            publicKey,
            NETWORK_NAME,
            1,
            1800000
        );

        const payment = DeployUtil.standardPayment(3000000000); // 3 CSPR (minting costs more)

        const session = DeployUtil.ExecutableDeployItem.newStoredContractByHash(
            Uint8Array.from(Buffer.from(CONTRACT_HASH.replace("hash-", ""), "hex")),
            "mint",
            args
        );

        const deploy = DeployUtil.makeDeploy(deployParams, session, payment);
        const signedDeploy = DeployUtil.signDeploy(deploy, keys);

        try {
            const hash = await sendDeploy(signedDeploy);
            console.log(`✅ Mint Success! Hash: ${hash}`);
            newHashes.push(hash);
        } catch (e) {
            console.error("❌ Mint Failed:", e.message);
        }

        // Esperar 2s para evitar saturación
        await new Promise(r => setTimeout(r, 2000));
    }

    console.log("\n\n📋 NEW MINT HASHES:");
    console.log(JSON.stringify(newHashes, null, 2));

    fs.writeFileSync(path.resolve(__dirname, "../new_mint_hashes.json"), JSON.stringify(newHashes, null, 2));
}

main().catch(console.error);
