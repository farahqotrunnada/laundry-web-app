import * as React from 'react';
import * as yup from 'yup';

import EditOrderItemsForm from './_components/edit';
import { redirect } from 'next/navigation';

interface PageProps {
  params: {
    order_id: string;
  };
}

export default async function Page({ params }: PageProps): Promise<React.JSX.Element> {
  try {
    const { order_id } = await yup
      .object({
        order_id: yup.string().required(),
      })
      .validate(params);

    if (!order_id) return redirect('/dashboard/orders');

    return (
      <>
        <div className='flex flex-col items-start space-y-2'>
          <h2 className='text-4xl font-bold'>Add Order Items</h2>
          <p className='leading-relaxed tracking-tight text-left text-muted-foreground'>
            Managing order items and weight to ensure trust and transparency.
          </p>
        </div>

        <EditOrderItemsForm order_id={order_id} />
      </>
    );
  } catch (error) {
    redirect('/dashboard/orders');
  }
}
