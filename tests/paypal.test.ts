import { generateAccessToken } from "../lib/paypal";


// Test to generate access token from paypal
test('generates a token from paypal', async () => {
    const tokenResponse = await generateAccessToken();
    console.log(tokenResponse);
    console.log(tokenResponse.length);
    expect(typeof tokenResponse).toBe('string');
    expect(tokenResponse.length).toBeGreaterThan(0);
});

