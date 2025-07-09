from pydantic import BaseModel
from typing import List

class ProductItem(BaseModel):
    name: str
    quantity: int

class ProductRequest(BaseModel):
    products: List[ProductItem]

class ProductDetail(BaseModel):
    name: str
    quantity: int
    unit_price: float
    subtotal: float

class ProductResponse(BaseModel):
    items: List[ProductDetail]
    total: float