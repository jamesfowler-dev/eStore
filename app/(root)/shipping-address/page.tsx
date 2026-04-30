// This file is the server component page for the "Shipping Address" step in the checkout flow.

import { auth } from "@/auth";
import { getMyCart } from "@/lib/actions/cart.actions";
import { getUserById } from "@/lib/actions/user.actions";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import { ShippingAddress } from "@/types";
import ShippingAddressForm from "./shipping-address-form";
import CheckoutSteps from "@/components/shared/checkout-steps";


// Shows in the browser tab
export const metadata: Metadata = {
    title: 'Shipping Address',
}

// Declares an async React server component for the page.
const ShippingAddressPage = async () => {

    //  Fetches the current user's cart
    const cart = await getMyCart();

    // If there’s no cart or it’s empty, redirects the user to the cart page
    if (!cart || cart.items.length === 0) redirect('/cart');

    // Gets the current user session
    const session = await auth();

    // Extracts the user ID from the session
    const userId = session?.user?.id;

    // If there’s no user ID (not signed in), redirects to the sign-in page
    if (!userId) redirect('/sign-in');

    // Fetches the user’s data from the database
    const user = await getUserById(userId);

    // Renders the ShippingAddressForm component, passing the user’s address as a prop
    return (
        <>
            <CheckoutSteps current={1} />
            <ShippingAddressForm address={user.address as ShippingAddress}
            />
        </>
    );
};

export default ShippingAddressPage;