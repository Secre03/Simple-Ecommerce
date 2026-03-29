function saveOrder() {
  const orders = JSON.parse(localStorage.getItem('orders')) || [];
  
  const newOrder = {
    id: generateOrderId(),
    orderTime: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric' }),
    totalCostCents: calculateOrderTotal(),
    products: cart.map(cartItem => {
      const deliveryOption = getDeliveryOption(cartItem.deliveryOptionId);
      
      return {
        productId: cartItem.productId,
        quantity: cartItem.quantity,
        estimatedDeliveryTime: calculateDeliveryDate(deliveryOption),
        name: cartItem.name,
        image: cartItem.image,
        priceCents: cartItem.priceCents
      };
    })
  };
  
  orders.unshift(newOrder);
  localStorage.setItem('orders', JSON.stringify(orders));
}

function calculateOrderTotal() {
  let total = 0;
  
  cart.forEach((cartItem) => {
    total += cartItem.priceCents * cartItem.quantity;
    const deliveryOption = getDeliveryOption(cartItem.deliveryOptionId);
    total += deliveryOption.priceCents;
  });
  
  const tax = total * 0.1;
  return Math.round(total + tax);
}

function generateOrderId() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

function renderOrdersPage() {
  const ordersGrid = document.querySelector('.orders-container-grid');
  if (!ordersGrid) return;
  
  const orders = JSON.parse(localStorage.getItem('orders')) || [];
  
  if (orders.length === 0) {
    ordersGrid.innerHTML = `
      <div class="text-center py-5">
        <h3>No orders yet</h3>
        <p class="mb-4">Start shopping to see your orders here!</p>
        <a href="../products.html" class="btn btn-primary">Shop Now</a>
      </div>
    `;
    return;
  }
  
  let ordersHTML = '';
  
  orders.forEach((order) => {
    ordersHTML += `
      <div class="order-wrapper">
        <div class="order-header-section">
          <div class="order-header-left">
            <div class="order-info-item">
              <div class="order-label">Order Placed:</div>
              <div>${order.orderTime}</div>
            </div>
            <div class="order-info-item">
              <div class="order-label">Total:</div>
              <div>$${(order.totalCostCents / 100).toFixed(2)}</div>
            </div>
          </div>
          <div class="order-header-right">
            <div class="order-label">Order ID:</div>
            <div>${order.id}</div>
          </div>
        </div>
        <div class="order-details-section">
          ${renderOrderProducts(order)}
        </div>
      </div>
    `;
  });
  
  ordersGrid.innerHTML = ordersHTML;
  
  document.querySelectorAll('.btn-buy-again').forEach(button => {
    button.addEventListener('click', () => {
      const productData = JSON.parse(button.dataset.product);
      
      cart.push({
        productId: productData.productId,
        quantity: 1,
        deliveryOptionId: '1',
        name: productData.name,
        image: productData.image,
        priceCents: productData.priceCents
      });
      
      saveToStorage();
      updateCartQuantity();
      showNotification('Item added to cart!');
    });
  });
}

function renderOrderProducts(order) {
  let productsHTML = '';
  
  order.products.forEach((product, index) => {
    productsHTML += `
      <div class="row g-3 ${index < order.products.length - 1 ? 'mb-4 pb-4 border-bottom' : ''}">
        <div class="col-lg-2 col-md-3 col-12">
          <div class="product-image-wrapper text-center">
            <img src="${product.image}" alt="${product.name}">
          </div>
        </div>
        <div class="col-lg-7 col-md-5 col-12">
          <div class="product-info-section">
            <div class="product-title">${product.name}</div>
            <div class="delivery-date">Arriving on: ${product.estimatedDeliveryTime}</div>
            <div class="product-qty">Quantity: ${product.quantity}</div>
            <button class="btn-buy-again" data-product='${JSON.stringify(product)}'>
              <img class="buy-icon" src="../../assets/logo/buy-again.png" alt="buy again">
              <span>Buy it again</span>
            </button>
          </div>
        </div>
        <div class="col-lg-3 col-md-4 col-12">
          <div class="product-actions-section">
            <a href="./tracking.html?orderId=${order.id}&productId=${product.productId}">
              <button class="btn-track-package">Track package</button>
            </a>
          </div>
        </div>
      </div>
    `;
  });
  
  return productsHTML;
}