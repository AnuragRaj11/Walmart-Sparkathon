from fastapi import FastAPI
from app.routes import products, cart

app = FastAPI()

app.include_router(products.router)
app.include_router(cart.router)

@app.get("/")
def root():
    return {"message": "Walmart Smart Cart Backend"}
