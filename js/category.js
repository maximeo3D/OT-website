document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    const requestedCategory = params.get('category');
    const categoryName = requestedCategory ? decodeURIComponent(requestedCategory) : 'Vêtements';

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

    if (!grid || !window.products) {
        return;
    }

    const productsInCategory = products.filter(product => product.category === categoryName);
    const baseProducts = (productsInCategory.length ? productsInCategory : products).map(product => ({
        ...product,
        productType: product.productType || 'Type 1'
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
            const matchesPrice = product.price >= min && product.price <= max;
            const matchesType = !activeTypes.size || activeTypes.has(product.productType);
            return matchesPrice && matchesType;
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
            const card = document.createElement('a');
            card.href = `product.html?id=${product.id}`;
            card.className = 'card';
            card.dataset.price = product.price.toFixed(2);
            card.dataset.name = product.name;
            card.dataset.bestseller = product.bestseller ? '0' : '1';
            card.style.textDecoration = 'none';
            card.style.color = 'inherit';

            card.innerHTML = `
                <div class="card-image">
                    <span style="font-size: 3rem; color: #ccc;">IMG</span>
                </div>
                <div class="card-content">
                    <h2 class="card-title">${product.name}</h2>
                    <p class="card-price">${formatPrice(product.price)}</p>
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
});

function formatPrice(price) {
    return `${price.toFixed(2).replace('.', ',')} €`;
}

