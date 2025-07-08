import React from 'react';

const Cart = ({ items }) => {
  return (
    <div style={{
      backgroundColor: '#ffffff',
      padding: '20px',
      borderRadius: '12px',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
      width: '100%',
      maxHeight: '300px',
      overflowY: 'auto',
      flex: 1,
    }}>
      <h2 style={{ marginBottom: '16px', color: '#2c3e50' }}>🛒 Detected Items</h2>
      {items.length === 0 ? (
        <p style={{ color: '#999' }}>No items detected yet.</p>
      ) : (
        items.map((item, index) => (
          <div
            key={index}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '12px',
              padding: '10px 14px',
              backgroundColor: '#f8f9fa',
              borderRadius: '8px',
            }}
          >
            <span style={{ fontWeight: 'bold' }}>{item.name}</span>
            <span>Qty: {item.quantity}</span>
            <span>₹{item.price}</span>
          </div>
        ))
      )}
    </div>
  );
};

export default Cart;
