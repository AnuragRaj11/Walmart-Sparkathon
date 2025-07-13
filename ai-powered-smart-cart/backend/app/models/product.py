from pydantic import BaseModel
from typing import List

class ProductItem(BaseModel):
    name: str
    quantity: int
    unit_price: float
    subtotal: float

class ProductRequest(BaseModel):
    products: List[ProductItem]

class ProductResponse(BaseModel):
    items: List[ProductItem]
    total: float