import React from 'react';

const Cart = ({ items, updateQuantity, removeItem, total }) => {
  return (
    <div className="cart-container">
      <h2>🛒 Your Cart</h2>
      {items.length === 0 ? (
        <div className="empty-cart">
          <p>Your cart is empty</p>
          <p>Scan items with the camera to add them!</p>
        </div>
      ) : (
        <>
          <div className="cart-items">
            {items.map((item) => (
              <div key={item.id} className="cart-item">
                <div className="item-image">
                  <img src={item.image} alt={item.name} />
                </div>
                <div className="item-details">
                  <h4>{item.name}</h4>
                  <p className="item-price">${item.price.toFixed(2)}</p>
                  <div className="quantity-controls">
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                      className="quantity-btn"
                    >
                      -
                    </button>
                    <span className="quantity">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="quantity-btn"
                    >
                      +
                    </button>
                  </div>
                </div>
                <div className="item-total">
                  <p>${(item.price * item.quantity).toFixed(2)}</p>
                  <button 
                    onClick={() => removeItem(item.id)}
                    className="remove-btn"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="cart-summary">
            <div className="total">
              <h3>Total: ${total.toFixed(2)}</h3>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;
