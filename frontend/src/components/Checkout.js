import React from 'react';

const Checkout = ({ items, onCheckout }) => {
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div style={{
      backgroundColor: '#ffffff',
      padding: '20px',
      borderRadius: '12px',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
      width: '280px',
      marginLeft: '20px',
      height: 'fit-content'
    }}>
      <h2 style={{ color: '#2c3e50' }}>🧾 Cart Summary</h2>
      <p style={{ fontSize: '16px', margin: '12px 0' }}>
        Total Items: <strong>{totalItems}</strong>
      </p>
      <p style={{ fontSize: '16px', margin: '12px 0' }}>
        Total Price: <strong>₹{totalPrice}</strong>
      </p>

      <button
        onClick={onCheckout}
        style={{
          backgroundColor: '#27ae60',
          color: '#fff',
          border: 'none',
          padding: '12px 18px',
          borderRadius: '8px',
          fontSize: '16px',
          fontWeight: 'bold',
          marginTop: '20px',
          width: '100%',
          cursor: 'pointer',
          transition: 'background 0.3s',
        }}
        onMouseOver={(e) => e.target.style.backgroundColor = '#1e8449'}
        onMouseOut={(e) => e.target.style.backgroundColor = '#27ae60'}
      >
        ✅ Checkout
      </button>
    </div>
  );
};

export default Checkout;
