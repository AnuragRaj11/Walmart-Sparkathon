from fastapi import APIRouter, UploadFile, File
from app.models.product import ProductRequest, ProductResponse, ProductItem
from ai_model.detect import detect_products_from_image

router = APIRouter()

PRICE_DB = {
    "oreo_pack": 2.99,
    "coke_can": 1.49,
    "lays_chips": 2.49,
    "dettol_soap": 1.25
}

@router.post("/detect", response_model=ProductResponse)
def detect_products(req: ProductRequest):
    items = []
    total = 0.0
    for product in req.products:
        price = PRICE_DB.get(product.name, 1.0)
        subtotal = product.quantity * price
        total += subtotal
        items.append({
            "name": product.name,
            "quantity": product.quantity,
            "unit_price": price,
            "subtotal": subtotal
        })
    return {"items": items, "total": total}

@router.post("/detect-image", response_model=ProductResponse)
async def detect_from_image(file: UploadFile = File(...)):
    image_bytes = await file.read()
    detected = detect_products_from_image(image_bytes)
    return detect_products(ProductRequest(products=detected))

