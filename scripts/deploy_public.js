
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
const NODE_URL = 'http://135.181.208.231:7777/rpc'; // Hetzner Testnet Node
const NETWORK_NAME = 'casper-test';
const WASM_PATH = '/home/vaiosvaios/CasperFlow-1/cep-78-enhanced-nft/target/wasm32-unknown-unknown/release/cep78.wasm';
// Key path - attempting to use the one with funds
const KEY_PATH = '/home/vaiosvaios/CasperFlow-1/keys/secret_key.pem';

// --- DEPLOY LOGIC ---
async function deployPublicContract() {
    console.log("🚀 Starting PUBLIC Enrollment for FlowFi Invoices...");

    // 1. Load Keys (Account starts with 02, so it is Secp256k1)
    const keyPair = Keys.Secp256K1.loadKeyPairFromPrivateFile(KEY_PATH);
    // Verify if loaded key matches the funded wallet we know? 
    // Usually pem matches public hex. Let's trust they are paired.

    console.log(`🔑 Deploying with Account: ${keyPair.publicKey.toHex()}`);

    // 2. Load WASM
    // Check if WASM exists, if not we might need to find it
    if (!fs.existsSync(WASM_PATH)) {
        console.error(`❌ WASM not found at ${WASM_PATH}. Please provide valid path.`);
        return;
    }
    const wasm = new Uint8Array(fs.readFileSync(WASM_PATH));

    // 3. Construct Arguments for CEP-78 (Public Minting)
    // Note: Arguments based on standard CEP-78 factory installation
    const args = RuntimeArgs.fromMap({
        "collection_name": CLValueBuilder.string("FlowFi Invoices"),
        "collection_symbol": CLValueBuilder.string("FLOW"),
        "total_token_supply": CLValueBuilder.u64(100000),
        "ownership_mode": CLValueBuilder.u8(0), // 0=Minter, 1=Assigned, 2=Transferable. Wait, strict CEP-78 enums:
        // Let's use string mode if supported or exact u8 mapping.
        // Minter=0, Assigned=1, Transferable=2. We want Transferable.
        "ownership_mode": CLValueBuilder.u8(2),

        "nft_kind": CLValueBuilder.u8(1), // 0=Physical, 1=Digital
        "holder_mode": CLValueBuilder.u8(2), // 0=Private, 1=Mixed, 2=Public (Anyone can hold)
        "whitelist_mode": CLValueBuilder.u8(0), // 0=Unlocked
        "minting_mode": CLValueBuilder.u8(1), // 0=Installer, 1=Public <--- THIS IS THE FIX
        "nft_metadata_kind": CLValueBuilder.u8(2), // 0=CEP78, 1=NFT721, 2=Raw. Best usually 0 or 2 for JSON flexibility. Let's go CEP78 (0) or Raw (2). Raw allows flexible JSON strings.
        // Let's stick to what worked partially before but failed permissions.
        // Usually CEP78=0 requires schema. Raw=2 allows any string.
        // To be safe for our diagnosing script which used string JSON, let's use RW (2) or CEP78 (0) with JSON schema.
        // Let's use Raw (2) to minimize schema validation errors.
        "nft_metadata_kind": CLValueBuilder.u8(2),

        "identifier_mode": CLValueBuilder.u8(0), // 0=Ordinal, 1=Hash
        "metadata_mutability": CLValueBuilder.u8(0), // 0=Immutable, 1=Mutable

        // Additional settings
        "burn_mode": CLValueBuilder.u8(0), // 0=Burnable
        "reporting_mode": CLValueBuilder.u8(0), // 0=None, 1=Owner, 2=Public
        "events_mode": CLValueBuilder.u8(1) // 1=CES (Standard Events)
    });

    // 4. Create Deploy
    const client = new CasperClient(NODE_URL);
    const deploy = DeployUtil.makeDeploy(
        new DeployUtil.DeployParams(keyPair.publicKey, NETWORK_NAME, 1, 3600000),
        DeployUtil.ExecutableDeployItem.newModuleBytes(wasm, args),
        DeployUtil.standardPayment(350000000000) // 350 CSPR (Generous to execute Install)
    );

    // 5. Sign
    const signedDeploy = DeployUtil.signDeploy(deploy, keyPair);

    // 6. Send
    console.log("📡 Sending Deploy to Network...");
    const deployHash = await client.putDeploy(signedDeploy);
    console.log(`✅ Deploy Sent! Hash: ${deployHash}`);
    console.log(`🔗 Check here: https://testnet.cspr.live/deploy/${deployHash}`);
    console.log("\n⚠️ WAIT FOR EXECUTION (~2 mins) then get the CONTRACT HASH from the Explorer page 'Deploys' tab.");
}

deployPublicContract();
