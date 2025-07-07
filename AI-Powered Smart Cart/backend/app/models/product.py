from pydantic import BaseModel
from typing import List, Dict, Optional

class ProductItem(BaseModel):
    name: str
    quantity: int

class ProductRequest(BaseModel):
    products: List[ProductItem]

class ProductResponse(BaseModel):
    total: float
    items: List[Dict]

class CartCreateResponse(BaseModel):
    cart_id: str

class Cart(BaseModel):
    cart_id: str
    items: List[ProductItem]
    total: float
