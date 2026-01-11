const { DeployUtil, CLValueBuilder, CLPublicKey, RuntimeArgs, CLAccountHash, CLKey } = require('casper-js-sdk');

// Mock data
const activeKey = "0106ca7c39cd272dbf21a86eeb3b36b7c26e2e9b94af64292419f7862936bca2ca"; // Public Key Format
const CONTRACT_HASH = "contract-2faa3d9bd2009c1988dd45f19cf307b3737ab191a4c16605588936ebb98aaa1a";
const CHAIN_NAME = "casper-test";
const ipfsUrl = "ipfs://QmTest123";

// Metadata we want to test
const metadataStandard = {
    name: `FlowFi Invoice #TEST`,
    symbol: "FLOW",
    token_uri: ipfsUrl,
    attributes: [
        { trait_type: "Risk", value: "A" },
        { trait_type: "Valuation", value: "10000" },
        { trait_type: "Type", value: "Invoice" }
    ]
};

const metadataJson = JSON.stringify(metadataStandard);

console.log("--------------- MINT TEST ---------------");
console.log("Metadata JSON:", metadataJson);

try {
    const senderKey = CLPublicKey.fromHex(activeKey);
    const contractHashBytes = Uint8Array.from(
        Buffer.from(CONTRACT_HASH.replace("contract-", ""), "hex")
    );

    const ownerAccountHash = new CLAccountHash(senderKey.toAccountHash());
    const ownerKey = new CLKey(ownerAccountHash);

    const mintArgs = RuntimeArgs.fromMap({
        "token_owner": ownerKey,
        "token_meta_data": CLValueBuilder.string(metadataJson)
    });

    const deployParams = new DeployUtil.DeployParams(senderKey, CHAIN_NAME, 1, 1800000);
    const session = DeployUtil.ExecutableDeployItem.newStoredContractByHash(
        contractHashBytes,
        "mint",
        mintArgs
    );
    const payment = DeployUtil.standardPayment(300000000000); // 300 CSPR
    const deploy = DeployUtil.makeDeploy(deployParams, session, payment);

    // Validate serialization
    const deployJson = DeployUtil.deployToJson(deploy);
    console.log("✅ Deploy constructed successfully!");
    console.log("Arg 'token_meta_data' present:", !!deploy.session.storedContractByHash.args.args.get("token_meta_data"));
    console.log("-----------------------------------------");
} catch (e) {
    console.error("❌ CONSTRUCTION FAILED:", e);
}
