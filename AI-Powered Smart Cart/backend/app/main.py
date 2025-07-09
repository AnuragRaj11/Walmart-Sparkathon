from fastapi import FastAPI
from app.routes import products, cart

app = FastAPI()

app.include_router(products.router, prefix="/api")
app.include_router(cart.router, prefix="/api")

@app.get("/")
def root():
    return {"message": "AI-Powered Smart Cart Backend Running"}