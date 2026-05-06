// No need to import .env because in Next.js applications, it is done automatically 
// The file provides PayPal API helpers for creating orders and generating access tokens.

// createOrder:
// Purpose: Creates a new PayPal order (sets up the payment, but does not collect money yet).
// Endpoint: POST /v2/checkout/orders
// When to use: When the user starts the checkout process.

// capturePayment:
// Purpose: Captures (collects) the payment for an existing order after the user approves it.
// Endpoint: POST /v2/checkout/orders/{orderId}/capture
// When to use: After the user has approved the payment and you want to actually charge them.

// In summary:
// createOrder sets up the payment, and capturePayment finalizes and collects the money for that order.


// Sets the PayPal API base URL from an environment variable, or defaults to the sandbox URL.
const base = process.env.PAYPAL_API_URL || "https://api-m.sandbox.paypal.com";


// Defines a paypal object with a createOrder method
export const paypal = {
    createOrder: async function createOrder(price: number) {
        // Calls generateAccessToken to get a PayPal access token
        const accessToken = await generateAccessToken();
        // Builds the order creation URL
        const url = `${base}/v2/checkout/orders`;
        // Sends a POST request to PayPal to create an order with the specified price
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`
            },
            // In the PayPal API, intent: 'CAPTURE' means you want to immediately capture (collect) the payment 
            // when the order is approved.'CAPTURE' tells PayPal to authorize and capture the funds in one step. 
            body: JSON.stringify({
                intent: 'CAPTURE',
                purchase_units: [
                    {
                        amount: {
                            currency_code: 'GBP',
                            value: price,
                        },
                    },
                ],
            }),
        });
        // If successful, returns the parsed JSON response, if not, throws an error with the response text
        return handleResponse(response);
    },

    capturePayment: async function capturePayment(orderId: string) {
        // Calls generateAccessToken to get a PayPal access token
        const accessToken = await generateAccessToken();
        // Builds the capture payment URL
        const url = `${base}/v2/checkout/orders/${orderId}/capture`;
        // Sends a POST request to PayPal to capture (finalise) the payment for that order
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`,
            },
        });
        return handleResponse(response)
    },
};

// Generate a Paypal access token
async function generateAccessToken() {
    // Reads client ID and secret from environment variables
    const { PAYPAL_CLIENT_ID, PAYPAL_APP_SECRET } = process.env;
    // Encodes them in base64 for HTTP Basic Auth.
    const auth = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_APP_SECRET}`).toString('base64');
    // Sends a POST request to PayPal’s token endpoint
    const response = await fetch(`${base}/v1/oauth2/token`, {
        method: 'POST',
        body: 'grant_type=client_credentials',
        headers: {
            Authorization: `Basic ${auth}`,
            'Content-Type': 'application/x-www-form-urlencoded',
        },
    });

    // If successful, returns the access token. If not, throws an error.
    const jsonData = await handleResponse(response);
    return jsonData.access_token;
}


// Defines a utility function to handle fetch responses. 
const handleResponse = async (response: Response) => {
    if (response.ok) {
        return response.json();
    } else {
        const errorMessage = await response.text();
        throw new Error(errorMessage)
    }
}

export { generateAccessToken }; 