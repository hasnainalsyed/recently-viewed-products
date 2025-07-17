/**
 * Recently Viewed Products
 * Handles tracking and displaying recently viewed products using localStorage
 */
class RecentlyViewedProducts {
  constructor(options = {}) {
    this.storageKey = options.storageKey || 'recentlyViewedProducts';
    this.maxProducts = options.maxProducts || 9;
    this.gridContainer = options.gridContainer || document.querySelector('[data-recently-viewed-products-grid]');
    this.emptyMessage = options.emptyMessage || document.querySelector('[data-recently-viewed-empty]');
    this.sectionContainer = options.sectionContainer || document.querySelector('[data-recently-viewed-section]');
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

    let products = this.getRecentlyViewed();

    // Filter out the current product if we're on a product page
    if (this.productData && this.productData.id) {
      products = products.filter(product => product.id !== this.productData.id);
    }

    if (products.length === 0) {
      this.hideSection();
      return;
    }

    this.showSection();

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

  showSection() {
    if (this.sectionContainer && this.sectionContainer.classList.contains('hidden')) {
      this.sectionContainer.classList.remove('hidden');
    }
  }

  hideSection() {
    if (this.sectionContainer && this.sectionContainer.classList.contains('hidden')) {
      this.sectionContainer.classList.add('hidden');
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