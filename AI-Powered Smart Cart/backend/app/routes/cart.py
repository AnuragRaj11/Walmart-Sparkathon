from fastapi import APIRouter
from app.routes.send_email import ReceiptRequest  

router = APIRouter(prefix="/cart", tags=["Cart"])

