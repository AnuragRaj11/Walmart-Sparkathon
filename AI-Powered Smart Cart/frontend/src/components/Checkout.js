import React, { useState, useEffect } from 'react';
import { getAuth } from "firebase/auth";

const Checkout = ({ items, total, onCheckoutComplete, onBack }) => {
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [loading, setLoading] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [email, setEmail] = useState('');
  const [emailSent, setEmailSent] = useState(false);

  useEffect(() => {
    const auth = getAuth();
    const currentUser = auth.currentUser;
    if (currentUser && currentUser.email) {
      setEmail(currentUser.email);
    }
  }, []);

  const handleCheckout = async () => {
    setLoading(true);

    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      alert("Please enter a valid email address.");
      setLoading(false);
      return;
    }

    setTimeout(async () => {
      setLoading(false);
      setOrderComplete(true);

      try {
        const response = await fetch("http://127.0.0.1:8000/api/email/send-receipt", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            email,
            items,
            total
          })
        });

        const data = await response.json();
        if (data.success) {
          setEmailSent(true);
          console.log("📧 Receipt sent to:", email);
        } else {
          console.warn("❌ Failed to send email:", data.message);
        }
      } catch (error) {
        console.error("❌ Error sending receipt:", error);
      }

      setTimeout(() => {
        onCheckoutComplete();
      }, 3000);
    }, 2000);
  };

  if (orderComplete) {
    return (
      <div className="checkout-container">
        <div className="order-success">
          <div className="success-icon">✅</div>
          <h2>Order Complete!</h2>
          <p>Thank you for your purchase</p>
          <p>Order ID: #{Math.random().toString(36).substr(2, 9).toUpperCase()}</p>
          <div className="receipt">
            <h4>Receipt</h4>
            {items.map(item => (
              <div key={item.id} className="receipt-item">
                <span>{item.name} x{item.quantity}</span>
                <span>${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
            <div className="receipt-total">
              <strong>Total: ${total.toFixed(2)}</strong>
            </div>
            {emailSent && (
              <p className="success-msg">📧 Receipt sent to <strong>{email}</strong></p>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-container">
      <div className="checkout-header">
        <button onClick={onBack} className="back-btn">← Back to Cart</button>
        <h2>💳 Checkout</h2>
      </div>

      <div className="checkout-content">
        <div className="order-summary">
          <h3>Order Summary</h3>
          <div className="summary-items">
            {items.map(item => (
              <div key={item.id} className="summary-item">
                <img src={item.image} alt={item.name} className="summary-image" />
                <div className="summary-details">
                  <span className="summary-name">{item.name}</span>
                  <span className="summary-quantity">Qty: {item.quantity}</span>
                </div>
                <span className="summary-price">${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="summary-total">
            <h3>Total: ${total.toFixed(2)}</h3>
          </div>
        </div>

        <div className="payment-section">
          <h3>Payment Method</h3>
          <div className="payment-options">
            {["card", "digital", "cash"].map(method => (
              <label key={method} className={`payment-option ${paymentMethod === method ? 'selected' : ''}`}>
                <input
                  type="radio"
                  value={method}
                  checked={paymentMethod === method}
                  onChange={() => setPaymentMethod(method)}
                />
                <span className="payment-icon">
                  {method === "card" ? "💳" : method === "digital" ? "📱" : "💵"}
                </span>
                {method === "card" ? "Credit/Debit Card" :
                  method === "digital" ? "Digital Wallet" : "Cash"}
              </label>
            ))}
          </div>

          <div className="email-input">
            <label htmlFor="email">Email for Receipt:</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
          </div>

          <button
            onClick={handleCheckout}
            disabled={loading || items.length === 0}
            className="checkout-btn"
          >
            {loading ? "⏳ Processing..." : `Pay $${total.toFixed(2)}`}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
