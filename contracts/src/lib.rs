#![no_std]
#![feature(used_with_arg)]

use odra::prelude::*;

#[odra::module]
pub struct FlowFiFactor {
    pub invoices: Mapping<u64, Invoice>,
    pub invoice_count: Variable<u64>,
    pub invoice_funders: Mapping<u64, Address>,
    pub mint_event: Event<InvoiceMinted>,
    pub fund_event: Event<InvoiceFunded>,
}

#[derive(OdraType, Debug, Clone, PartialEq, Eq)]
pub struct Invoice {
    pub id: u64,
    pub owner: Address,
    pub amount: U256,
    pub risk_score: u8,
    pub ipfs_hash: String,
    pub is_funded: bool,
}

#[derive(OdraType, Debug, PartialEq, Eq)]
pub struct InvoiceMinted {
    pub id: u64,
    pub owner: Address,
    pub amount: U256,
    pub risk_score: u8,
    pub ipfs_hash: String,
}

#[derive(OdraType, Debug, PartialEq, Eq)]
pub struct InvoiceFunded {
    pub id: u64,
    pub funder: Address,
    pub amount: U256,
}

#[odra::module]
impl FlowFiFactor {
    #[odra(init)]
    pub fn init(&mut self) {
        self.invoice_count.set(0);
    }

    pub fn mint_invoice(&mut self, amount: U256, risk_score: u8, ipfs_hash: String) -> u64 {
        let id = self.invoice_count.get_or_default();
        let owner = self.env().caller();
        
        let invoice = Invoice {
            id,
            owner,
            amount,
            risk_score,
            ipfs_hash: ipfs_hash.clone(),
            is_funded: false,
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

    #[odra(payable)]
    pub fn fund_invoice(&mut self, id: u64) {
        let mut invoice = self.invoices.get(&id).unwrap_or_revert(&self.env());
        
        if invoice.is_funded {
            self.env().revert(0); // AlreadyFunded
        }

        let payment = self.env().attached_value();
        if payment < invoice.amount {
            self.env().revert(1); // InsufficientFunds
        }

        let funder = self.env().caller();

        invoice.is_funded = true;
        self.invoices.set(&id, invoice.clone());
        self.invoice_funders.set(&id, funder);

        self.env().transfer_tokens(&invoice.owner, &payment);

        self.env().emit_event(InvoiceFunded {
            id,
            funder,
            amount: payment,
        });
    }

    pub fn get_invoice(&self, id: u64) -> Option<Invoice> {
        self.invoices.get(&id)
    }

    pub fn get_invoice_count(&self) -> u64 {
        self.invoice_count.get_or_default()
    }

    pub fn is_invoice_funded(&self, id: u64) -> bool {
        self.invoices.get(&id).map(|i| i.is_funded).unwrap_or(false)
    }
}
