'use client';

import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { CartItem } from '@/types';
import { toast } from 'sonner';
import { addItemToCart } from '@/lib/actions/cart.actions';


const AddToCart = ({item}: {item: CartItem}) => {
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
            // If response message is null or underfined, shows 'Failed to add item to cart'
            toast.error(res.message ?? 'Failed to add item to cart', {
                className: "bg-red-600 text-white border-red-700"
            });
            return;
            }

            toast.success("Added to cart", {
                className: "!bg-transparent !text-foreground !shadow-none",
                style: {
                    border: "1px solid rgb(209 213 219)", // gray-300
                    background: "transparent",
                    boxShadow: "none",
                },
                actionButtonStyle: {
                    backgroundColor: "#000000",
                    color: "#ffffff",
                    borderRadius: "4px",
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

    return (
        <Button 
            className='w-full' 
            type='button' 
            onClick={handleAddToCart}
        >
            Add To Cart
        </Button>);
}
 
export default AddToCart;