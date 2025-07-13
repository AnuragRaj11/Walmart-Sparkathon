from fastapi import FastAPI
from app.routes import products, cart, send_email

app = FastAPI(
    title="AI-Powered Smart Cart API",
    description="Backend for Walmart Sparkathon Project",
    version="1.0.0"
)
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="AI-Powered Smart Cart API",
    description="Backend for Walmart Sparkathon Project",
    version="1.0.0"
)

origins = [
    "http://localhost:3000",  
    "http://127.0.0.1:3000"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"], 
    allow_headers=["*"],
)


app.include_router(products.router, prefix="/api")
app.include_router(cart.router, prefix="/api")
app.include_router(send_email.router, prefix="/api")