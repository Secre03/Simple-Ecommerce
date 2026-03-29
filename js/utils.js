function initSearch() {
  const searchInput = document.querySelector('.search-input-field');
  const searchBtn = document.querySelector('.search-btn');
  
  if (!searchInput) return;

  const performSearch = () => {
    const query = searchInput.value.toLowerCase().trim();
    const productCards = document.querySelectorAll('.product-card');
    
    let visibleCount = 0;
    
    productCards.forEach(card => {
      const name = card.querySelector('.product-name')?.textContent.toLowerCase() || '';
      const shouldShow = query === '' || name.includes(query);
      
      const col = card.closest('.col');
      if (col) {
        col.style.display = shouldShow ? '' : 'none';
        if (shouldShow) visibleCount++;
      }
    });

    if (visibleCount === 0 && query !== '') {
      showNotification('No products found matching your search.');
    }
  };

  if (searchBtn) {
    searchBtn.addEventListener('click', performSearch);
  }
  
  searchInput.addEventListener('keyup', performSearch);
  searchInput.addEventListener('input', performSearch);
}

function initSubscription() {
  const subscribeBtn = document.querySelector('.subscribe-btn');
  const emailInput = document.querySelector('.email-input');
  
  if (!subscribeBtn || !emailInput) return;

  subscribeBtn.addEventListener('click', () => {
    const email = emailInput.value.trim();
    
    if (!email) {
      showNotification('Please enter your email address.');
      return;
    }
    
    if (!isValidEmail(email)) {
      showNotification('Please enter a valid email address.');
      return;
    }

    showNotification('Thank you for subscribing! Check your email for exclusive offers.', 4000);
    emailInput.value = '';
  });

  emailInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      subscribeBtn.click();
    }
  });
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function showNotification(message, duration = 3000) {
  const existing = document.querySelector('.notification-toast');
  if (existing) existing.remove();

  const notification = document.createElement('div');
  notification.className = 'notification-toast';
  notification.textContent = message;
  notification.style.cssText = `
    position: fixed;
    top: 100px;
    right: 20px;
    background: #28a745;
    color: white;
    padding: 15px 25px;
    border-radius: 5px;
    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    z-index: 10000;
    animation: slideIn 0.3s ease-out;
    font-family: 'Plus Jakarta Sans', sans-serif;
  `;

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.style.animation = 'slideOut 0.3s ease-out';
    setTimeout(() => notification.remove(), 300);
  }, duration);
}