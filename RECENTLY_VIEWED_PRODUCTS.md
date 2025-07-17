# Recently Viewed Products Section

A Shopify Dawn theme section that tracks and displays recently viewed products using localStorage.

## Features

- **Automatic Tracking**: Automatically tracks products when users visit product pages
- **Local Storage**: Uses browser localStorage to persist data across sessions
- **Responsive Design**: Fully responsive grid layout that adapts to different screen sizes
- **Customizable**: Configurable through theme customizer settings 
- **Performance Optimized**: Lazy loading images and efficient JavaScript
- **Accessibility**: Proper semantic HTML and ARIA attributes

## Files Created/Modified

### New Files
- `sections/recently-viewed-products.liquid` - Main section file
- `assets/recently-viewed-products.js` - JavaScript functionality
- `assets/recently-viewed-products.css` - Styling
- `templates/page.recently-viewed.json` - Example template
- `RECENTLY_VIEWED_PRODUCTS.md` - This documentation

### Modified Files
- `snippets/recently-viewed-products.liquid` - Deprecated old implementation

## How to Use

### 1. Add to a Page Template

Add the section to any page template by including it in the JSON template:

```json
{
  "sections": {
    "recently_viewed": {
      "type": "recently-viewed-products",
      "settings": {
        "heading": "Recently Viewed Products",
        "max_products": 6
      }
    }
  },
  "order": ["recently_viewed"]
}
```

### 2. Add to Product Pages

To track products, the section automatically detects when it's on a product page and stores the current product data.

### 3. Customize Settings

In the theme customizer, you can configure:

- **Heading**: Custom heading text
- **Heading Size**: Small, Medium, or Large
- **Maximum Products**: Number of products to display (3-12)
- **Empty Message**: Message shown when no products are viewed
- **Padding**: Top and bottom padding
- **Color Scheme**: Theme color scheme

## Technical Details

### JavaScript Class

The `RecentlyViewedProducts` class handles all functionality:

```javascript
new RecentlyViewedProducts({
  maxProducts: 6,
  productData: {
    id: 'product-id',
    title: 'Product Title',
    url: '/products/product-handle',
    image: 'image-url',
    price: '$19.99'
  }
});
```

### Local Storage

Products are stored in localStorage with the key `recentlyViewedProducts`:

```javascript
[
  {
    id: "product-id",
    title: "Product Title",
    url: "/products/product-handle",
    image: "image-url",
    price: "$19.99",
    handle: "product-handle"
  }
]
```

### CSS Classes

- `.recently-viewed-products` - Main container
- `.recently-viewed-products__grid` - Product grid
- `.recently-viewed-product` - Individual product card
- `.recently-viewed-product__image` - Product image
- `.recently-viewed-product__title` - Product title
- `.recently-viewed-product__price` - Product price
- `.recently-viewed-products__empty` - Empty state message

## Browser Compatibility

- Modern browsers with localStorage support
- Graceful degradation for older browsers
- Error handling for localStorage failures

## Performance Considerations

- Images use lazy loading
- JavaScript is loaded with `defer` attribute
- CSS is optimized for performance
- Minimal DOM manipulation

## Customization

### Styling

Modify `assets/recently-viewed-products.css` to customize the appearance:

```css
.recently-viewed-product {
  /* Custom styles */
}
```

### JavaScript

Extend the `RecentlyViewedProducts` class for additional functionality:

```javascript
class CustomRecentlyViewedProducts extends RecentlyViewedProducts {
  // Add custom methods
}
```

### Liquid Templates

The section uses standard Shopify Liquid syntax and can be customized like any other section.

## Troubleshooting

### Products Not Appearing

1. Check if localStorage is enabled in the browser
2. Verify the section is properly added to the page template
3. Ensure you've visited product pages to populate the data

### JavaScript Errors

1. Check browser console for errors
2. Verify the JavaScript file is loading correctly
3. Ensure the DOM elements exist before JavaScript runs

### Styling Issues

1. Check if the CSS file is loading
2. Verify CSS class names match the HTML
3. Check for CSS conflicts with other theme styles

## Future Enhancements

- Add analytics tracking
- Implement server-side storage
- Add product variant support
- Create admin interface for management
- Add export/import functionality
- Implement A/B testing capabilities 