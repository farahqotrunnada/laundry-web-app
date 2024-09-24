import * as React from 'react';

import OrderTable from './_components/table';

interface PageProps {
  //
}

export default async function Page(): Promise<React.JSX.Element> {
  return (
    <>
      <div className='flex flex-col items-start space-y-2'>
        <h2 className='text-4xl font-bold'>Orders Page</h2>
        <p className='leading-relaxed tracking-tight text-left text-muted-foreground'>
          Monitor, manage, and update your orders effortlessly. Track order progress in real-time, with options to view order details and update items for a smooth and efficient workflow.
        </p>
      </div>

      <OrderTable />
    </>
  );
}
