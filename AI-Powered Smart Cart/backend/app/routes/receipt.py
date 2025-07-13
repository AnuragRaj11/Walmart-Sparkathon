from fastapi import APIRouter, Body
from app.routes.mail_config import fast_mail, MessageSchema
from pydantic_settings import BaseSettings
from pydantic import EmailStr


router = APIRouter()

@router.post("/checkout-email")
async def send_receipt(data: dict = Body(...)):
    email = data["email"]
    items = data["items"]
    total = data["total"]

    content = "<h2>🧾 Your Smart Cart Receipt</h2><ul>"
    for item in items:
        content += f"<li>{item['name']} x{item['quantity']} = ${item['price'] * item['quantity']:.2f}</li>"
    content += f"</ul><h3>Total: ${total:.2f}</h3>"

    message = MessageSchema(
        subject="Your Smart Cart Receipt",
        recipients=[email],
        body=content,
        subtype="html"
    )

    await fast_mail.send_message(message)
    return {"success": True, "message": "Receipt sent"}
