function renderCheckoutPage() {
  const ordersList = document.querySelector('.orders-list');
  if (!ordersList) return;
  
  renderOrderSummary();
  renderPaymentSummary();
}

function renderOrderSummary() {
  let cartSummaryHTML = '';

  cart.forEach((cartItem) => {
    const deliveryOptionId = cartItem.deliveryOptionId;
    const deliveryOption = getDeliveryOption(deliveryOptionId);
    const dateString = calculateDeliveryDate(deliveryOption);

    cartSummaryHTML += `
      <div class="order-card js-cart-item-container-${cartItem.productId}">
        <p class="delivery-status">Delivery date: ${dateString}</p>
        <div class="order-content">
          <div class="row g-3">
            <div class="col-md-6">
              <div class="product-details d-flex gap-3">
                <img class="product-image" src="${cartItem.image}" alt="${cartItem.name}">
                <div class="product-info">
                  <p class="product-name mb-2">${cartItem.name}</p>
                  <p class="product-price mb-2">$${(cartItem.priceCents / 100).toFixed(2)}</p>
                  <div class="quantity-controls">
                    Quantity: <span class="quantity-label">${cartItem.quantity}</span>
                    <span class="action-link update-link js-update-link" data-product-id="${cartItem.productId}">Update</span>
                    <span class="action-link delete-link js-delete-link" data-product-id="${cartItem.productId}">Delete</span>
                  </div>
                  <input class="quantity-input js-quantity-input-${cartItem.productId}" type="number" value="${cartItem.quantity}" min="1" max="10" style="display: none;">
                  <span class="save-quantity-link link-primary js-save-link" data-product-id="${cartItem.productId}" style="display: none;">Save</span>
                </div>
              </div>
            </div>
            <div class="col-md-6">
              <div class="delivery-options-section">
                <div class="delivery-options-title">Choose a delivery option:</div>
                ${renderDeliveryOptions(cartItem)}
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  });

  const ordersList = document.querySelector('.orders-list');
  
  if (cart.length === 0) {
    ordersList.innerHTML = `
      <div class="text-center py-5">
        <h3>Your cart is empty</h3>
        <p class="mb-4">Add some products to get started!</p>
        <a href="../products.html" class="btn btn-primary">Continue Shopping</a>
      </div>
    `;
  } else {
    ordersList.innerHTML = cartSummaryHTML;
  }

  attachCheckoutEventListeners();
  updateCartQuantity();
}

function renderDeliveryOptions(cartItem) {
  let html = '';

  deliveryOptions.forEach((deliveryOption) => {
    const dateString = calculateDeliveryDate(deliveryOption);
    const priceString = deliveryOption.priceCents === 0
      ? 'FREE'
      : `$${(deliveryOption.priceCents / 100).toFixed(2)} -`;
    
    const isChecked = deliveryOption.id === cartItem.deliveryOptionId;

    html += `
      <div class="form-check delivery-option">
        <input ${isChecked ? 'checked' : ''} 
          class="form-check-input js-delivery-option" 
          type="radio" 
          name="delivery-option-${cartItem.productId}"
          data-product-id="${cartItem.productId}"
          data-delivery-option-id="${deliveryOption.id}">
        <label class="form-check-label">
          <div class="delivery-date">${dateString}</div>
          <div class="delivery-price">${priceString} Shipping</div>
        </label>
      </div>
    `;
  });

  return html;
}

function attachCheckoutEventListeners() {
  document.querySelectorAll('.js-delete-link').forEach((link) => {
    link.addEventListener('click', () => {
      const productId = link.dataset.productId;
      removeFromCart(productId);
      renderCheckoutPage();
      showNotification('Item removed from cart');
    });
  });

  document.querySelectorAll('.js-update-link').forEach((link) => {
    link.addEventListener('click', () => {
      const productId = link.dataset.productId;
      
      const container = document.querySelector(`.js-cart-item-container-${productId}`);
      container.classList.add('is-editing-quantity');
      
      const input = document.querySelector(`.js-quantity-input-${productId}`);
      const saveLink = document.querySelector(`.js-save-link[data-product-id="${productId}"]`);
      
      input.style.display = 'inline-block';
      saveLink.style.display = 'inline-block';
      link.style.display = 'none';
    });
  });

  document.querySelectorAll('.js-save-link').forEach((link) => {
    link.addEventListener('click', () => {
      const productId = link.dataset.productId;
      
      const input = document.querySelector(`.js-quantity-input-${productId}`);
      const newQuantity = parseInt(input.value);
      
      if (newQuantity < 1 || newQuantity >= 1000) {
        alert('Quantity must be at least 1 and less than 1000');
        return;
      }
      
      updateQuantity(productId, newQuantity);
      renderCheckoutPage();
      showNotification('Quantity updated');
    });
  });

  document.querySelectorAll('.js-delivery-option').forEach((element) => {
    element.addEventListener('click', () => {
      const { productId, deliveryOptionId } = element.dataset;
      updateDeliveryOption(productId, deliveryOptionId);
      renderCheckoutPage();
    });
  });

  const placeOrderButton = document.querySelector('.btn-place-order');
  if (placeOrderButton) {
    const parentLink = placeOrderButton.closest('a');
    if (parentLink) {
      const parent = parentLink.parentNode;
      parent.insertBefore(placeOrderButton, parentLink);
      parentLink.remove();
    }

    placeOrderButton.addEventListener('click', (e) => {
      e.preventDefault();
      
      if (cart.length === 0) {
        showNotification('Your cart is empty!');
        return;
      }
      
      saveOrder();
      cart = [];
      saveToStorage();
      
      showNotification('Order placed successfully! Redirecting...', 2000);
      
      setTimeout(() => {
        window.location.href = 'orders.html';
      }, 2000);
    });
  }
}

function renderPaymentSummary() {
  let productPriceCents = 0;
  let shippingPriceCents = 0;

  cart.forEach((cartItem) => {
    productPriceCents += cartItem.priceCents * cartItem.quantity;
    const deliveryOption = getDeliveryOption(cartItem.deliveryOptionId);
    shippingPriceCents += deliveryOption.priceCents;
  });

  const totalBeforeTaxCents = productPriceCents + shippingPriceCents;
  const taxCents = totalBeforeTaxCents * 0.1;
  const totalCents = totalBeforeTaxCents + taxCents;

  const paymentSummaryHTML = `
    <div class="summary-title">Order Summary</div>
    
    <div class="summary-row">
      <div>Items (${calculateCartQuantity()}):</div>
      <div class="summary-amount">$${(productPriceCents / 100).toFixed(2)}</div>
    </div>
    
    <div class="summary-row">
      <div>Shipping &amp; handling:</div>
      <div class="summary-amount">$${(shippingPriceCents / 100).toFixed(2)}</div>
    </div>
    
    <div class="summary-row subtotal-row">
      <div>Total before tax:</div>
      <div class="summary-amount">$${(totalBeforeTaxCents / 100).toFixed(2)}</div>
    </div>
    
    <div class="summary-row">
      <div>Estimated tax (10%):</div>
      <div class="summary-amount">$${(taxCents / 100).toFixed(2)}</div>
    </div>
    
    <div class="summary-row total-row">
      <div>Order total:</div>
      <div class="summary-amount">$${(totalCents / 100).toFixed(2)}</div>
    </div>
    
    <button class="btn-place-order w-100">Place your order</button>
  `;

  const paymentSummary = document.querySelector('.payment-summary-card');
  if (paymentSummary) {
    paymentSummary.innerHTML = paymentSummaryHTML;
  }

  const itemsCount = document.querySelector('.items-count');
  if (itemsCount) {
    itemsCount.textContent = calculateCartQuantity();
  }

  const placeOrderButton = document.querySelector('.btn-place-order');
  if (placeOrderButton) {
    placeOrderButton.addEventListener('click', (e) => {
      e.preventDefault();
      
      if (cart.length === 0) {
        showNotification('Your cart is empty!');
        return;
      }
      
      saveOrder();
      cart = [];
      saveToStorage();
      
      showNotification('Order placed successfully! Redirecting...', 2000);
      
      setTimeout(() => {
        window.location.href = 'orders.html';
      }, 2000);
    });
  }
}