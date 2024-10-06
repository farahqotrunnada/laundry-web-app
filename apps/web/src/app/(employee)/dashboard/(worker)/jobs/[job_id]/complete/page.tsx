import * as React from 'react';
import * as yup from 'yup';

import ConfirmOrderItemsForm from './_components/confirm';
import { redirect } from 'next/navigation';

interface PageProps {
  params: {
    job_id: string;
  };
}

export default async function Page({ params, ...props }: PageProps): Promise<React.JSX.Element> {
  try {
    const { job_id } = await yup
      .object({
        job_id: yup.string().required(),
      })
      .validate(params);

    if (!job_id) return redirect('/dashboard/jobs');

    return (
      <>
        <div className='flex flex-col items-start space-y-2'>
          <h2 className='text-4xl font-bold'>Confirm Order Items</h2>
          <p className='leading-relaxed tracking-tight text-left text-muted-foreground'>
            Managing order items to ensure trust and transparency.
          </p>
        </div>

        <ConfirmOrderItemsForm job_id={job_id} />
      </>
    );
  } catch (error) {
    redirect('/dashboard/jobs');
  }
}
