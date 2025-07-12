from fastapi import FastAPI
from app.routes import products, cart, send_email

app = FastAPI(
    title="AI-Powered Smart Cart API",
    description="Backend for Walmart Sparkathon Project",
    version="1.0.0"
)

app.include_router(products.router, prefix="/api")
app.include_router(cart.router, prefix="/api")
app.include_router(send_email.router, prefix="/api")