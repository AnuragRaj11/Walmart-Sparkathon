from fastapi import APIRouter, UploadFile, File
from app.models.product import ProductRequest, ProductResponse, ProductItem
from ai_model.detect import detect_products_from_image

router = APIRouter(prefix="/products", tags=["Products"])

PRICE_DB = {
    "Oreo Pack": 2.99,
    "Coke Can": 1.49,
    "Duracell Batteries": 3.99,
}

@router.post("/detect", response_model=ProductResponse)
async def detect_products(req: ProductRequest):
    items = []
    total = 0.0
    for product in req.products:
        price = PRICE_DB.get(product.name, 1.0)
        subtotal = product.quantity * price
        total += subtotal
        items.append(ProductItem(
            name=product.name,
            quantity=product.quantity,
            unit_price=price,
            subtotal=subtotal
        ))
    return ProductResponse(items=items, total=total)

@router.post("/detect-image", response_model=ProductResponse)
async def detect_from_image(file: UploadFile = File(...)):
    image_bytes = await file.read()
    filename = file.filename
    detected = detect_products_from_image(image_bytes, filename)
    return await detect_products(ProductRequest(products=detected))