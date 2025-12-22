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
            </div>
            <div class="thumbnail-list">
                ${product.images && product.images.length > 0 ? product.images.map((img, i) => `
                    <div class="thumbnail ${i === 0 ? 'active' : ''}" onclick="changeImage('${img}', ${i})">
                        <img src="${img}" alt="${product.name}" style="width: 100%; height: 100%; object-fit: cover;">
                    </div>
                `).join('') : ''}
                ${product.modelUrl ? `
                    <div class="thumbnail thumbnail-3d" onclick="open3D('${product.modelUrl}')">
                        <img src="assets/3d-icon.svg" alt="3D View">
                        <span>Voir en 3D</span>
                    </div>
                ` : ''}
            </div>

            <!-- Mobile gallery slider -->
            ${product.modelUrl ? `
            <div class="hero-3d-button" onclick="open3D('${product.modelUrl}')">
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
    setupImageZoom();
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
            ${product.modelUrl ? `
                <div class="thumbnail thumbnail-3d" onclick="open3D('${product.modelUrl}')">
                    <img src="assets/3d-icon.svg" alt="3D View">
                    <span>Voir en 3D</span>
                </div>
            ` : ''}
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
    const product = window.__currentProduct;
    if (!url) return;
    
    // Desktop: Replace main image with 3D viewer
    const mainImage = document.getElementById('main-image');
    if (mainImage) {
        mainImage.classList.add('no-zoom-icon');
        mainImage.innerHTML = `<iframe src="${url}" class="model-viewer-container" title="3D Viewer" style="width:100%; height:100%; border:0;"></iframe>`;
        
        // Remove active class from all thumbnails
        document.querySelectorAll('.thumbnail').forEach(thumb => {
            thumb.classList.remove('active');
        });
    }
    
    // Mobile: Add 3D slide to track
    const track = document.getElementById('hero-track');
    if (track) {
        // Create a dedicated 3D slide and append if not already present
        if (!track.dataset.has3d) {
            const slide = document.createElement('div');
            slide.className = 'hero-slide';
            slide.innerHTML = `<iframe src="${url}" class="model-viewer-container" title="3D Viewer" style="width:100%; height:100%; border:0;"></iframe>`;
            track.appendChild(slide);
            track.dataset.has3d = 'true';
        }

        // Scroll to the last slide (3D)
        const last = track.lastElementChild;
        if (last) {
            last.scrollIntoView({ behavior: 'smooth', inline: 'start' });
        }

        setupGalleryProgress();
    }
};

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

// Setup image zoom functionality for desktop
function setupImageZoom() {
    const mainImage = document.getElementById('main-image');
    if (!mainImage) return;
    
    let isZoomed = false;
    
    mainImage.addEventListener('click', function(e) {
        const img = this.querySelector('img');
        if (!img) return;
        
        isZoomed = !isZoomed;
        
        if (isZoomed) {
            this.classList.add('zoomed');
            
            // Calculate transform origin based on click position
            const rect = this.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;
            img.style.transformOrigin = `${x}% ${y}%`;
        } else {
            this.classList.remove('zoomed');
            img.style.transformOrigin = 'center center';
        }
    });
    
    mainImage.addEventListener('mousemove', function(e) {
        if (!isZoomed) return;
        
        const img = this.querySelector('img');
        if (!img) return;
        
        const rect = this.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        img.style.transformOrigin = `${x}% ${y}%`;
    });
}
