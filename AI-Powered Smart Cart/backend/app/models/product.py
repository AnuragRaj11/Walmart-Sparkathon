from pydantic import BaseModel
from typing import List

class ProductItem(BaseModel):
    name: str
    quantity: int

class ProductRequest(BaseModel):
    products: List[ProductItem]

class ProductResponse(BaseModel):
    total: float
    items: List[dict]
