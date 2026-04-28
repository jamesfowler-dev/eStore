'use server';

// This page contains server actions that run the backend logic when forms are submitted, including sign-up/sign-in/sign-out.

import {
    shippingAddressSchema,
    signInFormSchema,
    signUpFormSchema,
    paymentMethodSchema
} from "../validators";
import { signIn, signOut, auth } from "@/auth";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { hashSync } from 'bcrypt-ts-edge';
import { prisma } from '@/db/prisma';
import { formatError } from "../utils";
import { ShippingAddress } from "@/types";

// Sign in the user with credentials 
export async function signInWithCredentials(prevState: unknown, formData: FormData) {
    try {
        const user = signInFormSchema.parse({
            email: formData.get('email'),
            password: formData.get('password')
        });

        await signIn('credentials', user);

        return { success: true, message: 'Signed in successfully' }
    } catch (error) {
        if (isRedirectError(error)) {
            throw error;
        }
        return { success: false, message: 'Invalid email or password' }
    }
}

// Sign user out
export async function signOutUser() {
    await signOut();
}

// Sign up user
// prevState means “what happened last submit”, fornData means “what user typed this submit”
export async function signUpUser(prevState: unknown, formData: FormData) {
    try {
        const user = signUpFormSchema.parse({
            name: formData.get('name'),
            email: formData.get('email'),
            password: formData.get('password'),
            confirmPassword: formData.get('confirmPassword')
        })

        const plainPassword = user.password;

        user.password = hashSync(user.password, 10);

        await prisma.user.create({
            data: {
                name: user.name,
                email: user.email,
                password: user.password,

            }
        })
        await signIn('credentials', {
            email: user.email,
            password: plainPassword,
        });

        return { success: true, message: 'User registered successfully' };

    } catch (error) {
        // console.log(error.issues)
        if (isRedirectError(error)) {
            throw error;
        }
        return { success: false, message: formatError(error) }
    }
}

// Code explanations

// parse() is a Zod method that validates input against a schema and returns typed, cleaned data if valid
// hashSync(user.password, 10) turns a plain-text password into a secure one-way hash. 10 is the salt layer, higher is slower 
// but more secure

// signIn('credentials', { email: user.email, password: plainPassword }) this code immediately logs the new user in after registration
// credentials tells NextAuth to use your Credentials provider. NextAuth then checks that against the DB hash via my authorize logic

// Get user by the ID
export async function getUserByID(userId: string) {
    const user = await prisma.user.findFirst({
        where: { id: userId },
    });
    if (!user) throw new Error('User not found');
    return user;
}


// Update the user's address 
export async function updateUserAddress(data: ShippingAddress) {
    try {
        const session = await auth();

        // Get user from database 
        const currentUser = await prisma.user.findFirst({
            where: { id: session?.user?.id }
        });

        if (!currentUser) throw new Error('User not found');

        const address = shippingAddressSchema.parse(data);

        await prisma.user.update({
            where: { id: currentUser.id },
            // Data we want to update is the address
            data: { address }
        })

        return {
            success: true,
            message: 'User updated successfully',
        }

    } catch (error) {
        return { success: false, message: formatError(error) }
    }
}

// Update users payment method
export async function updateUserPaymentMethod(data: z.infer<typeof paymentMethodSchema>) {
    try {
        const session = await auth();
        const currentUser = await prisma.user.findFirst({
            where: { id: session?.user?.id }
        });

        if (!currentUser) throw new Error('User not found');

        const paymentMethod = paymentMethodSchema.parse(data);
        await prisma.user.update({
            where: { id: currentUser.id },
            data: { paymentMethod: paymentMethod.type }
        })

        return {
            success: true,
            message: 'User updated successfully',
        };

    } catch (error) {
        return {
            success: false,
            message: formatError(error)
        }
    }
}