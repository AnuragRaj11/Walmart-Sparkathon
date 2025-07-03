from fastapi import FastAPI
from app.routes import products

app = FastAPI()

app.include_router(products.router)

@app.get("/")
def root():
    return {"message": "Walmart Smart Cart Backend"}
