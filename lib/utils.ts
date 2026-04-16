// This page provides helper functions used across the app

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";


// Combines CSS class names safely. Uses clsx to join conditional classes and tailwind-merge to remove conflicting Tailwind classes
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

// Convert prisma object into a regular JS object
export function convertToPlainObject<T>(value: T): T {
    return JSON.parse(JSON.stringify(value));
}

// Format number with decimal places
export function formatNumberWithDecimal(num: number): string {
    const [int, decimal] = num.toString().split(".");
    return decimal ? `${int}.${decimal.padEnd(2, "0")}` : `${int}.00`;
}


// Format errors 
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function formatError(error: any ) {
    if (error.name === 'ZodError') {
        const fieldErrors = error.issues.map(
            (issue: any) => issue.message
        );

        return fieldErrors.join('. ');

    } else if (
        error.name === 'PrismaClientKnownRequestError' && 
        error.code === 'P2002'
    ) {
         const originalMessage = error.meta?.driverAdapterError?.cause?.originalMessage ?? '';


        if (originalMessage.includes('user_email_idx')) {
            return 'Email already exists';
        }

        if (originalMessage.includes('user_name_idx')) {
            return 'Name already exists';
        }

        return 'Field already exists';
    }

}   

// Round number to 2 decimal places
// What does EPSILON do? It helps avoid floating-point precision edge cases. 
// Example: without EPSILON, 1.005 can incorrectly round to 1.00 in JavaScript; 
// EPSILON improves chances of correct 1.01.
export const round2 = (value: number | string) => {
    if (typeof value === 'number') {
        return Math.round((value + Number.EPSILON) * 100) / 100;
    } else if (typeof value === 'string') {
        return Math.round((Number(value) + Number.EPSILON) * 100) / 100;
    } else {
        throw new Error('Value is not a number or string')
    }
}