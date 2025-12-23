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

    const inStock = product.stock !== false;
    const promoActive = typeof product.promo === 'number' && product.promo > 0;
    const promoPrice = promoActive ? Number((product.price * (1 - product.promo / 100)).toFixed(2)) : product.price;

    container.innerHTML = `
        <div class="product-gallery">
            <!-- Desktop gallery -->
            <div class="main-image" id="main-image">
                <img src="${product.images && product.images[0] ? product.images[0] : 'assets/product-placeholder.svg'}" alt="${product.name}">
                
                <!-- Desktop 3D Button -->
                ${product.modelUrl ? `
                <div class="hero-3d-button desktop-3d-button" id="desktop-3d-button" onclick="event.stopPropagation(); open3D('${product.modelUrl}')">
                    <img src="assets/3d-icon.svg" alt="3D View">
                    <span>3D</span>
                </div>` : ''}
            </div>
            <div class="thumbnail-list">
                ${product.images && product.images.length > 0 ? product.images.map((img, i) => `
                    <div class="thumbnail ${i === 0 ? 'active' : ''}" onclick="changeImage('${img}', ${i})">
                        <img src="${img}" alt="${product.name}" style="width: 100%; height: 100%; object-fit: cover;">
                    </div>
                `).join('') : ''}
            </div>

            <!-- Mobile gallery slider -->
            ${product.modelUrl ? `
            <div class="hero-3d-button mobile-3d-button" id="mobile-3d-button" onclick="event.stopPropagation(); open3D('${product.modelUrl}')">
                <img src="assets/3d-icon.svg" alt="3D View">
                <span>3D</span>
            </div>` : ''}
            <div class="hero-track" id="hero-track">
                ${renderSlides(product.images, product.name)}
            </div>
            <div class="gallery-progress" id="gallery-progress">
                <div class="progress-bar-inner"></div>
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
    window.__currentProduct = product;
    setupGalleryProgress();
    ensureGlobal3DOverlay(product.modelUrl);
});

function renderSlides(images, altText) {
    if (!images || !images.length) return `<div class="hero-slide"><img src="assets/product-placeholder.svg" alt="${altText}"></div>`;
    return images.map(img => `
        <div class="hero-slide">
            <img src="${img}" alt="${altText}">
        </div>
    `).join('');
}

// Global function for switching color variants
window.switchVariant = function (variantIndex) {
    const product = window.__currentProduct;
    if (!product || !product.variants || !product.variants[variantIndex]) return;

    const variant = product.variants[variantIndex];
    
    // Update mobile slider
    const track = document.getElementById('hero-track');
    if (track) {
        track.dataset.has3d = '';
        track.innerHTML = renderSlides(variant.images, product.name);
    }

    // Update desktop gallery
    const mainImage = document.getElementById('main-image');
    if (mainImage && variant.images && variant.images[0]) {
        const img = mainImage.querySelector('img');
        if (img) img.src = variant.images[0];
    }

    // Update desktop thumbnails
    const thumbnailList = document.querySelector('.thumbnail-list');
    if (thumbnailList) {
        thumbnailList.innerHTML = `
            ${variant.images && variant.images.length > 0 ? variant.images.map((img, i) => `
                <div class="thumbnail ${i === 0 ? 'active' : ''}" onclick="changeImage('${img}', ${i})">
                    <img src="${img}" alt="${product.name}" style="width: 100%; height: 100%; object-fit: cover;">
                </div>
            `).join('') : ''}
        `;
    }

    // Update active color swatch
    document.querySelectorAll('.color-swatch').forEach((swatch, index) => {
        swatch.classList.toggle('active', index === variantIndex);
    });

    setupGalleryProgress();
};

// Global function for loading 3D model
window.open3D = function (url) {
    if (!url) return;
    
    const desktopButton = document.getElementById('desktop-3d-button');
    const mobileButton = document.getElementById('mobile-3d-button');
    const overlay = ensureGlobal3DOverlay(url);
    const loader = document.getElementById('global-3d-loader');
    const iframe = document.getElementById('global-3d-iframe');
    
    // Load iframe src only on first click - loader shown only once
    if (iframe && !iframe.src) {
        if (loader) loader.style.display = 'flex';
        iframe.addEventListener('load', () => {
            // iframe load fires when the document is ready; wait a bit for Babylon assets
            setTimeout(() => {
                if (loader) loader.style.display = 'none';
            }, 1000);
        }, { once: true });
        iframe.src = url;
    }

    // Position overlay over the correct area (desktop: main image, mobile: whole gallery)
    positionGlobal3DOverlay();
    if (overlay) overlay.classList.add('active');
    
    // Hide the 3D buttons when overlay is active
    if (desktopButton) {
        desktopButton.style.display = 'none';
    }
    
    if (mobileButton) {
        mobileButton.style.display = 'none';
    }
};

// Global function for closing 3D overlay
window.close3D = function () {
    const desktopButton = document.getElementById('desktop-3d-button');
    const mobileButton = document.getElementById('mobile-3d-button');
    const overlay = document.getElementById('global-3d-overlay');
    
    if (overlay) overlay.classList.remove('active');
    
    // Show the 3D buttons again
    if (desktopButton) {
        desktopButton.style.display = 'inline-flex';
    }
    
    if (mobileButton) {
        // Reset to CSS-driven display so it stays hidden on desktop and shows on mobile
        mobileButton.style.display = '';
    }
    
    // Loaders stay in their current state (hidden if already loaded, shown if still loading)
    // No need to manipulate them here - they're controlled by the load event in open3D
};

function ensureGlobal3DOverlay(modelUrl) {
    if (!modelUrl) return null;
    let overlay = document.getElementById('global-3d-overlay');
    if (overlay) {
        overlay.dataset.modelUrl = modelUrl;
        return overlay;
    }

    overlay = document.createElement('div');
    overlay.id = 'global-3d-overlay';
    overlay.className = 'global-3d-overlay';
    overlay.dataset.modelUrl = modelUrl;
    overlay.innerHTML = `
        <div class="loader-3d-overlay" id="global-3d-loader">
            <img src="assets/3d_loader.gif" alt="Chargement 3D">
        </div>
        <div class="close-3d-button" onclick="event.stopPropagation(); close3D()">✕</div>
        <iframe id="global-3d-iframe" title="3D Viewer"></iframe>
    `;

    document.body.appendChild(overlay);

    // Reposition on resize/orientation change while active
    window.addEventListener('resize', () => {
        if (overlay.classList.contains('active')) positionGlobal3DOverlay();
    });

    return overlay;
}

function positionGlobal3DOverlay() {
    const overlay = document.getElementById('global-3d-overlay');
    if (!overlay) return;

    const isMobile = window.matchMedia('(max-width: 768px)').matches;
    const target = isMobile ? document.querySelector('.product-gallery') : document.getElementById('main-image');
    if (!target) return;

    const rect = target.getBoundingClientRect();
    overlay.style.top = `${rect.top}px`;
    overlay.style.left = `${rect.left}px`;
    overlay.style.width = `${rect.width}px`;
    overlay.style.height = `${rect.height}px`;
}

function setupGalleryProgress() {
    const track = document.getElementById('hero-track');
    const bar = document.getElementById('gallery-progress');
    const inner = bar ? bar.querySelector('.progress-bar-inner') : null;
    if (!track || !inner) return;

    const update = () => {
        const slides = track.children.length;
        if (!slides) return;
        const width = track.clientWidth || 1;
        const index = Math.round(track.scrollLeft / width);
        const progress = Math.min(100, Math.max(0, ((index + 1) / slides) * 100));
        inner.style.width = `${progress}%`;
    };

    track.addEventListener('scroll', () => {
        window.requestAnimationFrame(update);
    });

    update();
}

// Global function for changing desktop main image
window.changeImage = function(imageSrc, index) {
    const mainImage = document.getElementById('main-image');
    if (!mainImage) return;
    
    const img = mainImage.querySelector('img');
    if (img) {
        img.src = imageSrc;
    }
    
    // Update active thumbnail
    document.querySelectorAll('.thumbnail').forEach((thumb, i) => {
        thumb.classList.toggle('active', i === index);
    });
};

