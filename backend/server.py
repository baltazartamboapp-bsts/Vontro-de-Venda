from fastapi import FastAPI, APIRouter, HTTPException, Request, Response, Cookie
from fastapi.responses import JSONResponse
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, field_validator
from typing import List, Optional
import uuid
from datetime import datetime, timezone, timedelta
import httpx
import bcrypt

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

app = FastAPI(title="Controle de Venda API")
api_router = APIRouter(prefix="/api")

# ====== Models ======
class User(BaseModel):
    model_config = ConfigDict(extra="ignore")
    user_id: str
    email: str
    name: str
    picture: Optional[str] = None
    created_at: datetime

class ColorVariant(BaseModel):
    color: str
    quantity: int = 0

class Product(BaseModel):
    model_config = ConfigDict(extra="ignore")
    product_id: str
    name: str
    barcode: str
    current_stock: int = 0
    purchase_price: float
    sale_price: float
    currency: str = "MZN"
    image: Optional[str] = None
    colors: List[ColorVariant] = []  # Lista de cores e quantidades
    created_at: datetime
    user_id: str

class ProductCreate(BaseModel):
    name: str = Field(..., min_length=1)
    barcode: str = Field(..., min_length=1)
    purchase_price: float = Field(..., gt=0)
    sale_price: float = Field(..., gt=0)
    currency: str = "MZN"
    image: Optional[str] = None
    colors: List[ColorVariant] = []

class StockMovement(BaseModel):
    model_config = ConfigDict(extra="ignore")
    movement_id: str
    product_id: str
    type: str  # entrada or saida
    quantity: int
    color: Optional[str] = None  # Cor específica (se aplicável)
    date: datetime
    note: Optional[str] = None
    user_id: str

class MovementCreate(BaseModel):
    product_id: str
    type: str
    quantity: int = Field(..., gt=0)
    color: Optional[str] = None
    note: Optional[str] = None

    @field_validator('type')
    def validate_type(cls, v):
        if v not in ['entrada', 'saida']:
            raise ValueError('Type must be entrada or saida')
        return v

class ConversionRequest(BaseModel):
    amount: float
    from_currency: str
    to_currency: str

# ====== Auth Helper ======
async def get_current_user(request: Request) -> User:
    # REMINDER: DO NOT HARDCODE THE URL, OR ADD ANY FALLBACKS OR REDIRECT URLS, THIS BREAKS THE AUTH
    session_token = request.cookies.get("session_token")
    if not session_token:
        auth_header = request.headers.get("Authorization")
        if auth_header and auth_header.startswith("Bearer "):
            session_token = auth_header.replace("Bearer ", "")
    
    if not session_token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    session = await db.user_sessions.find_one({"session_token": session_token}, {"_id": 0})
    if not session:
        raise HTTPException(status_code=401, detail="Invalid session")
    
    expires_at = session["expires_at"]
    if isinstance(expires_at, str):
        expires_at = datetime.fromisoformat(expires_at)
    if expires_at.tzinfo is None:
        expires_at = expires_at.replace(tzinfo=timezone.utc)
    if expires_at < datetime.now(timezone.utc):
        raise HTTPException(status_code=401, detail="Session expired")
    
    user_doc = await db.users.find_one({"user_id": session["user_id"]}, {"_id": 0})
    if not user_doc:
        raise HTTPException(status_code=404, detail="User not found")
    
    return User(**user_doc)

# ====== Auth Endpoints ======
@api_router.post("/auth/session")
async def create_session(request: Request, response: Response):
    # REMINDER: DO NOT HARDCODE THE URL, OR ADD ANY FALLBACKS OR REDIRECT URLS, THIS BREAKS THE AUTH
    body = await request.json()
    session_id = body.get("session_id")
    
    if not session_id:
        raise HTTPException(status_code=400, detail="session_id required")
    
    async with httpx.AsyncClient() as http_client:
        try:
            res = await http_client.get(
                "https://demobackend.emergentagent.com/auth/v1/env/oauth/session-data",
                headers={"X-Session-ID": session_id},
                timeout=10.0
            )
            res.raise_for_status()
            data = res.json()
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Failed to fetch session data: {str(e)}")
    
    user_id = f"user_{uuid.uuid4().hex[:12]}"
    session_token = data["session_token"]
    
    existing_user = await db.users.find_one({"email": data["email"]}, {"_id": 0})
    if existing_user:
        user_id = existing_user["user_id"]
    else:
        await db.users.insert_one({
            "user_id": user_id,
            "email": data["email"],
            "name": data["name"],
            "picture": data.get("picture"),
            "created_at": datetime.now(timezone.utc)
        })
    
    await db.user_sessions.insert_one({
        "user_id": user_id,
        "session_token": session_token,
        "expires_at": datetime.now(timezone.utc) + timedelta(days=7),
        "created_at": datetime.now(timezone.utc)
    })
    
    response.set_cookie(
        key="session_token",
        value=session_token,
        httponly=True,
        secure=True,
        samesite="none",
        path="/",
        max_age=7*24*60*60
    )
    
    user_doc = await db.users.find_one({"user_id": user_id}, {"_id": 0})
    return User(**user_doc)

@api_router.get("/auth/me")
async def get_me(request: Request):
    user = await get_current_user(request)
    return user

@api_router.post("/auth/logout")
async def logout(request: Request, response: Response):
    session_token = request.cookies.get("session_token")
    if session_token:
        await db.user_sessions.delete_one({"session_token": session_token})
    
    response.delete_cookie("session_token", path="/")
    return {"message": "Logged out"}

# ====== Products Endpoints ======
@api_router.get("/products", response_model=List[Product])
async def get_products(request: Request):
    user = await get_current_user(request)
    products = await db.products.find({"user_id": user.user_id}, {"_id": 0}).to_list(1000)
    return products

@api_router.get("/products/{product_id}", response_model=Product)
async def get_product(product_id: str, request: Request):
    user = await get_current_user(request)
    product = await db.products.find_one({"product_id": product_id, "user_id": user.user_id}, {"_id": 0})
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return Product(**product)

@api_router.post("/products", response_model=Product)
async def create_product(product: ProductCreate, request: Request):
    user = await get_current_user(request)
    
    existing = await db.products.find_one({"barcode": product.barcode, "user_id": user.user_id})
    if existing:
        raise HTTPException(status_code=400, detail="Product with this barcode already exists")
    
    product_id = f"prod_{uuid.uuid4().hex[:12]}"
    
    # Calcular stock total a partir das cores
    total_stock = sum(color.quantity for color in product.colors) if product.colors else 0
    
    product_doc = {
        "product_id": product_id,
        "name": product.name,
        "barcode": product.barcode,
        "current_stock": total_stock,
        "purchase_price": product.purchase_price,
        "sale_price": product.sale_price,
        "currency": product.currency,
        "image": product.image,
        "colors": [{"color": c.color, "quantity": c.quantity} for c in product.colors],
        "created_at": datetime.now(timezone.utc),
        "user_id": user.user_id
    }
    
    await db.products.insert_one(product_doc)
    return Product(**product_doc)

@api_router.put("/products/{product_id}", response_model=Product)
async def update_product(product_id: str, product: ProductCreate, request: Request):
    user = await get_current_user(request)
    
    existing = await db.products.find_one({"product_id": product_id, "user_id": user.user_id}, {"_id": 0})
    if not existing:
        raise HTTPException(status_code=404, detail="Product not found")
    
    # Calcular stock total a partir das cores
    total_stock = sum(color.quantity for color in product.colors) if product.colors else 0
    
    update_data = {
        "name": product.name,
        "barcode": product.barcode,
        "purchase_price": product.purchase_price,
        "sale_price": product.sale_price,
        "currency": product.currency,
        "image": product.image,
        "colors": [{"color": c.color, "quantity": c.quantity} for c in product.colors],
        "current_stock": total_stock
    }
    
    await db.products.update_one({"product_id": product_id}, {"$set": update_data})
    
    updated = await db.products.find_one({"product_id": product_id}, {"_id": 0})
    return Product(**updated)

@api_router.delete("/products/{product_id}")
async def delete_product(product_id: str, request: Request):
    user = await get_current_user(request)
    result = await db.products.delete_one({"product_id": product_id, "user_id": user.user_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Product not found")
    return {"message": "Product deleted"}

@api_router.get("/products/barcode/{barcode}")
async def get_product_by_barcode(barcode: str, request: Request):
    user = await get_current_user(request)
    product = await db.products.find_one({"barcode": barcode, "user_id": user.user_id}, {"_id": 0})
    if not product:
        return {"found": False}
    return {"found": True, "product": Product(**product)}

# ====== Stock Movements Endpoints ======
@api_router.get("/movements", response_model=List[StockMovement])
async def get_movements(request: Request, product_id: Optional[str] = None):
    user = await get_current_user(request)
    query = {"user_id": user.user_id}
    if product_id:
        query["product_id"] = product_id
    movements = await db.stock_movements.find(query, {"_id": 0}).sort("date", -1).to_list(1000)
    return movements

@api_router.post("/movements", response_model=StockMovement)
async def create_movement(movement: MovementCreate, request: Request):
    user = await get_current_user(request)
    
    product = await db.products.find_one({"product_id": movement.product_id, "user_id": user.user_id}, {"_id": 0})
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    # Se o produto tem cores e uma cor específica foi fornecida
    if movement.color:
        colors = product.get("colors", [])
        color_index = next((i for i, c in enumerate(colors) if c["color"] == movement.color), None)
        
        if color_index is None:
            raise HTTPException(status_code=400, detail=f"Color '{movement.color}' not found in product")
        
        if movement.type == "saida" and colors[color_index]["quantity"] < movement.quantity:
            raise HTTPException(status_code=400, detail="Insufficient stock for this color")
        
        # Atualizar quantidade da cor específica
        if movement.type == "entrada":
            colors[color_index]["quantity"] += movement.quantity
        else:
            colors[color_index]["quantity"] -= movement.quantity
        
        # Recalcular stock total
        total_stock = sum(c["quantity"] for c in colors)
        
        await db.products.update_one(
            {"product_id": movement.product_id},
            {"$set": {"colors": colors, "current_stock": total_stock}}
        )
    else:
        # Movimento sem cor específica (comportamento antigo)
        if movement.type == "saida" and product["current_stock"] < movement.quantity:
            raise HTTPException(status_code=400, detail="Insufficient stock")
        
        if movement.type == "entrada":
            new_stock = product["current_stock"] + movement.quantity
        else:
            new_stock = product["current_stock"] - movement.quantity
        
        await db.products.update_one(
            {"product_id": movement.product_id},
            {"$set": {"current_stock": new_stock}}
        )
    
    movement_id = f"mov_{uuid.uuid4().hex[:12]}"
    movement_doc = {
        "movement_id": movement_id,
        "product_id": movement.product_id,
        "type": movement.type,
        "quantity": movement.quantity,
        "color": movement.color,
        "date": datetime.now(timezone.utc),
        "note": movement.note,
        "user_id": user.user_id
    }
    
    await db.stock_movements.insert_one(movement_doc)
    
    return StockMovement(**movement_doc)

# ====== Currency Endpoints ======
@api_router.post("/currency/convert")
async def convert_currency(conversion: ConversionRequest, request: Request):
    user = await get_current_user(request)
    
    cache_key = f"{conversion.from_currency}_{conversion.to_currency}"
    cached = await db.rates_cache.find_one({"cache_key": cache_key}, {"_id": 0})
    
    # Fix timezone comparison
    if cached and cached.get("expires_at"):
        expires_at = cached["expires_at"]
        if isinstance(expires_at, str):
            expires_at = datetime.fromisoformat(expires_at.replace('Z', '+00:00'))
        elif expires_at.tzinfo is None:
            expires_at = expires_at.replace(tzinfo=timezone.utc)
        
        if expires_at > datetime.now(timezone.utc):
            rate = cached["rate"]
        else:
            cached = None  # Force refresh
    
    if not cached or not cached.get("rate"):
        async with httpx.AsyncClient() as http_client:
            try:
                res = await http_client.get(
                    f"https://api.exchangerate-api.com/v4/latest/{conversion.from_currency}",
                    timeout=10.0
                )
                res.raise_for_status()
                data = res.json()
                rate = data["rates"].get(conversion.to_currency)
                
                if not rate:
                    raise HTTPException(status_code=400, detail="Currency not supported")
                
                await db.rates_cache.update_one(
                    {"cache_key": cache_key},
                    {"$set": {
                        "cache_key": cache_key,
                        "rate": rate,
                        "expires_at": datetime.now(timezone.utc) + timedelta(hours=1)
                    }},
                    upsert=True
                )
            except httpx.HTTPStatusError as e:
                # If API fails, try to use cached data even if expired
                if cached and cached.get("rate"):
                    rate = cached["rate"]
                    logger.warning(f"Using expired cache due to API error: {e}")
                else:
                    raise HTTPException(status_code=503, detail="Exchange rate service temporarily unavailable")
            except Exception as e:
                # Fallback to cache if available
                if cached and cached.get("rate"):
                    rate = cached["rate"]
                    logger.warning(f"Using cached rate due to error: {e}")
                else:
                    raise HTTPException(status_code=500, detail=f"Failed to fetch exchange rate: {str(e)}")
    
    converted_amount = conversion.amount * rate
    
    return {
        "from_currency": conversion.from_currency,
        "to_currency": conversion.to_currency,
        "amount": conversion.amount,
        "converted_amount": converted_amount,
        "rate": rate
    }

@api_router.get("/currency/rates/{base_currency}")
async def get_rates(base_currency: str, request: Request):
    user = await get_current_user(request)
    
    async with httpx.AsyncClient() as http_client:
        try:
            res = await http_client.get(
                f"https://api.exchangerate-api.com/v4/latest/{base_currency}",
                timeout=10.0
            )
            res.raise_for_status()
            data = res.json()
            return data
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Failed to fetch rates: {str(e)}")

# ====== Reports Endpoints ======
@api_router.get("/reports/summary")
async def get_summary(request: Request):
    user = await get_current_user(request)
    
    products_count = await db.products.count_documents({"user_id": user.user_id})
    
    products = await db.products.find({"user_id": user.user_id}, {"_id": 0}).to_list(1000)
    
    total_stock_value = sum(p["current_stock"] * p["purchase_price"] for p in products)
    total_potential_revenue = sum(p["current_stock"] * p["sale_price"] for p in products)
    
    movements = await db.stock_movements.find({"user_id": user.user_id}, {"_id": 0}).to_list(10000)
    total_entries = sum(1 for m in movements if m["type"] == "entrada")
    total_exits = sum(1 for m in movements if m["type"] == "saida")
    
    low_stock_products = [p for p in products if p["current_stock"] < 10]
    
    return {
        "products_count": products_count,
        "total_stock_value": total_stock_value,
        "total_potential_revenue": total_potential_revenue,
        "total_entries": total_entries,
        "total_exits": total_exits,
        "low_stock_count": len(low_stock_products),
        "low_stock_products": low_stock_products[:5]
    }

# ====== Support Endpoint ======
@api_router.post("/support/contact")
async def send_support_message(request: Request):
    user = await get_current_user(request)
    body = await request.json()
    
    message_id = f"msg_{uuid.uuid4().hex[:12]}"
    message_doc = {
        "message_id": message_id,
        "user_id": user.user_id,
        "subject": body.get("subject"),
        "message": body.get("message"),
        "created_at": datetime.now(timezone.utc),
        "status": "pending"
    }
    
    await db.support_messages.insert_one(message_doc)
    
    return {"message": "Message sent successfully", "message_id": message_id}

app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()