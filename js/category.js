document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    const requestedCategory = params.get('category');
    const categoryName = requestedCategory ? decodeURIComponent(requestedCategory) : "Accessoires d'arme";

    const titleEl = document.getElementById('category-title');
    if (titleEl) {
        titleEl.textContent = categoryName;
    }
    document.title = `Site Vitrine - ${categoryName}`;

    const grid = document.getElementById('product-grid');
    const typeOptionsContainer = document.getElementById('type-filter-options');
    const sortSelect = document.getElementById('sort-select');
    const priceMinInput = document.getElementById('price-min');
    const priceMaxInput = document.getElementById('price-max');
    const priceMinLabel = document.getElementById('price-min-value');
    const priceMaxLabel = document.getElementById('price-max-value');
    const priceTrack = document.getElementById('price-track');
    const stockOnlyInput = document.getElementById('stock-only');

    if (!grid || !window.products) {
        return;
    }

    const productsInCategory = products.filter(product => product.category === categoryName);
    const baseProducts = (productsInCategory.length ? productsInCategory : products).map(product => ({
        ...product,
        productType: product.productType || 'Type 1',
        stock: product.stock === false ? false : true
    }));

    let activeTypes = new Set();

    renderTypeOptions(baseProducts);
    updatePriceUI();
    renderProducts();

    function renderTypeOptions(items) {
        if (!typeOptionsContainer) {
            return;
        }
        const types = Array.from(new Set(items.map(item => item.productType))).sort();
        typeOptionsContainer.innerHTML = '';

        types.forEach(type => {
            const option = document.createElement('label');
            option.className = 'type-option';
            option.innerHTML = `
                <input type="checkbox" value="${type}" checked>
                <span>${type}</span>
            `;
            typeOptionsContainer.appendChild(option);
        });

        activeTypes = new Set(types);

        typeOptionsContainer.querySelectorAll('input[type="checkbox"]').forEach(input => {
            input.addEventListener('change', handleTypeChange);
        });
    }

    function handleTypeChange() {
        if (!typeOptionsContainer) {
            return;
        }
        const checkedValues = Array.from(typeOptionsContainer.querySelectorAll('input[type="checkbox"]'))
            .filter(input => input.checked)
            .map(input => input.value);

        activeTypes = checkedValues.length ? new Set(checkedValues) : new Set();
        renderProducts();
    }

    function updatePriceUI(changed) {
        if (!priceMinInput || !priceMaxInput || !priceMinLabel || !priceMaxLabel) {
            return;
        }

        let min = Number(priceMinInput.value);
        let max = Number(priceMaxInput.value);

        if (min > max) {
            if (changed === 'min') {
                priceMaxInput.value = min;
                max = min;
            } else {
                priceMinInput.value = max;
                min = max;
            }
        }

        priceMinLabel.textContent = `${min} €`;
        priceMaxLabel.textContent = `${max} €`;

        if (priceTrack && priceMaxInput) {
            const sliderMax = Number(priceMaxInput.max || 100);
            const minPercent = (min / sliderMax) * 100;
            const maxPercent = (max / sliderMax) * 100;
            priceTrack.style.background = `
                linear-gradient(
                    to right,
                    #ddd ${minPercent}%,
                    #000 ${minPercent}%,
                    #000 ${maxPercent}%,
                    #ddd ${maxPercent}%
                )
            `;
        }

        return { min, max };
    }

    function getFilteredProducts() {
        const { min = 0, max = 100 } = updatePriceUI() || {};

        return baseProducts.filter(product => {
            const displayPrice = getDisplayPrice(product);
            const matchesPrice = displayPrice >= min && displayPrice <= max;
            const matchesType = !activeTypes.size || activeTypes.has(product.productType);
            const isInStock = product.stock !== false;
            const matchesStock = !stockOnlyInput || !stockOnlyInput.checked || isInStock;
            return matchesPrice && matchesType && matchesStock;
        });
    }

    function renderProducts() {
        const filtered = getFilteredProducts();
        grid.innerHTML = '';

        if (!filtered.length) {
            grid.innerHTML = `<p style="grid-column: 1 / -1; text-align: center;">Aucun produit ne correspond aux filtres.</p>`;
            return;
        }

        filtered.forEach(product => {
            const isInStock = product.stock !== false;
            const promoActive = hasPromo(product);
            const promoPrice = getDisplayPrice(product);
            const card = document.createElement('a');
            card.href = `product.html?id=${product.id}`;
            card.className = 'card';
            card.dataset.price = promoPrice.toFixed(2);
            card.dataset.name = product.name;
            card.dataset.bestseller = product.bestseller ? '0' : '1';
            card.dataset.stock = isInStock ? '1' : '0';
            card.style.textDecoration = 'none';
            card.style.color = 'inherit';

            card.innerHTML = `
                <div class="card-image">
                    <span style="font-size: 3rem; color: #ccc;">IMG</span>
                </div>
                <div class="card-content">
                    <h2 class="card-title">${product.name}</h2>
                    <div class="card-pricing">
                        <p class="card-price${(!isInStock || promoActive) ? ' out-of-stock' : ''}">${formatPrice(product.price)}</p>
                        ${promoActive ? `<p class="card-price promo">${formatPrice(promoPrice)}</p>
                            <span class="promo-pill">-${product.promo}%</span>` : ''}
                        <span class="stock-status ${isInStock ? 'in-stock' : 'out-stock'}">${isInStock ? 'En stock' : 'Rupture de stock'}</span>
                    </div>
                </div>
            `;

            grid.appendChild(card);
        });

        if (sortSelect) {
            requestAnimationFrame(() => {
                sortSelect.dispatchEvent(new Event('change'));
            });
        }
    }

    if (priceMinInput) {
        priceMinInput.addEventListener('input', () => {
            updatePriceUI('min');
            renderProducts();
        });
    }

    if (priceMaxInput) {
        priceMaxInput.addEventListener('input', () => {
            updatePriceUI('max');
            renderProducts();
        });
    }

    if (stockOnlyInput) {
        stockOnlyInput.addEventListener('change', renderProducts);
    }
});

function formatPrice(price) {
    return `${price.toFixed(2).replace('.', ',')} €`;
}

function hasPromo(product) {
    return typeof product.promo === 'number' && product.promo > 0;
}

function getDisplayPrice(product) {
    if (hasPromo(product)) {
        return Number((product.price * (1 - product.promo / 100)).toFixed(2));
    }
    return Number(product.price);
}

