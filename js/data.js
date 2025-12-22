const products = [
    {
        id: 1,
        name: "Poignée avant angulaire",
        price: 28.99,
        category: "Accessoires d'arme",
        productType: "Type 1",
        description: "Poignée avant pour AR-15 et AR-10. Conçue pour une prise de main optimale et une manipulation facile.",
        images: ["assets/images/grip_black_side.png", "assets/images/grip_black_iso.png"],
        variants: [
            { color: "#000000", colorName: "Noir", images: ["assets/images/grip_black_side.png", "assets/images/grip_black_iso.png"] },
            { color: "#9D8975", colorName: "Sable", images: ["assets/images/grip_sable_side.png", "assets/images/grip_sable_iso.png"] },
            { color: "#47522D", colorName: "Kaki", images: ["assets/images/grip_kaki_side.png", "assets/images/grip_kaki_iso.png"] }
        ],
        modelUrl: "https://maximeo3d.github.io/3D-grip/",
        bestseller: true,
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
        images: ["assets/images/ph-1.jpg", "assets/images/ph-2.jpg", "assets/images/ph-3.jpg"],
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
        images: ["assets/images/ph-1.jpg", "assets/images/ph-2.jpg", "assets/images/ph-3.jpg"],
        bestseller: true,
        stock: true,
        promo: 0
    },
    {
        id: 6,
        name: "Sac Minimaliste",
        price: 95.00,
        category: "Goodies",
        productType: "Type 3",
        description: "Sac bandoulière en toile recyclée avec poches modulaires. Parfait pour transporter l'essentiel.",
        images: ["assets/images/ph-1.jpg", "assets/images/ph-2.jpg", "assets/images/ph-3.jpg"],
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
        images: ["assets/images/ph-1.jpg", "assets/images/ph-2.jpg", "assets/images/ph-3.jpg"],
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
        images: ["assets/images/ph-1.jpg", "assets/images/ph-2.jpg", "assets/images/ph-3.jpg"],
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
        images: ["assets/images/ph-1.jpg", "assets/images/ph-2.jpg", "assets/images/ph-3.jpg"],
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
        images: ["assets/images/ph-1.jpg", "assets/images/ph-2.jpg", "assets/images/ph-3.jpg"],
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
        images: ["assets/images/ph-1.jpg", "assets/images/ph-2.jpg", "assets/images/ph-3.jpg"],
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
        images: ["assets/images/ph-1.jpg", "assets/images/ph-2.jpg", "assets/images/ph-3.jpg"],
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
        images: ["assets/images/ph-1.jpg", "assets/images/ph-2.jpg", "assets/images/ph-3.jpg"],
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
        images: ["assets/images/ph-1.jpg", "assets/images/ph-2.jpg", "assets/images/ph-3.jpg"],
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
