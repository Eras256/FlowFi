# 👻 FlowFi: The Future of Invoice Financing on Casper

<div align="center">

[![Live Demo](https://img.shields.io/badge/🚀_Live_Demo-flowfi--casper.vercel.app-00D1B2?style=for-the-badge)](https://flowfi-casper.vercel.app)
[![Casper Network](https://img.shields.io/badge/Casper_Network-Testnet_2.0-FF0000?style=for-the-badge)](https://testnet.cspr.live)
[![CEP-78](https://img.shields.io/badge/Standard-CEP--78_NFT-purple?style=for-the-badge)](https://github.com/casper-ecosystem/cep-78-enhanced-nft)

**🏆 Casper Hackathon 2026 | Main Track + NodeOps Bounty**

*"Unlocking $3 Trillion in Trapped Working Capital Through AI-Powered RWA Tokenization"*

</div>

---

## 💡 The Vision

**Every 43 seconds, a small business closes because of cash flow problems.**

While $3 trillion sits trapped in unpaid invoices worldwide, traditional factoring remains broken: slow underwriting, manual paperwork, and fees that eat 5-10% of invoice value.

**FlowFi changes everything.**

We're building the first **AI-native invoice factoring protocol** on Casper Network — where invoices become instantly tradeable Real-World Assets, verified by AI, secured by blockchain, and funded in minutes instead of months.

---

## 🚀 What We Built

FlowFi is a complete **end-to-end DeFi protocol** for invoice factoring:

### 1️⃣ AI-Powered Risk Engine
Upload a PDF invoice → Our **hybrid AI engine** (NodeOps + Gemini Pro) performs forensic analysis in seconds:
- Document authenticity verification
- Counterparty risk assessment  
- Dynamic valuation with confidence scoring
- Risk grade assignment (A+, A, B+, B)

### 2️⃣ RWA Tokenization on Casper
Verified invoices are minted as **CEP-78 NFTs** with immutable on-chain metadata:
- AI risk score embedded in token
- IPFS-stored document proof
- Full transaction history on CSPR.live
- Regulatory-compliant structure

### 3️⃣ Instant Investment Marketplace
Investors browse verified invoices and fund directly:
- Real CSPR transfers to invoice owners
- 8-16% APY on real-world assets
- Transparent on-chain settlement
- No intermediaries, no delays

### 4️⃣ Professional Analytics Dashboard
Dexscreener-style market intelligence powered by **CSPR.cloud Market Data API**:
- Real-time token prices
- DEX pool liquidity & APY
- Transaction activity feed
- Portfolio tracking

---

## 🔗 Live on Casper Testnet 2.0

### Smart Contract (CEP-78 NFT)

| Property | Value |
|----------|-------|
| **Contract Package** | [`717b9ca1...78f07`](https://testnet.cspr.live/contract-package/717b9ca1ef2134a71ac38ccee216dc6e782c8c6d9c95a7355cf4a5c17be78f07) |
| **Contract Hash** | `hash-efc6a6f5e51c3a8cf993d9b58f6ebd03155f9eb7f013eedcab5709688938eb0f` |
| **Collection** | FlowFi Invoices (FLOW) |
| **Minting Mode** | ✅ Public (Permissionless) |
| **Total Supply** | 100,000 NFTs |

### Verified Transactions

| Transaction | Type | Status |
|-------------|------|--------|
| [Contract Deployment](https://testnet.cspr.live/deploy/9894fc65870af3689a69e76264b7d26b6de70bf065b6d2fc071cf23641e7a934) | Install CEP-78 | ✅ Success |
| [Sample Mint](https://testnet.cspr.live/deploy/632a44991ec1b06e6557f63d2ac3eeb553f75b509504d459c365b083042beef0) | Mint NFT | ✅ Success |
| [Sample Investment](https://testnet.cspr.live/deploy/2a188afc9deefd90ea2f319fa60e87f69e3980fdbbbcc43c4383648494f69a61) | CSPR Transfer | ✅ Success |

---

## 🎯 Why FlowFi Wins

### ✅ Real Utility, Not Speculation
We're not building another trading platform. FlowFi solves a **$3 trillion problem** affecting millions of businesses globally.

### ✅ Production-Ready Smart Contracts
Fully deployed CEP-78 with public minting, verifiable on CSPR.live. Not a mockup — real on-chain transactions.

### ✅ AI + Blockchain Synergy
First project combining **NodeOps AI infrastructure** with Casper's enterprise-grade blockchain for RWA underwriting.

### ✅ CSPR.cloud Deep Integration
Leveraging the new **Market Data API** for Dexscreener-quality analytics. Real-time token prices, DEX data, and more.

### ✅ Enterprise-Grade UX
Immersive 3D interface, premium animations, and a seamless wallet experience. Built for institutions, accessible to everyone.

---

## 🛠 Technology Stack

| Layer | Technology |
|-------|------------|
| **Blockchain** | Casper Network 2.0 (CEP-78 Enhanced NFT) |
| **AI Engine** | Hybrid: NodeOps Local LLMs + Google Gemini Pro |
| **Frontend** | Next.js 14, React 18, TypeScript, Framer Motion |
| **Backend** | Python FastAPI, NodeOps Infrastructure |
| **Storage** | IPFS via Pinata |
| **Database** | Supabase (PostgreSQL) |
| **Market Data** | CSPR.cloud Market Data API |
| **Wallet** | Native Casper Wallet Integration |

---

## 📸 Screenshots

| Dashboard | Marketplace | Analytics |
|-----------|-------------|-----------|
| Upload → AI Analysis → Mint | Browse & Invest | Real-time Market Data |

---

## 🏃 Quick Start

### Prerequisites
- Node.js 18+ & pnpm
- Casper Wallet Extension
- (Optional) Python 3.9+ for backend

### Run Locally
```bash
# Clone the repository
git clone https://github.com/Eras256/FlowFi.git
cd FlowFi/frontend

# Install dependencies
pnpm install

# Configure environment
cp .env.example .env.local
# Edit .env.local with your API keys

# Start development server
pnpm dev
```

### Environment Variables
```env
# Casper Network
NEXT_PUBLIC_CASPER_CHAIN_NAME=casper-test
NEXT_PUBLIC_CASPER_CONTRACT_HASH=efc6a6f5e51c3a8cf993d9b58f6ebd03155f9eb7f013eedcab5709688938eb0f
NEXT_PUBLIC_CASPER_CONTRACT_PACKAGE_HASH=717b9ca1ef2134a71ac38ccee216dc6e782c8c6d9c95a7355cf4a5c17be78f07

# CSPR.cloud (get from https://console.cspr.build)
NEXT_PUBLIC_CSPR_CLOUD_ACCESS_TOKEN=your-token

# AI & Storage
GEMINI_API_KEY=your-gemini-key
NEXT_PUBLIC_PINATA_JWT=your-pinata-jwt
```

---

## � Pages Overview

| Page | Purpose |
|------|---------|
| **/** | Immersive landing with 3D hero, stats, and value proposition |
| **/dashboard** | Borrower flow: Upload → AI Analysis → Mint NFT |
| **/marketplace** | Investor flow: Browse → Select → Fund with CSPR |
| **/analytics** | Dexscreener-style market data dashboard |
| **/institutional** | Enterprise features & compliance info |
| **/developers** | API documentation & SDK examples |

---

## 🏆 Hackathon Tracks

| Track | Prize | FlowFi Fit |
|-------|-------|------------|
| **Main Track - 1st Place** | $10,000 | ✅ Primary Target |
| **NodeOps Bounty** | $5,000 Credit | ✅ AI Integration |
| **Best Use of CSPR.cloud** | - | ✅ Market Data API |

---

## 🟢 Key On-Chain Actions to Test (Judges)

1.  **Mint an Invoice (NFT):**
    *   Go to **Dashboard**.
    *   Upload any PDF (or use the one generated).
    *   Click **"Mint Invoice NFT"**.
    *   *(Wait ~15s)* -> You will receive a **verified mainnet/testnet Deploy Hash**.
    *   Click the hash to see your NFT transaction on `cspr.live`.

2.  **Invest in an Invoice (DeFi):**
    *   Go to **Marketplace**.
    *   You will see **20+ Real Verified Invoices** (Pre-loaded from Casper Testnet activity).
    *   Click **"Invest Now"** on any available invoice.
    *   Sign the transaction with Casper Wallet.
    *   See the invoice status change to **Funded** on-chain.

### 🔍 Verifiable Proofs (Testnet)

The marketplace is pre-populated with **20 real invoices verified on Casper Testnet**. You can verify them on the explorer:

*   **Quantum Hardware ($112,000):** [View Transaction (`4d1cd...`)](https://testnet.cspr.live/deploy/4d1cd2c9ff419bdd31262bbbdda561615a2caf4a5a48a3a4edaedee53dca4132)
*   **BioLife Pharma ($89,500):** [View Transaction (`24186...`)](https://testnet.cspr.live/deploy/24186da408850fc4a38f4b72214f20c2e2b9ee6b41fd4e07df52a267f8a76789)
*   **GreenEnergy Co ($67,500):** [View Transaction (`273ef...`)](https://testnet.cspr.live/deploy/273ef138ba1cc5d1fa98b00592da1ae5adfb09f80f5b05bdd1cec76850b601ac)
*   *(And 17 more available in the dApp)*

---

## 🔮 Roadmap

### Phase 1: Hackathon (Current)
- ✅ CEP-78 Contract Deployment
- ✅ AI Risk Engine
- ✅ Investor Marketplace
- ✅ CSPR.cloud Integration

### Phase 2: Mainnet Launch
- [ ] Mainnet contract deployment
- [ ] Credit scoring partnerships
- [ ] Institutional onboarding
- [ ] Multi-currency support

### Phase 3: Scale
- [ ] Cross-chain bridges
- [ ] Secondary market trading
- [ ] Insurance integration
- [ ] Global expansion

---

## � License

MIT License. Built with ❤️ for the Casper Hackathon 2026.

---

## 🔗 Links

| Resource | Link |
|----------|------|
| **Live Demo** | [flowfi-casper.vercel.app](https://flowfi-casper.vercel.app) |
| **Contract** | [CSPR.live](https://testnet.cspr.live/contract-package/717b9ca1ef2134a71ac38ccee216dc6e782c8c6d9c95a7355cf4a5c17be78f07) |
| **Hackathon** | [DoraHacks](https://dorahacks.io/hackathon/casper-hackathon-2026) |
| **CSPR.cloud** | [docs.cspr.cloud](https://docs.cspr.cloud) |

---

<div align="center">

### 👻 FlowFi — Where Invoices Become Assets

**Vote for us on [CSPR.fans](https://cspr.fans)!**

</div>
