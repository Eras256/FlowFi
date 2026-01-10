
const fs = require('fs');
const { Keys, DeployUtil, RuntimeArgs, CLValueBuilder, CLPublicKey } = require('casper-js-sdk');
const axios = require('axios');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

const RAW_PRIVATE_KEY = process.env.CASPER_ADMIN_PRIVATE_KEY || "MHQCAQEEIDfv8TLmR5GMqNr9iUIQYfPZ1TzAi40k/X/OtXE0MDH9oAcGBSuBBAAKoUQDQgAEpNnW5KyCfd1qbgilPf3mGB7H2dBY4hWjbOoX9+HcYJUCirg09Xsw57T26r+ltoO4BmiA+Le42G1k/DYvqma7SA==";
const API_URL = 'http://localhost:3000/api'; // Use our own serverless proxy for convenience

function formatPem(base64Key, label) {
    let pem = `-----BEGIN ${label}-----\n`;
    let lineLength = 64;
    for (let i = 0; i < base64Key.length; i += lineLength) {
        pem += base64Key.substring(i, i + lineLength) + '\n';
    }
    pem += `-----END ${label}-----\n`;
    return pem;
}

async function deployContract() {
    console.log("👷 Preparing Fresh NFT Contract Deployment...");

    // 1. Setup Keys
    const tempKeyPath = path.join(__dirname, 'temp_deploy_key.pem');
    const pemContent = formatPem(RAW_PRIVATE_KEY, "PRIVATE KEY");
    fs.writeFileSync(tempKeyPath, pemContent);

    let keys;
    try { keys = Keys.Ed25519.loadKeyPairFromPrivateFile(tempKeyPath); }
    catch (e) { keys = Keys.Secp256K1.loadKeyPairFromPrivateFile(tempKeyPath); }
    const publicKey = keys.publicKey;
    console.log("🔑 Installer:", publicKey.toHex());

    // 2. Load WASM
    // We use 'contracts/cep-78.wasm' as it seems to be the main compatible one, or 'cep-78-new.wasm'
    const wasmPath = path.resolve('/home/vaiosvaios/CasperFlow-1/contracts/cep-78-new.wasm');
    const wasm = new Uint8Array(fs.readFileSync(wasmPath));
    console.log(`📦 Loaded WASM: ${wasm.length} bytes`);

    // 3. Configure Arguments for UNLIMITED POWER (and reliability)
    const args = RuntimeArgs.fromMap({
        "collection_name": CLValueBuilder.string("FlowFi Invoices V2"),
        "collection_symbol": CLValueBuilder.string("FLOW"),
        "total_token_supply": CLValueBuilder.u64(10000), // Huge supply
        "ownership_mode": CLValueBuilder.u8(2), // Transferable
        "nft_kind": CLValueBuilder.u8(1), // Digital
        "identifier_mode": CLValueBuilder.u8(0), // 0 = Ordinal (0, 1, 2...) - SAFEST to avoid hash collisions
        "metadata_mutability": CLValueBuilder.u8(0), // Immutable
        "minting_mode": CLValueBuilder.u8(1), // 1 = Installer only (You)
        "allow_minting": CLValueBuilder.bool(true),
        // Basic Schema setup for JSON metadata
        "nft_metadata_kind": CLValueBuilder.u8(2), // 2 = Raw/CEP78 standard JSON
        "json_schema": CLValueBuilder.string(JSON.stringify({
            properties: {
                name: { name: "name", description: "", required: true },
                symbol: { name: "symbol", description: "", required: true },
                token_uri: { name: "token_uri", description: "", required: true }
            }
        }))
    });

    // 4. Create Deploy
    const deployParams = new DeployUtil.DeployParams(publicKey, 'casper-test');
    const session = DeployUtil.ExecutableDeployItem.newModuleBytes(
        wasm,
        args
    );
    // Installation costs around 180-250 CSPR usually. Putting 350 to be safe.
    const payment = DeployUtil.standardPayment(350_000_000_000);
    const deploy = DeployUtil.makeDeploy(deployParams, session, payment);
    const signedDeploy = DeployUtil.signDeploy(deploy, keys);

    // 5. Send
    const deployJson = DeployUtil.deployToJson(signedDeploy);
    console.log("🚀 Sending installation deploy...");

    try {
        const res = await axios.post(`${API_URL}/deploy`, { deploy: deployJson });
        console.log(`✅ INSTALLED! Deploy Hash: ${res.data.deploy_hash}`);
        console.log(`⚠️ IMPORTANT: Wait 1-2 mins, then check this link to find the NEW CONTRACT HASH in the 'execution_results' (transforms):`);
        console.log(`🔗 https://testnet.cspr.live/deploy/${res.data.deploy_hash}`);
    } catch (e) {
        console.error("❌ Installation Failed:", e.message);
        if (e.response) console.log(e.response.data);
    } finally {
        if (fs.existsSync(tempKeyPath)) fs.unlinkSync(tempKeyPath);
    }
}

deployContract();
