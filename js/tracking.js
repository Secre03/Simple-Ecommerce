function renderTrackingPage() {
  const urlParams = new URLSearchParams(window.location.search);
  const orderId = urlParams.get('orderId');
  const productId = urlParams.get('productId');
  
  if (!orderId || !productId) {
    document.querySelector('.tracking-content').innerHTML = `
      <div class="text-center py-5">
        <h3>Invalid tracking information</h3>
        <p class="mb-4">No order or product specified</p>
        <a href="./orders.html" class="btn btn-primary">Back to Orders</a>
      </div>
    `;
    return;
  }
  
  const orders = JSON.parse(localStorage.getItem('orders')) || [];
  const order = orders.find(o => o.id === orderId);
  
  if (!order) {
    document.querySelector('.tracking-content').innerHTML = `
      <div class="text-center py-5">
        <h3>Order not found</h3>
        <p class="mb-4">This order doesn't exist</p>
        <a href="./orders.html" class="btn btn-primary">Back to Orders</a>
      </div>
    `;
    return;
  }
  
  const product = order.products.find(p => p.productId === productId);
  
  if (!product) {
    document.querySelector('.tracking-content').innerHTML = `
      <div class="text-center py-5">
        <h3>Product not found</h3>
        <p class="mb-4">This product doesn't exist in the order</p>
        <a href="./orders.html" class="btn btn-primary">Back to Orders</a>
      </div>
    `;
    return;
  }
  
  const orderDate = new Date();
  const deliveryDate = new Date(product.estimatedDeliveryTime);
  const today = new Date();
  
  let status = 'preparing';
  let progressPercentage = 0;
  
  const daysUntilDelivery = Math.ceil((deliveryDate - today) / (1000 * 60 * 60 * 24));
  
  if (daysUntilDelivery <= 0) {
    status = 'delivered';
    progressPercentage = 100;
  } else if (daysUntilDelivery <= 3) {
    status = 'shipped';
    progressPercentage = 50;
  } else {
    status = 'preparing';
    progressPercentage = 0;
  }
  
  const trackingHTML = `
    <a class="back-link" href="./orders.html">
      View all orders
    </a>

    <div class="delivery-date-heading">
      ${status === 'delivered' ? 'Delivered on' : 'Arriving on'} ${product.estimatedDeliveryTime}
    </div>

    <div class="product-detail-info">
      ${product.name}
    </div>

    <div class="product-detail-info">
      Quantity: ${product.quantity}
    </div>

    <img class="product-tracking-image" src="${product.image}" alt="${product.name}">

    <div class="progress-status-container">
      <div class="status-label ${status === 'preparing' || status === 'shipped' || status === 'delivered' ? 'status-current' : ''}">
        Preparing
      </div>
      <div class="status-label ${status === 'shipped' || status === 'delivered' ? 'status-current' : ''}">
        Shipped
      </div>
      <div class="status-label ${status === 'delivered' ? 'status-current' : ''}">
        Delivered
      </div>
    </div>

    <div class="progress-bar-wrapper">
      <div class="progress-bar-fill" style="width: ${progressPercentage}%"></div>
    </div>
  `;
  
  document.querySelector('.tracking-content').innerHTML = trackingHTML;
}