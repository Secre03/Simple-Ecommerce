// main.js - Main Application Initialization
// This is the entry point that ties everything together

document.addEventListener('DOMContentLoaded', () => {
  const currentPage = window.location.pathname;
  
  // Products page
  if (currentPage.includes('products.html')) {
    renderProductsPage();
    initSearch();
  }
  
  // Home page / Index
  if (currentPage.includes('index.html') || currentPage.endsWith('/')) {
    extractProductsFromPage();
    updateCartQuantity();
    initSubscription();
    
    document.querySelectorAll('.btn-add-cart').forEach((button) => {
      const parentLink = button.closest('a');
      if (parentLink) {
        const parent = parentLink.parentNode;
        parent.insertBefore(button, parentLink);
        parentLink.remove();
      }

      button.addEventListener('click', (e) => {
        e.preventDefault();
        
        const productCard = button.closest('.product-card');
        const productId = productCard.dataset.productId;
        
        const quantitySelect = productCard.querySelector('.quantity-select');
        const quantity = quantitySelect ? parseInt(quantitySelect.value) : 1;
        
        addToCart(productId, quantity);
        updateCartQuantity();
        showNotification('Item added to cart! Redirecting to checkout...', 1500);
        
        setTimeout(() => {
          window.location.href = './pages/cart/checkout.html';
        }, 1500);
      });
    });
  }
  
  // Checkout page
  if (currentPage.includes('checkout.html')) {
    renderCheckoutPage();
  }
  
  // Orders page
  if (currentPage.includes('orders.html')) {
    renderOrdersPage();
    updateCartQuantity();
  }
  
  // Tracking page
  if (currentPage.includes('tracking.html')) {
    renderTrackingPage();
    updateCartQuantity();
  }
  
  // Update cart quantity on all pages
  updateCartQuantity();
});