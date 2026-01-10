
const axios = require('axios');
const fs = require('fs');
const { Keys, DeployUtil, CLPublicKey, CLValueBuilder, RuntimeArgs, CLKey, CLAccountHash } = require('casper-js-sdk');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

const API_URL = 'http://localhost:3000/api';
const RAW_PRIVATE_KEY = process.env.CASPER_ADMIN_PRIVATE_KEY || "MHQCAQEEIDfv8TLmR5GMqNr9iUIQYfPZ1TzAi40k/X/OtXE0MDH9oAcGBSuBBAAKoUQDQgAEpNnW5KyCfd1qbgilPf3mGB7H2dBY4hWjbOoX9+HcYJUCirg09Xsw57T26r+ltoO4BmiA+Le42G1k/DYvqma7SA==";
const CONTRACT_HASH = "contract-2faa3d9bd2009c1988dd45f19cf307b3737ab191a4c16605588936ebb98aaa1a";

function formatPem(base64Key, label) {
    let pem = `-----BEGIN ${label}-----\n`;
    let lineLength = 64;
    for (let i = 0; i < base64Key.length; i += lineLength) {
        pem += base64Key.substring(i, i + lineLength) + '\n';
    }
    pem += `-----END ${label}-----\n`;
    return pem;
}

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function attemptMint() {
    console.log("🚀 Starting Aggressive Mint Test...");

    // Setup Key
    const tempKeyPath = path.join(__dirname, 'temp_key_mint.pem');
    const pemContent = formatPem(RAW_PRIVATE_KEY, "PRIVATE KEY");
    fs.writeFileSync(tempKeyPath, pemContent);

    let keys;
    try { keys = Keys.Ed25519.loadKeyPairFromPrivateFile(tempKeyPath); }
    catch (e) { keys = Keys.Secp256K1.loadKeyPairFromPrivateFile(tempKeyPath); }

    const publicKey = keys.publicKey;
    console.log("🔑 Signer:", publicKey.toHex());

    // --- FIX STRATEGY: RANDOMIZED METADATA TO AVOID HASH COLLISION ---
    const uniqueSalt = Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
    const tokenId = `P-${uniqueSalt}`;

    const metadata = JSON.stringify({
        name: `FlowFi Invoice #${tokenId}`, // Unique Name
        symbol: "FLOW",
        token_uri: `ipfs://QmTest${uniqueSalt}`, // Unique URI to force new hash
        checksum: uniqueSalt, // Unique Checksum field
        attributes: [
            { trait_type: "Test Run", value: uniqueSalt },
            { trait_type: "Minted On", value: new Date().toISOString() }
        ]
    });

    console.log("📝 Metadata Salt:", uniqueSalt);

    const contractHashBytes = Uint8Array.from(Buffer.from(CONTRACT_HASH.replace("contract-", ""), "hex"));
    const ownerAccountHash = new CLAccountHash(publicKey.toAccountHash());
    const ownerKey = new CLKey(ownerAccountHash);

    const mintArgs = RuntimeArgs.fromMap({
        "token_owner": ownerKey,
        "token_meta_data": CLValueBuilder.string(metadata)
    });

    const deployParams = new DeployUtil.DeployParams(publicKey, 'casper-test', 1, 1800000); // 30 min TTL
    const session = DeployUtil.ExecutableDeployItem.newStoredContractByHash(
        contractHashBytes,
        "mint",
        mintArgs
    );
    const payment = DeployUtil.standardPayment(300_000_000_000); // 300 CSPR (Overkill to rule out gas)
    const deploy = DeployUtil.makeDeploy(deployParams, session, payment);
    const signedDeploy = DeployUtil.signDeploy(deploy, keys);

    // Send
    try {
        const deployJson = DeployUtil.deployToJson(signedDeploy);
        const start = Date.now();
        const res = await axios.post(`${API_URL}/deploy`, { deploy: deployJson });
        console.log(`✅ Sent! Hash: ${res.data.deploy_hash}`);
        console.log(`🌐 Monitor: https://testnet.cspr.live/deploy/${res.data.deploy_hash}`);

        // Polling status logic could go here, but for now we output link for manual check
    } catch (e) {
        console.error("❌ Send Failed:", e.message);
    } finally {
        if (fs.existsSync(tempKeyPath)) fs.unlinkSync(tempKeyPath);
    }
}

attemptMint();
