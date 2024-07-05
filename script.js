document.addEventListener('DOMContentLoaded', () => {
    const tabs = document.querySelectorAll('.tab');
    const productsContainer = document.querySelector('.products');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Remove active class from all tabs
            tabs.forEach(t => t.classList.remove('active'));
            // Add active class to the clicked tab
            tab.classList.add('active');
            // Fetch and display products based on the selected category
            fetchProducts(tab.getAttribute('data-category'));
        });
    });

    // Function to fetch products
    function fetchProducts(category) {
        // Clear previous products
        productsContainer.innerHTML = '';

        // Fetch product data from API
        fetch('https://cdn.shopify.com/s/files/1/0564/3685/0790/files/multiProduct.json')
            .then(response => response.json())
            .then(data => {
                console.log('API Data:', data); // Log the data to understand its structure

                // Check if data contains a categories array
                if (data.categories && Array.isArray(data.categories)) {
                    // Find the category object that matches the selected category
                    const categoryData = data.categories.find(cat => cat.category_name.toLowerCase() === category);

                    if (categoryData && categoryData.category_products) {
                        displayProducts(categoryData.category_products);
                    } else {
                        console.error('No products found for category:', category);
                    }
                } else {
                    console.error('Unexpected data format:', data);
                }
            })
            .catch(error => console.error('Error fetching product data:', error));
    }

    // Function to display products
    function displayProducts(products) {
        products.forEach(product => {
            const productCard = document.createElement('div');
            productCard.classList.add('product-card');

            const discountedPrice = (product.price * (1 - ((product.compare_at_price - product.price) / product.compare_at_price) * 100)).toFixed(2);

            productCard.innerHTML = `
                <img src="${product.image}" alt="${product.title}">
                ${product.badge_text ? `<p class="badge">${product.badge_text}</p>` : ''}
                <h2>${product.title}</h2>
                <p>Vendor: ${product.vendor}</p>
                <p class="price">Rs ${product.price}</p>
                <p class="compare-price">Rs ${product.compare_at_price}</p>
                <button>Add to Cart</button>
            `;

            productsContainer.appendChild(productCard);
        });
    }

    // Initialize with the first tab active and load products
    tabs[0].click();
});
