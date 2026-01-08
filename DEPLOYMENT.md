# FlowFi CEP-78 Contract Deployment Summary

## ✅ Successfully Deployed on Casper Testnet 2.0

### Transaction Details

| Field | Value |
|-------|-------|
| **Transaction Hash** | `ac9c2c07afa0042b94ed9cfa04f13eb4be4901cf66553e1506ec5def8df314ae` |
| **Block Hash** | `6e23ea0319b91c3bfdfd3f9b562edf89ee6e2a2cde98edf7f5b1bd1b6fbf5c57` |
| **Timestamp** | Jan 7, 2026, 10:15:56 PM CST |
| **Status** | ✅ Success |
| **Action** | WASM Deployment |
| **API Version** | 2.0.0 |
| **Chain** | casper-test |

### Gas Details

| Field | Value |
|-------|-------|
| **Transaction Payment** | 800.00000 CSPR ($4.00) |
| **Consumed Gas** | 761.42005 CSPR ($3.81) |
| **Charged Amount** | 771.06504 CSPR ($3.86) |

### Contract Details

| Field | Value |
|-------|-------|
| **Contract Package Hash** | `113fd0f7f4f803e2401a9547442e2ca31bd9001b4fcd803eaff7a3dac11e4623` |
| **Contract Hash (v1)** | `contract-2faa3d9bd2009c1988dd45f19cf307b3737ab191a4c16605588936ebb98aaa1a` |
| **Access Key** | `uref-4c81efe49665c8a000b2feeadf7bf0222504f1e8d93426bb680dda5930e540bd-007` |
| **Contract Type** | CEP-78 NFT |
| **Upgradable** | Yes |

### Owner Account

| Field | Value |
|-------|-------|
| **Caller/Owner** | `0202a4d9d6e4ac827ddd6a6e08a53dfde6181ec7d9d058e215a36cea17f7e1dc6095` |

### Collection Details

| Field | Value |
|-------|-------|
| **Collection Name** | FlowFi Invoices |
| **Collection Symbol** | FLOW |
| **Total Supply** | 1,000,000 |

### Modalities

| Modality | Value |
|----------|-------|
| **Ownership** | Transferable |
| **Events Mode** | CEP-47 style Map-based events |
| **NFT Kind** | Digital |
| **NFT Metadata Kind** | CEP78 |
| **Whitelist Mode** | Unlocked |
| **NFT Holder Mode** | Mixed |
| **Burn Mode** | Burnable |
| **NFT Identifier Mode** | Ordinal |
| **Metadata Mutability** | Mutable |

### Explorer Links

- 🔗 **Transaction**: https://testnet.cspr.live/deploy/ac9c2c07afa0042b94ed9cfa04f13eb4be4901cf66553e1506ec5def8df314ae
- 🔗 **Contract Package**: https://testnet.cspr.live/contract-package/113fd0f7f4f803e2401a9547442e2ca31bd9001b4fcd803eaff7a3dac11e4623
- 🔗 **Contract Version 1**: https://testnet.cspr.live/contract/2faa3d9bd2009c1988dd45f19cf307b3737ab191a4c16605588936ebb98aaa1a

### Frontend Integration

The contract has been integrated into the frontend:

1. **Environment Variables** (`.env.local`):
   - `NEXT_PUBLIC_CASPER_CONTRACT_PACKAGE_HASH`
   - `NEXT_PUBLIC_CASPER_CONTRACT_HASH`

2. **Contract Config** (`frontend/lib/contract.ts`)

3. **Dashboard** (`frontend/app/dashboard/page.tsx`)

### How It Was Built

1. Cloned CEP-78 Enhanced NFT from `casper-ecosystem/cep-78-enhanced-nft` (dev branch)
2. Compiled using `make build-contract` with Rust nightly-2025-02-04 for Casper 2.0
3. Deployed using `pycspr` Python SDK with 800 CSPR gas
4. Integrated contract hashes into frontend

### Entrypoints Available

- `mint` - Mint new invoice NFTs
- `transfer` - Transfer ownership
- `burn` - Burn tokens
- `approve` - Approve spender
- `set_approval_for_all` - Bulk approval
- `balance_of` - Check balance
- `owner_of` - Get token owner
- `metadata` - Get token metadata

---
*Deployed for FlowFi - Casper Hackathon 2026*
