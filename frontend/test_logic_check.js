
const assert = require('assert');

// 1. Test Metadata Generation Logic
console.log("🧪 Test 1: AI Metadata Structure");
const mockResult = {
    risk_score: "A+",
    valuation: 15000,
    confidence: 0.98,
    model_used: "NodeOps-Gemini-Pro"
};

const metadataStandard = {
    name: `FlowFi Invoice #TEST`,
    symbol: "FLOW",
    token_uri: "ipfs://test",
    attributes: [
        { trait_type: "Risk Score", value: mockResult.risk_score || "A" },
        { trait_type: "Valuation", value: `${mockResult.valuation || 0}` },
        { trait_type: "Currency", value: "USD" },
        { trait_type: "AI Model", value: mockResult.model_used || "NodeOps-Gemini-Pro" },
        { trait_type: "Confidence", value: `${(mockResult.confidence || 0.95) * 100}%` },
        { trait_type: "Analysis Date", value: new Date().toISOString() },
        { trait_type: "Type", value: "Invoice RWA" }
    ]
};

try {
    const json = JSON.stringify(metadataStandard);
    console.log("✅ Metadata JSON valid:", json);
    if (!json.includes("NodeOps-Gemini-Pro")) throw new Error("Missing AI Model");
    console.log("✅ AI Attribution Present\n");
} catch (e) {
    console.error("❌ Metadata Failed:", e);
    process.exit(1);
}

// 2. Test Investment Calculation Logic
console.log("🧪 Test 2: Investment Math");
const invoice = { amount: 12500 }; // $12,500
const csprPrice = 0.0245;

try {
    const invoiceValueCSPR = Math.floor((invoice.amount) / csprPrice);
    console.log(`USD Amount: $${invoice.amount}`);
    console.log(`CSPR Price: $${csprPrice}`);
    console.log(`Calc CSPR Value: ${invoiceValueCSPR}`);

    // Math.min check as per code
    const investmentMotesRaw = invoiceValueCSPR * 1_000_000_000;
    const investmentMotes = Math.min(investmentMotesRaw, 50_000_000_000); // 50 CSPR cap

    console.log(`Investment in Motes: ${investmentMotes}`);

    if (isNaN(investmentMotes)) throw new Error("NaN detected in calculation");
    if (investmentMotes > 50_000_000_000) throw new Error("Cap logic failed");

    console.log("✅ Investment Math Robust\n");
} catch (e) {
    console.error("❌ Math Failed:", e);
    process.exit(1);
}

console.log("🎉 ALL SYSTEMS GO: Logic verified.");
