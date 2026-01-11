
const fs = require('fs');
const {
    CasperClient,
    DeployUtil,
    CLPublicKey,
    RuntimeArgs,
    CLValueBuilder,
    CLKey,
    CLAccountHash,
    Keys
} = require('casper-js-sdk');

// Configuration
const NODE_URL = 'http://65.21.235.219:7777/rpc'; // Reliable node
const NETWORK_NAME = 'casper-test';
const CONTRACT_HASH = 'contract-2faa3d9bd2009c1988dd45f19cf307b3737ab191a4c16605588936ebb98aaa1a';

// Keys - We need the secret key to sign
// Since I don't have your secret key file, I will simulate the construction of the Deploy 
// and print it out to verify the TYPES of arguments being sent.
// This often reveals if we are sending a String where a Key is expected.

async function diagnoseMint() {
    console.log("🔍 Starting Mint Diagnosis...");

    const client = new CasperClient(NODE_URL);

    // Mock Keys for construction
    const mockPublicKey = CLPublicKey.fromHex("0202a4d9d6e4ac827ddd6a6e08a53dfde6181ec7d9d058e215a36cea17f7e1dc6095");

    // contract hash bytes
    const contractHashAsBytes = Uint8Array.from(Buffer.from(CONTRACT_HASH.replace('contract-', ''), 'hex'));

    // Prepare Arguments
    // 1. Token Owner: CEP-78 expects a Key (AccountHash or Hash)
    const accountHash = new CLAccountHash(mockPublicKey.toAccountHash());
    const ownerKey = new CLKey(accountHash);

    // 2. Token Metadata: CEP-78 expects a String (if JSON schema) or Map
    // Let's check what schema mode the contract is in.
    // Assuming JSON mode based on our previous discussions.
    const metadata = JSON.stringify({
        name: "Test NFT",
        description: "Diagnosis Mint",
        attributes: []
    });

    const runtimeArgs = RuntimeArgs.fromMap({
        'token_owner': ownerKey,
        'token_meta_data': CLValueBuilder.string(metadata)
    });

    console.log("✅ Arguments Constructed:");
    console.log("   - token_owner (Type):", ownerKey.clType().toString());
    console.log("   - token_meta_data (Type):", CLValueBuilder.string(metadata).clType().toString());
    console.log("   - token_meta_data (Value):", metadata);

    // Construct Deploy
    const deployParams = new DeployUtil.DeployParams(
        mockPublicKey,
        NETWORK_NAME,
        1,       // gasPrice
        3600000  // ttl
    );

    const session = DeployUtil.ExecutableDeployItem.newStoredContractByHash(
        contractHashAsBytes,
        'mint',
        runtimeArgs
    );

    const payment = DeployUtil.standardPayment(5000000000); // 5 CSPR

    const deploy = DeployUtil.makeDeploy(deployParams, session, payment);

    console.log("✅ Deploy structure created successfully via SDK.");

    // Now let's try to verify if the contract actually ALLOWS public minting using a query
    // BUT since we see failures on-chain, it's likely an execution error (revert).

    console.log("\n⚠️ HYPOTHESIS FOR FAILURE:");
    console.log("1. Most CEP-78 contracts default to 'Installer' minting mode (only the installer can mint).");
    console.log("2. If your wallet '0202...6095' is NOT the installer account, the contract will revert.");
    console.log("   - Installer Account: usually the one that deployed it.");
    console.log("   - Wallet used in screenshot: 0202...6095");

    console.log("\n🔍 Checking if 0202...6095 is the installer...");
    // We can't easily check installer on-chain without querying state, 
    // but we can check if the deploy of the contract was from this account.

    // For now, let's assume valid ownership.
    // The second most common error "User Error 1" often means invalid JSON schema.
    // We must ensure the metadata matches the schema defined in init.
    // If schema is "CustomValidated", it validates fields. If "Raw", it accepts anything.

}

diagnoseMint();
