const fs = require('fs');
const {
    DeployUtil,
    CLPublicKey,
    RuntimeArgs,
    CLValueBuilder,
    Keys,
} = require('casper-js-sdk');

// --- CONFIGURATION ---
const HTTPS_NODE_URL = 'https://node.testnet.cspr.cloud/rpc';
const ACCESS_TOKEN = '019b9f79-2cd4-7e83-a46e-65f3bc6c51bd';
const NETWORK_NAME = 'casper-test';
const KEY_PATH = '/home/vaiosvaios/CasperFlow-1/keys/temp_admin.pem';
const CONTRACT_HASH = 'hash-efc6a6f5e51c3a8cf993d9b58f6ebd03155f9eb7f013eedcab5709688938eb0f';

async function registerAndMint() {
    console.log("🧪 STEP 1: Registering Owner...");

    const keyPair = Keys.Secp256K1.loadKeyPairFromPrivateFile(KEY_PATH);
    console.log(`🔑 Account: ${keyPair.publicKey.toHex()}`);

    // STEP 1: Register Owner
    const registerArgs = RuntimeArgs.fromMap({
        "token_owner": CLValueBuilder.key(keyPair.publicKey)
    });

    const registerDeploy = DeployUtil.makeDeploy(
        new DeployUtil.DeployParams(keyPair.publicKey, NETWORK_NAME, 1, 1800000),
        DeployUtil.ExecutableDeployItem.newStoredContractByHash(
            Buffer.from(CONTRACT_HASH.replace('hash-', ''), 'hex'),
            "register_owner",
            registerArgs
        ),
        DeployUtil.standardPayment(3000000000) // 3 CSPR
    );

    const signedRegister = DeployUtil.signDeploy(registerDeploy, keyPair);
    const registerJson = DeployUtil.deployToJson(signedRegister);

    const registerPayload = {
        id: Date.now(),
        jsonrpc: "2.0",
        method: "account_put_deploy",
        params: registerJson
    };

    try {
        const regResponse = await fetch(HTTPS_NODE_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'authorization': ACCESS_TOKEN },
            body: JSON.stringify(registerPayload)
        });
        const regResult = await regResponse.json();

        if (regResult.error) {
            console.error("❌ Register Failed:", JSON.stringify(regResult.error));
            return;
        }

        const regHash = regResult.result.deploy_hash;
        console.log(`✅ Register Sent! Hash: ${regHash}`);
        console.log(`🔗 https://testnet.cspr.live/deploy/${regHash}`);
        console.log("⏳ Waiting 30s for registration to confirm...");

        await new Promise(r => setTimeout(r, 30000));

        // STEP 2: Now Mint
        console.log("\n🧪 STEP 2: Minting NFT...");

        const cep78Metadata = {
            "name": "FlowFi Invoice #1",
            "token_uri": "https://ipfs.io/ipfs/QmTestHash123456789",
            "checksum": "0000000000000000000000000000000000000000000000000000000000000000"
        };

        const mintArgs = RuntimeArgs.fromMap({
            "token_owner": CLValueBuilder.key(keyPair.publicKey),
            "token_meta_data": CLValueBuilder.string(JSON.stringify(cep78Metadata))
        });

        const mintDeploy = DeployUtil.makeDeploy(
            new DeployUtil.DeployParams(keyPair.publicKey, NETWORK_NAME, 1, 1800000),
            DeployUtil.ExecutableDeployItem.newStoredContractByHash(
                Buffer.from(CONTRACT_HASH.replace('hash-', ''), 'hex'),
                "mint",
                mintArgs
            ),
            DeployUtil.standardPayment(10000000000) // 10 CSPR
        );

        const signedMint = DeployUtil.signDeploy(mintDeploy, keyPair);
        const mintJson = DeployUtil.deployToJson(signedMint);

        const mintPayload = {
            id: Date.now(),
            jsonrpc: "2.0",
            method: "account_put_deploy",
            params: mintJson
        };

        const mintResponse = await fetch(HTTPS_NODE_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'authorization': ACCESS_TOKEN },
            body: JSON.stringify(mintPayload)
        });
        const mintResult = await mintResponse.json();

        if (mintResult.error) {
            console.error("❌ Mint Failed:", JSON.stringify(mintResult.error));
            return;
        }

        const mintHash = mintResult.result.deploy_hash;
        console.log(`✅ MINT SENT! Hash: ${mintHash}`);
        console.log(`🔗 https://testnet.cspr.live/deploy/${mintHash}`);
        console.log("\n🎯 Check the explorer for SUCCESS status!");

    } catch (err) {
        console.error("❌ Error:", err);
    }
}

registerAndMint();
