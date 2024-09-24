import * as React from 'react';

import Link from 'next/link';
import ResetPasswordForm from './_components/form';

interface PageProps {
  //
}

export default async function Page(): Promise<React.JSX.Element> {
  return (
    <div className='grid gap-6'>
      <div className='grid gap-2 text-center'>
        <h1 className='text-3xl font-bold'>Forgot your password?</h1>
        <p className='text-sm text-balance text-muted-foreground'>
          Don&apos;t worry! We&apos;ll send you a link to reset your password.
        </p>
      </div>
      <div className='grid gap-4'>
        <ResetPasswordForm />
      </div>
      <div className='mt-4 text-sm text-center'>
        Don&apos;t have an account?{' '}
        <Link href='/auth/register' className='underline'>
          Sign up
        </Link>
      </div>
    </div>
  );
}
