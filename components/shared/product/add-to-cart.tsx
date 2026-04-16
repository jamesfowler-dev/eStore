// This page is simply a component that is the dynamic add-to-cart button
// Shows an "Add To Cart" button if the item isn't in the cart
// Shows quantity controls (minus/count/plus buttons) if the item IS in the cart
// Handles adding, removing, and updating quantities with toast notifications

'use client';

import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation'; // Navigate between pages
import { Cart, CartItem } from '@/types'; // TypeScript types for cart and items
import { toast } from 'sonner'; // Toast notification library
import { addItemToCart, removeItemFromCart } from '@/lib/actions/cart.actions'; // Server actions
import { Plus, Minus, Loader } from 'lucide-react'; // Icon components
import { useTransition } from 'react';


const AddToCart = ({ cart, item }: { cart?: Cart; item: CartItem }) => {
    // cart = optional existing cart object

    // This is called a Router Hook which is used to navigate to /cart page
    const router = useRouter();
    const [isPending, startTransition] = useTransition();


    // This is called when user clicks "Add To Cart"
    const handleAddToCart = async () => {
        startTransition(async () => {
            try {
                // Calls server action to add item
                const res = await addItemToCart(item);

                if (!res) {
                toast.error('Failed to add item to cart', {
                    className: "bg-red-600 text-white border-red-700"
                });
                return;
                }

                //  If response indicates failure , extract message (handle both string and object formats) and show error toast
                if (!res.success) {
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

                // If successfull, extract success, show success toast with description of what was added, 
                // "Go To Cart" button & click the button to navigate to /cart
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
        })
    };


    // Handle remove from cart
    const handleRemoveFromCart = async () => {
        startTransition(async () => {
            // Call server action to remove item from cart
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
        });
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
                {isPending ? (
                    <Loader className='w-4 h-4 animate-spin' />
                ) : (
                    <Minus className='h-4 w-4' />
                )}
            </Button>
            <span className="px-2">{existItem.qty}</span>
            <Button 
                type='button' 
                variant='outline'
                onClick={handleAddToCart}
            >
                {isPending ? (
                    <Loader className='w-4 h-4 animate-spin' />
                ) : (
                    <Plus className='h-4 w-4' />
                )}
            </Button>
        </div>
    ): (
        <Button 
            className='w-full' 
            type='button' 
            onClick={handleAddToCart}
        >
                {isPending ? (
                    <Loader className='w-4 h-4 animate-spin' />
                ) : (
                    <Plus className='h-4 w-4' />
                )}{' '}
                Add To Cart
        </Button>
    );
}
 
export default AddToCart;


