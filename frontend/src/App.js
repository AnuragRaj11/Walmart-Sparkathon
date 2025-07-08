import React, { useState } from 'react';
import Camera from './components/Camera';
import Cart from './components/Cart';
import Checkout from './components/Checkout';

function App() {
  const [items, setItems] = useState([
    { name: 'Apple', quantity: 2, price: 40 },
    { name: 'Milk', quantity: 1, price: 60 }
  ]);

  const handleCheckout = () => {
    alert("Checkout complete!");
  };

  return (
    <div style={{ padding: '30px', backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>🛍️ Smart Cart</h1>

      {/* This renders the live webcam */}
      <Camera />

      <div style={{ display: 'flex', marginTop: '30px' }}>
        {/* This renders your cart items */}
        <Cart items={items} />

        {/* This renders the total and checkout button */}
        <Checkout items={items} onCheckout={handleCheckout} />
      </div>
    </div>
  );
}

export default App;
