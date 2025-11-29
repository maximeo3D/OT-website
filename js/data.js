const products = [
    {
        id: 1,
        name: "T-Shirt Basique",
        price: 25.00,
        category: "Accessoires d'arme",
        productType: "Type 1",
        description: "Un t-shirt en coton bio d'une douceur incomparable. Coupe ajustée, idéal pour le quotidien. Disponible en plusieurs coloris.",
        images: ["assets/product-placeholder.svg", "assets/product-placeholder.svg"],
        modelUrl: "https://playground.babylonjs.com/full.html#6XIT28#5",
        bestseller: true,
        stock: true,
        promo: 20
    },
    {
        id: 2,
        name: "Pantalon Noir",
        price: 60.00,
        category: "Accessoires d'arme",
        productType: "Type 1",
        description: "Pantalon chino noir élégant et confortable. Parfait pour le travail ou les sorties décontractées.",
        images: ["assets/product-placeholder.svg"],
        bestseller: false,
        stock: true,
        promo: 0
    },
    {
        id: 3,
        name: "Veste Légère",
        price: 85.00,
        category: "Accessoires de tir",
        productType: "Type 2",
        description: "Veste mi-saison imperméable. Style urbain et protection contre les intempéries.",
        images: ["assets/product-placeholder.svg"],
        bestseller: false,
        stock: false,
        promo: 15
    },
    {
        id: 4,
        name: "Chemise Blanche",
        price: 45.00,
        category: "Accessoires de tir",
        productType: "Type 2",
        description: "Chemise blanche classique en popeline de coton. Un indispensable du vestiaire masculin.",
        images: ["assets/product-placeholder.svg"],
        bestseller: true,
        stock: true,
        promo: 0
    },
    {
        id: 5,
        name: "Sneakers Graphite",
        price: 95.00,
        category: "Accessoires d'arme",
        productType: "Type 3",
        description: "Basket montante en cuir grainé avec semelle cousue. Confort premium pour les journées actives.",
        images: ["assets/product-placeholder.svg"],
        bestseller: true,
        stock: true,
        promo: 10
    },
    {
        id: 6,
        name: "Sac Minimaliste",
        price: 95.00,
        category: "Goodies",
        productType: "Type 3",
        description: "Sac bandoulière en toile recyclée avec poches modulaires. Parfait pour transporter l'essentiel.",
        images: ["assets/product-placeholder.svg"],
        bestseller: false,
        stock: true,
        promo: 0
    },
    {
        id: 7,
        name: "Montre Acier Brossé",
        price: 90.00,
        category: "Goodies",
        productType: "Type 4",
        description: "Montre analogique épurée avec cadran mat et bracelet interchangeable.",
        images: ["assets/product-placeholder.svg"],
        bestseller: false,
        stock: false,
        promo: 25
    },
    {
        id: 8,
        name: "Lunettes Transparentes",
        price: 70.00,
        category: "Accessoires de tir",
        productType: "Type 2",
        description: "Monture légère aux lignes géométriques. Protection anti-lumière bleue intégrée.",
        images: ["assets/product-placeholder.svg"],
        bestseller: true,
        stock: true,
        promo: 0
    },
    {
        id: 9,
        name: "Bougie Atelier",
        price: 32.00,
        category: "Goodies",
        productType: "Type 5",
        description: "Bougie parfumée cire de soja, notes de bois fumé et cuir. Pot en ciment réutilisable.",
        images: ["assets/product-placeholder.svg"],
        bestseller: false,
        stock: false,
        promo: 0
    },
    {
        id: 10,
        name: "Plaid Texturé",
        price: 65.00,
        category: "Goodies",
        productType: "Type 5",
        description: "Plaid oversized en coton bio tissé. Ajoute chaleur et relief à votre salon.",
        images: ["assets/product-placeholder.svg"],
        bestseller: false,
        stock: true,
        promo: 5
    },
    {
        id: 11,
        name: "Lampe de Bureau Axis",
        price: 85.00,
        category: "Goodies",
        productType: "Type 4",
        description: "Lampe articulée aluminium brossé, éclairage LED dimmable.",
        images: ["assets/product-placeholder.svg"],
        bestseller: true,
        stock: true,
        promo: 0
    },
    {
        id: 12,
        name: "Tabouret Béton",
        price: 80.00,
        category: "Goodies",
        productType: "Type 3",
        description: "Tabouret cylindrique en béton fibré. Fait office d'assise ou de table d'appoint.",
        images: ["assets/product-placeholder.svg"],
        bestseller: false,
        stock: false,
        promo: 0
    },
    {
        id: 13,
        name: "Tapis Graphique",
        price: 100.00,
        category: "Goodies",
        productType: "Type 6",
        description: "Tapis laine et coton motifs ton-sur-ton. Résiste aux passages intensifs.",
        images: ["assets/product-placeholder.svg"],
        bestseller: true,
        stock: true,
        promo: 12
    },
    {
        id: 14,
        name: "Coque Cuir Premium",
        price: 45.00,
        category: "Goodies",
        productType: "Type 4",
        description: "Coque smartphone en cuir pleine fleur avec intérieur microfibre protecteur.",
        images: ["assets/product-placeholder.svg"],
        bestseller: false,
        stock: true,
        promo: 0
    }
];

// Helper function to get product by ID
function getProductById(id) {
    return products.find(p => p.id === parseInt(id, 10));
}

// Expose for other scripts that expect globals
window.products = products;
window.getProductById = getProductById;
