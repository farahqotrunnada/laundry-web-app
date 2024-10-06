import * as React from 'react';
import * as yup from 'yup';

import OrderDetail from './_components/detail';
import { redirect } from 'next/navigation';

interface PageProps {
  params: {
    order_id: string;
  };
}

export default async function Page({ params, ...props }: PageProps): Promise<React.JSX.Element> {
  try {
    const { order_id } = await yup
      .object({
        order_id: yup.string().required(),
      })
      .validate(params);

    return (
      <>
        <div className='flex flex-col items-start space-y-2'>
          <h2 className='text-4xl font-bold'>Order Details </h2>
          <p className='leading-relaxed tracking-tight text-left text-muted-foreground'>
            Managing order details, location, order progress, items, fee, and payment to ensure a comprehensive service.
          </p>
        </div>

        <OrderDetail order_id={order_id} />
      </>
    );
  } catch (error) {
    redirect('/dashboard/orders');
  }
}
