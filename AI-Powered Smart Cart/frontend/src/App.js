import React, { useState, useEffect } from 'react';
import Camera from './components/Camera';
import Cart from './components/Cart';
import Checkout from './components/Checkout';
import { getProductSuggestions } from './services/api';
import './App.css';

function App() {
  const [currentView, setCurrentView] = useState('main'); // 'main', 'checkout'
  const [cartItems, setCartItems] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [total, setTotal] = useState(0);

  // Calculate total whenever cart items change
  useEffect(() => {
    const newTotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    setTotal(newTotal);
  }, [cartItems]);

  // Get product suggestions when cart changes
  useEffect(() => {
    if (cartItems.length > 0) {
      getProductSuggestions(cartItems).then(result => {
        if (result.success) {
          setSuggestions(result.suggestions);
        }
      });
    } else {
      setSuggestions([]);
    }
  }, [cartItems]);

  const handleProductDetected = (product) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id);
      
      if (existingItem) {
        // Increase quantity if item already exists
        return prevItems.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        // Add new item with quantity 1
        return [...prevItems, { ...product, quantity: 1 }];
      }
    });
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeItem(productId);
      return;
    }
    
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === productId
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  const removeItem = (productId) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
  };

  const addSuggestionToCart = (product) => {
    handleProductDetected(product);
  };

  const handleCheckout = () => {
    if (cartItems.length > 0) {
      setCurrentView('checkout');
    }
  };

  const handleCheckoutComplete = () => {
    setCartItems([]);
    setCurrentView('main');
    setSuggestions([]);
  };

  const handleBackToCart = () => {
    setCurrentView('main');
  };

  if (currentView === 'checkout') {
    return (
      <div className="app">
        <Checkout
          items={cartItems}
          total={total}
          onCheckoutComplete={handleCheckoutComplete}
          onBack={handleBackToCart}
        />
      </div>
    );
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>🛒 AI-Powered Smart Cart</h1>
        <p>Scan products with your camera to add them to your cart</p>
      </header>

      <div className="main-content">
        <div className="camera-section">
          <Camera onProductDetected={handleProductDetected} />
        </div>

        <div className="cart-section">
          <Cart
            items={cartItems}
            updateQuantity={updateQuantity}
            removeItem={removeItem}
            total={total}
          />
          
          {cartItems.length > 0 && (
            <div className="checkout-section">
              <button 
                onClick={handleCheckout}
                className="checkout-btn-main"
              >
                🛒 Proceed to Checkout (${total.toFixed(2)})
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Product Suggestions */}
      {suggestions.length > 0 && (
        <div className="suggestions-section">
          <h3>💡 You might also like</h3>
          <div className="suggestions-grid">
            {suggestions.map(product => (
              <div key={product.id} className="suggestion-card">
                <img src={product.image} alt={product.name} />
                <div className="suggestion-info">
                  <h4>{product.name}</h4>
                  <p className="suggestion-price">${product.price.toFixed(2)}</p>
                  <button 
                    onClick={() => addSuggestionToCart(product)}
                    className="add-suggestion-btn"
                  >
                    + Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Cart Summary Footer */}
      {cartItems.length > 0 && (
        <div className="cart-footer">
          <div className="cart-summary-footer">
            <span className="item-count">
              {cartItems.reduce((sum, item) => sum + item.quantity, 0)} items
            </span>
            <span className="total-price">Total: ${total.toFixed(2)}</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
