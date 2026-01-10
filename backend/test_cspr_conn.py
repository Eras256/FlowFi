
import os
import requests
import json
from dotenv import load_dotenv

load_dotenv()

TOKEN = os.getenv("CSPR_CLOUD_ACCESS_TOKEN")
RPC_URL = "https://node.testnet.cspr.cloud/rpc"

print(f"Testing connection to {RPC_URL}")
print(f"Token present: {'Yes' if TOKEN else 'No'}")

headers = {
    "Content-Type": "application/json",
    "Authorization": TOKEN
}

payload = {
    "jsonrpc": "2.0",
    "id": 1,
    "method": "info_get_status",
    "params": []
}

try:
    response = requests.post(RPC_URL, headers=headers, json=payload, timeout=10)
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.text[:500]}...")
    
    if response.status_code == 200:
        print("✅ Connection Successful!")
    else:
        print("❌ Connection Failed")
        
except Exception as e:
    print(f"❌ Error: {e}")
