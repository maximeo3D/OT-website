const products = [
    {
        id: 1,
        name: "Poignée avant angulaire",
        price: 20,
        category: "Accessoires d'arme",
        productType: "Type 1",
        description: "Poignée avant pour AR-15 et AR-10. Conçue pour une prise de main optimale et une manipulation facile.",
        images: ["assets/images/grip_black_side.png", "assets/images/grip_black_iso.png", "assets/images/grip_black_ar.png"],
        variants: [
            { color: "#000000", colorName: "Noir", images: ["assets/images/grip_black_side.png", "assets/images/grip_black_iso.png", "assets/images/grip_black_ar.png"] },
            { color: "#9D8975", colorName: "Sable", images: ["assets/images/grip_sable_side.png", "assets/images/grip_sable_iso.png"] },
            { color: "#47522D", colorName: "Kaki", images: ["assets/images/grip_kaki_side.png", "assets/images/grip_kaki_iso.png"] }
        ],
        modelUrl: "https://maximeo3d.github.io/3D-angled-grip/",
        bestseller: true,
        stock: true,
        promo: 0
    },
    {
        id: 2,
        name: "Pistol Grip ",
        price: 15,
        category: "Accessoires d'arme",
        productType: "Type 1",
        description: "Poignée type pistol grip. Conçue pour une prise de main optimale et une manipulation facile.",
        images: ["assets/images/grip_black_side.png", "assets/images/grip_black_iso.png", "assets/images/grip_black_ar.png"],
        variants: [
            { color: "#000000", colorName: "Noir", images: ["assets/images/grip_black_side.png", "assets/images/grip_black_iso.png", "assets/images/grip_black_ar.png"] },
            { color: "#9D8975", colorName: "Sable", images: ["assets/images/grip_sable_side.png", "assets/images/grip_sable_iso.png"] },
            { color: "#47522D", colorName: "Kaki", images: ["assets/images/grip_kaki_side.png", "assets/images/grip_kaki_iso.png"] }
        ],
        modelUrl: "https://maximeo3d.github.io/3D-AR-grip/",
        bestseller: true,
        stock: true,
        promo: 0
    },
    {
        id: 2,
        name: "Etui de culasse Savage B22  ",
        price: 15,
        category: "Accessoires d'arme",
        productType: "Type 1",
        description: "Etui de culasse pour Savage B22. Conçu pour protéger votre la culasse de votre arme lors des transports. L'étui est magnetique, parfait pour le stockage dans un coffre en metal.",
        images: ["assets/images/grip_black_side.png", "assets/images/grip_black_iso.png", "assets/images/grip_black_ar.png"],
        variants: [
            { color: "#000000", colorName: "Noir", images: ["assets/images/grip_black_side.png", "assets/images/grip_black_iso.png", "assets/images/grip_black_ar.png"] },
            { color: "#9D8975", colorName: "Gris", images: ["assets/images/grip_sable_side.png", "assets/images/grip_sable_iso.png"] },
            { color: "#FFFFFF", colorName: "Blanc", images: ["assets/images/grip_kaki_side.png", "assets/images/grip_kaki_iso.png"] },
            { color: "#47522D", colorName: "Kaki", images: ["assets/images/grip_kaki_side.png", "assets/images/grip_kaki_iso.png"] }
        ],
        modelUrl: "https://maximeo3d.github.io/3D-etui-B22/",
        bestseller: true,
        stock: true,
        promo: 0
    },
    {
        id: 4,
        name: "Support de munitions 22lr",
        price: 5.00,
        category: "Accessoires de tir",
        productType: "Type 2",
        description: "Support de munitions pour optimiser le chargement de votre arme. Disponible en plusieurs calibres.",
        images: ["assets/images/ph-1.jpg", "assets/images/ph-2.jpg", "assets/images/ph-3.jpg"],
        bestseller: true,
        stock: true,
        promo: 0
    },
    {
        id: 6,
        name: "Magnet Barillet",
        price: 15.00,
        category: "Goodies",
        productType: "Type 3",
        description: "Sac bandoulière en toile recyclée avec poches modulaires. Parfait pour transporter l'essentiel.",
        images: ["assets/images/ph-1.jpg", "assets/images/ph-2.jpg", "assets/images/ph-3.jpg"],
        bestseller: false,
        stock: true,
        promo: 0
    },
    {
        id: 10,
        name: "Porte-clé OVNI",
        price: 10.00,
        category: "Goodies",
        productType: "Type 5",
        description: "Porte clé en forme d'OVNI. Pour personnaliser votre trousseau, ou votre arme. Accroche Picatinny/m-lok vendus en option ou à part",
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
