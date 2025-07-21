/**
 * Recently Viewed Products
 * Handles tracking and displaying recently viewed products using localStorage
 */
class RecentlyViewedProducts {
  constructor(options = {}) {
    this.storageKey = options.storageKey || 'recentlyViewedProducts';
    this.maxProducts = options.maxProducts || 9;
    this.gridContainer = options.gridContainer || document.querySelector('[data-recently-viewed-products-grid]');
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

    // Render products using the card structure
    this.renderProducts(products);
  }

  renderProducts(products) {
    // Render products using the same structure as card-product.liquid
    const productsHTML = products.map(product => `
      <div class="swiper-slide" data-product-id="${product.id}">
        <div class="card-wrapper product-card-wrapper underline-links-hover">
          <div class="card card--standard">
            <div class="card__inner">
              <div class="card__media">
                <div class="media media--transparent media--hover-effect">
                  <img
                    src="${product.image}"
                    alt="${product.title}"
                    class="motion-reduce"
                    loading="lazy"
                    width="533"
                    height="533"
                  >
                </div>
              </div>
            </div>
            <div class="card__content">
              <div class="card__information">
                <h4 class="card__heading h5">
                  <a href="${product.url}" class="full-unstyled-link">
                    ${product.title}
                  </a>
                </h4>
                <div class="card-information">
                  ${product.rating ? `<div class="rating">${product.rating}</div>` : ''}
                  ${this.renderPrice(product)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `).join('');

    this.gridContainer.innerHTML = productsHTML;
    this.initSwiper();
  }

  renderPrice(product) {
    const price = this.clean(product.price);
    const compareAtPrice = this.clean(product.compare_at_price);
    const priceMin = this.clean(product.price_min);
    const priceMax = this.clean(product.price_max);
    const compareAtPriceMin = this.clean(product.compare_at_price_min);
    const compareAtPriceMax = this.clean(product.compare_at_price_max);

    const hasPriceRange = priceMin && priceMax && priceMin !== priceMax;
    const hasCompareAtPriceRange = compareAtPriceMin && compareAtPriceMax && (compareAtPriceMin !== compareAtPriceMax || compareAtPriceMin > priceMin);
    const isOnSale = (compareAtPrice && compareAtPrice > price) || (hasCompareAtPriceRange && (compareAtPriceMin > priceMin || compareAtPriceMax > priceMax));

    let priceClass = 'price';
    if (isOnSale) priceClass += ' price--on-sale';
    if (hasPriceRange) priceClass += ' price--price-range';

    let priceHTML = `<div class="${priceClass}"><div class="price__container">`;

    if (hasPriceRange && isOnSale) {
      // Range with sale
      priceHTML += `
        <div class="price__sale">
          <span class="visually-hidden visually-hidden--inline">Regular price</span>
          <span class="price-item price-item--sale price-item--last">
            ${product.price_min} – ${product.price_max}
          </span>
        </div>
      `;
    } else if (hasPriceRange) {
      // Range, no sale
      priceHTML += `
        <div class="price__regular">
          <span class="visually-hidden visually-hidden--inline">Regular price</span>
          <span class="price-item price-item--regular">
            ${product.price_min} – ${product.price_max}
          </span>
        </div>
      `;
    } else if (isOnSale) {
      // Single product on sale
      priceHTML += `
        <div class="price__sale">
          <span class="visually-hidden visually-hidden--inline">Regular price</span>
          <span>
            <s class="price-item price-item--regular">
              ${product.compare_at_price}
            </s>
          </span>
          <span class="visually-hidden visually-hidden--inline">Sale price</span>
          <span class="price-item price-item--sale price-item--last">
            ${product.price}
          </span>
        </div>
      `;
    } else {
      // Single product, regular price
      priceHTML += `
        <div class="price__regular">
          <span class="visually-hidden visually-hidden--inline">Regular price</span>
          <span class="price-item price-item--regular">
            ${product.price}
          </span>
        </div>
      `;
    }

    priceHTML += '</div></div>';
    return priceHTML;
  }

  clean(value) {
    if (typeof value !== 'string') return parseFloat(value);
    return parseFloat(value.replace(/[^\d.-]/g, ''));
  }

  initSwiper() {
    const recentlyViewedProducts = this.sectionContainer.querySelector('[data-swiper-name="recently-viewed-products"]');
    if (!recentlyViewedProducts) return;

    // Avoid initializing twice
    if (recentlyViewedProducts.classList.contains('swiper-initialized')) return;

    const slidesDesktop = recentlyViewedProducts.getAttribute('data-slides-desktop') || 5;
    const slidesMobile = recentlyViewedProducts.getAttribute('data-slides-mobile') || 2;

    new Swiper(recentlyViewedProducts, {
      slidesPerView: slidesMobile,
      spaceBetween: 15,
      loop: true,
      navigation: {
        nextEl: '.slider-button--next',
        prevEl: '.slider-button--prev',
      },
      breakpoints: {
        1024: {
          slidesPerView: parseInt(slidesDesktop, 10) || 4,
          spaceBetween: 30,
        },
        768: {
          slidesPerView: 3,
          spaceBetween: 30,
        },
        480: {
          slidesPerView: 2,
          spaceBetween: 15,
        },
      },
    });

    recentlyViewedProducts.classList.add('swiper-initialized');
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
