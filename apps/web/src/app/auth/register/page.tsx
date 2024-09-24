import * as React from 'react';

import GoogleButton from '@/components/google-button';
import Link from 'next/link';
import RegisterForm from './_components/form';

interface PageProps {
  //
}

export default async function Page(): Promise<React.JSX.Element> {
  return (
    <div className='grid gap-6'>
      <div className='grid gap-2 text-center'>
        <h1 className='text-3xl font-bold'>Register</h1>
        <p className='text-sm text-balance text-muted-foreground'>Enter your email below to create an account</p>
      </div>

      <div className='grid gap-4'>
        <RegisterForm />

        <GoogleButton />
      </div>

      <div className='mt-4 text-sm text-center'>
        Already have an account?{' '}
        <Link href='/auth/login' className='underline'>
          Login
        </Link>
      </div>
    </div>
  );
}
