# 🛒 AI-Powered Smart Cart

Welcome to the **AI-Powered Smart Cart** repository!  
This project was built for the Walmart Sparkathon and aims to redefine the shopping experience using AI, IoT, and smart automation.

---

## 🚀 Project Overview

The AI-Powered Smart Cart is an intelligent shopping cart system designed to automate billing, enhance customer convenience, and reduce checkout times. It leverages computer vision, sensors, and a user-friendly web interface to create a seamless and futuristic in-store experience.

---

## ✨ Features

- **Automated Item Scanning**: Recognizes and adds items to the cart automatically using AI/computer vision.
- **Real-Time Cart Tracking**: Keeps track of items and their quantities in real-time.
- **Instant Billing**: Instantly calculates and displays the total bill.
- **Digital Receipt**: Sends an email receipt to the customer upon payment.
- **User-Friendly Dashboard**: Interactive web interface for cart management and checkout.
- **Secure Payment Integration**: (Optional/future) Integrates with popular payment gateways.

---

## 🛠️ Tech Stack

- **Backend**: Python, FastAPI
- **Frontend**: JavaScript, HTML, CSS
- **Email Service**: SMTP (Gmail)
- **Other**: Computer Vision (OpenCV or similar - if implemented), IoT device integration (future scope)

---

## 📁 Project Structure

```
backend/
│   ├── main.py                # FastAPI entry point
│   ├── routes/                # API route definitions
│   ├── models/                # Pydantic models and data schemas
│   ├── mail_config.py         # Email sending logic
│   ├── ...                    # Other backend files
frontend/
│   ├── index.html             # Main web UI
│   ├── static/                # JS, CSS, images
│   └── ...                    # Other frontend files
README.md
```

---

## 🚦 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/AnuragRaj11/Walmart-Sparkathon.git
cd Walmart-Sparkathon
```

### 2. Backend Setup

- Make sure you have Python 3.9+ installed.
- Create and activate a virtual environment (optional but recommended):

    ```bash
    python -m venv venv
    source venv/bin/activate   # or venv\Scripts\activate on Windows
    ```

- Install dependencies:

    ```bash
    pip install -r requirements.txt
    ```

- Create a `.env` file in `backend/` with your email credentials:

    ```
    MAIL_USERNAME=your_real_gmail@gmail.com
    MAIL_PASSWORD=your_app_password
    MAIL_FROM=your_real_gmail@gmail.com
    MAIL_PORT=587
    MAIL_SERVER=smtp.gmail.com
    MAIL_STARTTLS=True
    MAIL_SSL_TLS=False
    ```

- Run the backend server:

    ```bash
    uvicorn main:app --reload
    ```

### 3. Frontend Setup

- Open `frontend/index.html` in your browser, or deploy using a simple HTTP server:

    ```bash
    cd frontend
    python -m http.server 8001
    ```

- The app should now connect to the backend at `http://127.0.0.1:8000`.

---

## 📧 Email Sending Setup

- Ensure [2-Step Verification](https://myaccount.google.com/security) is **enabled** on your Gmail account.
- Generate an [App Password](https://myaccount.google.com/apppasswords) and use it as `MAIL_PASSWORD` in your `.env`.

---

## 🤖 Future Improvements

- Hardware integration with smart cart (RFID, barcode, weight sensors)
- Enhanced AI for product recognition
- Mobile app support
- Real payment gateway integration (Stripe, Razorpay, etc.)
- User authentication & profile management

---

## 🤝 Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

## 🙌 Acknowledgements

- [Walmart Sparkathon](https://www.walmart.com)
- Open Source Community

---

**Happy Shopping! 🛍️**