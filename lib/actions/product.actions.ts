"use server";

import { prisma } from "@/db/prisma";
import { convertToPlainObject } from "../utils";
import { LATEST_PRODUCTS_LIMIT } from "../constants";

// Get latest products
export async function getLatestProducts() {

    // Queries Prisma for products in descending orde
    const data = await prisma.product.findMany({

        // Limits the number returned. In Prisma, "take" means how many records to return
        take: LATEST_PRODUCTS_LIMIT,
        // sort by the created_at field in descending order
        orderBy: { created_at: "desc" },
    });

    // Converts Prisma results into plain JS objects 
    return convertToPlainObject(data);
}


// Get single product by it's slug 
export async function getProductBySlug(slug: string) {
    return await prisma.product.findFirst({
        where: { slug: slug },
    });
}