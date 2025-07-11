
const MOCK_PRODUCTS = [];


const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));


export const detectProduct = async (imageData) => {
  await delay(1000);


  if (MOCK_PRODUCTS.length === 0) {
    return {
      success: false,
      error: "No products available for detection",
      detectedAt: new Date().toISOString()
    };
  }

  const randomProduct = MOCK_PRODUCTS[Math.floor(Math.random() * MOCK_PRODUCTS.length)];


  const confidence = 0.8 + Math.random() * 0.2; 

  return {
    success: true,
    product: randomProduct,
    confidence: confidence,
    detectedAt: new Date().toISOString()
  };
};

export const getAllProducts = async () => {
  await delay(500);
  return {
    success: true,
    products: MOCK_PRODUCTS
  };
};


export const getProductById = async (id) => {
  await delay(300);
  const product = MOCK_PRODUCTS.find(p => p.id === id);
  return {
    success: !!product,
    product: product || null
  };
};


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


export const processCheckout = async (items, paymentMethod) => {
  await delay(2000);

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

export const getProductSuggestions = async (cartItems) => {
  await delay(600);

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
