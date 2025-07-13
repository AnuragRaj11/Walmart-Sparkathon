from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, EmailStr
from app.routes.mail_config import send_receipt_email  

router = APIRouter(prefix="/email", tags=["Email"])

class ReceiptRequest(BaseModel):
    email: EmailStr
    items: list
    total: float

@router.post("/send-receipt")
async def send_receipt(data: ReceiptRequest):
    try:
        await send_receipt_email(
            to=data.email,
            subject="Your Smart Cart Receipt",
            html_content=generate_receipt_html(data.items, data.total)
        )
        return {"success": True, "message": "Email sent"}
    except Exception as e:
        print("Email send error:", e)  # 👈 Add this
        raise HTTPException(status_code=500, detail=str(e))


def generate_receipt_html(items: list, total: float) -> str:
    item_rows = "".join(
        f"<tr><td>{item['name']}</td><td>{item['quantity']}</td><td>${item['price']:.2f}</td></tr>"
        for item in items
    )
    return f"""
    <h3>🧾 Thank you for shopping with us!</h3>
    <table border="1" cellpadding="5">
      <tr><th>Item</th><th>Qty</th><th>Price</th></tr>
      {item_rows}
    </table>
    <h4>Total: ${total:.2f}</h4>
    """