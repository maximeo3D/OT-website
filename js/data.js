const products = [
    {
        id: 1,
        name: "T-Shirt Basique",
        price: 25.00,
        category: "Vêtements",
        description: "Un t-shirt en coton bio d'une douceur incomparable. Coupe ajustée, idéal pour le quotidien. Disponible en plusieurs coloris.",
        images: ["assets/product-placeholder.svg", "assets/product-placeholder.svg"],
        modelUrl: "https://playground.babylonjs.com/full.html#6XIT28#5",
        bestseller: true
    },
    {
        id: 2,
        name: "Pantalon Noir",
        price: 60.00,
        category: "Vêtements",
        description: "Pantalon chino noir élégant et confortable. Parfait pour le travail ou les sorties décontractées.",
        images: ["assets/product-placeholder.svg"],
        bestseller: false
    },
    {
        id: 3,
        name: "Veste Légère",
        price: 85.00,
        category: "Vêtements",
        description: "Veste mi-saison imperméable. Style urbain et protection contre les intempéries.",
        images: ["assets/product-placeholder.svg"],
        bestseller: false
    },
    {
        id: 4,
        name: "Chemise Blanche",
        price: 45.00,
        category: "Vêtements",
        description: "Chemise blanche classique en popeline de coton. Un indispensable du vestiaire masculin.",
        images: ["assets/product-placeholder.svg"],
        bestseller: true
    }
];

// Helper function to get product by ID
function getProductById(id) {
    return products.find(p => p.id === parseInt(id));
}
