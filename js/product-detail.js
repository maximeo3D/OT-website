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
            <div id="product-configurator" class="product-configurator"></div>
            <button class="add-to-cart">Ajouter au panier</button>
        </div>
    `;
    window.__currentProduct = product;
    makeHeroTrackInfinite();
    setupGalleryProgress();
    ensureGlobal3DOverlay(product.modelUrl);
    initProductConfigurator(product);
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

    makeHeroTrackInfinite();
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
            attachViewerBridge(iframe);
            // iframe load fires when the document is ready; wait a bit for Babylon assets
            setTimeout(() => {
                if (loader) loader.style.display = 'none';
            }, 1000);
        }, { once: true });
        iframe.src = url;
    }

    attachViewerBridge(iframe);

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
    window.addEventListener('scroll', () => {
        if (overlay.classList.contains('active')) positionGlobal3DOverlay();
    }, { passive: true });

    return overlay;
}

function positionGlobal3DOverlay() {
    const overlay = document.getElementById('global-3d-overlay');
    if (!overlay) return;

    const isMobile = window.matchMedia('(max-width: 768px)').matches;
    const target = isMobile ? document.querySelector('.product-gallery') : document.getElementById('main-image');
    if (!target) return;

    const rect = target.getBoundingClientRect();
    overlay.style.top = `${rect.top + window.scrollY}px`;
    overlay.style.left = `${rect.left + window.scrollX}px`;
    overlay.style.width = `${rect.width}px`;
    overlay.style.height = `${rect.height}px`;
}

function setupGalleryProgress() {
    const track = document.getElementById('hero-track');
    const bar = document.getElementById('gallery-progress');
    const inner = bar ? bar.querySelector('.progress-bar-inner') : null;
    if (!track || !inner) return;

    track.addEventListener('scroll', () => {
        window.requestAnimationFrame(updateGalleryProgressNow);
    });

    updateGalleryProgressNow();
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

// Update progress bar based on current hero-track position (supports infinite loop clones)
function updateGalleryProgressNow() {
    const track = document.getElementById('hero-track');
    const bar = document.getElementById('gallery-progress');
    const inner = bar ? bar.querySelector('.progress-bar-inner') : null;
    if (!track || !inner) return;

    const isInfinite = track.dataset.infinite === 'true';
    const realSlides = Number(track.dataset.slidesCount || (track.children.length - (isInfinite ? 2 : 0)));
    if (!realSlides) return;

    const width = track.clientWidth || 1;
    const offset = isInfinite ? 1 : 0;
    const rawIndex = (track.scrollLeft / width) - offset;
    const index = Math.round(rawIndex);
    const clampedIndex = Math.min(realSlides - 1, Math.max(0, index));
    const progress = Math.min(100, Math.max(0, ((clampedIndex + 1) / realSlides) * 100));
    inner.style.width = `${progress}%`;
}

// Make mobile hero slider loop infinitely by cloning first/last slides
function makeHeroTrackInfinite() {
    const track = document.getElementById('hero-track');
    if (!track) return;

    // Remove existing clones if any
    track.querySelectorAll('.hero-slide[data-clone="true"]').forEach(node => node.remove());

    const slides = Array.from(track.querySelectorAll('.hero-slide'));
    const realCount = slides.length;
    track.dataset.slidesCount = realCount;

    if (realCount <= 1) {
        track.dataset.infinite = 'false';
        return;
    }

    const firstClone = slides[0].cloneNode(true);
    const lastClone = slides[realCount - 1].cloneNode(true);
    firstClone.dataset.clone = 'true';
    lastClone.dataset.clone = 'true';

    track.insertBefore(lastClone, track.firstChild);
    track.appendChild(firstClone);
    track.dataset.infinite = 'true';

    // Ensure we start on the first real slide (after the prepended clone)
    requestAnimationFrame(() => {
        track.scrollLeft = track.clientWidth;
        updateGalleryProgressNow();
    });

    // Attach loop handler once
    if (!track.dataset.loopHandlerAttached) {
        track.addEventListener('scroll', () => {
            const width = track.clientWidth || 1;
            const total = Number(track.dataset.slidesCount || 0);
            if (!total) return;

            const maxScroll = width * (total + 1); // last clone position
            if (track.scrollLeft <= 1) {
                // Jump to last real slide
                track.scrollLeft = width * total;
                updateGalleryProgressNow();
            } else if (track.scrollLeft >= maxScroll) {
                // Jump to first real slide
                track.scrollLeft = width;
                updateGalleryProgressNow();
            }
        }, { passive: true });
        track.dataset.loopHandlerAttached = 'true';
    }
}

let productViewer = null;

function getViewerFrameWindow() {
    const iframe = document.getElementById('global-3d-iframe');
    if (!iframe) return null;
    try {
        return iframe.contentWindow;
    } catch {
        return null;
    }
}

function attachViewerBridge(iframe) {
    if (!iframe) return;
    let frameWindow;
    try {
        frameWindow = iframe.contentWindow;
    } catch {
        return;
    }
    if (!frameWindow) return;

    const onReady = () => {
        if (!frameWindow.viewer) return;
        productViewer = frameWindow.viewer;
        syncConfiguratorToViewer();
    };

    if (frameWindow.viewerReady && frameWindow.viewer) {
        onReady();
        return;
    }

    frameWindow.addEventListener('viewer-api-ready', onReady, { once: true });
}

function withProductViewer(run) {
    if (productViewer) {
        run(productViewer);
        return true;
    }
    const product = window.__currentProduct;
    if (product && product.modelUrl) {
        open3D(product.modelUrl);
    }
    const iframe = document.getElementById('global-3d-iframe');
    attachViewerBridge(iframe);
    return false;
}

async function initProductConfigurator(product) {
    const mount = document.getElementById('product-configurator');
    if (!mount || !product.configApiUrl) return;

    mount.innerHTML = '<p class="configurator-loading">Chargement de la configuration…</p>';

    try {
        const response = await fetch(product.configApiUrl);
        if (!response.ok) throw new Error('Config unavailable');
        const api = await response.json();
        const project = api.project || {};
        window.__viewerProject = project;
        mount.innerHTML = renderConfiguratorMarkup(project);
        wireConfiguratorEvents(project);
        if (product.modelUrl) {
            open3D(product.modelUrl);
        }
    } catch {
        mount.innerHTML = '<p class="configurator-error">Impossible de charger la configuration 3D.</p>';
    }
}

function renderConfiguratorMarkup(project) {
    const rules = project.rules || [];
    const engravings = project.engravings || [];
    const viewpoints = project.viewpoints || [];
    const defaults = project.defaults || {};
    const defaultRules = defaults.rules || {};

    const rulesHtml = rules.map(rule => {
        const activeId = defaultRules[rule.id] || (rule.options && rule.options[0] && rule.options[0].id);
        return `
            <div class="config-group" data-rule-id="${rule.id}">
                <span class="config-group-label">${rule.label || rule.id}</span>
                <div class="config-options">
                    ${(rule.options || []).map(opt => `
                        <button type="button"
                                class="config-option ${opt.id === activeId ? 'active' : ''}"
                                data-rule-id="${rule.id}"
                                data-option-id="${opt.id}">
                            ${opt.label || opt.id}
                        </button>
                    `).join('')}
                </div>
            </div>
        `;
    }).join('');

    const engravingsHtml = engravings.map(zone => {
        const text = defaults.engravingText || zone.text || '';
        const font = defaults.engravingFont || zone.font || (zone.fonts && zone.fonts[0]) || '';
        const fontOptions = (zone.fonts || []).map(name => `
            <option value="${name}" ${name === font ? 'selected' : ''}>${name}</option>
        `).join('');
        return `
            <div class="config-group" data-engraving-id="${zone.id}">
                <label class="config-group-label" for="engraving-${zone.id}">${zone.label || 'Gravure'}</label>
                <input type="text" class="config-text" id="engraving-${zone.id}"
                       data-engraving-id="${zone.id}" value="${escapeHtmlAttr(text)}" maxlength="32">
                ${fontOptions ? `
                <select class="config-select" data-engraving-font="${zone.id}">${fontOptions}</select>
                ` : ''}
            </div>
        `;
    }).join('');

    const viewpointsHtml = viewpoints.length ? `
        <div class="config-group">
            <span class="config-group-label">Vue</span>
            <div class="config-options">
                ${viewpoints.map(vp => `
                    <button type="button" class="config-option viewpoint-option ${vp.id === project.defaultViewpoint ? 'active' : ''}"
                            data-viewpoint-id="${vp.id}">
                        ${vp.label || vp.id}
                    </button>
                `).join('')}
            </div>
        </div>
    ` : '';

    return `
        <div class="configurator-panel">
            <h2 class="configurator-title">Personnalisation</h2>
            ${rulesHtml}
            ${engravingsHtml}
            ${viewpointsHtml}
        </div>
    `;
}

function escapeHtmlAttr(value) {
    return String(value)
        .replace(/&/g, '&amp;')
        .replace(/"/g, '&quot;')
        .replace(/</g, '&lt;');
}

function wireConfiguratorEvents(project) {
    const mount = document.getElementById('product-configurator');
    if (!mount) return;

    mount.querySelectorAll('[data-rule-id][data-option-id]').forEach(btn => {
        btn.addEventListener('click', () => {
            const ruleId = btn.dataset.ruleId;
            const optionId = btn.dataset.optionId;
            mount.querySelectorAll(`[data-rule-id="${ruleId}"][data-option-id]`).forEach(el => {
                el.classList.toggle('active', el === btn);
            });
            applyViewerRule(ruleId, optionId);
        });
    });

    mount.querySelectorAll('.config-text[data-engraving-id]').forEach(input => {
        const apply = () => applyViewerEngravingText(input.dataset.engravingId, input.value);
        input.addEventListener('change', apply);
        input.addEventListener('input', debounce(apply, 300));
    });

    mount.querySelectorAll('select[data-engraving-font]').forEach(select => {
        select.addEventListener('change', () => {
            applyViewerEngravingFont(select.dataset.engravingFont, select.value);
        });
    });

    mount.querySelectorAll('.viewpoint-option').forEach(btn => {
        btn.addEventListener('click', () => {
            mount.querySelectorAll('.viewpoint-option').forEach(el => {
                el.classList.toggle('active', el === btn);
            });
            applyViewerViewpoint(btn.dataset.viewpointId);
        });
    });
}

function debounce(fn, ms) {
    let timer;
    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => fn(...args), ms);
    };
}

function applyViewerRule(ruleId, optionId) {
    if (!withProductViewer(viewer => viewer.applyRule(ruleId, optionId))) {
        window.__pendingViewerActions = window.__pendingViewerActions || [];
        window.__pendingViewerActions.push({ type: 'rule', ruleId, optionId });
    }
}

function applyViewerEngravingText(engravingId, text) {
    if (!withProductViewer(viewer => viewer.setEngravingText(engravingId, text))) {
        window.__pendingViewerActions = window.__pendingViewerActions || [];
        window.__pendingViewerActions.push({ type: 'engravingText', engravingId, text });
    }
}

function applyViewerEngravingFont(engravingId, fontName) {
    if (!withProductViewer(viewer => viewer.setEngravingFont(engravingId, fontName))) {
        window.__pendingViewerActions = window.__pendingViewerActions || [];
        window.__pendingViewerActions.push({ type: 'engravingFont', engravingId, fontName });
    }
}

function applyViewerViewpoint(viewpointId) {
    if (!withProductViewer(viewer => viewer.gotoViewpoint(viewpointId))) {
        window.__pendingViewerActions = window.__pendingViewerActions || [];
        window.__pendingViewerActions.push({ type: 'viewpoint', viewpointId });
    }
}

function syncConfiguratorToViewer() {
    if (!productViewer || !window.__viewerProject) return;

    const pending = (window.__pendingViewerActions || []).slice();
    window.__pendingViewerActions = [];

    const mount = document.getElementById('product-configurator');
    if (mount) {
        mount.querySelectorAll('[data-rule-id][data-option-id].active').forEach(btn => {
            productViewer.applyRule(btn.dataset.ruleId, btn.dataset.optionId);
        });
        mount.querySelectorAll('.config-text[data-engraving-id]').forEach(input => {
            productViewer.setEngravingText(input.dataset.engravingId, input.value);
        });
        mount.querySelectorAll('select[data-engraving-font]').forEach(select => {
            productViewer.setEngravingFont(select.dataset.engravingFont, select.value);
        });
        const activeVp = mount.querySelector('.viewpoint-option.active');
        if (activeVp) productViewer.gotoViewpoint(activeVp.dataset.viewpointId);
    } else {
        const defaults = window.__viewerProject.defaults || {};
        const rules = defaults.rules || {};
        Object.entries(rules).forEach(([ruleId, optionId]) => {
            productViewer.applyRule(ruleId, optionId);
        });
        if (defaults.engravingText) {
            const zones = window.__viewerProject.engravings || [];
            zones.forEach(zone => {
                productViewer.setEngravingText(zone.id, defaults.engravingText);
            });
        }
        if (defaults.engravingFont) {
            const zones = window.__viewerProject.engravings || [];
            zones.forEach(zone => {
                productViewer.setEngravingFont(zone.id, defaults.engravingFont);
            });
        }
        const vp = window.__viewerProject.defaultViewpoint;
        if (vp) productViewer.gotoViewpoint(vp);
    }

    pending.forEach(action => {
        if (action.type === 'rule') productViewer.applyRule(action.ruleId, action.optionId);
        if (action.type === 'engravingText') productViewer.setEngravingText(action.engravingId, action.text);
        if (action.type === 'engravingFont') productViewer.setEngravingFont(action.engravingId, action.fontName);
        if (action.type === 'viewpoint') productViewer.gotoViewpoint(action.viewpointId);
    });
}

