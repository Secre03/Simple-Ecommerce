let products = JSON.parse(localStorage.getItem('products')) || [];

function saveProductsToStorage() {
  localStorage.setItem('products', JSON.stringify(products));
}

function extractProductsFromPage() {
  const productCards = document.querySelectorAll('.product-card');
  
  productCards.forEach((card, index) => {
    const img = card.querySelector('img');
    const name = card.querySelector('.product-name')?.textContent.trim();
    const priceText = card.querySelector('.product-price')?.textContent.trim();
    const price = parseFloat(priceText?.replace('$', '') || 0);
    const imageSrc = img?.src || img?.getAttribute('src') || '';
    const ratingImg = card.querySelector('.rating-stars img');
    
    let rating = { stars: 4, count: 100 };
    if (ratingImg) {
      const ratingSrc = ratingImg.src || ratingImg.getAttribute('src');
      const ratingMatch = ratingSrc.match(/rating-(\d+)/);
      if (ratingMatch) {
        rating.stars = parseInt(ratingMatch[1]) / 10;
      }
    }
    
    const productId = `product-${index + 1}`;
    
    const product = {
      id: productId,
      name: name,
      image: imageSrc,
      rating: rating,
      priceCents: Math.round(price * 100)
    };
    
    const exists = products.find(p => p.name === product.name && p.priceCents === product.priceCents);
    if (!exists) {
      products.push(product);
    }
    
    card.dataset.productId = productId;
  });
  
  saveProductsToStorage();
}

function getProduct(productId) {
  let matchingProduct;
  products.forEach((product) => {
    if (product.id === productId) {
      matchingProduct = product;
    }
  });
  return matchingProduct;
}

function renderProductsPage() {
  extractProductsFromPage();
  updateCartQuantity();

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
        window.location.href = './cart/checkout.html';
      }, 1500);
    });
  });
}