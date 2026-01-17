# Project Name
FlowFi

# Tagline (Vision)
The first AI-native RWA invoice factoring protocol on Casper Network. We use AI Agents to audit/score real-world invoices and tokenize them as CEP-78 NFTs for instant liquidity.

# Project Description

## 👻 FlowFi: The Future of Invoice Financing

**FlowFi** is the first **RWA (Real World Asset)** platform on Casper Network that uses **AI Agents** to instantly audit, score, and tokenize real-world invoices. We bridge the $3T global trade finance gap by allowing Small and Medium Businesses (SMBs) to turn their outstanding invoices into liquid assets (NFTs) that can be funded instantly by investors.

### 🔗 Live Links
- **Live Demo:** [https://flowfi-casper.vercel.app](https://flowfi-casper.vercel.app)
- **Deployer Account:** [Account | CSPR.live](https://testnet.cspr.live/account/0202a4d9d6e4ac827ddd6a6e08a53dfde6181ec7d9d058e215a36cea17f7e1dc6095)
- **Contract Package:** [Contract Package | CSPR.live](https://testnet.cspr.live/contract-package/717b9ca1ef2134a71ac38ccee216dc6e782c8c6d9c95a7355cf4a5c17be78f07)

---

### 🚨 The Problem
- **Trillions trapped:** SMBs wait 30-90 days for invoices to be paid, creating massive cash flow gaps.
- **Legacy is broken:** Traditional factoring takes weeks of manual paperwork and charges high fees (15-30%).
- **Lack of transparency:** Investors often cannot verify the underlying assets in DeFi lending pools.

### 🛠 The FlowFi Solution
We automated the entire investment banking due-diligence process using AI and Blockchain:

1.  **AI Risk Audit:** Our **NodeOps AI Agent** (FlowAI) analyzes PDF invoices in seconds, extracting data and calculating a credit risk score (Grade A-F) and valuation.
2.  **Tokenization:** Verified invoices are minted as **CEP-78 Enhanced NFTs** on the **Casper Network**, preserving data privacy while ensuring on-chain ownership.
3.  **Instant Liquidity:** These NFTs are listed on our marketplace where global investors can fund them to earn APY (8-16%), secured by the real-world asset.

### ⚙️ Technical Architecture
FlowFi is built on a hybrid architecture for speed, security, and scalability:

**1. Blockchain (Casper Network):**
-   **CEP-78 Standard:** We use the Enhanced NFT standard for "Proof of Invoice" tokens. This allows us to store immutable metadata (Risk Score, Valuation, IPFS Hash) directly on-chain.
-   **Smart Contracts:** We use a dual-contract architecture:
    *   **CEP-78:** For standard-compliant NFT ownership and metadata.
    *   **Odra Framework:** We developed custom factoring logic in Rust (`contracts/src/lib.rs`) using Odra to handle advanced features like fund custody and automated settlements.
-   **CSPR.cloud:** We utilize the CSPR.cloud Market Data API for real-time analytics and reliable RPC connections.

**2. Artificial Intelligence (NodeOps):**
-   **FlowAI Agent:** A Python-based multi-model agent hosted on **NodeOps**.
-   **Hybrid Intelligence:** It orchestrates between **Google Gemini Pro** (for semantic understanding) and local LLMs like **DeepSeek/Qwen** (analyzing quantitative data) to prevent hallucinations and ensure accurate financial risk scoring.

**3. Frontend (Next.js):**
-   **Immersive UX:** Built with Next.js 14, TailwindCSS, and Framer Motion. Features a "Neural Loader" and 3D glassmorphism UI to visualize the AI process.
-   **Casper Wallet Integration:** Full connectivity for signing deploys and managing assets.

### 🏆 Hackathon Tracks & Integrations
-   **DeFi / RWA (Main Track):** We are a pure RWA use case. We bring off-chain assets (invoices) on-chain using Casper's enterprise-grade features. The use of **CEP-78** provides the metadata structure necessary for complex financial assets that standard ERC-721s lack.
-   **NodeOps Bounty:** Our entire risk engine is containerized and deployed via NodeOps. We demonstrate how AI Agents can act as "Oracles" for blockchain data, validating off-chain documents before allowing on-chain minting.

### 🔮 Roadmap
-   **Mainnet Launch:** Deploy verified contracts to Casper Mainnet.
-   **Secondary Market:** Enable trading of fractionalized invoice parts.
-   **Zk-Privacy:** Implement Zero-Knowledge proofs for invoice details to protect vendor privacy while proving validity.
