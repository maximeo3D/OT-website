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
            <div style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; color: #ccc; font-size: 0.8rem;">IMG</div>
        </div>
    `).join('');

    // Add 3D Thumbnail if modelUrl exists
    if (product.modelUrl) {
        imagesHtml += `
            <div class="thumbnail thumbnail-3d" onclick="load3DModel('${product.modelUrl}', this)">
                <img src="assets/3d-icon.svg" alt="3D View">
            </div>
        `;
    }

    container.innerHTML = `
        <div class="product-gallery">
            <div class="main-image" id="main-image">
                <span>IMG</span>
            </div>
            <div class="thumbnail-list">
                ${imagesHtml}
            </div>
        </div>
        <div class="product-info">
            <h1>${product.name}</h1>
            <p class="product-price">${product.price.toFixed(2)} €</p>
            <div class="product-description">
                <p>${product.description}</p>
            </div>
            <button class="add-to-cart">Ajouter au panier</button>
        </div>
    `;
});

// Global function for image switching
window.changeImage = function (src, thumbnail) {
    // Update active state
    document.querySelectorAll('.thumbnail').forEach(t => t.classList.remove('active'));
    thumbnail.classList.add('active');

    // Reset main image content
    const mainImage = document.getElementById('main-image');
    mainImage.innerHTML = '<span>IMG</span>';
    // In a real app, we would set the background image or img src here
};

// Global function for loading 3D model
window.load3DModel = function (url, thumbnail) {
    // Update active state
    document.querySelectorAll('.thumbnail').forEach(t => t.classList.remove('active'));
    thumbnail.classList.add('active');

    // Load iframe
    const mainImage = document.getElementById('main-image');
    mainImage.innerHTML = `<iframe src="${url}" class="model-viewer-container" title="3D Viewer"></iframe>`;
};
