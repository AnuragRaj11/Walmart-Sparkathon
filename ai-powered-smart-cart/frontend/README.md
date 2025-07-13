# 🛒 AI-Powered Smart Cart Frontend

A modern React application that simulates an AI-powered smart shopping cart system where users can scan products using their camera to automatically add items to their cart.

## ✨ Features

- **📷 Product Scanning**: Use camera to scan and detect products with AI simulation
- **🛒 Smart Cart**: Automatically manages cart items with quantity controls
- **💳 Checkout Process**: Complete payment flow with multiple payment methods
- **💡 Product Suggestions**: AI-powered recommendations based on cart contents
- **📱 Responsive Design**: Works on desktop, tablet, and mobile devices
- **🎨 Modern UI**: Beautiful gradient design with smooth animations

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## 🎯 How to Use

1. **Scan Products**: Click the "🔍 Scan Product" button to simulate scanning a product with the camera
2. **Manage Cart**: Use quantity controls (+/-) to adjust item quantities or remove items
3. **View Suggestions**: See AI-powered product recommendations based on your cart
4. **Checkout**: Click "Proceed to Checkout" to complete your purchase
5. **Payment**: Choose from multiple payment methods and complete the order

## 🛠️ Technologies Used

- **React 19** - Frontend framework
- **React Webcam** - Camera integration
- **CSS3** - Modern styling with gradients and animations
- **Mock API** - Simulated backend services with product data

## 📁 Project Structure

```
src/
├── components/
│   ├── Camera.js      # Product scanning with camera
│   ├── Cart.js        # Shopping cart management
│   └── Checkout.js    # Payment and order completion
├── services/
│   └── api.js         # Mock API services
├── App.js             # Main application component
├── App.css            # Application styles
└── index.js           # Entry point
```

## 🎨 Features Showcase

- **Real-time Scanning**: Animated scanning overlay with detection feedback
- **Beautiful UI**: Modern gradient design with hover effects
- **Responsive Layout**: Adapts to all screen sizes
- **Interactive Animations**: Smooth transitions and micro-interactions
- **Product History**: Track recently scanned items
- **Order Management**: Complete checkout flow with receipt generation

## 🔧 Available Scripts

- `npm start` - Runs the app in development mode
- `npm test` - Launches the test runner
- `npm run build` - Builds the app for production
- `npm run eject` - Ejects from Create React App (one-way operation)

## 📝 Notes

This is a frontend-only implementation with mock data and simulated AI detection. The camera integration works but uses random product selection to simulate AI detection results.

For a complete shopping experience, this frontend can be connected to a real backend API with actual AI/ML product detection capabilities. 