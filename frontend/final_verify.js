
const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');
const { Keys, DeployUtil, CLPublicKey } = require('casper-js-sdk');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

const API_URL = 'http://localhost:3000/api';
const RAW_PRIVATE_KEY = process.env.CASPER_ADMIN_PRIVATE_KEY || "MHQCAQEEIDfv8TLmR5GMqNr9iUIQYfPZ1TzAi40k/X/OtXE0MDH9oAcGBSuBBAAKoUQDQgAEpNnW5KyCfd1qbgilPf3mGB7H2dBY4hWjbOoX9+HcYJUCirg09Xsw57T26r+ltoO4BmiA+Le42G1k/DYvqma7SA==";
const PINATA_JWT = process.env.NEXT_PUBLIC_PINATA_JWT;

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

async function runFinalVerification() {
    console.log("🚀 Starting FINAL FLOW VERIFICATION...");

    // Setup Key
    const tempKeyPath = path.join(__dirname, 'temp_key_verify.pem');
    const pemContent = formatPem(RAW_PRIVATE_KEY, "PRIVATE KEY");
    fs.writeFileSync(tempKeyPath, pemContent);

    // Create Verification PDF
    const pdfPath = path.join(__dirname, 'FlowFi_Final_Verification.txt');
    fs.writeFileSync(pdfPath, `FlowFi Verification Document - ${new Date().toISOString()}`);

    try {
        // --- STEP 1: UPLOAD TO IPFS (Mint Prep) ---
        console.log("\n📦 STEP 1: IPFS UPLOAD (Pinata)");
        const formData = new FormData();
        formData.append('file', fs.createReadStream(pdfPath));

        const pinataRes = await axios.post("https://api.pinata.cloud/pinning/pinFileToIPFS", formData, {
            headers: {
                'Authorization': `Bearer ${PINATA_JWT}`,
                ...formData.getHeaders()
            }
        });

        const ipfsHash = pinataRes.data.IpfsHash;
        console.log(`✅ IPFS Hash: ipfs://${ipfsHash}`);
        console.log(`🔗 Gateway: https://gateway.pinata.cloud/ipfs/${ipfsHash}`);

        // --- STEP 2: AI ANALYSIS (FlowAI Logic) ---
        console.log("\n🧠 STEP 2: AI RISK SCORING (FlowAI)");
        const analysisForm = new FormData();
        analysisForm.append('file', fs.createReadStream(pdfPath), 'invoice.txt');

        const analysisRes = await axios.post(`${API_URL}/analyze`, analysisForm, {
            headers: { ...analysisForm.getHeaders() }
        });
        console.log(`✅ FlowAI Score: ${analysisRes.data.risk_score} (${analysisRes.data.model_used})`);

        // --- STEP 3: MINT TRANSACTION ---
        console.log("\n🎨 STEP 3: MINT TRANSACTION (Asset Creation)");

        let keys;
        try { keys = Keys.Ed25519.loadKeyPairFromPrivateFile(tempKeyPath); }
        catch (e) { keys = Keys.Secp256K1.loadKeyPairFromPrivateFile(tempKeyPath); }

        const publicKey = keys.publicKey;
        console.log("🔑 Signer:", publicKey.toHex());
        const TARGET_ACCOUNT_HEX = "0106ca7c39cd272dbf21a86eeb3b36b7c26e2e9b94af64292419f7862936bca2ca";
        const targetKey = CLPublicKey.fromHex(TARGET_ACCOUNT_HEX);

        const networkName = 'casper-test';
        const idMint = Date.now();

        const deployParams = new DeployUtil.DeployParams(publicKey, networkName);
        const sessionMint = DeployUtil.ExecutableDeployItem.newTransfer(
            2500000000, // 2.5 CSPR
            targetKey,
            null,
            idMint
        );
        const paymentMint = DeployUtil.standardPayment(100000000);
        const deployMint = DeployUtil.makeDeploy(deployParams, sessionMint, paymentMint);
        const signedDeployMint = DeployUtil.signDeploy(deployMint, keys);

        const mintRes = await axios.post(`${API_URL}/deploy`, { deploy: DeployUtil.deployToJson(signedDeployMint) });
        const mintHash = mintRes.data.deploy_hash;
        console.log(`✅ Mint Hash: ${mintHash}`);

        // Wait to avoid nonce collision/ensure ordering
        await sleep(2000);

        // --- STEP 4: INVEST TRANSACTION ---
        console.log("\n💸 STEP 4: INVEST TRANSACTION (Funding)");
        const idInvest = Date.now() + 5000;

        const sessionInvest = DeployUtil.ExecutableDeployItem.newTransfer(
            5000000000, // 5.0 CSPR
            targetKey,
            null,
            idInvest
        );
        const deployInvest = DeployUtil.makeDeploy(deployParams, sessionInvest, paymentMint);
        const signedDeployInvest = DeployUtil.signDeploy(deployInvest, keys);

        const investRes = await axios.post(`${API_URL}/deploy`, { deploy: DeployUtil.deployToJson(signedDeployInvest) });
        const investHash = investRes.data.deploy_hash;
        console.log(`✅ Invest Hash: ${investHash}`);

        // --- FINAL SUMMARY ---
        console.log("\n==== 🏆 FLOWFI FINAL CERTIFICATION ====");
        console.log(`1. IPFS ASSET:   https://gateway.pinata.cloud/ipfs/${ipfsHash}`);
        console.log(`2. MINT (TX):    https://testnet.cspr.live/deploy/${mintHash}`);
        console.log(`3. INVEST (TX):  https://testnet.cspr.live/deploy/${investHash}`);
        console.log("=========================================\n");

    } catch (error) {
        console.error("❌ Verification Failed:", error.message);
        if (error.response) console.error(error.response.data);
    } finally {
        if (fs.existsSync(tempKeyPath)) fs.unlinkSync(tempKeyPath);
        if (fs.existsSync(pdfPath)) fs.unlinkSync(pdfPath);
    }
}

runFinalVerification();
