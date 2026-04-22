"use server";

import { prisma } from "@/db/prisma";
import { convertToPlainObject } from "../utils";
import { LATEST_PRODUCTS_LIMIT } from "../constants";

// Get latest products
export async function getLatestProducts() {

    // Queries Prisma for products in descending orde
    const data = await prisma.product.findMany({
        take: LATEST_PRODUCTS_LIMIT,
        orderBy: { created_at: "desc" },
        select: {
            id: true,
            name: true,
            slug: true,
            category: true,
            brand: true,
            description: true,
            stock: true,
            images: true,
            isFeatured: true,
            banner: true,
            price: true,
            rating: true,
            numReviews: true,
            created_at: true,
        },
    });
    return convertToPlainObject(data);
}


// Get single product by it's slug 
export async function getProductBySlug(slug: string) {
    return await prisma.product.findFirst({
        where: { slug: slug },
        select: {
            id: true,
            name: true,
            slug: true,
            category: true,
            brand: true,
            description: true,
            stock: true,
            images: true,
            isFeatured: true,
            banner: true,
            price: true,
            rating: true,
            numReviews: true,
            created_at: true,
        },
    });
}