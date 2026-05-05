import { Metadata } from "next";
import { getOrderById } from "@/lib/actions/order-actions";
import { notFound } from "next/navigation";
import OrderDetailsTable from './order-details-table';
import { ShippingAddress } from "@/types";

export const metadata: Metadata = {
    title: 'Order Details'
};

// Declares an async React component called OrderDetailsPage. It expects a props object 
// with a params property, which is a Promise resolving to an object with an id string. What 
// this actually means is the params property is not an object right away, but a Promise 
// (an object representing a future value).
const OrderDetailsPage = async (props: {
    params: Promise<{
        id: string
    }>
}) => {
    // Waits for the params Promise to resolve, then extracts the id value from it.
    const { id } = await props.params;
    const order = await getOrderById(id);
    if (!order) notFound();

    return (
        <OrderDetailsTable
            order={{
                ...order,
                shippingAddress: order.shippingAddress as ShippingAddress,
            }}
        />
    );
};

export default OrderDetailsPage;


// This component receives a Promise for route parameters, waits for it to resolve, 
// extracts the id, and displays it.
// Note: In Next.js, params is usually passed as a plain object, not a Promise—so you may 
// want to update the type to params: { id: string } instead of params: 
// Promise<{ id: string }>.

