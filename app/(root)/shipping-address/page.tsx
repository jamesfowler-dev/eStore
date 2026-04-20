import { auth } from "@/auth";
import { getMyCart } from "@/lib/actions/cart.actions";
import { getUserByID } from "@/lib/actions/user.actions";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import { ShippingAddress } from "@/types";

export const metadata: Metadata = {
    title: 'Shipping Address',
}

// Shows in the browser tab
const shippingAddressPage = async () => {
    const cart = await getMyCart();

    if (!cart || cart.items.length === 0) redirect('/cart');

    const session = await auth();

    const userId = session?.user?.id;

    if (!userId) throw new Error('No user ID');

    const user = await getUserByID(userId);

    return ( <>Address</> );
}
 
export default shippingAddressPage;