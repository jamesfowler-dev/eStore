import { z } from 'zod';
import { insertProductSchema, insertCartSchema, cartItemSchema, shippingAddressSchema } from '@/lib/validators';

export type Product = {
    id: string;
    name: string;
    slug: string;
    category: string;
    brand: string;
    description: string;
    stock: number;
    images: string[];
    isFeatured: boolean;
    banner: string | null;
    price: string;
    rating: string;
    numReviews: number;
    created_at: Date;
};

export type Cart = z.infer<typeof insertCartSchema>;
export type CartItem = z.infer<typeof cartItemSchema>;
export type ShippingAddress = z.infer<typeof shippingAddressSchema>;

