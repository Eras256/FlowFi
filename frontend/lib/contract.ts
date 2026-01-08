/**
 * FlowFi Contract Configuration
 * CEP-78 NFT Contract for Real-World Asset Tokenization
 * 
 * Deployed on: January 7, 2026
 * Network: Casper Testnet
 */

export const CONTRACT_CONFIG = {
    // CEP-78 Contract Package Hash (for upgradable contracts)
    CONTRACT_PACKAGE_HASH: process.env.NEXT_PUBLIC_CASPER_CONTRACT_PACKAGE_HASH || "113fd0f7f4f803e2401a9547442e2ca31bd9001b4fcd803eaff7a3dac11e4623",

    // Versioned Contract Hash (for calling entrypoints)
    CONTRACT_HASH: process.env.NEXT_PUBLIC_CASPER_CONTRACT_HASH || "contract-2faa3d9bd2009c1988dd45f19cf307b3737ab191a4c16605588936ebb98aaa1a",

    // Access Key (URef)
    ACCESS_KEY: "uref-4c81efe49665c8a000b2feeadf7bf0222504f1e8d93426bb680dda5930e540bd-007",

    // Deploy Transaction Hash
    DEPLOY_HASH: "ac9c2c07afa0042b94ed9cfa04f13eb4be4901cf66553e1506ec5def8df314ae",

    // Collection Info
    COLLECTION_NAME: "FlowFi Invoices",
    COLLECTION_SYMBOL: "FLOW",
    TOTAL_SUPPLY: 1000000,

    // Owner
    OWNER: "0202a4d9d6e4ac827ddd6a6e08a53dfde6181ec7d9d058e215a36cea17f7e1dc6095",

    // Network Config
    NODE_URL: process.env.NEXT_PUBLIC_CASPER_NODE_URL || "https://node.testnet.casper.network/rpc",
    CHAIN_NAME: process.env.NEXT_PUBLIC_CASPER_CHAIN_NAME || "casper-test",

    // Modalities
    MODALITIES: {
        OWNERSHIP: "Transferable",
        EVENTS_MODE: "CEP-47 style Map-based events",
        NFT_KIND: "Digital",
        NFT_METADATA_KIND: "CEP78",
        WHITELIST_MODE: "Unlocked",
        NFT_HOLDER_MODE: "Mixed",
        BURN_MODE: "Burnable",
        NFT_IDENTIFIER_MODE: "Ordinal",
        METADATA_MUTABILITY: "Mutable",
        UPGRADABLE: true,
    },

    // Explorer URLs
    EXPLORER_BASE: "https://testnet.cspr.live",
    getContractPackageUrl: function () {
        return `${this.EXPLORER_BASE}/contract-package/${this.CONTRACT_PACKAGE_HASH}`;
    },
    getContractUrl: function () {
        return `${this.EXPLORER_BASE}/contract/${this.CONTRACT_HASH.replace("contract-", "")}`;
    },
    getDeployUrl: function () {
        return `${this.EXPLORER_BASE}/deploy/${this.DEPLOY_HASH}`;
    },
    getTokenUrl: function (tokenId: string | number) {
        return `${this.EXPLORER_BASE}/contract/${this.CONTRACT_HASH.replace("contract-", "")}`;
    },

    // Contract Entrypoints
    ENTRYPOINTS: {
        MINT: "mint",
        TRANSFER: "transfer",
        BURN: "burn",
        SET_APPROVAL_FOR_ALL: "set_approval_for_all",
        APPROVE: "approve",
        BALANCE_OF: "balance_of",
        OWNER_OF: "owner_of",
        METADATA: "metadata",
    },

    // Gas Configuration (in motes - 1 CSPR = 1,000,000,000 motes)
    GAS: {
        MINT: 50_000_000_000,      // 50 CSPR for minting
        TRANSFER: 10_000_000_000,  // 10 CSPR for transfer
        APPROVE: 5_000_000_000,    // 5 CSPR for approval
    }
};

export default CONTRACT_CONFIG;
