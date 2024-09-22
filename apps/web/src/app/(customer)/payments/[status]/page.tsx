import * as React from 'react';
import * as yup from 'yup';

import { Button } from '@/components/ui/button';
import Illustration from '@/components/illustration';
import Link from 'next/link';
import { redirect } from 'next/navigation';

interface PageProps {
  params: {
    status: string;
  };
}

export default async function Page({ params }: PageProps): Promise<React.JSX.Element> {
  try {
    const { status } = await yup
      .object({
        status: yup
          .string()
          .transform((value) => value.charAt(0).toUpperCase() + value.slice(1))
          .oneOf(['Finished', 'Pending', 'Failed'])
          .required(),
      })
      .validate(params);

    return (
      <div className='container'>
        <div className='flex flex-col items-center justify-center py-20 space-y-4'>
          <div className='w-full max-w-lg'>
            <Illustration />
          </div>
          <h1 className='text-4xl font-bold text-center'>{status} Payment</h1>
          <p className='max-w-lg text-sm text-center text-muted-foreground'>
            We've processed your payment, you can now close this window and return to your dashboard, if you have any
            questions, please contact our support team at{' '}
            <a href='mailto:support@laundry.app' className='text-primary'>
              support@laundry.app
            </a>
          </p>
          <Link href='/'>
            <Button>Back to home</Button>
          </Link>
        </div>
      </div>
    );
  } catch (error) {
    redirect('/');
  }
}
