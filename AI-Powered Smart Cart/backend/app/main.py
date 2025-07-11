from fastapi import FastAPI
from app.routes import products, cart

app = FastAPI(
    title="AI-Powered Smart Cart API",
    description="Backend for Walmart Sparkathon Project",
    version="1.0.0"
)

app.include_router(products.router, prefix="/api")
app.include_router(cart.router, prefix="/api")

@app.get("/", tags=["Root"])
async def root():
    return {"message": "AI-Powered Smart Cart Backend Running"}