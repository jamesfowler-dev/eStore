'use server';

import { isRedirectError } from "next/dist/client/components/redirect-error";
import { convertToPlainObject, formatError } from "../utils";
import { getMyCart } from "./cart.actions";
import { auth } from "@/auth";
import { getUserById } from "./user.actions";
import { insertOrderItemSchema, insertOrderSchema } from "../validators";
import { prisma } from "@/db/prisma";
import { CartItem, PaymentResult } from "@/types";
import { paypal } from "../paypal";
import { revalidatePath } from "next/cache";

// Create order and create the order items
export async function createOrder() {
    try {
        const session = await auth();
        if (!session) throw new Error('User not authenticated')

        const cart = await getMyCart();
        const userId = session?.user?.id;
        if (!userId) throw new Error('User not found')

        const user = await getUserById(userId);

        if (!cart || cart.items.length === 0) {
            return {
                success: false,
                message: 'Your cart is empty',
                redirectTo: '/cart',
            }
        }

        if (!user.address) {
            return {
                success: false,
                message: 'No shipping address',
                redirectTo: '/shipping-address',
            }
        }

        if (!user.paymentMethod) {
            return {
                success: false,
                message: 'No payment method',
                redirectTo: '/payment-method',
            }
        }

        // Create the order object 
        const order = insertOrderSchema.parse({
            userId: user.id,
            shippingAddress: user.address,
            paymentMethod: user.paymentMethod,
            itemsPrice: cart.itemsPrice,
            shippingPrice: cart.shippingPrice,
            taxPrice: cart.taxPrice,
            totalPrice: cart.totalPrice,
        })

        // Create a transaction to create order and order items in database
        const insertedOrderId = await prisma.$transaction(async (tx) => {
            // Create order
            const insertedOrder = await tx.order.create({
                data: order
            })
            // Create order items from the cart items. Use for...of with await for sequential async operations (like inside a transaction)
            for (const item of cart.items as CartItem[]) {
                // For each item, asynchronously create a new orderItem record in the database within the transaction
                await tx.orderItem.create({
                    data: {
                        // Spread all properties from the cart item into the new orderItem
                        ...item,
                        price: item.price,
                        orderId: insertedOrder.id
                    },
                });
            }
            // Clear cart
            await tx.cart.update({
                where: { id: cart.id },
                data: {
                    items: [],
                    totalPrice: 0,
                    taxPrice: 0,
                    shippingPrice: 0,
                    itemsPrice: 0
                }
            });

            return insertedOrder.id

        });

        if (!insertedOrderId) throw new Error('Order not created');

        return {
            success: true,
            message: 'Order created',
            redirectTo: `/order/${insertedOrderId}`
        }

    } catch (error) {
        if (isRedirectError(error)) throw error;
        return {
            success: false,
            message: formatError(error)
        }
    }
}



// Use .map() instead of for-of loops for transforming arrays or when you want 
// to run async operations in parallel (with Promise.all).

// Get an order by id

// This function fetches an order by its ID, including its order items and the user’s 
// name and email, then returns the result as a plain object
export async function getOrderById(orderId: string) {
    // uses Prisma client to asynchronously find the firs order in the db matching 
    // the criteria below and storing the result in data
    const data = await prisma.order.findFirst({
        // Where specifies the filter criteria for the query 
        where: {
            id: orderId,
        },
        // Specifies related data to include in the result
        include: {
            orderitems: true,
            // Include the related user, but only select their name and email fields
            user: {
                select: {
                    name: true,
                    email: true
                }
            },
        },
    });

    // Converts the Prisma result to a plain JavaScript object (removing any special 
    // Prisma properties)
    return convertToPlainObject(data);
}


// Create new paypal order
export async function createPayPalOrder(orderId: string) {
    try {
        // Get order from database
        const order = await prisma.order.findFirst({
            where: {
                id: orderId,
            }
        });

        if (order) {
            // Create a paypal order
            const paypalOrder = await paypal.createOrder(Number(order.totalPrice));

            // Update order with Paypal order id
            await prisma.order.update({
                where: { id: orderId },
                data: {
                    paymentResult: {
                        id: paypalOrder.id,
                        email_address: '',
                        status: '',
                        pricePaid: 0
                    }
                }
            });

            return {
                success: true, message: 'Item order created successfully',
                data: paypalOrder.id,
            }
        } else {
            throw new Error('Order not found')
        }

    } catch (error) {
        return { succes: false, message: formatError(error) };
    }
}

// Approve paypal order and update to paid 
export async function approvePayPalOrder(
    orderId: string,
    data: { orderId: string }
) {
    try {
        // Get order from database
        const order = await prisma.order.findFirst({
            where: {
                id: orderId,
            }
        });

        if (!order) throw new Error("Order not found")

        const captureData = await paypal.capturePayment(data.orderId)

        if (!captureData || captureData.id !== (order.paymentResult as PaymentResult)?.id || captureData.status !== 'COMPLETED') {
            throw new Error('Error in PayPal payment');
        }

        // Update order to paid
        updateOrderToPaid({
            orderId,
            paymentResult: {
                id: captureData.id,
                status: captureData.status,
                email_address: captureData.payer.email_address,
                // This line safely retrieves the paid amount from the PayPal response and stores it in pricePaid. 
                // If any part of the chain is missing, pricePaid will be undefined
                pricePaid: captureData.purchase_units[0]?.payments?.captures[0]?.amount?.value,
            },
        });

        revalidatePath(`/order/${orderId}`);

        return {
            success: true,
            message: 'Your order has been paid',
        }

    } catch (error) {
        return { success: false, message: formatError(error) }
    }
}


// Update order to paid
async function updateOrderToPaid({
    orderId,
    paymentResult
}: {
    orderId: string;
    paymentResult?: PaymentResult
}) {
    const order = await prisma.order.findFirst({
        where: {
            id: orderId,
        },
        include: {
            orderitems: true
        }
    });

    if (!order) throw new Error('Order not found')

    if (order.isPaid) throw new Error('Order is already paid');

    // Transaction to update order and account for product stock amount
    await prisma.$transaction(async (tx) => {
        // Iterate over products and update the stock
        for (const item of order.orderitems) {
            await tx.product.update({
                where: { id: item.productId },
                data: { stock: { increment: -item.qty } },
            });
        }

        // Set the order to paid
        await tx.order.update({
            where: { id: orderId },
            data: {
                isPaid: true,
                paidAt: new Date(),
                paymentResult
            }
        });
    });

    // Get update order after transaction
    const updatedOrder = await prisma.order.findFirst({
        where: { id: orderId },
        include: {
            orderitems: true,
            user: {
                select: {
                    name: true,
                    email: true
                }
            },
        }
    });

    if (!updatedOrder) throw new Error('Order not found')
}
