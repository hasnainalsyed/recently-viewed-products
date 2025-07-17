/**
 * Recently Viewed Products
 * Handles tracking and displaying recently viewed products using localStorage
 */
class RecentlyViewedProducts {
  constructor(options = {}) {
    this.storageKey = options.storageKey || 'recentlyViewedProducts';
    this.maxProducts = options.maxProducts || 6;
    this.gridContainer = options.gridContainer || document.getElementById('recently-viewed-products-grid');
    this.emptyMessage = options.emptyMessage || document.getElementById('recently-viewed-empty');
    this.productData = options.productData || null;

    this.init();
  }

  init() {
    // Track current product if we're on a product page and have product data
    if (this.productData && this.productData.id) {
      this.addToRecentlyViewed(this.productData);
    }

    this.displayProducts();
  }

  addToRecentlyViewed(productData) {
    let recentlyViewed = this.getRecentlyViewed();

    // Remove if already exists
    recentlyViewed = recentlyViewed.filter(item => item.id !== productData.id);

    // Add to beginning
    recentlyViewed.unshift(productData);

    // Limit to max products
    if (recentlyViewed.length > this.maxProducts) {
      recentlyViewed = recentlyViewed.slice(0, this.maxProducts);
    }

    localStorage.setItem(this.storageKey, JSON.stringify(recentlyViewed));
  }

  getRecentlyViewed() {
    try {
      return JSON.parse(localStorage.getItem(this.storageKey)) || [];
    } catch (e) {
      console.warn('Error parsing recently viewed products from localStorage:', e);
      return [];
    }
  }

  displayProducts() {
    if (!this.gridContainer) {
      console.warn('Recently viewed products grid container not found');
      return;
    }

    const products = this.getRecentlyViewed();

    if (products.length === 0) {
      this.showEmptyMessage();
      return;
    }

    this.hideEmptyMessage();

    const productsHTML = products.map(product => `
      <div class="recently-viewed-product">
        <a href="${product.url}" class="recently-viewed-product__link">
          <img 
            src="${product.image}" 
            alt="${product.title}"
            class="recently-viewed-product__image"
            loading="lazy"
            onerror="this.style.display='none'"
          >
          <h3 class="recently-viewed-product__title">${product.title}</h3>
          <div class="recently-viewed-product__price">${product.price}</div>
        </a>
      </div>
    `).join('');

    this.gridContainer.innerHTML = productsHTML;
  }

  showEmptyMessage() {
    if (this.emptyMessage) {
      this.emptyMessage.style.display = 'block';
    }
  }

  hideEmptyMessage() {
    if (this.emptyMessage) {
      this.emptyMessage.style.display = 'none';
    }
  }

  // Public method to clear recently viewed products
  clearRecentlyViewed() {
    localStorage.removeItem(this.storageKey);
    this.displayProducts();
  }

  // Public method to get current recently viewed products
  getCurrentProducts() {
    return this.getRecentlyViewed();
  }
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = RecentlyViewedProducts;
} else {
  window.RecentlyViewedProducts = RecentlyViewedProducts;
}
