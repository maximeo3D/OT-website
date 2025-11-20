document.addEventListener('DOMContentLoaded', () => {
    const sortSelect = document.getElementById('sort-select');
    const productGrid = document.getElementById('product-grid');

    if (sortSelect && productGrid) {
        sortSelect.addEventListener('change', () => {
            const sortValue = sortSelect.value;
            const products = Array.from(productGrid.children);

            products.sort((a, b) => {
                const priceA = parseFloat(a.dataset.price);
                const priceB = parseFloat(b.dataset.price);
                const nameA = a.dataset.name.toLowerCase();
                const nameB = b.dataset.name.toLowerCase();
                const rankA = parseInt(a.dataset.bestseller);
                const rankB = parseInt(b.dataset.bestseller);

                switch (sortValue) {
                    case 'price-asc':
                        return priceA - priceB;
                    case 'price-desc':
                        return priceB - priceA;
                    case 'bestseller':
                        return rankA - rankB;
                    case 'name':
                    default:
                        return nameA.localeCompare(nameB);
                }
            });

            // Re-append sorted elements
            products.forEach(product => productGrid.appendChild(product));
        });
    }
});
