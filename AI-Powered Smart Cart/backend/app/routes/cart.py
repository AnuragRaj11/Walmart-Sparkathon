from fastapi import APIRouter, HTTPException
from app.models.product import ProductItem, Cart, CartCreateResponse
import uuid

router = APIRouter()

CARTS = {}

PRICES = {
    "coke_can": 1.50,
    "lays_chips": 2.00,
    "oreo_pack": 1.25,
    "dettol_soap": 0.99
}

@router.post("/cart/create", response_model=CartCreateResponse)
def create_cart():
    cart_id = str(uuid.uuid4())
    CARTS[cart_id] = {"items": [], "total": 0}
    return {"cart_id": cart_id}


@router.put("/cart/update/{cart_id}", response_model=Cart)
def update_cart(cart_id: str, items: list[ProductItem]):
    if cart_id not in CARTS:
        raise HTTPException(status_code=404, detail="Cart not found")

    total = 0
    for item in items:
        price = PRICES.get(item.name, 0)
        total += price * item.quantity

    CARTS[cart_id] = {
        "items": items,
        "total": total
    }

    return {
        "cart_id": cart_id,
        "items": items,
        "total": total
    }


@router.get("/cart/{cart_id}", response_model=Cart)
def get_cart(cart_id: str):
    if cart_id not in CARTS:
        raise HTTPException(status_code=404, detail="Cart not found")

    cart = CARTS[cart_id]
    return {
        "cart_id": cart_id,
        "items": cart["items"],
        "total": cart["total"]
    }


@router.delete("/cart/{cart_id}")
def delete_cart(cart_id: str):
    if cart_id not in CARTS:
        raise HTTPException(status_code=404, detail="Cart not found")

    del CARTS[cart_id]
    return {"message": f"Cart {cart_id} deleted"}
