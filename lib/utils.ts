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
export function formatError(error: unknown) {
    // This is type guard for Zod Errors. This block checks that error is an object, not null, 
    // has a name property equal to 'ZodError', and has an issues property that is an array.
    // This safely narrows error to a ZodError-like object.
    if (
        typeof error === 'object' &&
        error !== null &&
        'name' in error &&
        error.name === 'ZodError' &&
        'issues' in error &&
        Array.isArray((error as { issues?: unknown }).issues)
    ) {
        // Accessing issues with a specific type:
        // This line asserts that error.issues is an array of objects with a message property, 
        // then maps over them to extract the message strings.
        const fieldErrors = (error as { issues: { message: string }[] }).issues.map(
        (issue: { message: string }) => issue.message
        );
        return fieldErrors.join('. ');
    
        // Type Guard for PrismaClientKnownRequestError:
        // This block checks that error is an object, not null, has a name property equal to
        //  'PrismaClientKnownRequestError', and a code property equal to 'P2002'. This safely narrows 
        // error to a Prisma error of a specific type.
    } else if (
        typeof error === 'object' &&
        error !== null &&
        'name' in error &&
        error.name === 'PrismaClientKnownRequestError' &&
        'code' in error &&
        error.code === 'P2002'
    ) {
        // Accessing deeply nested meta property with a specific type:
        const originalMessage = (
            error as { meta?: { driverAdapterError?: { cause?: { originalMessage?: string } } }
        }).meta?.driverAdapterError?.cause?.originalMessage ?? '';


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


const CURRENCY_FORMATTER = new Intl.NumberFormat('en-UK', {
  currency: 'GBP',
  style: 'currency',
  minimumFractionDigits: 2
});

// Format currency using the formatter above
export function formatCurrency(amount: number | string | null) {
  if (typeof amount === 'number') {
    return CURRENCY_FORMATTER.format(amount);
  } else if (typeof amount === 'string') {
    return CURRENCY_FORMATTER.format(Number(amount));
  } else {
    return 'NaN';
  }
}
