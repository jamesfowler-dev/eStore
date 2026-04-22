import { z } from 'zod';
import { 
    insertProductSchema, 
    insertCartSchema, 
    cartItemSchema, 
    shippingAddressSchema 
} from '@/lib/validators';

export type Product = z.infer<typeof insertProductSchema> & {
    id: string;
    rating: string;
    numReviews: number;
    created_at: Date;
    slug: string;
    images: string[];
    name: string;
    brand: string;
    stock: number;
    price: string;
};

export type Cart = z.infer<typeof insertCartSchema>;
export type CartItem = z.infer<typeof cartItemSchema>;
export type ShippingAddress = z.infer<typeof shippingAddressSchema>;

