'use server';

// This file defines two server actions. addItemToCart prepares and validates data needed to 
// add a product to a cart.
// getMyCart: fetches the current user’s cart (or guest cart via cookie) from the database

// cookies imports Next.js API to read request cookies on the server
import { cookies } from 'next/headers';
import { CartItem } from '@/types';
import { convertToPlainObject, formatError, round2 } from '../utils';
import { auth } from '@/auth';
import { prisma } from '@/db/prisma';
import { cartItemSchema, insertCartSchema } from '../validators';
import { revalidatePath } from 'next/cache';


// Calculate cart prices
const calcPrice = (items: CartItem[]) => {
    const itemsPrice = round2(
        items.reduce((acc, item) => acc + Number(item.price) * item.qty, 0)
    ),
        // Calculate shipping price
        shippingPrice = round2(itemsPrice > 100 ? 0 : 10), 
        taxPrice = round2(0.15 * itemsPrice),
        totalPrice = round2(itemsPrice + shippingPrice + taxPrice)

        return {
            itemsPrice: itemsPrice.toFixed(2),
            shippingPrice: shippingPrice.toFixed(2),
            taxPrice: taxPrice.toFixed(2),
            totalPrice: totalPrice .toFixed(2),
        }
}




// here data is the parameter and CartItem is the type 
export async function addItemToCart(data: CartItem) {
    try {
        // Check for the cart cookie. cookies() is a Next.js function that lets you read
        //  and write HTTP cookies on the server.
        const sessionCartId = (await cookies()).get('sessionCartId')?.value; 
        if (!sessionCartId) throw new Error('Cart session not found');

        // Get current session and user ID or null for guest 
        const session = await auth(); 
        // If session or user or id not there, userId becomes undefined 
        const userId = session?.user?.id ? (session.user.id as string) : undefined; 

        // Get cart
        const cart = await getMyCart(); 

        // Parse and validate item against schema
        const item = cartItemSchema.parse(data);

        // Find product in database
        const product = await prisma.product.findFirst({
            where: {id: item.productId}
        }); 
        if (!product) throw new Error('Product not found'); 
        if (!cart) {
            // Create new cart object
            const newCart = insertCartSchema.parse({
                userId: userId,
                // Creates a new items array containing just the current item being added
                items: [item],
                // Links this cart to the session cookie for guest cart tracking
                sessionCartId: sessionCartId,
                // Spreads in computed price fields returned by calcPrice, such as itemsPrice, 
                // shippingPrice, taxPrice, and totalPrice
                ...calcPrice([item])
                });

                // Add to database 
                await prisma.cart.create({
                    data: newCart
                });

                // Revalidate product page
                revalidatePath(`/product/${product.slug}`)

                return {
                    success: true,
                    message: 'item added to cart',
                };
            } else {
                
            }
        
        } catch (error) {
        return {
            success: false,
            message: formatError(error),
        }
        }


}


export async function getMyCart() {
        // Check for the cart cookie 
        const sessionCartId = (await cookies()).get('sessionCartId')?.value; 
        // Throws if missing
        if (!sessionCartId) throw new Error('Cart session not found');

        // Get session and user ID
        const session = await auth(); 
        // If session or user or id not there, userId becomes undefined 
        const userId = session?.user?.id ? (session.user.id as string) : undefined; 

        // Get user cart from database
        const cart = await prisma.cart.findFirst({
            where: userId ? { userId: userId } : { sessionCartId: sessionCartId }
        });
        
        if (!cart) return undefined;
        
        // Convert decimals and return 
        return convertToPlainObject({
            // Here the spread operator means copy all properties from cart into a new object
            // then override those properties with the lines that come after ie items etc
            ...cart,
            items: cart.items as CartItem[],
            itemsPrice: cart.itemsPrice.toString(),
            totalPrice: cart.totalPrice.toString(),
            shippingPrice: cart.shippingPrice.toString(),
            taxPrice: cart.taxPrice.toString(),
        });

}

