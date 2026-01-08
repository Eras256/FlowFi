#!/usr/bin/env python3
"""
CEP-78 Contract Deployment Script using pycspr + requests
Compatible with Casper 2.0 Testnet
"""

import os
import json
import requests
import pycspr
from pycspr import KeyAlgorithm
from pycspr.types.crypto.complex import PrivateKey
from pycspr.types.cl import CLV_Key, CLV_List, CLV_U8, CLV_U64, CLV_String, CLV_Bool, CLV_KeyType
from pycspr.types.node.rpc.complex import DeployOfModuleBytes, WasmModule
from pathlib import Path

# Load environment variables
from dotenv import load_dotenv
load_dotenv(Path(__file__).parent.parent / 'contracts/src/.env.local')

# Configuration
RPC_URL = "https://node.testnet.casper.network/rpc"
CHAIN_NAME = os.getenv("CASPER_CHAIN_NAME", "casper-test")
PRIVATE_KEY_B64 = os.getenv("CASPER_ADMIN_PRIVATE_KEY")

# WASM path
WASM_PATH = Path(__file__).parent.parent / "contracts/cep-78.wasm"

def load_private_key() -> PrivateKey:
    """Load private key from base64 PEM content"""
    pem_content = f"-----BEGIN PRIVATE KEY-----\n{PRIVATE_KEY_B64}\n-----END PRIVATE KEY-----"
    temp_path = Path("/tmp/casper_temp_key.pem")
    temp_path.write_text(pem_content)
    try:
        pvk_bytes, pbk_bytes = pycspr.get_key_pair_from_pem_file(temp_path, algo=KeyAlgorithm.SECP256K1)
        pvk = PrivateKey(algo=KeyAlgorithm.SECP256K1, pbk=pbk_bytes, pvk=pvk_bytes)
    except Exception as e:
        print(f"Secp256K1 failed: {e}, trying Ed25519")
        pvk_bytes, pbk_bytes = pycspr.get_key_pair_from_pem_file(temp_path, algo=KeyAlgorithm.ED25519)
        pvk = PrivateKey(algo=KeyAlgorithm.ED25519, pbk=pbk_bytes, pvk=pvk_bytes)
    finally:
        temp_path.unlink()
    return pvk

def create_deploy_args(account_hash: bytes) -> dict:
    """Create deployment arguments for CEP-78"""
    
    # Build ACL whitelist with installer's key
    installer_key = CLV_Key(identifier=account_hash, key_type=CLV_KeyType.ACCOUNT)
    
    args = {
        "collection_name": CLV_String("FlowFi Invoices"),
        "collection_symbol": CLV_String("FLOW"),
        "total_token_supply": CLV_U64(1000000),
        
        "ownership_mode": CLV_U8(2),  # Transferable
        "nft_kind": CLV_U8(1),  # Digital
        "holder_mode": CLV_U8(2),  # Mixed
        "whitelist_mode": CLV_U8(0),  # Unlocked
        "minting_mode": CLV_U8(2),  # ACL
        
        "allow_minting": CLV_Bool(True),
        "acl_whitelist": CLV_List([installer_key]),  # List of Keys
        "acl_package_mode": CLV_Bool(False),
        
        "receipt_name": CLV_String("flowfi_receipt"),
        "cep78_package_key": CLV_String(""),
        
        "nft_metadata_kind": CLV_U8(0),  # CEP78
        "optional_metadata": CLV_List([CLV_U8(0)]),  # Populated with dummy
        "additional_required_metadata": CLV_List([CLV_U8(0)]),  # Populated with dummy
        
        "json_schema": CLV_String("{}"),
        
        "identifier_mode": CLV_U8(0),  # Ordinal
        "metadata_mutability": CLV_U8(1),  # Mutable
        "burn_mode": CLV_U8(0),  # Burnable
        
        "owner_reverse_lookup_mode": CLV_U8(1),  # Complete
        "events_mode": CLV_U8(1),  # CEP47
    }
    
    return args

def main():
    print("🚀 CEP-78 Deployment via Python SDK + HTTP...")
    
    # Load key
    pvk = load_private_key()
    print(f"Using public key: {pvk.account_key.hex()}")
    
    # Load WASM
    if not WASM_PATH.exists():
        print(f"❌ WASM not found at {WASM_PATH}")
        return
    wasm_bytes = pycspr.read_wasm(WASM_PATH)
    print(f"Loaded WASM: {len(wasm_bytes)} bytes")
    
    # Get account hash for args
    account_hash = pycspr.get_account_hash(pvk.account_key)
    args = create_deploy_args(account_hash)
    
    # Create deploy parameters
    deploy_params = pycspr.create_deploy_parameters(
        account=pvk,
        chain_name=CHAIN_NAME,
        ttl="1h",
    )
    
    # Payment
    payment = pycspr.create_standard_payment(800_000_000_000)  # 800 CSPR
    
    # Session with module bytes
    wasm_module = WasmModule(wasm_bytes)
    session = DeployOfModuleBytes(args=args, module_bytes=wasm_module)
    
    # Create and sign deploy
    deploy = pycspr.create_deploy(deploy_params, payment, session)
    approval = pycspr.create_deploy_approval(deploy, pvk)
    deploy.approvals.append(approval)
    
    # Validate deploy
    pycspr.validate_deploy(deploy)
    print("Deploy validated successfully")
    
    # Serialize to JSON
    deploy_json = pycspr.to_json(deploy)
    
    # Send via HTTP
    payload = {
        "id": 1,
        "jsonrpc": "2.0",
        "method": "account_put_deploy",
        "params": {"deploy": deploy_json}
    }
    
    print("Sending deploy to node...")
    try:
        response = requests.post(RPC_URL, json=payload, timeout=60)
        result = response.json()
        
        if "error" in result:
            print(f"❌ RPC Error: {result['error']}")
        elif "result" in result:
            deploy_hash = result["result"]["deploy_hash"]
            print(f"\n✅ DEPLOY SENT!")
            print(f"Deploy Hash: {deploy_hash}")
            print(f"Explorer: https://testnet.cspr.live/deploy/{deploy_hash}")
        else:
            print(f"Unknown response: {result}")
    except Exception as e:
        print(f"❌ Deploy failed: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    main()
