from fastapi import APIRouter
from app.models.product import ProductRequest, ProductResponse

router = APIRouter()

# Simulated product price database
PRODUCT_DB = {
    "coke_can": 1.50,
    "lays_chips": 2.00,
    "oreo_pack": 1.25,
    "dettol_soap": 0.99
}

@router.post("/detect", response_model=ProductResponse)
def detect_products(req: ProductRequest):
    total = 0
    detailed_items = []

    for item in req.products:
        price = PRODUCT_DB.get(item.name, 0)
        subtotal = price * item.quantity
        total += subtotal
        detailed_items.append({
            "name": item.name,
            "quantity": item.quantity,
            "unit_price": price,
            "subtotal": subtotal
        })

    return {"total": total, "items": detailed_items}
