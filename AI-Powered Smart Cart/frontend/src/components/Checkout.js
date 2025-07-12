import React, { useState, useEffect } from 'react';
import { getAuth } from "firebase/auth";

const Checkout = ({ items, total, onCheckoutComplete, onBack, user }) => {
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

    // Basic frontend email validation
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      alert("Please enter a valid email address.");
      setLoading(false);
      return;
    }

    setTimeout(async () => {
      setLoading(false);
      setOrderComplete(true);

      if (email.trim()) {
        try {
          const response = await fetch("http://127.0.0.1:8000/checkout-email", {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              email: email,
              items: items,
              total: total
            })
          });

          const data = await response.json();
          if (data.success) {
            setEmailSent(true);
            console.log("\u{1F4E7} Email sent successfully");
          } else {
            console.warn("\u{274C} Failed to send email:", data.message);
          }
        } catch (error) {
          console.error("\u{274C} Email API Error:", error);
        }
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
            <label className={`payment-option ${paymentMethod === 'card' ? 'selected' : ''}`}>
              <input
                type="radio"
                value="card"
                checked={paymentMethod === 'card'}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              <span className="payment-icon">💳</span>
              Credit/Debit Card
            </label>

            <label className={`payment-option ${paymentMethod === 'digital' ? 'selected' : ''}`}>
              <input
                type="radio"
                value="digital"
                checked={paymentMethod === 'digital'}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              <span className="payment-icon">📱</span>
              Digital Wallet
            </label>

            <label className={`payment-option ${paymentMethod === 'cash' ? 'selected' : ''}`}>
              <input
                type="radio"
                value="cash"
                checked={paymentMethod === 'cash'}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              <span className="payment-icon">💵</span>
              Cash
            </label>
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
            {loading ? (
              <>
                <span className="loading-spinner">⏳</span>
                Processing...
              </>
            ) : (
              `Pay $${total.toFixed(2)}`
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
