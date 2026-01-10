# 🚀 FlowFi - Vercel Environment Variables

This document contains all the environment variables you need to configure in Vercel for the FlowFi application.

---

## 📋 How to Add Environment Variables in Vercel

1. Go to your **Vercel Dashboard** → Select **FlowFi** project
2. Click **Settings** → **Environment Variables**
3. Add each variable below with its corresponding value
4. Make sure to select all environments: **Production**, **Preview**, and **Development**
5. Click **Save** after adding each variable
6. **Redeploy** your project for changes to take effect

---

## 🔑 Required Variables

### Core Configuration
| Variable | Value | Description |
|----------|-------|-------------|
| `NEXT_PUBLIC_API_URL` | `/api` | API endpoint (uses serverless routes) |
| `NEXT_PUBLIC_CASPER_CHAIN_NAME` | `casper-test` | Casper network name |

### Casper Contract (CEP-78 NFT)
| Variable | Value | Description |
|----------|-------|-------------|
| `NEXT_PUBLIC_CASPER_CONTRACT_PACKAGE_HASH` | `113fd0f7f4f803e2401a9547442e2ca31bd9001b4fcd803eaff7a3dac11e4623` | Contract package hash |
| `NEXT_PUBLIC_CASPER_CONTRACT_HASH` | `contract-2faa3d9bd2009c1988dd45f19cf307b3737ab191a4c16605588936ebb98aaa1a` | Contract hash |

### AI Analysis (Gemini API)
| Variable | Value | Description |
|----------|-------|-------------|
| `GEMINI_API_KEY` | `AIzaSyBMwnPVzL_oG7JooBfAfBzy8clHRY1OL5s` | Google Gemini API key for AI analysis |

### Casper RPC (CSPR.cloud)
| Variable | Value | Description |
|----------|-------|-------------|
| `CSPR_CLOUD_ACCESS_TOKEN` | `019b9f79-2cd4-7e83-a46e-65f3bc6c51bd` | CSPR.cloud API token for RPC calls |
| `NEXT_PUBLIC_CSPR_CLOUD_ACCESS_TOKEN` | `019b9f79-2cd4-7e83-a46e-65f3bc6c51bd` | CSPR.cloud token for Market Data API (client-side) |

---

## 🗄️ Optional Variables (Recommended)

### Supabase Database
> *If not configured, the app will use localStorage as fallback*

| Variable | Value | Description |
|----------|-------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://pslpgvbujwnqgfrwfhih.supabase.co` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBzbHBndmJ1anducWdmcndmaGloIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgwNjEwOTEsImV4cCI6MjA4MzYzNzA5MX0.mg20KfE5P_3dgdUK0EFdAnVJHePfh84pCum6B_qlUik` | Supabase anonymous key |

### Pinata (IPFS Storage)
> *If not configured, the app will use mock IPFS URLs*

| Variable | Value | Description |
|----------|-------|-------------|
| `NEXT_PUBLIC_PINATA_API_KEY` | `6d84c90c6d822eb5ed2c` | Pinata API key |
| `NEXT_PUBLIC_PINATA_API_SECRET` | `964b83f4259c1f5b6b843e1ec2588e2b1fc856713e39ce596e5483b8a7a9f659` | Pinata API secret |
| `NEXT_PUBLIC_PINATA_JWT` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiI2ZmRjMmRhNy00ZTcyLTQ2ZWQtYTA3MC02MDIxYWFiNjI1MjYiLCJlbWFpbCI6InZhaW9naW9zc0BnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwicGluX3BvbGljeSI6eyJyZWdpb25zIjpbeyJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MSwiaWQiOiJGUkExIn0seyJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MSwiaWQiOiJOWUMxIn1dLCJ2ZXJzaW9uIjoxfSwibWZhX2VuYWJsZWQiOmZhbHNlLCJzdGF0dXMiOiJBQ1RJVkUifSwiYXV0aGVudGljYXRpb25UeXBlIjoic2NvcGVkS2V5Iiwic2NvcGVkS2V5S2V5IjoiNmQ4NGM5MGM2ZDgyMmViNWVkMmMiLCJzY29wZWRLZXlTZWNyZXQiOiI5NjRiODNmNDI1OWMxZjViNmI4NDNlMWVjMjU4OGUyYjFmYzg1NjcxM2UzOWNlNTk2ZTU0ODNiOGE3YTlmNjU5IiwiZXhwIjoxNzk5NjA5Mjk4fQ.N-34op2aeD46AwUlhtpgtE5ergnBRhrffpZjn6KAleI` | Pinata JWT token |
| `NEXT_PUBLIC_PINATA_GATEWAY` | `https://gateway.pinata.cloud` | Pinata gateway URL |

---

## 📝 Quick Copy-Paste Format

Use this format to quickly add all variables in Vercel:

```
NEXT_PUBLIC_API_URL=/api
NEXT_PUBLIC_CASPER_CHAIN_NAME=casper-test
NEXT_PUBLIC_CASPER_CONTRACT_PACKAGE_HASH=113fd0f7f4f803e2401a9547442e2ca31bd9001b4fcd803eaff7a3dac11e4623
NEXT_PUBLIC_CASPER_CONTRACT_HASH=contract-2faa3d9bd2009c1988dd45f19cf307b3737ab191a4c16605588936ebb98aaa1a
GEMINI_API_KEY=AIzaSyBMwnPVzL_oG7JooBfAfBzy8clHRY1OL5s
CSPR_CLOUD_ACCESS_TOKEN=019b9f79-2cd4-7e83-a46e-65f3bc6c51bd
NEXT_PUBLIC_SUPABASE_URL=https://pslpgvbujwnqgfrwfhih.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBzbHBndmJ1anducWdmcndmaGloIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgwNjEwOTEsImV4cCI6MjA4MzYzNzA5MX0.mg20KfE5P_3dgdUK0EFdAnVJHePfh84pCum6B_qlUik
NEXT_PUBLIC_PINATA_API_KEY=6d84c90c6d822eb5ed2c
NEXT_PUBLIC_PINATA_API_SECRET=964b83f4259c1f5b6b843e1ec2588e2b1fc856713e39ce596e5483b8a7a9f659
NEXT_PUBLIC_PINATA_JWT=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb25zIjp7ImlkIjoiNmZkYzJkYTctNGU3Mi00NmVkLWEwNzAtNjAyMWFhYjYyNTI2IiwiZW1haWwiOiJ2YWlvZ2lvc3NAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsInBpbl9wb2xpY3kiOnsicmVnaW9ucyI6W3siZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjEsImlkIjoiRlJBMSJ9LHsiZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjEsImlkIjoiTllDMSJ9XSwidmVyc2lvbiI6MX0sIm1mYV9lbmFibGVkIjpmYWxzZSwic3RhdHVzIjoiQUNUSVZFIn0sImF1dGhlbnRpY2F0aW9uVHlwZSI6InNjb3BlZEtleSIsInNjb3BlZEtleUtleSI6IjZkODRjOTBjNmQ4MjJlYjVlZDJjIiwic2NvcGVkS2V5U2VjcmV0IjoiOTY0YjgzZjQyNTljMWY1YjZiODQzZTFlYzI1ODhlMmIxZmM4NTY3MTNlMzljZTU5NmU1NDgzYjhhN2E5ZjY1OSIsImV4cCI6MTc5OTYwOTI5OH0.N-34op2aeD46AwUlhtpgtE5ergnBRhrffpZjn6KAleI
NEXT_PUBLIC_PINATA_GATEWAY=https://gateway.pinata.cloud
```

---

## ⚠️ Security Notes

- **Never commit this file with real secrets to a public repository**
- The `GEMINI_API_KEY` and `CSPR_CLOUD_ACCESS_TOKEN` should be kept secret (they don't have `NEXT_PUBLIC_` prefix)
- Variables with `NEXT_PUBLIC_` prefix are exposed to the browser - this is expected for Casper contract hashes and public API URLs
- If you suspect any keys are compromised, rotate them immediately in their respective dashboards

---

## 🔄 After Adding Variables

1. Go to **Deployments** tab in Vercel
2. Click the **...** menu on the latest deployment
3. Click **Redeploy**
4. Wait for the build to complete
5. Test your application!

---

*Document generated for FlowFi - Casper Hackathon 2026*
