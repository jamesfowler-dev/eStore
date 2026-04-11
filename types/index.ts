export type Product = {
    id: string;
    name: string;
    slug: string;
    category: string;
    images: string[];
    brand: string;
    description: string;
    stock: number;
    price: string;
    rating: string;
    numReviews: number;
    isFeatured: boolean;
    banner: string | null;
    created_at: Date;
};
