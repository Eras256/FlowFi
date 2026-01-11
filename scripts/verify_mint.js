const { CasperClient, Keys, DeployUtil, CLValueBuilder, RuntimeArgs, CLKey, CLAccountHash } = require('casper-js-sdk');
const fs = require('fs');
const path = require('path');

// Configuration
const NODE_URL = "http://136.243.187.84:7777/rpc"; // Alternative reliable node
const CONTRACT_HASH = "contract-2faa3d9bd2009c1988dd45f19cf307b3737ab191a4c16605588936ebb98aaa1a";
const CHAIN_NAME = "casper-test";

// Load Key
const privateKeyBase64 = "MHQCAQEEIDfv8TLmR5GMqNr9iUIQYfPZ1TzAi40k/X/OtXE0MDH9oAcGBSuBBAAKoUQDQgAEpNnW5KyCfd1qbgilPf3mGB7H2dBY4hWjbOoX9+HcYJUCirg09Xsw57T26r+ltoO4BmiA+Le42G1k/DYvqma7SA==";
const pem = `-----BEGIN PRIVATE KEY-----\n${privateKeyBase64}\n-----END PRIVATE KEY-----`;
const tempKeyPath = path.join(__dirname, 'temp_verify_key.pem');
fs.writeFileSync(tempKeyPath, pem);
const keys = Keys.Secp256K1.loadKeyPairFromPrivateFile(tempKeyPath);
fs.unlinkSync(tempKeyPath);

console.log("🔑 Using Account:", keys.publicKey.toHex());

async function mint() {
    const client = new CasperClient(NODE_URL);

    // Simplified Metadata (The fix we implemented)
    const metadata = JSON.stringify({
        name: `FlowFi Test ${Date.now()}`,
        symbol: "FLOW",
        token_uri: "ipfs://QmTest",
        attributes: [
            { trait_type: "Type", value: "Test" }
        ]
    });

    console.log("📝 Prepared Metadata:", metadata);

    // Prepare Deploy
    const contractHashBytes = Uint8Array.from(Buffer.from(CONTRACT_HASH.replace("contract-", ""), "hex"));

    // Key factory fix
    const ownerAccountHash = new CLAccountHash(keys.publicKey.toAccountHash());
    const ownerKey = new CLKey(ownerAccountHash);

    const args = RuntimeArgs.fromMap({
        "token_owner": ownerKey,
        "token_meta_data": CLValueBuilder.string(metadata)
    });

    const deployParams = new DeployUtil.DeployParams(keys.publicKey, CHAIN_NAME);
    const session = DeployUtil.ExecutableDeployItem.newStoredContractByHash(
        contractHashBytes,
        "mint",
        args
    );
    const payment = DeployUtil.standardPayment(5000000000); // 5 CSPR
    const deploy = DeployUtil.makeDeploy(deployParams, session, payment);

    // Sign
    const signedDeploy = DeployUtil.signDeploy(deploy, keys);

    // Send
    console.log("🚀 Sending deploy...");
    try {
        const deployHash = await client.putDeploy(signedDeploy);
        console.log("✅ Sent! Hash:", deployHash);
        console.log("Check status manually: https://testnet.cspr.live/deploy/" + deployHash);
    } catch (e) {
        console.error("❌ Send Failed:", e);
    }
}

mint();
