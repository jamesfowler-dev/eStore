'use client';

import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { SignInDefaultValues } from '@/lib/constants';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { signInWithCredentials } from '@/lib/actions/user.actions';
import { useSearchParams } from 'next/navigation';


const CredentialsSignInForm = () => {
    const [data, action] = useActionState(signInWithCredentials, {
        success: false,
        message: '',
    });

    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get('callbackUrl') ?? '/';

    // Custom sign-in button
    const SignInButton = () => {
        const { pending } = useFormStatus();

        return (
            <Button 
                type="submit" 
                disabled={pending} 
                className='w-full' 
                style={{ borderRadius: '8px' }}
                variant='default'
            >
                { pending ? 'Signing In...' : 'Sign In' }
            </Button>
        );
    };

    return (
    <form action={action}>
        <input type='hidden' name='callbackUrl' value={callbackUrl} />
        <div className="space-y-6">
            <div>
                <Label htmlFor='email'>Email</Label>
                <Input 
                    id='email' 
                    name='email' 
                    type='email' 
                    required 
                    autoComplete='email'
                    defaultValue={SignInDefaultValues.email}
                />
            </div>
            <div>
                <Label htmlFor='password'>Password</Label>
                <Input 
                    id='password' 
                    name='password' 
                    type='password' 
                    required 
                    autoComplete='password'
                    defaultValue={SignInDefaultValues.password}
                />
            </div>
            <div>
                <SignInButton />
            </div>
            { data && !data.success && (
                <div className="text-center text-destructive">
                    {data.message}
                </div>
            )}

            <div className="text-sm text-center text-muted-foreground">
                Don&apos;t have an account? {' '}
                <Link 
                    href='/sign-up' 
                    target='_self' 
                    className='Link'
                >
                    Sign Up
                </Link>
            </div>
        </div>
    </form>
    );
};
 
export default CredentialsSignInForm;


// this is just display text in JSX. &apos; is the HTM:L entity for an apostraphe

// {' '} adds an explicit space in JSX after the text, so the next element (the Sign Up link)
//  isn’t glued directly to the ?

// The conditional rendering on line 51; If there is response data and the action failed, 
// show the error message in red centered text