'use client';

import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { Cart, CartItem } from '@/types';
import { toast } from 'sonner';
import { addItemToCart, removeItemFromCart } from '@/lib/actions/cart.actions';
import { Plus, Minus } from 'lucide-react';


const AddToCart = ({ cart, item }: { cart?: Cart; item: CartItem }) => {
    const router = useRouter();

    const handleAddToCart = async () => {
        try {
            const res = await addItemToCart(item);

            if (!res) {
            toast.error('Failed to add item to cart', {
                className: "bg-red-600 text-white border-red-700"
            });
            return;
            }

            if (!res.success) {
            // Extract message string from response
            const errorMsg = typeof res.message === 'string' ? res.message : (
                res.message?.message ?? 'Failed to add item to cart');
            toast.error(errorMsg, {
                className: "bg-red-600 text-white border-red-700",
                style: {
                    zIndex: 9999,
                },
            });
            return;
            }

            // Handle success add to cart
            const successMsg = typeof res.message === 'string' ? res.message : (
                res.message?.message ?? 'Item added successfully');
            toast.success("Added to cart", {
                description: successMsg,
                className: "text-white border-green-600 shadow-lg",
                style: {
                    backgroundColor: '#ffffff',
                    zIndex: 9999,
                },
                actionButtonStyle: {
                    backgroundColor: "#000000",
                    color: "#ffffff",
                    borderRadius: "4px",
                    padding: "4px 8px",
                    fontWeight: "500",
                },                    
                action: {
                    label: "Go To Cart",
                    onClick: () => router.push("/cart"),
                },
            });
        } catch {
            toast.error('Failed to add item to cart');
        }
    };


    // Handle remove from cart
    const handleRemoveFromCart = async () => {
        const res = await removeItemFromCart(item.productId);
        const msg = typeof res.message === 'string' ? res.message : (
            res.message?.message ?? 'Item updated');
        
        if (res.success) {
            toast.success(msg, {
                className: "text-white border-green-600 shadow-lg",
                style: {
                    backgroundColor: '#ffffff',
                    zIndex: 9999,
                },
            });
        } else {
            toast.error(msg);
        }
    }

    // Check if item is in cart
    const existItem = cart && cart.items.find((x) => x.productId === item.productId);

    return existItem ? (
        <div>
            <Button 
                type='button' 
                variant='outline'
                onClick={handleRemoveFromCart}
            >
                <Minus className='h-4 w-4' />
            </Button>
            <span className="px-2">{existItem.qty}</span>
            <Button 
                type='button' 
                variant='outline'
                onClick={handleAddToCart}
            >
                <Plus className='h-4 w-4' />
            </Button>
        </div>
    ): (
        <Button 
            className='w-full' 
            type='button' 
            onClick={handleAddToCart}
        >
            <Plus />Add To Cart
        </Button>
    );
}
 
export default AddToCart;


