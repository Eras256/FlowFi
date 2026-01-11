
const DEPLOY_HASH = '9894fc65870af3689a69e76264b7d26b6de70bf065b6d2fc071cf23641e7a934';
const HTTPS_NODE_URL = 'https://node.testnet.cspr.cloud/rpc';
const ACCESS_TOKEN = '019b9f79-2cd4-7e83-a46e-65f3bc6c51bd';

async function checkDeploy() {
    console.log(`🔎 Checking Deploy: ${DEPLOY_HASH}`);

    const rpcPayload = {
        id: new Date().getTime(),
        jsonrpc: "2.0",
        method: "info_get_deploy",
        params: { deploy_hash: DEPLOY_HASH }
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

        const result = await response.json();

        if (result.error) {
            console.log("⏳ Deploy not found yet or error:", result.error.message);
            return;
        }

        // DEBUG RESPONSE
        console.log(JSON.stringify(result, null, 2));

        const executionResults = result.result.execution_results;
        if (!executionResults || executionResults.length === 0) {
            console.log("⏳ Pending execution (no results yet)...");
            return;
        }

        const success = executionResults[0].result.Success;
        if (!success) {
            console.error("❌ Execution FAILED:", JSON.stringify(executionResults[0].result.Failure, null, 2));
            return;
        }

        console.log("✅ Execution SUCCESS!");

        // Find Contract Hash in Transforms
        const transforms = success.effect.transforms;
        let contractHash = null;
        let packageHash = null;

        transforms.forEach(t => {
            if (t.transform.WriteContract) {
                console.log("📝 Found Contract Write");
                // The key is usually 'contract-HASH'
                if (t.key.startsWith('contract-')) {
                    contractHash = t.key;
                }
            }
            if (t.transform.WriteContractPackage) {
                console.log("📦 Found Package Write");
                if (t.key.startsWith('hash-')) // ContractPackage is usually hash-... 
                { // wait, sometimes stored as uref or hash
                    // Actually easy way: CEP-78 standard installs usually emit the hash in keys or returned data?
                    // Let's print all 'contract-' keys
                }
            }
        });

        // Also look at the KEY of the transform, typically:
        // "contract-0e..." -> "WriteContract"

        console.log("\n--- EXTRACTED HASHES ---");
        const contractKeys = transforms.filter(t => t.key.startsWith('contract-')).map(t => t.key);
        const packageKeys = transforms.filter(t => t.key.startsWith('contract-package-')).map(t => t.key); // recent casper uses contract-package- prefix? or hash-?

        if (contractKeys.length > 0) console.log(`CT: ${contractKeys[0]}`);
        else console.log("⚠️ No 'contract-' key found. Checking all keys...");

        if (packageKeys.length > 0) console.log(`PKG: ${packageKeys[0]}`);

        // Dump all keys just in case
        // console.log(transforms.map(t => t.key));

    } catch (e) {
        console.error("Error:", e);
    }
}

checkDeploy();
