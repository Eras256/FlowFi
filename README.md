# 🌊 FlowFi: AI-Powered Invoice Factoring on Casper

> **Hackathon Track:** Main Track (DeFi / RWA) + NodeOps Bounty  
> **Tagline:** "Instant Liquidity for SMBs via AI Risk Audits & Casper Blockchain."

![FlowFi Banner](https://via.placeholder.com/1200x400?text=FlowFi+Dashboard)

## 🏆 The Problem
Small businesses wait 30-90 days for invoices to be paid. Traditional factoring is slow, manual, and expensive.

## 🚀 The Solution
**FlowFi** is a decentralized application (dApp) that:
1.  **AI Audit**: Uses a **NodeOps AI Agent** (powered by Gemini) to instantly parse and score PDF invoices.
2.  **RWA Tokenization**: Mints a "Proof of Invoice" NFT on the **Casper Network** (Testnet 2.0).
3.  **Instant Market**: Allows investors to fund these verified invoices instantly.

---

## 🔗 Live Deployment on Casper Testnet 2.0

### Smart Contract (CEP-78 NFT)

| Field | Value |
|-------|-------|
| **Contract Package** | `113fd0f7f4f803e2401a9547442e2ca31bd9001b4fcd803eaff7a3dac11e4623` |
| **Contract Hash (v1)** | `contract-2faa3d9bd2009c1988dd45f19cf307b3737ab191a4c16605588936ebb98aaa1a` |
| **Collection Name** | FlowFi Invoices |
| **Symbol** | FLOW |
| **Total Supply** | 1,000,000 NFTs |
| **Contract Type** | CEP-78 Enhanced NFT |
| **Upgradable** | Yes |

### Deployment Transaction

| Field | Value |
|-------|-------|
| **Transaction Hash** | `ac9c2c07afa0042b94ed9cfa04f13eb4be4901cf66553e1506ec5def8df314ae` |
| **Block Hash** | `6e23ea0319b91c3bfdfd3f9b562edf89ee6e2a2cde98edf7f5b1bd1b6fbf5c57` |
| **Timestamp** | Jan 7, 2026, 10:15:56 PM CST |
| **Gas Used** | 761.42 CSPR |
| **Status** | ✅ Success |

### Explorer Links

- 🔗 **[View Transaction on CSPR.live](https://testnet.cspr.live/deploy/ac9c2c07afa0042b94ed9cfa04f13eb4be4901cf66553e1506ec5def8df314ae)**
- 🔗 **[View Contract Package on CSPR.live](https://testnet.cspr.live/contract-package/113fd0f7f4f803e2401a9547442e2ca31bd9001b4fcd803eaff7a3dac11e4623)**

---

## 🛠 Tech Stack
*   **Blockchain**: Casper Network 2.0 (Testnet) - CEP-78 Enhanced NFT Standard
*   **AI Agent**: Python (FastAPI) + Google Gemini Pro + NodeOps Infrastructure
*   **Frontend**: Next.js 14, Tailwind CSS, Framer Motion (Glassmorphism UI)
*   **Wallet**: Casper Wallet (Connected via `window.CasperWalletProvider`)
*   **Storage**: IPFS via Thirdweb

## ✨ Key Features
*   **Dynamic Risk Scoring**: Upload a PDF, get a real-time risk score ("A", "B", "C") and valuation.
*   **Casper Integration**: 
    *   Authenticates users via Casper Wallet.
    *   Signs and deploys real transactions to `casper-test`.
    *   Mints NFTs representing Real-World Assets (invoices).
*   **CEP-78 Standard**: Uses the official Casper NFT standard for maximum compatibility.
*   **NodeOps Ready**: Includes `Dockerfile` and `nodeops.yaml` for one-click deployment on NodeOps Console.

---

## 📦 Installation & Local Run

### Prerequisites
*   Node.js & pnpm
*   Python 3.9+
*   Casper Wallet Extension (Chrome)

### 1. Frontend (Next.js)
```bash
cd frontend
pnpm install
pnpm dev
# Opens at http://localhost:3000
```

### 2. AI Backend (Python)
```bash
cd backend
pip install -r requirements.txt
# Create .env file with your GEMINI_API_KEY
python -m uvicorn main:app --reload
# API runs at http://localhost:8000
```

### 3. Smart Contract

The CEP-78 NFT contract has already been deployed to Casper Testnet 2.0. The frontend is pre-configured to use it.

**Environment Variables** (already configured in `frontend/.env.local`):
```env
NEXT_PUBLIC_CASPER_NODE_URL=https://node.testnet.casper.network/rpc
NEXT_PUBLIC_CASPER_CHAIN_NAME=casper-test
NEXT_PUBLIC_CASPER_CONTRACT_PACKAGE_HASH=113fd0f7f4f803e2401a9547442e2ca31bd9001b4fcd803eaff7a3dac11e4623
NEXT_PUBLIC_CASPER_CONTRACT_HASH=contract-2faa3d9bd2009c1988dd45f19cf307b3737ab191a4c16605588936ebb98aaa1a
```

---

## 📁 Project Structure

```
CasperFlow-1/
├── frontend/                 # Next.js 14 Frontend
│   ├── app/                  # App Router pages
│   ├── components/           # React components
│   ├── lib/                  # Utilities (casper.ts, contract.ts)
│   └── .env.local            # Environment variables
├── backend/                  # Python FastAPI + AI Agent
├── contracts/                # Smart contract WASM files
├── cep-78-enhanced-nft/      # CEP-78 source code (compiled)
├── scripts/                  # Deployment scripts
├── keys/                     # Casper account keys
├── DEPLOYMENT.md             # Full deployment documentation
└── README.md                 # This file
```

---

## 🔑 Contract Modalities

| Modality | Configuration |
|----------|---------------|
| **Ownership** | Transferable |
| **Events Mode** | CEP-47 style Map-based events |
| **NFT Kind** | Digital |
| **NFT Metadata Kind** | CEP78 |
| **Whitelist Mode** | Unlocked |
| **NFT Holder Mode** | Mixed |
| **Burn Mode** | Burnable |
| **Identifier Mode** | Ordinal |
| **Metadata Mutability** | Mutable |

---

## 📜 License
MIT License. Built for Casper Hackathon 2026.

---

## 👥 Team
Built with ❤️ for the Casper Hackathon 2026.
