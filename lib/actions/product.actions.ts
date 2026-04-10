"use server";
// import "dotenv/config";
// import { PrismaPg } from "@prisma/adapter-pg";
import { prisma } from "@/db/prisma";
import { convertToPlainObject } from "../utils";
import { LATEST_PRODUCTS_LIMIT } from "../constants";

// Get latest products
export async function getLatestProducts() {
    // const connectionString = process.env.DATABASE_URL;
    // const adapter = new PrismaPg({ connectionString });
    // const prisma = new PrismaClient({ adapter });

    const data = await prisma.product.findMany({
        take: LATEST_PRODUCTS_LIMIT,
        orderBy: { created_at: "desc" },
    });

    return convertToPlainObject(data);
}


// Get single product by it's slug 
export async function getProductBySlug(slug: string) {
    return await prisma.product.findFirst({
        where: { slug: slug },
    });
}