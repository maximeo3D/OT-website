const formatPriceValue = (value) => `${value.toFixed(2).replace('.', ',')} €`;

document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    const productId = params.get('id');
    const container = document.getElementById('product-content');

    if (!productId) {
        container.innerHTML = '<p>Produit non trouvé.</p>';
        return;
    }

    const product = getProductById(productId);

    if (!product) {
        container.innerHTML = '<p>Produit non trouvé.</p>';
        return;
    }

    // Update page title
    document.title = `Site Vitrine - ${product.name}`;

    // Generate Images HTML
    let imagesHtml = product.images.map((img, index) => `
        <div class="thumbnail ${index === 0 ? 'active' : ''}" onclick="changeImage('${img}', this)">
            <img src="${img}" alt="${product.name}" style="width: 100%; height: 100%; object-fit: cover;">
        </div>
    `).join('');

    // Add 3D Thumbnail if modelUrl exists
    if (product.modelUrl) {
        imagesHtml += `
            <div class="thumbnail thumbnail-3d" onclick="load3DModel('${product.modelUrl}', this)">
                <img src="assets/3d-icon.svg" alt="3D View">
                <span style="font-size: 0.7rem; text-align: center; margin-top: 0.25rem;">Voir en 3D</span>
            </div>
        `;
    }

    const inStock = product.stock !== false;
    const promoActive = typeof product.promo === 'number' && product.promo > 0;
    const promoPrice = promoActive ? Number((product.price * (1 - product.promo / 100)).toFixed(2)) : product.price;
    const mainImageSrc = product.images && product.images.length > 0 ? product.images[0] : 'assets/product-placeholder.svg';

    container.innerHTML = `
        <div class="product-gallery">
            <div class="main-image" id="main-image"></div>
            <div class="thumbnail-list" id="thumbnail-list">
                ${imagesHtml}
            </div>
        </div>
        <div class="product-info">
            <h1>${product.name}</h1>
            <div class="product-meta-row">
                <div class="product-pricing">
                    <p class="product-price${(!inStock || promoActive) ? ' out-of-stock' : ''}">${formatPriceValue(product.price)}</p>
                    ${promoActive ? `<p class="product-price promo">${formatPriceValue(promoPrice)}</p>
                        <span class="promo-pill">-${product.promo}%</span>` : ''}
                    <span class="stock-status ${inStock ? 'in-stock' : 'out-stock'}">
                        ${inStock ? 'En stock' : 'Rupture de stock'}
                    </span>
                </div>
            </div>
            ${product.variants && product.variants.length > 0 ? `
            <div class="color-selector">
                <label class="color-label">Couleur :</label>
                <div class="color-options" id="color-options">
                    ${product.variants.map((variant, index) => `
                        <button class="color-swatch ${index === 0 ? 'active' : ''}" 
                                data-variant-index="${index}"
                                style="background-color: ${variant.color}; ${variant.color === '#FFFFFF' ? 'border: 1px solid #999;' : ''}"
                                title="${variant.colorName}"
                                onclick="switchVariant(${index})">
                        </button>
                    `).join('')}
                </div>
            </div>
            ` : ''}
            <div class="product-description">
                <p>${product.description}</p>
            </div>
            <button class="add-to-cart">Ajouter au panier</button>
        </div>
    `;

    setMainImage(mainImageSrc, product.name);
});

// Helper to set the main image with zoom handlers
function setMainImage(src, altText = 'Product') {
    const mainImage = document.getElementById('main-image');
    if (!mainImage) return;

    mainImage.classList.remove('zoomed');
    mainImage.classList.remove('no-zoom-icon');
    mainImage.innerHTML = `<img src="${src}" alt="${altText}" style="width: 100%; height: 100%; object-fit: cover;">`;
    attachZoomHandlers(mainImage);
}

// Global function for image switching
window.changeImage = function (src, thumbnail) {
    // Update active state
    document.querySelectorAll('.thumbnail').forEach(t => t.classList.remove('active'));
    if (thumbnail) thumbnail.classList.add('active');

    setMainImage(src);
};

// Global function for loading 3D model
window.load3DModel = function (url, thumbnail) {
    // Update active state
    document.querySelectorAll('.thumbnail').forEach(t => t.classList.remove('active'));
    thumbnail.classList.add('active');

    // Load iframe
    const mainImage = document.getElementById('main-image');
    mainImage.classList.remove('zoomed');
    mainImage.classList.add('no-zoom-icon');
    mainImage.innerHTML = `<iframe src="${url}" class="model-viewer-container" title="3D Viewer"></iframe>`;
};

// Global function for switching color variants
window.switchVariant = function (variantIndex) {
    const params = new URLSearchParams(window.location.search);
    const productId = params.get('id');
    const product = getProductById(productId);
    
    if (!product || !product.variants || !product.variants[variantIndex]) {
        return;
    }
    
    const variant = product.variants[variantIndex];
    const mainImage = document.getElementById('main-image');
    const thumbnailList = document.querySelector('.thumbnail-list');
    
    // Update main image
    setMainImage(variant.images[0], product.name);
    
    // Update thumbnails
    let newThumbnails = variant.images.map((img, index) => `
        <div class="thumbnail ${index === 0 ? 'active' : ''}" onclick="changeImage('${img}', this)">
            <img src="${img}" alt="${product.name}" style="width: 100%; height: 100%; object-fit: cover;">
        </div>
    `).join('');
    
    // Add 3D thumbnail if exists
    if (product.modelUrl) {
        newThumbnails += `
            <div class="thumbnail thumbnail-3d" onclick="load3DModel('${product.modelUrl}', this)">
                <img src="assets/3d-icon.svg" alt="3D View">
                <span style="font-size: 0.7rem; text-align: center; margin-top: 0.25rem;">Voir en 3D</span>
            </div>
        `;
    }
    
    thumbnailList.innerHTML = newThumbnails;
    
    // Update active color swatch
    document.querySelectorAll('.color-swatch').forEach((swatch, index) => {
        swatch.classList.toggle('active', index === variantIndex);
    });
};

function attachZoomHandlers(mainImageEl) {
    const img = mainImageEl.querySelector('img');
    if (!img) return;

    mainImageEl.onmouseenter = null;
    mainImageEl.onmousemove = null;
    mainImageEl.onclick = null;
    mainImageEl.onmouseleave = null;

    mainImageEl.onclick = () => {
        const isZoomed = mainImageEl.classList.toggle('zoomed');
        if (!isZoomed) {
            img.style.transformOrigin = 'center center';
        }
    };

    mainImageEl.onmousemove = (e) => {
        if (!mainImageEl.classList.contains('zoomed')) return;
        const rect = mainImageEl.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        img.style.transformOrigin = `${x}% ${y}%`;
    };

    mainImageEl.onmouseleave = () => {
        if (mainImageEl.classList.contains('zoomed')) {
            mainImageEl.classList.remove('zoomed');
            img.style.transformOrigin = 'center center';
        }
    };
}
