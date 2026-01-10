# 🌊 FlowFi: AI-Powered Invoice Factoring on Casper Network

> **Hackathon Track:** Main Track (DeFi / RWA) + NodeOps Bounty  
> **Tagline:** "Instant Liquidity for SMBs via AI Risk Audits & Casper Blockchain."

![FlowFi Banner](https://via.placeholder.com/1200x400?text=FlowFi+Dashboard)

## 🏆 The Problem
Small businesses wait 30-90 days for invoices to be paid. Traditional factoring is slow, manual, and expensive.

## 🚀 The Solution
**FlowFi** is a decentralized application (dApp) that:
1.  **AI Audit**: Uses a **NodeOps AI Agent** (powered by Gemini + Local LLMs) to instantly parse and score PDF invoices.
2.  **RWA Tokenization**: Mints a "Proof of Invoice" NFT on the **Casper Network** (Testnet 2.0).
3.  **Instant Market**: Allows investors to fund these verified invoices instantly.
4.  **Market Analytics**: Real-time token prices and DEX data via CSPR.cloud Market Data API.

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

| Component | Technology |
|-----------|------------|
| **Blockchain** | Casper Network 2.0 (Testnet) - CEP-78 Enhanced NFT Standard |
| **AI Engine** | FlowAI Multi-Model (Local LLMs + Google Gemini Pro) |
| **Frontend** | Next.js 14, React 18, TypeScript, Tailwind CSS, Framer Motion |
| **Backend** | Python FastAPI + NodeOps Infrastructure |
| **Wallet** | Casper Wallet (Native `window.CasperWalletProvider`) |
| **Storage** | IPFS via Pinata |
| **Database** | Supabase (PostgreSQL) |
| **Market Data** | CSPR.cloud Market Data API |
| **3D Graphics** | Three.js + React Three Fiber |

---

## ✨ Key Features

### For Borrowers (SMBs)
- **Dynamic Risk Scoring**: Upload a PDF, get a real-time risk score (A+, A, B...) and valuation
- **Instant NFT Minting**: Verified invoices become tradeable CEP-78 NFTs
- **IPFS Storage**: Permanent, decentralized document storage

### For Investors
- **Marketplace**: Browse and invest in verified invoices
- **High Yields**: 8-16% APY on real-world assets
- **Transparent**: All transactions verifiable on-chain

### For the Ecosystem
- **📊 Analytics Dashboard**: Dexscreener-like interface with token prices, DEX pools, and transaction activity powered by CSPR.cloud
- **📈 Real-Time Data**: Live market cap, volume, and token rates

---

## 📁 Project Structure

```
FlowFi/
├── frontend/                   # Next.js 14 Frontend
│   ├── app/                    # App Router pages
│   │   ├── page.tsx           # Landing page (immersive hero)
│   │   ├── dashboard/         # Borrower dashboard (upload → analyze → mint)
│   │   ├── marketplace/       # Investor marketplace
│   │   ├── analytics/         # Market data dashboard (CSPR.cloud)
│   │   ├── institutional/     # Enterprise features
│   │   ├── developers/        # API docs & SDK
│   │   └── api/               # Serverless API routes
│   │       ├── analyze/       # AI invoice analysis
│   │       ├── deploy/        # Casper RPC proxy
│   │       └── market-data/   # CSPR.cloud proxy
│   ├── components/            # React components
│   │   ├── immersive/         # 3D & animated components
│   │   ├── ui/                # Navbar, Footer
│   │   └── providers.tsx      # Casper Wallet context
│   ├── lib/                   # Utilities
│   │   ├── casper.ts         # Wallet interface
│   │   ├── contract.ts       # Contract config
│   │   ├── cspr-cloud.ts     # 📊 NEW: Market Data API
│   │   ├── supabase.ts       # Database client
│   │   └── pinata.ts         # IPFS upload
│   └── .env.local            # Environment variables
├── backend/                   # Python FastAPI + AI Agent
│   ├── main.py               # API server
│   ├── flowai/               # Multi-model AI engine
│   │   ├── engine.py         # Orchestrator (Core → LLM → Cloud)
│   │   ├── core.py           # Proprietary ML model (~5ms)
│   │   └── models.py         # Model registry
│   └── Dockerfile            # NodeOps deployment
├── contracts/                 # Smart contract WASM files
├── scripts/                   # Deployment scripts
├── keys/                      # Casper account keys
├── nodeops.yaml              # NodeOps configuration
└── README.md                 # This file
```

---

## 📦 Installation & Local Run

### Prerequisites
*   Node.js 18+ & pnpm
*   Python 3.9+
*   Casper Wallet Extension (Chrome)

### 1. Frontend (Next.js)
```bash
cd frontend
pnpm install
pnpm dev
# Opens at http://localhost:3000
```

### 2. AI Backend (Python) - Optional for local LLMs
```bash
cd backend
pip install -r requirements.txt
# Create .env file with your GEMINI_API_KEY
python -m uvicorn main:app --reload
# API runs at http://localhost:8000
```

### 3. Environment Variables
Create `frontend/.env.local`:
```env
# Casper Network
NEXT_PUBLIC_CASPER_CHAIN_NAME=casper-test
NEXT_PUBLIC_CASPER_CONTRACT_PACKAGE_HASH=113fd0f7f4f803e2401a9547442e2ca31bd9001b4fcd803eaff7a3dac11e4623
NEXT_PUBLIC_CASPER_CONTRACT_HASH=contract-2faa3d9bd2009c1988dd45f19cf307b3737ab191a4c16605588936ebb98aaa1a

# CSPR.cloud (get from https://console.cspr.build)
CSPR_CLOUD_ACCESS_TOKEN=your-token
NEXT_PUBLIC_CSPR_CLOUD_ACCESS_TOKEN=your-token

# AI
GEMINI_API_KEY=your-gemini-key

# Supabase (optional)
NEXT_PUBLIC_SUPABASE_URL=your-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-key

# Pinata IPFS
NEXT_PUBLIC_PINATA_JWT=your-jwt
```

---

## 🚀 Deployment

### Vercel (Frontend)
1. Import repository into Vercel
2. Set **Root Directory** to `frontend`
3. Add environment variables from `.env.local`
4. Deploy!

### NodeOps (Backend AI)
```bash
nodeops deploy flowfi-ai-agent
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

## 🌐 CSPR.cloud Integration

FlowFi integrates with **CSPR.cloud Market Data API** for:
- Real-time token prices (calculated from DEX activity)
- Trading pairs and exchange rates
- DEX pool liquidity and APY
- Transaction history

> *"Today we added Market Data APIs for fungible tokens. Token prices in fiat calculated based on DEX activity."* - Casper Association

---

## 📊 Pages Overview

| Page | Description |
|------|-------------|
| **/** | Hero landing with 3D particles, stats, features |
| **/dashboard** | Upload invoice → AI analysis → Mint NFT |
| **/marketplace** | Browse & invest in verified invoices |
| **/analytics** | Token prices, DEX pools, transactions (Dexscreener-style) |
| **/predictions** | Community prediction markets |
| **/institutional** | Enterprise features, compliance, API access |
| **/developers** | API reference, SDK examples, contract docs |

---

## 🏆 Hackathon Categories

| Category | Prize | FlowFi Fit |
|----------|-------|------------|
| **Main Track - 1st** | $10,000 | ✅ Primary target |
| **Main Track - 2nd** | $7,000 | ✅ |
| **Main Track - 3rd** | $3,000 | ✅ |
| **Best Interoperability** | $2,500 | ❌ N/A |
| **Best Liquid Staking** | $2,500 | ❌ N/A |

---

## 📜 License
MIT License. Built for Casper Hackathon 2026.

---

## 👥 Team
Built with ❤️ for the Casper Hackathon 2026.

---

## 🔗 Links
- **Live Demo**: Coming soon
- **Testnet Contract**: [View on CSPR.live](https://testnet.cspr.live/contract-package/113fd0f7f4f803e2401a9547442e2ca31bd9001b4fcd803eaff7a3dac11e4623)
- **DoraHacks**: [Casper Hackathon 2026](https://dorahacks.io/hackathon/casper-hackathon-2026)
- **CSPR.cloud Docs**: [docs.cspr.cloud](https://docs.cspr.cloud)
