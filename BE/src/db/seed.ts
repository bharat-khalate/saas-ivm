import { PrismaClient, Prisma } from '../../generated/prisma/index.js';

const prisma = new PrismaClient();
const images = [
    "http://localhost:5000/api/files/1/1773401985080-915947658.jpg",
    "http://localhost:5000/api/files/1/1777895379721-390960622.jpg",
    "http://localhost:5000/api/files/1/1777895271845-6527888.png",
    "http://localhost:5000/api/files/1/1777962336688-236198921.jpg"
];
const getRandomImage = () => {
    return images[Math.floor(Math.random() * images.length)];
};
async function main() {
    console.log("🌱 Seeding started...");

    const user = await prisma.user.upsert({
        where: { email: "admin@test.com" },
        update: {},
        create: {
            email: "admin@test.com",
            password: "$2b$10$4nErabIkS0SMDJJr98y6qeqUAalkaiZjxQgaAf1vOuHPFSlCaNrx.",//password
            organisationName: "My Store",
        },
    });

    await prisma.settings.upsert({
        where: { organizationId: user.userId },
        update: {},
        create: {
            organizationId: user.userId,
            defaultLowStockThreshold: 5,
        },
    });

    const categories = ["electronic", "fashion", "grocery", "books"];

    for (const cat of categories) {
        await prisma.category.upsert({
            where: { category: cat },
            update: {},
            create: { category: cat },
        });
    }

    const productsData = Array.from({ length: 30 }).map((_, i) => {
        const category = categories[i % categories.length];

        return {
            sku: `SKU-${i + 1}`,
            name: `Product ${i + 1}`,
            description: `Description for product ${i + 1}`,
            category,
            costPrice: new Prisma.Decimal(100 + i * 10),
            sellingPrice: new Prisma.Decimal(150 + i * 10),
            quantityOnHand: 10 + i,
        };
    });


    for (const p of productsData) {
        await prisma.product.upsert({
            where: {
                organizationId_sku: {
                    organizationId: user.userId,
                    sku: p.sku,
                },
            },
            update: {},
            create: {
                organizationId: user.userId,
                name: p.name,
                sku: p.sku,
                description: p.description,
                quantityOnHand: p.quantityOnHand,
                costPrice: p.costPrice,
                sellingPrice: p.sellingPrice,
                categoryName: p.category,
                fileUrl: getRandomImage(),
                translations: {
                    create: [
                        {
                            language: "en",
                            name: p.name,
                            description: p.description,
                        },
                        {
                            language: "hi",
                            name: `हिंदी ${p.name}`,
                            description: `हिंदी विवरण ${p.name}`,
                        },
                    ],
                },
            },
        });
    }

    console.log(" Seeding finished!");
}

main()
    .catch((e) => {
        console.error("Seeding error:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });