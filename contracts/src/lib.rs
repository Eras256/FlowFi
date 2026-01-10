#![no_std]

extern crate alloc;

use alloc::string::String;
use alloc::vec::Vec;
use odra::prelude::*;
use odra::casper_types::U256;
use odra::{Address, Mapping, Variable, Event, UnwrapOrRevert};

/// FlowFi Factor - Invoice Factoring Smart Contract
/// 
/// This contract handles:
/// - Minting invoices as on-chain assets
/// - Funding invoices by investors  
/// - Tracking invoice status and ownership
/// - Automatic payment distribution

#[odra::module]
pub struct FlowFiFactor {
    /// Mapping of invoice ID to Invoice data
    pub invoices: Mapping<u64, Invoice>,
    /// Total number of invoices minted
    pub invoice_count: Variable<u64>,
    /// Mapping of invoice ID to funder address
    pub invoice_funders: Mapping<u64, Address>,
    /// Event emitted when invoice is minted
    pub mint_event: Event<InvoiceMinted>,
    /// Event emitted when invoice is funded
    pub fund_event: Event<InvoiceFunded>,
}

/// Invoice data structure stored on-chain
#[derive(OdraType, Clone, Debug, PartialEq, Eq)]
pub struct Invoice {
    /// Unique invoice ID
    pub id: u64,
    /// Owner/borrower address
    pub owner: Address,
    /// Invoice amount in motes (1 CSPR = 1e9 motes)
    pub amount: U256,
    /// Risk score (0-100, where 100 is best)
    pub risk_score: u8,
    /// IPFS hash for invoice document
    pub ipfs_hash: String,
    /// Invoice status
    pub status: InvoiceStatus,
    /// Timestamp of minting
    pub created_at: u64,
}

/// Invoice status enum
#[derive(OdraType, Clone, Debug, PartialEq, Eq)]
pub enum InvoiceStatus {
    /// Available for funding
    Available,
    /// Funded by an investor
    Funded,
    /// Repaid (invoice completed)
    Repaid,
    /// Defaulted
    Defaulted,
}

/// Event: Invoice minted
#[derive(OdraType, Debug, PartialEq, Eq)]
pub struct InvoiceMinted {
    pub id: u64,
    pub owner: Address,
    pub amount: U256,
    pub risk_score: u8,
    pub ipfs_hash: String,
}

/// Event: Invoice funded
#[derive(OdraType, Debug, PartialEq, Eq)]
pub struct InvoiceFunded {
    pub id: u64,
    pub funder: Address,
    pub amount: U256,
}

/// Contract errors
#[derive(OdraType, Debug, PartialEq, Eq)]
pub enum FlowFiError {
    InvoiceNotFound,
    AlreadyFunded,
    InsufficientFunds,
    NotOwner,
    InvalidRiskScore,
    InvalidAmount,
}

#[odra::module]
impl FlowFiFactor {
    /// Initialize the contract
    #[odra(init)]
    pub fn init(&mut self) {
        self.invoice_count.set(0);
    }

    /// Mint a new invoice NFT
    /// 
    /// # Arguments
    /// * `amount` - Invoice value in motes
    /// * `risk_score` - AI-calculated risk score (0-100)
    /// * `ipfs_hash` - IPFS CID of invoice document
    /// 
    /// # Returns
    /// The ID of the newly minted invoice
    pub fn mint_invoice(
        &mut self, 
        amount: U256, 
        risk_score: u8,
        ipfs_hash: String
    ) -> u64 {
        // Validate inputs
        if risk_score > 100 {
            self.env().revert(FlowFiError::InvalidRiskScore);
        }
        if amount == U256::zero() {
            self.env().revert(FlowFiError::InvalidAmount);
        }

        let id = self.invoice_count.get_or_default();
        let owner = self.env().caller();
        let created_at = self.env().get_block_time();
        
        let invoice = Invoice {
            id,
            owner,
            amount,
            risk_score,
            ipfs_hash: ipfs_hash.clone(),
            status: InvoiceStatus::Available,
            created_at,
        };

        self.invoices.set(&id, invoice);
        
        self.env().emit_event(InvoiceMinted {
            id,
            owner,
            amount,
            risk_score,
            ipfs_hash,
        });

        self.invoice_count.set(id + 1);
        
        id
    }

    /// Fund an invoice (investor function)
    /// 
    /// This is a payable function - caller must send CSPR equal to or greater 
    /// than the invoice amount. The CSPR is transferred to the invoice owner.
    /// 
    /// # Arguments
    /// * `id` - Invoice ID to fund
    #[odra(payable)]
    pub fn fund_invoice(&mut self, id: u64) {
        let mut invoice = self.invoices.get(&id)
            .unwrap_or_revert_with(&self.env(), FlowFiError::InvoiceNotFound);
        
        // Check if already funded
        if invoice.status != InvoiceStatus::Available {
            self.env().revert(FlowFiError::AlreadyFunded);
        }

        // Check payment amount
        let payment = self.env().attached_value();
        if payment < invoice.amount {
            self.env().revert(FlowFiError::InsufficientFunds);
        }

        let funder = self.env().caller();

        // Update state
        invoice.status = InvoiceStatus::Funded;
        self.invoices.set(&id, invoice.clone());
        self.invoice_funders.set(&id, funder);

        // Transfer funds to the invoice owner (borrower gets liquidity)
        self.env().transfer_tokens(&invoice.owner, &payment);

        self.env().emit_event(InvoiceFunded {
            id,
            funder,
            amount: payment,
        });
    }

    /// Get invoice by ID
    pub fn get_invoice(&self, id: u64) -> Option<Invoice> {
        self.invoices.get(&id)
    }

    /// Get total invoice count
    pub fn get_invoice_count(&self) -> u64 {
        self.invoice_count.get_or_default()
    }

    /// Get funder of an invoice
    pub fn get_invoice_funder(&self, id: u64) -> Option<Address> {
        self.invoice_funders.get(&id)
    }

    /// Check if invoice is funded
    pub fn is_invoice_funded(&self, id: u64) -> bool {
        match self.invoices.get(&id) {
            Some(invoice) => invoice.status == InvoiceStatus::Funded,
            None => false,
        }
    }

    /// Get all invoices by owner (for dashboard)
    /// Note: This is a view function that returns invoice IDs owned by an address
    pub fn get_owner_invoice_count(&self, owner: Address) -> u64 {
        let total = self.invoice_count.get_or_default();
        let mut count = 0u64;
        
        for i in 0..total {
            if let Some(invoice) = self.invoices.get(&i) {
                if invoice.owner == owner {
                    count += 1;
                }
            }
        }
        
        count
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use odra::host::{Deployer, HostRef};

    #[test]
    fn test_mint_invoice() {
        let env = odra_test::env();
        let mut contract = FlowFiFactorHostRef::deploy(&env, FlowFiFactorInitArgs {});
        
        let id = contract.mint_invoice(
            U256::from(1000000000u64), // 1 CSPR
            95, // High risk score
            String::from("QmTestHash123")
        );
        
        assert_eq!(id, 0);
        assert_eq!(contract.get_invoice_count(), 1);
        
        let invoice = contract.get_invoice(0).unwrap();
        assert_eq!(invoice.risk_score, 95);
        assert_eq!(invoice.status, InvoiceStatus::Available);
    }

    #[test]
    fn test_fund_invoice() {
        let env = odra_test::env();
        let mut contract = FlowFiFactorHostRef::deploy(&env, FlowFiFactorInitArgs {});
        
        // Mint invoice
        let id = contract.mint_invoice(
            U256::from(1000000000u64),
            90,
            String::from("QmTestHash")
        );
        
        // Fund invoice
        contract.with_tokens(U256::from(1000000000u64)).fund_invoice(id);
        
        let invoice = contract.get_invoice(id).unwrap();
        assert_eq!(invoice.status, InvoiceStatus::Funded);
    }
}
