// Mock API service for Smart Cart
// Since we're not modifying the backend, this simulates all API calls

// Mock product database - No sample products
const MOCK_PRODUCTS = [];

// Simulate network delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Mock AI detection service
export const detectProduct = async (imageData) => {
  await delay(1000); // Simulate processing time
  
  // Return failure if no products available
  if (MOCK_PRODUCTS.length === 0) {
    return {
      success: false,
      error: "No products available for detection",
      detectedAt: new Date().toISOString()
    };
  }
  
  // Randomly select a product to simulate detection
  const randomProduct = MOCK_PRODUCTS[Math.floor(Math.random() * MOCK_PRODUCTS.length)];
  
  // Simulate detection confidence
  const confidence = 0.8 + Math.random() * 0.2; // 80-100% confidence
  
  return {
    success: true,
    product: randomProduct,
    confidence: confidence,
    detectedAt: new Date().toISOString()
  };
};

// Get all products
export const getAllProducts = async () => {
  await delay(500);
  return {
    success: true,
    products: MOCK_PRODUCTS
  };
};

// Get product by ID
export const getProductById = async (id) => {
  await delay(300);
  const product = MOCK_PRODUCTS.find(p => p.id === id);
  return {
    success: !!product,
    product: product || null
  };
};

// Search products
export const searchProducts = async (query) => {
  await delay(400);
  const results = MOCK_PRODUCTS.filter(product => 
    product.name.toLowerCase().includes(query.toLowerCase()) ||
    product.category.toLowerCase().includes(query.toLowerCase())
  );
  
  return {
    success: true,
    products: results
  };
};

// Mock checkout process
export const processCheckout = async (items, paymentMethod) => {
  await delay(2000); // Simulate payment processing
  
  const orderId = Math.random().toString(36).substr(2, 9).toUpperCase();
  const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  return {
    success: true,
    orderId: orderId,
    total: total,
    paymentMethod: paymentMethod,
    processedAt: new Date().toISOString(),
    items: items
  };
};

// Get product suggestions based on cart
export const getProductSuggestions = async (cartItems) => {
  await delay(600);
  
  // Simple logic: suggest products from different categories
  const cartCategories = cartItems.map(item => item.category);
  const suggestions = MOCK_PRODUCTS.filter(product => 
    !cartCategories.includes(product.category) &&
    !cartItems.find(item => item.id === product.id)
  ).slice(0, 3);
  
  return {
    success: true,
    suggestions: suggestions
  };
};
