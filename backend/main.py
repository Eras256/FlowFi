from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
from typing import Optional, Dict, Any, List
import time
import asyncio
import logging
import os
import io
import pypdf
import httpx
import json

# FlowAI - Local AI Engine
from flowai.engine import FlowAIEngine, AnalysisMode, get_flowai_engine
from flowai.models import ModelRegistry, ModelCapability

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("FlowAI")

load_dotenv()

app = FastAPI(
    title="FlowFi AI Engine",
    description="""
## FlowAI - Advanced Financial Analysis Engine

Multi-model AI system for invoice factoring risk assessment.

### Features:
- **Local LLMs**: DeepSeek-R1, Qwen3, Mistral, Llama (via Ollama)
- **Cloud Fallback**: Google Gemini Pro
- **Mathematical Reasoning**: Step-by-step quantitative analysis
- **Quantum Scoring**: Advanced composite risk metrics
- **Casper Integration**: RPC proxy for blockchain transactions
    """,
    version="2.0.0"
)

# Enable CORS
origins = os.getenv("ALLOWED_ORIGINS", "http://localhost:3000,http://127.0.0.1:3000").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Casper RPC Endpoints (Updated January 2026 - Casper 2.0)
# Priority: CSPR.cloud (with auth) > Public nodes
CSPR_CLOUD_ACCESS_TOKEN = os.getenv("CSPR_CLOUD_ACCESS_TOKEN", "")

# Use CSPR.cloud if token is available, otherwise fall back to public nodes
if CSPR_CLOUD_ACCESS_TOKEN:
    CASPER_RPC_ENDPOINTS = [
        ("https://node.testnet.cspr.cloud/rpc", CSPR_CLOUD_ACCESS_TOKEN),
    ]
else:
    # Fallback to public nodes (may have CORS/timeout issues)
    CASPER_RPC_ENDPOINTS = [
        ("https://node.testnet.casper.network:7777/rpc", None),
        ("http://3.142.241.131:7777/rpc", None),
        ("http://52.35.59.254:7777/rpc", None),
    ]

# FlowAI Engine instance
flowai_engine: Optional[FlowAIEngine] = None

class AnalysisResponse(BaseModel):
    risk_score: str
    valuation: int
    confidence: float
    summary: str
    reasoning: Optional[str] = None
    quantum_score: Optional[float] = None
    model_used: Optional[str] = None
    source: str = "local"

class FlowAIStatus(BaseModel):
    mode: str
    ollama_available: bool
    loaded_models: List[str]
    recommended_stack: Dict[str, str]
    gemini_available: bool
    available_vram_gb: float

class DeployRequest(BaseModel):
    deploy: dict

class DeployStatusRequest(BaseModel):
    deploy_hash: str

@app.on_event("startup")
async def startup_event():
    global flowai_engine
    
    logger.info("="*50)
    logger.info("🚀 FlowAI Engine Starting...")
    logger.info("="*50)
    
    # Initialize FlowAI
    try:
        flowai_engine = FlowAIEngine(
            mode=AnalysisMode.AUTO,
            available_vram=float(os.getenv("FLOWAI_VRAM_GB", "12")),
            gemini_api_key=os.getenv("GEMINI_API_KEY")
        )
        await flowai_engine.initialize()
        
        status = flowai_engine.get_status()
        logger.info(f"✅ FlowAI Ready!")
        logger.info(f"   Mode: {status['mode']}")
        logger.info(f"   Ollama: {'Available' if status['ollama_available'] else 'Not available'}")
        logger.info(f"   Gemini: {'Available' if status['gemini_available'] else 'Not available'}")
        logger.info(f"   Models: {status['loaded_models']}")
    except Exception as e:
        logger.error(f"❌ FlowAI initialization failed: {e}")
        logger.info("   Falling back to Gemini-only mode")
    
    # Log RPC configuration
    if CSPR_CLOUD_ACCESS_TOKEN:
        logger.info(f"🔗 Casper RPC: CSPR.cloud (authenticated)")
    else:
        endpoint_urls = [e[0] if isinstance(e, tuple) else e for e in CASPER_RPC_ENDPOINTS]
        logger.info(f"🔗 Casper RPC Proxy Ready - Endpoints: {endpoint_urls}")
        logger.warning("   ⚠️ No CSPR_CLOUD_ACCESS_TOKEN set. Using public nodes (may timeout).")

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "flowfi-nodeops-agent", "timestamp": time.time()}

@app.post("/deploy")
async def send_deploy(request: DeployRequest):
    """
    Proxy endpoint to send deploys to Casper Network.
    This avoids CORS issues by making the request from the server.
    """
    deploy_data = request.deploy
    
    # Log the incoming deploy structure for debugging
    logger.info(f"Received deploy with keys: {deploy_data.keys() if isinstance(deploy_data, dict) else 'not a dict'}")
    
    # The deploy from casper-js-sdk deployToJson() has a \"deploy\" wrapper
    # We need to pass the inner deploy object to the RPC
    actual_deploy = deploy_data.get("deploy", deploy_data)
    
    # JSON-RPC request format for account_put_deploy (Casper 1.x style, still supported)
    rpc_request = {
        "jsonrpc": "2.0",
        "id": int(time.time() * 1000),
        "method": "account_put_deploy",
        "params": [actual_deploy]  # Note: params is an array, not an object
    }
    
    errors = []
    
    async with httpx.AsyncClient(timeout=60.0) as client:
        for endpoint_config in CASPER_RPC_ENDPOINTS:
            # Handle both tuple format (url, token) and string format
            if isinstance(endpoint_config, tuple):
                rpc_url, auth_token = endpoint_config
            else:
                rpc_url, auth_token = endpoint_config, None
            
            try:
                logger.info(f"Trying RPC: {rpc_url}" + (" (with auth)" if auth_token else ""))
                
                # Build headers
                headers = {"Content-Type": "application/json"}
                if auth_token:
                    headers["Authorization"] = auth_token
                
                response = await client.post(
                    rpc_url,
                    json=rpc_request,
                    headers=headers
                )
                
                logger.info(f"Response from {rpc_url}: status={response.status_code}")
                
                if response.status_code == 200:
                    result = response.json()
                    logger.info(f"RPC Response: {json.dumps(result)[:500]}")
                    
                    if "error" in result:
                        error_msg = result["error"].get("message", str(result["error"]))
                        logger.warning(f"RPC error from {rpc_url}: {error_msg}")
                        
                        # DEBUG: Save failed deploy for inspection
                        try:
                            with open("/tmp/failed_deploy.json", "w") as f:
                                json.dump(actual_deploy, f, indent=2)
                            logger.info(f"💾 Saved failed deploy to /tmp/failed_deploy.json")
                        except Exception as e:
                            logger.error(f"Failed to save debug deploy: {e}")
                            
                        errors.append(f"{rpc_url}: {error_msg}")
                        continue
                    
                    if "result" in result:
                        deploy_hash = result["result"].get("deploy_hash", "")
                        if deploy_hash:
                            logger.info(f"✅ Deploy successful via {rpc_url}: {deploy_hash}")
                            return {
                                "success": True,
                                "deploy_hash": deploy_hash,
                                "rpc_used": rpc_url
                            }
                        else:
                            # Some endpoints return different structure
                            logger.info(f"Result structure: {result['result']}")
                            if isinstance(result["result"], str):
                                return {
                                    "success": True,
                                    "deploy_hash": result["result"],
                                    "rpc_used": rpc_url
                                }
                elif response.status_code == 401:
                    errors.append(f"{rpc_url}: Authentication failed (invalid token)")
                else:
                    errors.append(f"{rpc_url}: HTTP {response.status_code}")
                    
            except httpx.TimeoutException:
                logger.warning(f"Timeout on {rpc_url}")
                errors.append(f"{rpc_url}: Timeout")
            except Exception as e:
                logger.warning(f"Error on {rpc_url}: {str(e)}")
                errors.append(f"{rpc_url}: {str(e)}")
    
    # All endpoints failed
    raise HTTPException(
        status_code=502,
        detail=f"All Casper RPC endpoints failed: {'; '.join(errors)}"
    )

@app.post("/deploy-status")
async def get_deploy_status(request: DeployStatusRequest):
    """
    Get the status of a deploy by its hash.
    """
    rpc_request = {
        "jsonrpc": "2.0",
        "id": int(time.time() * 1000),
        "method": "info_get_deploy",
        "params": {
            "deploy_hash": request.deploy_hash
        }
    }
    
    async with httpx.AsyncClient(timeout=30.0) as client:
        for rpc_url in CASPER_RPC_ENDPOINTS:
            try:
                response = await client.post(
                    rpc_url,
                    json=rpc_request,
                    headers={"Content-Type": "application/json"}
                )
                
                if response.status_code == 200:
                    result = response.json()
                    if "result" in result:
                        return {
                            "success": True,
                            "deploy": result["result"]
                        }
            except Exception as e:
                continue
    
    raise HTTPException(status_code=404, detail="Deploy not found or RPC unavailable")

@app.post("/analyze", response_model=AnalysisResponse)
async def analyze_invoice(file: UploadFile = File(...)):
    try:
        import google.generativeai as genai
        
        api_key = os.getenv("GEMINI_API_KEY")
        if not api_key:
            raise Exception("No Gemini API Key found")

        # Read PDF Content
        content = await file.read()
        pdf_reader = pypdf.PdfReader(io.BytesIO(content))
        extracted_text = ""
        for page in pdf_reader.pages:
            extracted_text += page.extract_text() + "\n"
            
        logger.info(f"Extracted {len(extracted_text)} chars from PDF")

        # Use FlowAI for analysis
        if flowai_engine:
            logger.info("🧠 Using FlowAI for analysis...")
            result = await flowai_engine.analyze_document(
                document_text=extracted_text,
                document_type="invoice"
            )
            
            response = AnalysisResponse(
                risk_score=result.risk_score,
                valuation=result.valuation,
                confidence=result.confidence,
                summary=result.summary,
                reasoning=result.reasoning,
                quantum_score=result.quantum_score,
                model_used=result.model_used,
                source=result.source
            )
            
            logger.info(f"✅ FlowAI Analysis complete: {result.risk_score} | Model: {result.model_used}")
        else:
            # Fallback to Gemini only
            import google.generativeai as genai
            
            api_key = os.getenv("GEMINI_API_KEY")
            if not api_key:
                raise Exception("No Gemini API Key found")

            genai.configure(api_key=api_key)
            model = genai.GenerativeModel('gemini-pro')

            prompt = """
            You are FlowAI, an expert financial risk auditor for an Invoice Factoring platform called FlowFi.
            Analyze this invoice content and provide a comprehensive risk assessment.
            
            Return ONLY a JSON string with this format:
            {
                "risk_score": "A+, A, A-, B+, B, B-, C+, C, C-, D, or F",
                "valuation": <integer_value>,
                "confidence": <float_between_0_1>,
                "summary": "One sentence summary of the risk.",
                "reasoning": "Step-by-step analysis of risk factors",
                "quantum_score": <float_0_to_100>
            }
            """
            
            response_ai = model.generate_content(prompt + f"\nContext/Invoice Text: {extracted_text}")
            text = response_ai.text.replace("```json", "").replace("```", "").strip()
            
            try:
                data = json.loads(text)
            except json.JSONDecodeError:
                logger.error("Failed to parse JSON from AI response")
                raise Exception("AI Response format error")
            
            response = AnalysisResponse(
                risk_score=data.get("risk_score", "B"),
                valuation=data.get("valuation", 9500),
                confidence=data.get("confidence", 0.85),
                summary=data.get("summary", "AI Analysis complete."),
                reasoning=data.get("reasoning"),
                quantum_score=data.get("quantum_score"),
                model_used="Gemini Pro",
                source="cloud"
            )

    except Exception as e:
        logger.error(f"AI Error: {e}")
        # Build a safe fallback
        response = AnalysisResponse(
            risk_score="B+",
            valuation=5000,
            confidence=0.80,
            summary=f"FlowAI Analysis (Fallback due to: {str(e)})",
            model_used="fallback",
            source="fallback"
        )
    
    return response


# ============ FlowAI Management Endpoints ============

@app.get("/flowai/status", response_model=FlowAIStatus)
async def get_flowai_status():
    """Get FlowAI engine status and available models"""
    if flowai_engine:
        status = flowai_engine.get_status()
        return FlowAIStatus(
            mode=status["mode"],
            ollama_available=status["ollama_available"],
            loaded_models=status["loaded_models"],
            recommended_stack=status["recommended_stack"],
            gemini_available=status["gemini_available"],
            available_vram_gb=status["available_vram_gb"]
        )
    return FlowAIStatus(
        mode="fallback",
        ollama_available=False,
        loaded_models=[],
        recommended_stack={},
        gemini_available=os.getenv("GEMINI_API_KEY") is not None,
        available_vram_gb=0
    )


@app.get("/flowai/models")
async def list_available_models():
    """List all available AI models in the registry"""
    models = ModelRegistry.get_all_models()
    return {
        "models": [
            {
                "name": m.name,
                "ollama_name": m.ollama_name,
                "parameters": m.parameters,
                "context_length": m.context_length,
                "capabilities": [c.value for c in m.capabilities],
                "description": m.description,
                "priority": m.priority,
                "min_vram_gb": m.min_vram_gb
            }
            for m in models
        ]
    }


@app.post("/flowai/pull-models")
async def pull_recommended_models():
    """Pull recommended Ollama models for FlowAI"""
    if not flowai_engine:
        raise HTTPException(status_code=503, detail="FlowAI engine not initialized")
    
    results = await flowai_engine.pull_recommended_models()
    return {
        "success": True,
        "results": results
    }


@app.get("/flowai/recommended")
async def get_recommended_stack():
    """Get recommended model stack for current hardware"""
    available_vram = float(os.getenv("FLOWAI_VRAM_GB", "12"))
    stack = ModelRegistry.get_recommended_stack(available_vram)
    
    return {
        "available_vram_gb": available_vram,
        "recommended_stack": {
            task: {
                "name": model.name,
                "ollama_name": model.ollama_name,
                "description": model.description
            }
            for task, model in stack.items()
        }
    }


if __name__ == "__main__":
    import uvicorn
    host = os.getenv("API_HOST", "0.0.0.0")
    port = int(os.getenv("API_PORT", "8000"))
    uvicorn.run(app, host=host, port=port)
